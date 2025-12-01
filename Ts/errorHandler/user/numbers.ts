export function minErr(number: any, lang: string): string {
  if (lang === "fr") {
    return(
      `Ce champ nécessite un nombre supérieur ou égal à ${number}.`
    );
  } else {
    return(
      `this field requires a number greater than or equal to ${number}`
    );
  }
}

export function maxErr(number: any, lang: string): string {
  if (lang === "fr") {
    return(
      `Ce champ nécessite un nombre inférieur ou égal à ${number}.`
    );
  } else {
    return(
      `this field requires a number less than or equal to ${number}`
    );
  }
}

export function rangeErr(min: any, max: any, lang: string): string {
  if (lang === "fr") {
    return(
      `Ce champ nécessite un nombre compris entre ${min} et ${max}.`
    );
  } else {
    return(`this field requires a number between ${min} and ${max}`);
  }
}

export function factorOfError(number: any, lang: string): string {
    if (lang === "fr") {
      return(`Ce champ nécessite un facteur de ${number}.`);
    } else {
      return(`this field requires a factor of ${number}`);
    }
}

export function multipleError(number: any, lang: string): string {
  if (lang === "fr") {
    return `Ce champ nécessite un multiple de ${number}.`;
  } else {
    return `this field requires a multiple of ${number}`;
  }
}

export function typeError(type: string, lang: string): string{
  if (lang === "fr") {
    return `Ce champ doit être de type ${type}.`;
  } else {
    return `this field must be of type ${type}`;
  }
}


export function classError(lang: string, numClass: string): string {
  if (lang === "fr") {
    if(numClass === 'even'){
      numClass = 'pair';
    } else if(numClass === 'odd'){
      numClass = 'impair';
    } else if(numClass === 'prime'){
      numClass = "premier";
    }
  
    return `Ce champ doit contenir les nombres ${numClass} .`;
  } else {
    return `This field requires ${numClass} numbers.`;
  }
}

export function invalidInput(lang: string, expected: string): string {
  if (lang === "fr") {
    if (expected === "perfectsquare") {
      expected = "Carré parfait";
    } else if (expected === "palindrome") {
      expected = "palindrome";
    }
    return `Ce champ nécessite un ${expected}.`;
  } else {

    return `This field requires a ${expected}`;
  }
}