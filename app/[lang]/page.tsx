import { notFound } from "next/navigation";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import DevelopersTransition from "@/components/DevelopersTransition";
import DevelopersView from "@/components/DevelopersView";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HybridModel from "@/components/HybridModel";
import MoonSky from "@/components/MoonSky";
import Navbar from "@/components/Navbar";
import PageBackground from "@/components/PageBackground";
import ProjectsGallery from "@/components/ProjectsGallery";
import ScrollJourney from "@/components/ScrollJourney";
import ServicesBento from "@/components/ServicesBento";
import { site } from "@/data/site";
import { hasLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const origin = `https://${site.domain}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${origin}/#organization`,
        name: site.name,
        url: origin,
        logo: `${origin}/images/isotipo-nfory.svg`,
        email: site.contactEmail,
        description: dict.meta.description,
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        url: `${origin}/${lang}`,
        name: site.name,
        inLanguage: lang,
        publisher: { "@id": `${origin}/#organization` },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <PageBackground />

      <Navbar locale={lang} t={dict.nav} />

      <DevelopersTransition
        view={<DevelopersView locale={lang} t={dict.team} />}
        labels={{ open: dict.nav.team, back: dict.team.back }}
        modules={[
          { index: "01", label: dict.nav.about, href: "#nosotros" },
          { index: "02", label: dict.nav.services, href: "#servicios" },
          { index: "03", label: dict.nav.projects, href: "#proyectos" },
          { index: "04", label: dict.nav.contact, href: "#contacto" },
        ]}
      >
        <MoonSky />
        <main className="relative">
          <Hero t={dict.hero} cta={dict.nav.cta} />
          <ScrollJourney>
            <AboutSection t={dict.about} />
            <ServicesBento t={dict.services} orchestration={dict.orchestration} />
            <HybridModel t={dict.model} />
            <ProjectsGallery locale={lang} t={dict.projects} />
            <ContactSection locale={lang} t={dict.contact} />
          </ScrollJourney>
        </main>

        <Footer locale={lang} t={dict} />
      </DevelopersTransition>
    </>
  );
}
