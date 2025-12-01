export function notSupported(
  lang: string,
  fieldName: string,
  parsedCountry: string
): string {
  if (lang === "fr") {
    return `Le pays ${parsedCountry} n'est pas encore pris en charge pour la validation de numéro de téléphone au niveau du champ ${fieldName}. Veuillez visiter https://gd3v.com/ pour plus d'informations.`;
  }
  return `${parsedCountry} is not yet supported for phone number validation at ${fieldName}. Please visit https://gd3v.com/ for more information.`;
}
