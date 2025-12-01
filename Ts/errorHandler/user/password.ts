export function valueMismatch(lang: string): string {
  if (lang === "fr") {
    return `Les valeurs saisies ne correspondent pas`;
  } else {
    return `The entered values do not match.`;
  }
}

export function invalidCharCount(
  lang: string,
  count: number,
  charType: string
): string {
  if (lang === "fr") {
    return `Le champ doit contenir au moins ${count} ${charType}.`;
  }
  return `This field requires at least ${count} ${charType}.`;
}

export function minLength(
  lang: string,
  len: number
): string {
  if (lang === "fr") {
    return `Le champ doit contenir au moins ${len} caractères.`;
  }
  return `This field requires at least ${len} characters.`;
}