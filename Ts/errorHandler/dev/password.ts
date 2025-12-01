export function missingField(
  lang: string,
  name: string,
  fieldName: string = ""
): string {
  if (lang === "fr") {
    return `Le champ avec le nom '${name}' n'existe pas ou est défini de manière incorrecte a ${fieldName}.`;
  }
  return `The field with the name '${name}' does not exist or is incorrectly defined at ${fieldName}.`;
}
