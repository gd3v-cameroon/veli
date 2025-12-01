export function invalidPhoneNumber(
  lang: string,
  Countries: Array<string>
): string {
  if (lang === "fr") {
    return `Veuillez fournir un numéro de téléphone valide pour l'un des pays suivants: ${Countries.map(
      (country) => {
        if (country === "any") {
          return "n'importe quel pays";
        } else {
          return country;
        }
      }
    )}.`;
  }
  return `Please provide a valid phone number from: ${Countries.map(
    (country) => `${country} `
  )}.`;
}
