import { notFound } from "next/navigation";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import DevelopersSection from "@/components/DevelopersSection";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HybridModel from "@/components/HybridModel";
import Navbar from "@/components/Navbar";
import PageBackground from "@/components/PageBackground";
import ProjectsGallery from "@/components/ProjectsGallery";
import ScrollJourney from "@/components/ScrollJourney";
import ServicesBento from "@/components/ServicesBento";
import { hasLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <PageBackground />

      <Navbar locale={lang} t={dict.nav} />

      <main className="relative">
        <Hero t={dict.hero} cta={dict.nav.cta} />
        <ScrollJourney>
          <AboutSection t={dict.about} />
          <ServicesBento t={dict.services} orchestration={dict.orchestration} />
          <HybridModel t={dict.model} />
          <ProjectsGallery locale={lang} t={dict.projects} />
          <DevelopersSection locale={lang} t={dict.team} />
          <ContactSection locale={lang} t={dict.contact} />
        </ScrollJourney>
      </main>

      <Footer locale={lang} t={dict} />
    </>
  );
}
