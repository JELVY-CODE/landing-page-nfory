'use server';

import { headers } from "next/headers";
import { CONTACT_SERVICES, CONTACT_SLOTS } from "@/data/contact";
import { site } from "@/data/site";
import type { ContactField, ContactState, ContactValues } from "@/lib/contact";
import { DEFAULT_LOCALE, hasLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";
import { rateLimit } from "@/lib/rate-limit";
import { turnstileEnabled, verifyTurnstile } from "@/lib/turnstile";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DEFAULT_TO = "contact@nfory.com";
const DEFAULT_FROM = "NFory Web <onboarding@resend.dev>";
const MIN_FILL_MS = 3000;
const MAX_REQUESTS = 5;
const WINDOW_MS = 60 * 60 * 1000;

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const formatDate = (isoDate: string, locale: Locale = "es") =>
  new Date(`${isoDate}T12:00:00Z`).toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

const includes = (list: readonly string[], value: string) => list.includes(value);

type Email = { to: string; subject: string; html: string; text: string; replyTo: string };

async function sendEmail(apiKey: string, email: Email) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
      to: [email.to],
      reply_to: email.replyTo,
      subject: email.subject,
      html: email.html,
      text: email.text,
    }),
  });
  if (!response.ok) throw new Error(`Resend ${response.status}: ${await response.text()}`);
}

function describeRequest(values: ContactValues, locale: Locale) {
  const labels = getDictionary(locale).contact.form;
  const service =
    values.service === "other" ? `${labels.services.other}: ${values.serviceOther}` : labels.services[values.service as keyof typeof labels.services];
  const slot = values.slot ? labels.slots[values.slot as keyof typeof labels.slots] : "";
  const schedule = values.date ? `${formatDate(values.date, locale)}${slot ? ` · ${slot}` : ""}` : slot || labels.slotNone;
  return { service, schedule };
}

function confirmationEmail(values: ContactValues, locale: Locale): Email {
  const t = getDictionary(locale).contact.confirmation;
  const { service, schedule } = describeRequest(values, locale);
  const greeting = t.greeting.replace("{name}", values.name);
  const rows: [string, string][] = [
    [t.service, service],
    [t.schedule, schedule],
  ];

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#18181b;max-width:560px">
      <p style="margin:0 0 16px;font-size:15px">${escapeHtml(greeting)}</p>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.6">${escapeHtml(t.body)}</p>
      <h3 style="margin:0 0 8px;font-size:14px;color:#6366F1;font-weight:600">${escapeHtml(t.summary)}</h3>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:6px 12px 6px 0;color:#71717a;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
            <td style="padding:6px 0">${escapeHtml(value)}</td>
          </tr>`,
          )
          .join("")}
      </table>
      <h3 style="margin:20px 0 8px;font-size:14px;color:#71717a;font-weight:500">${escapeHtml(t.message)}</h3>
      <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap;color:#3f3f46">${escapeHtml(values.message)}</p>
      <p style="margin:24px 0 4px;font-size:14px;line-height:1.6">${escapeHtml(t.closing)}</p>
      <p style="margin:0;font-size:14px;font-weight:600">${escapeHtml(t.signature)}</p>
      <p style="margin:24px 0 0;font-size:12px;color:#a1a1aa">${site.domain}</p>
    </div>`;

  const text = [greeting, "", t.body, "", `${t.summary}:`, ...rows.map(([label, value]) => `${label}: ${value}`), "", `${t.message}:`, values.message, "", t.closing, t.signature].join("\n");

  return { to: values.email, replyTo: process.env.CONTACT_TO_EMAIL || DEFAULT_TO, subject: t.subject, html, text };
}

