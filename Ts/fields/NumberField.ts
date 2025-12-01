import {Utils} from "../utils";
import * as userNumErr from "../errorHandler/user/numbers";
import {validationElementsTypes} from "Ts/globalTypes";

export class NumberField extends Utils {
  public validate(element: validationElementsTypes): void {
    const {
      field: input,
      specifications: developerSpecifications,
      errorField,
    } = element;
    try {
      Object.entries(developerSpecifications).forEach(([key, rawValue]) => {
        const {value} = Utils.propertyValueSplitter(Utils.trim(rawValue));
        switch (key) {
          case "min":
            if (
              this.#minCheck(input.value, value, developerSpecifications.name)
            ) {
              Utils.handleSuccess(input, errorField);
            } else {
              Utils.handleError(
                input,
                errorField,
                Utils.generateError(rawValue, () =>
                  userNumErr.minErr(developerSpecifications.min, Utils.lang)
                )
              );
            }
            break;

          case "max":
            if (
              this.#maxCheck(input.value, value, developerSpecifications.name)
            ) {
              Utils.handleSuccess(input, errorField);
            } else {
              Utils.handleError(
                input,
                errorField,
                Utils.generateError(rawValue, () =>
                  userNumErr.maxErr(developerSpecifications.max, Utils.lang)
                )
              );
            }
            break;

          case "range":
            const [min, max] = value.split(",");
            if (
              this.#rangeCheck(input.value, value, developerSpecifications.name)
            ) {
              Utils.handleSuccess(input, errorField);
            } else {
              Utils.handleError(
                input,
                errorField,
                Utils.generateError(rawValue, () =>
                  userNumErr.rangeErr(min, max, Utils.lang)
                )
              );
            }
            break;

          case "factorOf":
            if (
              this.#factorOfCheck(
                input.value,
                value,
                developerSpecifications.name
              )
            ) {
              Utils.handleSuccess(input, errorField);
            } else {
              Utils.handleError(
                input,
                errorField,
                Utils.generateError(rawValue, () =>
                  userNumErr.factorOfError(
                    developerSpecifications.factorOf,
                    Utils.lang
                  )
                )
              );
            }

            break;

          case "multipleOf":
            if (
              this.#multipleCheck(
                input.value,
                value,
                developerSpecifications.name
              )
            ) {
              Utils.handleSuccess(input, errorField);
            } else {
              Utils.handleError(
                input,
                errorField,
                Utils.generateError(rawValue, () =>
                  userNumErr.multipleError(
                    developerSpecifications.multipleOf,
                    Utils.lang
                  )
                )
              );
            }

            break;

          case "numType":
            this.#numTypeCheck(
              rawValue,
              input,
              developerSpecifications.name,
              errorField
            );
            break;

          case "numClass":
            this.#numClassCheck(
              rawValue,
              input,
              developerSpecifications.name,
              errorField
            );
            break;

          case "fancyNum":
            this.#fancyNumCheck(
              input,
              errorField,
              key,
              developerSpecifications.name
            );
            break;
          
        }
      });
    } catch (error) {}
  }

  #minCheck(userInput: any, min: any, fieldName: string): boolean {
    return userInput >= parseFloat(min) ? true : false;
  }

  #maxCheck(userInput: any, max: any, fieldName: string): boolean {
    return userInput <= parseFloat(max) ? true : false;
  }

  #rangeCheck(userInput: any, range: any, fieldName: string): boolean {
    const [min, max] = range.split(",");
    return userInput >= parseFloat(min) && userInput <= parseFloat(max)
      ? true
      : false;
  }

  #factorOfCheck(userInput: any, number: any, fieldName: string): boolean {
    return parseFloat(number) % userInput === 0 ? true : false;
  }

  #multipleCheck(userInput: any, number: any, fieldName: string): boolean {
    return userInput % parseFloat(number) === 0 ? true : false;
  }

  #numTypeCheck(
    rawValue: string,
    field: any,
    fieldName: string,
    errorField: any
  ): void {
    const type = Utils.propertyValueSplitter(rawValue).value;
    const error = () => {
      Utils.handleError(
        field,
        errorField,
        Utils.generateError(rawValue, () =>
          userNumErr.typeError(type, Utils.lang)
        )
      );
    };
    if (type === "integer") {
      if (Number.isInteger(Number(field.value))) {
        Utils.handleSuccess(field, errorField);
      } else {
        error();
      }
    } else if (type === "decimal") {
      if (!Number.isInteger(Number(field.value))) {
        Utils.handleSuccess(field, errorField);
      } else {
        error();
      }
    } else if (type === "real") {
      if (
        (Number.isInteger(Number(field.value)) ||
          !Number.isInteger(Number(field.value))) &&
        !isNaN(Number(field.value))
      ) {
        Utils.handleSuccess(field, errorField);
      } else {
        error();
      }
    }
  }

  /**
   *
   * @param {string} type - The number class property value to check against.
   * @param {any} field - The input field to be checked.
   * @param {string} fieldName - The name of the field being checked.
   * @param {any} errorField - The error field to display any errors.
   * @return {void}
   */
  #numClassCheck(
    rawValue: string,
    field: any,
    fieldName: string,
    errorField: any
  ): void {
    const type = Utils.propertyValueSplitter(rawValue).value;
    const error = () => {
      Utils.handleError(
        field,
        errorField,
        Utils.generateError(rawValue, () =>
          userNumErr.classError(Utils.lang, type)
        )
      );
    };
    // Check if the number class property value is 'even'
    if (type === "even") {
      // Check if the input field value is even
      if (Number(field.value) % 2 === 0) {
        Utils.handleSuccess(field, errorField);
      } else {
        // Display an error message if the input field value is not even
        error();
      }
    }
    // Check if the number class property value is 'odd'
    else if (type === "odd") {
      // Check if the input field value is odd
      if (Number(field.value) % 2 !== 0 && !isNaN(Number(field.value))) {
        Utils.handleSuccess(field, errorField);
      } else {
        // Display an error message if the input field value is not odd
        error();
      }
    }
    // Check if the number class property value is 'prime'
    else if (type === "prime") {
      // Check if the input field value is prime
      if (this.#isPrime(Number(field.value))) {
        Utils.handleSuccess(field, errorField);
      } else {
        // Display an error message if the input field value is not prime
        error();
      }
    }
  }

  /**
   *
   * @param {any} inputField - The input field to be checked.
   * @param {any} errorField - The error field to display any errors.
   * @param {string} propertyValue - The fancy number property value to check against.
   * @param {string} fieldName - The name of the field being checked.
   * @return {void}
   */
  #fancyNumCheck(
    inputField: any,
    errorField: any,
    rawValue: string,
    fieldName: string
  ): void {
    const propertyValue = Utils.propertyValueSplitter(rawValue).value;
    if (propertyValue === "perfectsquare") {
      if (Number.isInteger(Math.sqrt(Number(inputField.value)))) {
        Utils.handleSuccess(inputField, errorField);
      } else {
        Utils.handleError(
          inputField,
          errorField,
          Utils.generateError(rawValue, () =>
            userNumErr.invalidInput(Utils.lang, propertyValue)
          )
        );
      }
    }
  }

  /**
   * Determines if a number is prime.
   *
   * @param {number} num - The number to check.
   * @return {boolean} - True if the number is prime, false otherwise.
   */

  // Loop through numbers from 2 to the square root of the number
  #isPrime(num: number): boolean {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      // If the number is divisible by any number in the loop, it is not prime
      if (num % i === 0) {
        return false; // Not prime
      }
      if (num % i === 0) return false; // Not prime
    }

    // If the number has passed all the checks, it is prime
    return true; // Is prime
  }
}
