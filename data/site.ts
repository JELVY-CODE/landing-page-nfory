export const site = {
  name: "NFory",
  domain: "nfory.com",
  contactHref: "#contacto",
  contactEmail: "contact@nfory.com",
  nav: [
    { key: "about", href: "#nosotros", page: false },
    { key: "services", href: "#servicios", page: false },
    { key: "projects", href: "#proyectos", page: false },
    { key: "team", href: "#desarrolladores", page: false },
    { key: "contact", href: "#contacto", page: false },
  ],
  social: [
    { id: "linkedin", name: "LinkedIn", href: null },
    { id: "facebook", name: "Facebook", href: null },
    { id: "github", name: "GitHub", href: null },
    { id: "instagram", name: "Instagram", href: null },
  ],
} as const;
