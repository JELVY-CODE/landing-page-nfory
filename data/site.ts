export const site = {
  name: "NFory",
  domain: "nfory.com",
  contactHref: "#contacto",
  contactEmail: "jesuslizarraga@nfory.com",
  nav: [
    { key: "about", href: "#nosotros", page: false },
    { key: "services", href: "#servicios", page: false },
    { key: "projects", href: "#proyectos", page: false },
    { key: "team", href: "#desarrolladores", page: false },
    { key: "contact", href: "#contacto", page: false },
  ],
  // Pendiente de confirmar: sustituir por las URLs reales de los perfiles de NFory.
  social: [
    { id: "linkedin", name: "LinkedIn", href: "https://www.linkedin.com/company/nfory" },
    { id: "facebook", name: "Facebook", href: "https://www.facebook.com/nfory" },
    { id: "github", name: "GitHub", href: "https://github.com/nfory" },
    { id: "instagram", name: "Instagram", href: "https://www.instagram.com/nfory" },
  ],
} as const;
