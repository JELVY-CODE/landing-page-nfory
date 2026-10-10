export const navHref = (item: { href: string; page: boolean }, locale: string, basePath: string) =>
  item.page ? `/${locale}${item.href}` : `${basePath}${item.href}`;
