export function minChar(
  lang: string,
  len: number,
  charType?: string,
  input?: HTMLInputElement | HTMLTextAreaElement
): string {
  if (lang === "en") {
    return `This field requires at least ${len} ${charType} characters.`;
  } else if (lang === "fr") {
    return `Ce champ doit contenir au moins ${len} caractères ${charType}.`;
  }

  return "";
}

export function minNum(
  lang: string,

  len: number,
  input?: HTMLInputElement
): string {
  if (lang === "en") {
    return `This field requires at least ${len} numbers.`;
  } else if (lang === "fr") {
    return `Ce champ doit contenir au moins ${len} nombres.`;
  }

  return "";
}

export function maxChar(
  lang: string,
  input: HTMLInputElement | HTMLTextAreaElement,
  len: number
): string {
  if (lang === "en") {
    return `This field requires at most ${len} characters.`;
  } else if (lang === "fr") {
    return `Ce champ doit contenir au plus ${len} caractères.`;
  }

  return "";
}

export function minWord(
  lang: string,
  input: HTMLInputElement | HTMLTextAreaElement,
  len: number
): string {
  if (lang === "en") {
    return `This field requires at least ${len} words.`;
  } else if (lang === "fr") {
    return `Ce champ doit contenir au moins ${len} mots.`;
  }

  return "";
}

export function maxWord(
  lang: string,
  input: HTMLInputElement | HTMLTextAreaElement,
  len: number
): string {
  if (lang === "en") {
    return `This field requires at most ${len} words.`;
  } else if (lang === "fr") {
    return `Ce champ doit contenir au plus ${len} mots.`;
  }

  return "";
}

export function lowercase(
  lang: string,
  input?: HTMLInputElement | HTMLTextAreaElement
): string {
  if (lang === "en") {
    return `This field requires lowercase character.`;
  } else if (lang === "fr") {
    return `Ce champ doit contenir des caractères en minuscule.`;
  }

  return "";
}

export function uppercase(
  lang: string,
  input?: HTMLInputElement | HTMLTextAreaElement
): string {
  if (lang === "en") {
    return `This field requires uppercase character.`;
  } else if (lang === "fr") {
    return `Ce champ doit contenir des caractères en majuscule.`;
  }

  return "";
}

export function specialChar(
  lang: string,
  input: HTMLInputElement | HTMLTextAreaElement,
  character: string
): string {
  if (lang === "en") {
    return `The character '${character}' is not allowed in this field.`;
  } else if (lang === "fr") {
    return `Le caractère '${character}' n'est pas autorisé dans ce champ.`;
  }

  return "";
}

export function charRange(min: number, max: number, lang: string): string {
  if (lang === "en") {
    return `Characters most be between the range of ${min} and ${max} inclusive.`;
  } else if (lang === "fr") {
    return `Les caractères doivent être comprise entre ${min} et ${max} inclus.`;
  }

  return "";
}

export function maxCharReapeatExceeded(limit: number, lang: string): string {
  if (lang === "en") {
    return `This field cannot contain any character more than ${limit} times.`;
  }
  return `Ce champ ne peut pas contenir un caractère plus de ${limit} fois.`;
}

export function patternFound(lang: string): string {
  if (lang === "en") {
    return `The field cannot contain sequential characters like "1234" or "abcd"`;
  }
  return ` Ce champ ne peut pas contenir des caractères successifs comme "1234" ou "abcd"`;
}

export function passwordTrialLimitWarning(lang: string): string {
  if (lang === "en") {
    return `This is your last trial.`;
  } else {
    return ``;
  }
}

export function passwordRateLimit(lang: string): string {
  if (lang === "en") {
    return `too many attempts. form frozen.`;
  } else {
    return ``;
  }
}

export function invalidEmailAddress(lang: string, magicWord: string): string {
  if (lang === "en") {
    return `This field requires a ${magicWord} email address.`;
  } else {
    return ` Ce champ doit contenir une adresse email ${magicWord}.`;
  }
}
