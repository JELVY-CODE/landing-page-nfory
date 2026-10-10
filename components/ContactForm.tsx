'use client';

import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { submitContact } from "@/app/actions/contact";
import DateField from "@/components/DateField";
import SelectField from "@/components/SelectField";
import TurnstileWidget from "@/components/TurnstileWidget";
import { CONTACT_SERVICES, CONTACT_SLOTS } from "@/data/contact";
import { initialContactState, type ContactField } from "@/lib/contact";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { site } from "@/data/site";
import { turnstileSiteKey } from "@/lib/turnstile";

const control =
  "w-full rounded-xl border border-white/10 bg-zinc-950/60 px-4 text-[0.9375rem] text-white placeholder:text-zinc-600 " +
  "transition-[border-color,box-shadow] duration-150 outline-none " +
  "focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/15 " +
  "aria-invalid:border-red-400/60 aria-invalid:focus:ring-red-400/15";


type FieldProps = {
  id: ContactField;
  label: string;
  optionalLabel?: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

function Field({ id, label, optionalLabel, error, className = "", children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-sm font-medium text-zinc-300">
        {label}
        {optionalLabel && <span className="text-xs font-normal text-zinc-600">{optionalLabel}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm({ locale, t }: { locale: Locale; t: Dictionary["contact"]["form"] }) {
  const [state, formAction, pending] = useActionState(submitContact, initialContactState);

  const [service, setService] = useState(state.values?.service ?? "");
  const startedAtRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, [state]);
  const errors = state.errors ?? {};
  const fieldProps = (id: ContactField) => ({
    id,
    name: id,
    defaultValue: state.values?.[id] ?? "",
    "aria-invalid": errors[id] ? true : undefined,
    "aria-describedby": errors[id] ? `${id}-error` : undefined,
  });

  if (state.status === "success") {
    return (
      <div role="status" className="flex min-h-[26rem] flex-col items-center justify-center text-center">
        <div className="flex size-14 items-center justify-center rounded-full border border-violet-500/40 bg-violet-500/10 text-violet-300 shadow-[0_0_32px_-4px_rgb(139_92_246/0.6)]">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </div>
        <h3 className="mt-6 text-xl font-semibold tracking-tight text-white">{t.successTitle}</h3>
        <p className="mt-2 max-w-sm text-[0.9375rem] leading-relaxed text-zinc-400">{t.successText}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="grid gap-5 sm:grid-cols-2">
      <input type="hidden" name="locale" value={locale} />
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="" />
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">{t.honeypot}</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Field id="name" label={t.name} error={errors.name}>
        <input {...fieldProps("name")} type="text" autoComplete="name" required maxLength={100} placeholder={t.namePlaceholder} className={`${control} h-11`} />
      </Field>

      <Field id="email" label={t.email} error={errors.email}>
        <input {...fieldProps("email")} type="email" autoComplete="email" required maxLength={200} placeholder={t.emailPlaceholder} className={`${control} h-11`} />
      </Field>

      <Field id="company" label={t.company} optionalLabel={t.optional} error={errors.company}>
        <input {...fieldProps("company")} type="text" autoComplete="organization" maxLength={120} placeholder={t.companyPlaceholder} className={`${control} h-11`} />
      </Field>

      <Field id="service" label={t.service} error={errors.service}>
        <SelectField
          id="service"
          name="service"
          options={CONTACT_SERVICES.map((value) => ({ value, label: t.services[value] }))}
          placeholder={t.servicePlaceholder}
          defaultValue={state.values?.service}
          onChange={setService}
          className={control}
          invalid={Boolean(errors.service)}
          describedBy={errors.service ? "service-error" : undefined}
        />
      </Field>

      {service === "other" && (
        <Field id="serviceOther" label={t.serviceOther} error={errors.serviceOther} className="popover-in sm:col-span-2">
          <input {...fieldProps("serviceOther")} type="text" required autoFocus maxLength={120} placeholder={t.serviceOtherPlaceholder} className={`${control} h-11`} />
        </Field>
      )}

      <Field id="date" label={t.date} optionalLabel={t.optional} error={errors.date}>
        <DateField
          id="date"
          name="date"
          locale={locale}
          defaultValue={state.values?.date}
          placeholder={t.date}
          className={control}
          invalid={Boolean(errors.date)}
          describedBy={errors.date ? "date-error" : undefined}
        />
      </Field>

      <Field id="slot" label={t.slot} optionalLabel={t.optional} error={errors.slot}>
        <SelectField
          id="slot"
          name="slot"
          options={[{ value: "", label: t.slotNone }, ...CONTACT_SLOTS.map((value) => ({ value, label: t.slots[value] }))]}
          placeholder={t.slotNone}
          defaultValue={state.values?.slot}
          className={control}
          invalid={Boolean(errors.slot)}
          describedBy={errors.slot ? "slot-error" : undefined}
        />
      </Field>

      <Field id="message" label={t.message} error={errors.message} className="sm:col-span-2">
        <textarea
          {...fieldProps("message")}
          required
          rows={4}
          maxLength={2000}
          placeholder={t.messagePlaceholder}
          className={`${control} resize-y py-3 leading-relaxed`}
        />
      </Field>

      {turnstileSiteKey && <TurnstileWidget siteKey={turnstileSiteKey} locale={locale} resetKey={state} />}

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className={`text-sm ${state.status === "error" ? "text-red-300" : "text-zinc-500"}`}>
          {state.status === "error" && state.message ? (
            <>
              {state.message}{" "}
              {!state.errors && (
                <a href={`mailto:${site.contactEmail}`} className="text-indigo-300 underline underline-offset-4">
                  {site.contactEmail}
                </a>
              )}
            </>
          ) : (
            t.responseTime
          )}
        </p>
        <button
          type="submit"
          disabled={pending}
          className={
            "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-indigo-500 px-6 text-[0.9375rem] font-medium text-white " +
            "shadow-[0_0_0_1px_rgb(255_255_255/0.08)_inset,0_8px_24px_-8px_rgb(99_102_241/0.6)] " +
            "transition-[scale,background-color,opacity] duration-150 ease-out-strong hover:bg-indigo-600 active:scale-[0.97] " +
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:cursor-wait disabled:opacity-70"
          }
        >
          {pending ? (
            <>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 animate-spin" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              {t.sending}
            </>
          ) : (
            t.submit
          )}
        </button>
      </div>
    </form>
  );
}
