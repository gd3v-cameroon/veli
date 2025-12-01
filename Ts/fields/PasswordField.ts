import {Utils} from "../utils";
import * as uer from "../errorHandler/user/errors";
import * as passwordDevErrors from "../errorHandler/dev/password";
import * as passwordUserErrors from "../errorHandler/user/password";
import {validationElementsTypes} from "Ts/globalTypes";
export class PasswordField extends Utils {
  static inputField: HTMLInputElement | HTMLTextAreaElement;
  static fieldName: string;
  public language = Utils.lang;
  static #errorHolder: any;
  private static dSpecifications: any;
  public static validate(
    element: validationElementsTypes,
    validationRules: any
  ): void {
    try {
      const {
        errorField,
        field: input,
        specifications: developerSpecifications,
      } = element;
      this.#errorHolder = errorField;
      this.dSpecifications = developerSpecifications;
      Object.entries(developerSpecifications).forEach(([key, rawValue]) => {
        const v = Utils.propertyValueSplitter(rawValue);

        if (key === "securityLevel") {
          this.inputField = input;
          this.fieldName = developerSpecifications.name;
          switch (developerSpecifications.securityLevel.split("@@")[0]) {
            case "s1":
              this.#levelOne(input.value);
              break;
            case "s2":
              this.#levelTwo(input.value);
              break;
            case "s3":
              this.#levelThree(input.value);
              break;
            case "s4":
              this.#levelFour(input.value);
              break;
          }
        } else if (key === "confirmWith") {
          const confirmRule = validationRules.find(
            (rule: validationElementsTypes) =>
              rule.specifications.name ===
              developerSpecifications.confirmWith.split("@@")[0]
          );

          if (confirmRule) {
            if (
              input.value.length > 0 &&
              confirmRule.field.value.length > 0 &&
              input.value === confirmRule.field.value
            ) {
              Utils.handleSuccess(input, errorField);
              Utils.handleSuccess(confirmRule.field, confirmRule.errorField);
            } else {
              const e1 = Utils.generateError(
                this.dSpecifications.confirmWith,
                () => passwordUserErrors.valueMismatch(Utils.lang)
              );
              Utils.handleError(input, errorField, e1);

              const e2 = Utils.generateError(
                this.dSpecifications.confirmWith,
                () => passwordUserErrors.valueMismatch(Utils.lang)
              );
              Utils.handleError(confirmRule.field, confirmRule.errorField, e2);
            }
          } else {
            console.error(
              passwordDevErrors.missingField(
                Utils.lang,
                developerSpecifications.confirmWith
              )
            );
            throw new Error("");
          }
        } else if (key === "maxCharRepeat") {
          const limit = parseInt(
            this.dSpecifications.maxCharRepeat.split("@@")[0]
          );
          if (this.#checkMaxCharRepeat(input.value, limit)) {
            const errormessage = Utils.generateError(
              this.dSpecifications.maxCharRepeat,
              () => uer.maxCharReapeatExceeded(limit, Utils.lang)
            );
            Utils.handleError(input, errorField, errormessage);
          } else {
            Utils.handleSuccess(input, errorField);
          }
        } else if (key === "sequentialPatternCount") {
          const length = parseInt(
            this.dSpecifications.sequentialPatternCount.split("@@")[0]
          );
          if (this.#hasSequentialPattern(input.value, length)) {
            const errormessage = Utils.generateError(
              this.dSpecifications.sequentialPatternCount,
              () => uer.patternFound(Utils.lang)
            );
            Utils.handleError(input, errorField, errormessage);
          } else {
            Utils.handleSuccess(input, errorField);
          }
        } else if (
          key === "minLen" ||
          key === "minNumCount" ||
          key === "minLowercaseAlphabetCount" ||
          key === "minUppercaseAlphabetCount" ||
          key === "minSpecialCharCount"
        ) {
          const value = parseInt(Utils.propertyValueSplitter(rawValue).value);
          const userInput = Utils.trim(input.value);
          const charCounts = Utils.countChars(userInput);

          // Mapping keys to their respective character counts and error messages
          const validationRules = {
            minLen: {
              count: userInput.length,
              errorMessage: () =>
                passwordUserErrors.minLength(Utils.lang, value),
            },
            minNumCount: {
              count: charCounts.num,
              errorMessage: () =>
                passwordUserErrors.invalidCharCount(
                  Utils.lang,
                  value,
                  "'numbers'"
                ),
            },
            minLowercaseAlphabetCount: {
              count: charCounts.lowercaseAlphabet,
              errorMessage: () =>
                passwordUserErrors.invalidCharCount(
                  Utils.lang,
                  value,
                  "'lowercase alphabetic characters'"
                ),
            },
            minUppercaseAlphabetCount: {
              count: charCounts.uppercaseAlphabet,
              errorMessage: () =>
                passwordUserErrors.invalidCharCount(
                  Utils.lang,
                  value,
                  "'uppercase alphabetic characters'"
                ),
            },
            minSpecialCharCount: {
              count: charCounts.specialChar,
              errorMessage: () =>
                passwordUserErrors.invalidCharCount(
                  Utils.lang,
                  value,
                  "'special characters'"
                ),
            },
          };

          // Apply validation
          if (validationRules[key].count >= value) {
            Utils.handleSuccess(input, errorField);
          } else {
            Utils.handleError(
              input,
              errorField,
              Utils.generateError(rawValue, validationRules[key].errorMessage)
            );
          }
        }
      });
    } catch (error) {}
  }

