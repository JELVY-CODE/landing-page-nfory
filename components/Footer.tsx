import { analyticsEnabled } from "@/components/Analytics";
import BrandLogo from "@/components/BrandLogo";
import { CookieSettingsButton } from "@/components/CookieConsent";
import SocialLinks from "@/components/SocialLinks";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { site } from "@/data/site";
import { navHref } from "@/lib/navigation";

async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

const linkClass = "rounded-full px-3 py-1.5 text-sm text-zinc-500 transition-colors duration-150 hover:text-zinc-200";

type FooterProps = { locale: Locale; t: Dictionary; basePath?: string };

export default function Footer({ locale, t, basePath = "" }: FooterProps) {
  return (
    <footer className="px-4 pb-10 sm:px-6">
      <div className="mx-auto max-w-6xl border-t border-white/[0.06] pt-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <BrandLogo />
          <ul className="flex flex-wrap items-center justify-center gap-1">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a href={navHref(item, locale, basePath)} className={linkClass}>
                  {t.nav[item.key]}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.contactEmail}`} className={linkClass}>
                {site.contactEmail}
              </a>
            </li>
          </ul>
        </div>
        <div className="mt-6 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-1">
            <p className="text-sm text-zinc-500 sm:mr-2">
              © <CopyrightYear /> {site.name}. {t.footer.rights}
            </p>
            <a href={`/${locale}/privacidad`} className={linkClass}>
              {t.footer.privacy}
            </a>
            {analyticsEnabled && <CookieSettingsButton label={t.footer.cookies} className={`${linkClass} cursor-pointer`} />}
          </div>
          <SocialLinks label={t.footer.follow} />
        </div>
      </div>
    </footer>
  );
}
