export function invalidRelationship(
  parsedRelationship: string,
  lang: string,
  fieldName: string
): string {
  if (lang === "fr") {
    return `${parsedRelationship} n'est pas une relation valide au niveau de ${fieldName}`;
  } else {
    return `${parsedRelationship} is not a valid relationship at ${fieldName}`;
  }
}

export function invalidGroupMemberType(
  parsedMemberName: string,
  lang: string,
  fieldName: string
): string {
  if (lang === "fr") {
    return `${parsedMemberName} n'est pas un checkbox au niveau de ${fieldName}`;
  }
  return `${parsedMemberName} is not a checkbox at ${fieldName}`;
}

export function invalidRelationshipType(lang: string, parsedRelationship: string, fieldName: string): string {
  if (lang === "fr") {
    return `linkTo attendait une relation comme "enableToggle", "clear", "reset" ou "passwordShowToggle", mais a trouvé ${parsedRelationship} à ${fieldName}.`;
  }
  return `linkTo expected a relationship like "enableToggle", "clear", "reset" or "passwordShowToggle" but found ${parsedRelationship} at ${fieldName}.`;
}

export function invalidDefaultSelect_maxSelect_propUsage(lang: string, fieldName: string): string{
  if (lang === "fr") {
    return `La propriété 'maxSelect' ne peut pas être inférieure au nombre de champs 'defaultSelect' a ${fieldName}.`;
  }
  return `The 'maxSelect' properties cannot be less than  the number of 'diffultSelect' fields at ${fieldName}.`;
}