  static #levelOne(password: string) {
    const minimumLen = 5;
    const maximumLen = 7;
    if (
      this.isInRangeMin(password, minimumLen) &&
      this.isInRangeMax(password, maximumLen)
    ) {
      //handle success
      Utils.handleSuccess(this.inputField, this.#errorHolder);
    } else {
      let errorMessage = Utils.generateError(
        this.dSpecifications.securityLevel,
        () => uer.charRange(minimumLen, maximumLen, Utils.lang)
      );
      //handle error
      Utils.handleError(this.inputField, this.#errorHolder, errorMessage);
    }
  }

  static #levelTwo(password: string) {
    const minLen = 8,
      maxLen = 11;
    const trimmedPassword = Utils.trim(password);
    const lengthValid =
      this.isInRangeMin(trimmedPassword, minLen) &&
      this.isInRangeMax(trimmedPassword, maxLen);

    let hasLowercase = false,
      hasUppercase = false;

    for (const char of trimmedPassword) {
      if (char >= "a" && char <= "z") hasLowercase = true;
      else if (char >= "A" && char <= "Z") hasUppercase = true;

      if (hasLowercase && hasUppercase) break; // Exit early when both are found
    }

    const errors = [
      {
        check: !lengthValid,
        message: () => uer.charRange(minLen, maxLen, Utils.lang),
      },
      {check: !hasLowercase, message: () => uer.lowercase(Utils.lang)},
      {check: !hasUppercase, message: () => uer.uppercase(Utils.lang)},
    ];

    for (const {check, message} of errors) {
      if (check) {
        const errorMsg = Utils.generateError(
          this.dSpecifications.securityLevel,
          message
        );
        return Utils.handleError(this.inputField, this.#errorHolder, errorMsg);
      }
    }

    Utils.handleSuccess(this.inputField, this.#errorHolder);
  }

  static #levelThree(password: string) {
    const minLen = 12,
      maxLen = 17;
    const trimmedPassword = Utils.trim(password);
    const lengthValid =
      this.isInRangeMin(trimmedPassword, minLen) &&
      this.isInRangeMax(trimmedPassword, maxLen);

    let uppercaseCount = 0,
      lowercaseCount = 0,
      numberCount = 0;

    for (const char of trimmedPassword) {
      if (char >= "a" && char <= "z") lowercaseCount++;
      else if (char >= "A" && char <= "Z") uppercaseCount++;
      else if (char >= "0" && char <= "9") numberCount++;
    }

    const hasLowercase = lowercaseCount >= 3;
    const hasUppercase = uppercaseCount >= 3;
    const hasNumbers = numberCount >= 3;

    const errors = [
      {
        check: !lengthValid,
        message: () => uer.charRange(minLen, maxLen, Utils.lang),
      },
      {
        check: !hasLowercase,
        message: () => uer.minChar(Utils.lang, 3, "lowercase"),
      },
      {
        check: !hasUppercase,
        message: () => uer.minChar(Utils.lang, 3, "uppercase"),
      },
      {check: !hasNumbers, message: () => uer.minNum(Utils.lang, 3)},
    ];

    for (const {check, message} of errors) {
      if (check) {
        const errorMsg = Utils.generateError(
          this.dSpecifications.securityLevel,
          message
        );
        return Utils.handleError(this.inputField, this.#errorHolder, errorMsg);
      }
    }

    Utils.handleSuccess(this.inputField, this.#errorHolder);
  }

  static #levelFour(password: string) {
    const minLen = 18,
      maxLen = 30;
    const trimmedPassword = Utils.trim(password);
    const lengthValid =
      this.isInRangeMin(trimmedPassword, minLen) &&
      this.isInRangeMax(trimmedPassword, maxLen);

    let uppercaseCount = 0,
      lowercaseCount = 0,
      numberCount = 0,
      specialCharCount = 0;
    const specialChars = /[^a-zA-Z0-9]/; // Regex for special characters

    for (const char of trimmedPassword) {
      if (char >= "a" && char <= "z") lowercaseCount++;
      else if (char >= "A" && char <= "Z") uppercaseCount++;
      else if (char >= "0" && char <= "9") numberCount++;
      else if (specialChars.test(char)) specialCharCount++;
    }

    const hasLowercase = lowercaseCount >= 4;
    const hasUppercase = uppercaseCount >= 4;
    const hasNumbers = numberCount >= 4;
    const hasSpecialChars = specialCharCount >= 4;

    const errors = [
      {
        check: !lengthValid,
        message: () => uer.charRange(minLen, maxLen, Utils.lang),
      },
      {
        check: !hasLowercase,
        message: () => uer.minChar(Utils.lang, 4, "lowercase"),
      },
      {
        check: !hasUppercase,
        message: () => uer.minChar(Utils.lang, 4, "uppercase"),
      },
      {check: !hasNumbers, message: () => uer.minNum(Utils.lang, 4)},
      {
        check: !hasSpecialChars,
        message: () => uer.minChar(Utils.lang, 4, "special"),
      },
    ];

    for (const {check, message} of errors) {
      if (check) {
        const errorMsg = Utils.generateError(
          this.dSpecifications.securityLevel,
          message
        );
        return Utils.handleError(this.inputField, this.#errorHolder, errorMsg);
      }
    }

    Utils.handleSuccess(this.inputField, this.#errorHolder);
  }

  static #checkMaxCharRepeat(password: string, limit: number): boolean {
    const charCount = new Map<string, number>();
    for (const char of password) {
      charCount.set(char, (charCount.get(char) || 0) + 1);
      if (charCount.get(char)! > limit) return true; // Stop early if limit exceeded
    }
    return false;
  }

  static #hasSequentialPattern(password: string, length: number): boolean {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (let i = 0; i <= password.length - length; i++) {
      const substring = password.substring(i, i + length);

      if (
        chars.includes(substring) ||
        chars.split("").reverse().join("").includes(substring)
      ) {
        return true; // Found sequential pattern
      }
    }

    return false;
  }
}
