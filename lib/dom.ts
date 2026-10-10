// Next.js conserva ocultas (display: none) las páginas de idiomas ya visitados, así que un mismo id o selector
// puede existir varias veces en el documento: estas utilidades solo devuelven elementos visibles.
export const isVisible = (element: Element) => element.getClientRects().length > 0;

export const visibleAll = <T extends Element = HTMLElement>(selector: string) => Array.from(document.querySelectorAll<T>(selector)).filter(isVisible);

export const visibleOne = <T extends Element = HTMLElement>(selector: string): T | null => visibleAll<T>(selector)[0] ?? null;

export const visibleById = (id: string) => visibleOne(`[id="${CSS.escape(id)}"]`);
