/** Índices de la imagen anterior y siguiente del lightbox (sin repetir ni incluir la actual). */
export function neighborIndexes(index: number, total: number): number[] {
  if (total < 2) return [];
  return [...new Set([(index + 1) % total, (index - 1 + total) % total])].filter((i) => i !== index);
}
