import {
  finalValidationResponseType,
  propertyValueType,
  CharCountType,
} from "./globalTypes";

export class Utils {
  private static validationResponse: boolean = true;
  public static finalValidationResponse: finalValidationResponseType = {
    status: false,
    values: {},
  };
  static lang: string = "en";
  static #userValidationRate: number = 0;

  public static trim(text: any): string {
    if (text === null || text === undefined) return "";
    const s = typeof text === "string" ? text : String(text);
    return s.replace(/\s/g, "");
  }

  // Accessor for validationResponse
  public static get getValidationResponse(): boolean {
    return this.validationResponse;
  }

  public static get getuserValidationRate(): number {
    return this.#userValidationRate;
  }

  //Accessor for validation rate

  // Consider making the setter private if modification should only be done through child classes
  public static set setValidationResponse(response: boolean) {
    this.validationResponse = response;
  }

  static isInRangeMin(text: string, length: number): boolean {
    let compactText = this.trim(text);

    if (compactText.length >= length) {
      return true;
    } else {
      return false;
    }
  }

  static isInRangeMax(text: string, length: number): boolean {
    let compactText = this.trim(text);

    if (compactText.length <= length) {
      return true;
    } else {
      return false;
    }
  }

  static isInMinWordRange(phrase: string, length: number): boolean {
    let wordCount = Math.floor(phrase.trim().split(" ").length);
    if (wordCount >= length) {
      return true;
    } else {
      return false;
    }
  }

  static isInMaxWordRange(phrase: string, length: number): boolean {
    let wordCount = Math.floor(phrase.trim().split(" ").length);
    if (wordCount <= length) {
      return true;
    } else {
      return false;
    }
  }

  static isUppercase(text: string): boolean {
    let compactText = this.trim(text);
    if (compactText === compactText.toUpperCase()) {
      return true;
    } else {
      return false;
    }
  }

  static isLowercase(text: string): boolean {
    let compactText = Utils.trim(text);
    if (compactText === compactText.toLowerCase()) {
      return true;
    } else {
      return false;
    }
  }

  static specialCharScan(str: string): string | null {
    const regex = /[^\w\s]/; // Matches any character that is not a letter, number, or underscore

    // Check using regex first (potentially faster for common cases)
    const match = Utils.trim(str).match(regex);
    if (match) {
      return match[0]; // Return the first matched character
    }

    // If no match with regex, loop through characters for more control
    for (let i = 0; i < Utils.trim(str).length; i++) {
      const charCode = Utils.trim(str).charCodeAt(i);
      if (
        (charCode < 48 || charCode > 57) && // Not a number (0-9)
        (charCode < 65 || charCode > 90) && // Not an uppercase letter (A-Z)
        (charCode < 97 || charCode > 122) && // Not a lowercase letter (a-z)
        charCode !== 95 // Not underscore
      ) {
        return str[i]; // Return the character as a string
      }
    }

    // No special characters found
    return null;
  }

  static handleSuccess(inputField: any, errorField: any): void {
    //remove the error class if exist
    inputField!.classList.remove("veli-error-field");

    //add the success class to the corresponding field
    inputField!.classList.add("veli-success-field");

    //add the error message if specified by the developer
    errorField !== null ? (errorField.innerText = "") : "";
  }

  static handleError(
    inputField: any,
    errorField: any,
    errorMessage: string
  ): void {
    //remove success class if it exists
    inputField!.classList.remove("veli-success-field");

    //add the error class to the corresponding field
    inputField!.classList.add("veli-error-field");
    //add the error message if specified by the developer
    errorField !== null ? (errorField.innerText = errorMessage) : "";

    // Set the error state
    this.setValidationResponse = false;
    throw new Error("Validation failed");
  }

  static isBoolean(value: any): boolean {
    if (typeof value === "boolean") {
      return true;
    } else {
      return false;
    }
  }

  static generateError = (value: string, fallback: () => string): string => {
    const error = value.includes("@@") ? value.split("@@")[1] : fallback();

    return error;
  };

  static isArray(value: any): boolean {
    if (Array.isArray(value)) {
      return true;
    } else {
      return false;
    }
  }

  static isNumber(value: any): boolean {
    if (typeof value === "number") {
      return true;
    } else {
      return false;
    }
  }

  static isString(value: any): boolean {
    if (typeof value === "string") {
      return true;
    } else {
      return false;
    }
  }

  static isArrayOfStrings(value: any): boolean {
    return (
      Array.isArray(value) && value.every((item) => typeof item === "string")
    );
  }

  static isArrayOfNumbers(value: any): boolean {
    return (
      Array.isArray(value) && value.every((item) => typeof item === "number")
    );
  }

  static isInteger(value: any): boolean {
    if (typeof value === "number") {
      return Number.isInteger(value);
    }
    if (typeof value === "string" && value.trim() !== "") {
      return Number.isInteger(Number(value));
    }
    return false;
  }

  static isArrayOfBooleans(value: any): boolean {
    return (
      Array.isArray(value) && value.every((item) => typeof item === "boolean")
    );
  }

  static propertyValueSplitter(value: any): propertyValueType {
    const raw = value === null || value === undefined ? "" : String(value);
    const parts = raw.split("@@");
    const val = parts[0] ? parts[0].trim() : "";
    const errorMessage =
      parts.length > 1 ? parts.slice(1).join("@@").trim() : undefined;
    return {value: val, errorMessage};
  }

  public static countChars(value: string): CharCountType {
    const sanitizedValues = this.trim(value);
    const specialChars = /[^a-zA-Z0-9]/;
    let num = 0,
      lowercaseAlphabet = 0,
      specialChar = 0,
      uppercaseAlphabet = 0;
    for (const char of sanitizedValues) {
      if (char >= "a" && char <= "z") lowercaseAlphabet++;
      else if (char >= "A" && char <= "Z") uppercaseAlphabet++;
      else if (char >= "0" && char <= "9") num++;
      else if (specialChars.test(char)) specialChar++;
    }
    return {
      num,
      lowercaseAlphabet,
      uppercaseAlphabet,
      specialChar,
    };
  }
}
