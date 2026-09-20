/**
 * Escapes characters that could break out of a `<script type="application/ld+json">`
 * tag or that are invalid inside a JS string literal in some engines (U+2028/U+2029),
 * before injecting JSON into HTML via dangerouslySetInnerHTML.
 */
const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);

export function safeJsonLdStringify(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .split(LINE_SEPARATOR)
    .join("\\u2028")
    .split(PARAGRAPH_SEPARATOR)
    .join("\\u2029");
}