function validate(values: ContactValues, t: Dictionary["contact"]["errors"]) {
  const errors: Partial<Record<ContactField, string>> = {};

  if (values.name.length < 2) errors.name = t.name;
  else if (values.name.length > 100) errors.name = t.nameLong;

  if (!EMAIL_RE.test(values.email) || values.email.length > 200) errors.email = t.email;

  if (values.company.length > 120) errors.company = t.company;

  if (!includes(CONTACT_SERVICES, values.service)) errors.service = t.service;
  else if (values.service === "other" && (values.serviceOther.length < 2 || values.serviceOther.length > 120)) {
    errors.serviceOther = t.serviceOther;
  }

  if (values.date) {
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    if (!DATE_RE.test(values.date) || Number.isNaN(Date.parse(values.date))) errors.date = t.date;
    else if (values.date < yesterday) errors.date = t.datePast;
  }

  if (values.slot && !includes(CONTACT_SLOTS, values.slot)) errors.slot = t.slot;

  if (values.message.length < 10) errors.message = t.message;
  else if (values.message.length > 2000) errors.message = t.messageLong;

  return errors;
}

export async function submitContact(_prevState: ContactState, formData: FormData): Promise<ContactState> {
  const read = (key: string) => String(formData.get(key) ?? "").trim();
  const requested = read("locale");
  const locale = hasLocale(requested) ? requested : DEFAULT_LOCALE;
  const t = getDictionary(locale).contact;

  if (read("website")) return { status: "success" };
  const startedAt = Number(read("startedAt"));
  if (startedAt && Date.now() - startedAt < MIN_FILL_MS) return { status: "success" };

  const values: ContactValues = {
    name: read("name"),
    email: read("email"),
    company: read("company"),
    service: read("service"),
    serviceOther: read("serviceOther"),
    date: read("date"),
    slot: read("slot"),
    message: read("message"),
  };

  const errors = validate(values, t.errors);
  if (Object.keys(errors).length > 0) return { status: "error", message: t.errors.review, errors, values };

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-real-ip") ?? requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  if (!rateLimit(`contact:${ip ?? "unknown"}`, MAX_REQUESTS, WINDOW_MS)) return { status: "error", message: t.errors.tooMany, values };
  if (!(await verifyTurnstile(read("cf-turnstile-response"), ip))) return { status: "error", message: t.errors.verification, values };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] Falta RESEND_API_KEY: no se puede enviar el correo.");
    return { status: "error", message: t.errors.unavailable, values };
  }

  const { service, schedule } = describeRequest(values, "es");

  const rows: [string, string][] = [
    ["Nombre", values.name],
    ["Correo", values.email],
    ["Empresa", values.company || "—"],
    ["Servicio", service],
    ["Preferencia de cita", schedule],
    ["Idioma de la web", locale],
  ];

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#18181b;max-width:560px">
      <h2 style="margin:0 0 16px;font-size:18px">Nueva solicitud de consultoría</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:8px 12px 8px 0;color:#71717a;white-space:nowrap;vertical-align:top">${label}</td>
            <td style="padding:8px 0">${escapeHtml(value)}</td>
          </tr>`,
          )
          .join("")}
      </table>
      <h3 style="margin:24px 0 8px;font-size:14px;color:#71717a;font-weight:500">Mensaje</h3>
      <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(values.message)}</p>
    </div>`;

  const text = [...rows.map(([label, value]) => `${label}: ${value}`), "", "Mensaje:", values.message].join("\n");

  try {
    await sendEmail(apiKey, {
      to: process.env.CONTACT_TO_EMAIL || DEFAULT_TO,
      replyTo: values.email,
      subject: `Consultoría · ${values.name}${values.company ? ` (${values.company})` : ""}`,
      html,
      text,
    });
  } catch (error) {
    console.error("[contact] No se pudo enviar la solicitud", error);
    return { status: "error", message: t.errors.failed, values };
  }

  if (turnstileEnabled()) {
    await sendEmail(apiKey, confirmationEmail(values, locale)).catch((error) => console.error("[contact] No se pudo enviar la confirmación", error));
  }

  return { status: "success" };
}
