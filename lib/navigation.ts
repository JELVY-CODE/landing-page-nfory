// Las anclas apuntan a la landing; las páginas propias se prefijan con el idioma.
export const navHref = (item: { href: string; page: boolean }, locale: string, basePath: string) =>
  item.page ? `/${locale}${item.href}` : `${basePath}${item.href}`;
