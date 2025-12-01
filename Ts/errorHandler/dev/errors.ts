export function formInstanceMismatch(form: HTMLFormElement, lang: string) {
  if (lang === "en") {
    throw new Error(
      form +
        " is not an instance of HTMLFormElement. Please provide a valid form. In the constructor FormValidation()."
    );
  } else if (lang === "fr") {
    throw new Error(
      form +
        " n'est pas une instance de HTMLFormElement. Veuillez fournir un formulaire valide. Dans le constructeur FormValidation()."
    );
  }
}

export function missingGdevAttribute(lang: string, target: any): void {
  if (lang === "en") {
    console.warn(
      "No data-veli-rules found in " +
        target +
        ". Please make sure all form fields have the data-veli-rules attribute with validation rules."
    );
  } else if (lang === "fr") {
    console.warn(
      "Aucun data-veli-rules n'a été trouvé dans " +
        target +
        ". Veuillez vous assurer que tous les champs du formulaire ont l'attribut data-veli-rules avec les règles de validation."
    );
  }
}

export function missingProperty(
  lang: string,
  missingprop: string,
  fieldName: string
): string {
  if (lang === "en") {
    return `missing ${missingprop} at ${fieldName}`;
  }
  return `${fieldName} manque une propriété  ${missingprop}.`;
}

export function missingFieldWrappers(lang: string): void {
  if (lang === "en") {
    console.warn(
      'No field-wrapper found in the provided form. Ensure fields are wrapped in a <div class="veli-field-wrapper"> and include a <span class="veli-error"></span>. See MIGRATION.md for details.'
    );
  } else if (lang === "fr") {
    console.warn(
      'Aucun field-wrapper n\'a été trouvé dans le formulaire. Assurez-vous que les champs sont encapsulés dans <div class="veli-field-wrapper"> et incluent <span class="veli-error"></span>. Voir MIGRATION.md pour plus de détails.'
    );
  }
}

export function missingRequiredGdevProps(
  input: any,
  name: string | null,
  lang: string
): string {
  if (lang === "fr") {
    return name
      ? `${name} is missing a type property.`
      : `${input} is missing a name property.`;
  } else {
    return name
      ? `${name} manque une propriété  'type'.`
      : `${input} manque une propriété  'name'.`;
  }
}

export function undefinedPasswordSecurityLevel(
  lang: string,
  name: string
): void {
  if (lang === "en") {
    throw new Error(
      `Undefined password security level at ${name}. consider using (s1, s2, s3, s4).`
    );
  } else {
    throw new Error(
      `Niveau de securité du mot de passe non défini à ${name}. Considère d'utiliser (s1, s2, s3, s4).`
    );
  }
}

export function wrongFieldInstance(lang: string, field: any): void {
  if (lang === "en") {
    throw new Error(
      `${field} is neither an Instance of HTMLinputElement nor HTMLtextAreaElement.`
    );
  } else if (lang === "fr") {
  }
}

export function invalidGdevProperty(
  parsedProperty: string,
  lang: string,
  fieldType: string,
  fieldName: string = ""
): string {
  if (lang === "en") {
    return `${parsedProperty} is not a valid property for type ${fieldType} at ${fieldName}`;
  }

  return `${parsedProperty} n'est pas une propriété valide pour le type ${fieldType} a ${fieldName}`;
}

export function undefinedProvider(lang: string, name: string): void {
  if (lang === "en") {
    throw new Error(`${name} is not a valid email provider.`);
  } else if (lang === "fr") {
    throw new Error(`${name} n'est pas un fournisseur d'email valide.`);
  }
}

export function invalidPropertyValue(
  property: string,
  expectedType: string,
  fieldName: string,
  lang: string
): string {
  if (lang === "en") {
    return `type ${property} expected a value of type ${expectedType} at ${fieldName}`;
  }
  return `type ${property} attendait une valeur de type ${expectedType} au niveau de ${fieldName}`;
}

export function duplicateData(name: string, lang: string): string {
  if (lang === "fr") {
    return `Un champ avec le nom ${name} existe déjà. Veuillez choisir un nom différent pour éviter les conflits.`;
  } else {
    return `A field with the name ${name} already exists. Please use a different name.`;
  }
}

export function missingClassName(
  lang: string,
  element: any,
  expectedClassName: string
): string {
  if (lang === "fr") {
    return `Missing class name '${expectedClassName}' at ${element.tagName}.`;
  } else {
    return `Classe ${expectedClassName} manquante au niveau de ${element.tagName}.`;
  }
}
export function missingField(
  lang: string,
  providedName: string,
  currentField: string
): string {
  if (lang === "fr") {
    return `Le champ avec le nom '${providedName}' n'existe pas ou est défini de manière incorrecte at ${currentField}. Veuillez renseigner le nom du champ correctement.`;
  } else {
    return `The field with the name '${providedName}' does not exist or is incorrectly defined a ${currentField}. Please provide the correct field name.`;
  }
}
