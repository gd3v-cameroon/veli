import {Utils} from "../utils";
import * as er from "../errorHandler/user/errors";
import {validationElementsTypes} from "Ts/globalTypes";

export class TextField extends Utils {
  static #props: string[] = [
    "type",
    "name",
    "minChar",
    "maxChar",
    "minWord",
    "maxWord",
    "case",
    "specialChar",
    "pattern",
  ];

  static validate(element: validationElementsTypes, lang: string) {
    const {errorField, field, specifications} = element;
    try {
      Object.keys(specifications).forEach((key) => {
        if (this.#props.includes(key)) {
          if (key === "minChar") {
            if (
              !this.isInRangeMin(
                field.value,
                Math.floor(parseInt(specifications.minChar))
              )
            ) {
              let errorMessage = Utils.generateError(
                specifications.minChar,
                () =>
                  er.minChar(
                    lang,
                    Math.floor(parseInt(specifications.minChar)),
                    "",
                    field!
                  )
              );

              //handle error
              Utils.handleError(field, errorField, errorMessage);
            } else {
              //handle success
              Utils.handleSuccess(field, errorField);
            }
          }

          if (key === "maxChar") {
            if (
              this.isInRangeMax(
                field!.value,
                Math.floor(parseInt(specifications.maxChar))
              )
            ) {
              //handle success
              Utils.handleSuccess(field, errorField);
            } else {
              let errorMessage = Utils.generateError(
                specifications.maxChar,
                () =>
                  er.maxChar(
                    lang,
                    field!,
                    Math.floor(parseInt(specifications.maxChar))
                  )
              );
              //handle error
              Utils.handleError(field, errorField, errorMessage);
            }
          }

          if (key === "minWord") {
            if (
              !this.isInMinWordRange(
                field!.value,
                Math.floor(parseInt(specifications.minWord))
              )
            ) {
              let errorMessage = Utils.generateError(
                specifications.minWord,
                () =>
                  er.minWord(
                    lang,
                    field!,
                    Math.floor(parseInt(specifications.minWord))
                  )
              );

              //handle error
              Utils.handleError(field, errorField, errorMessage);

              // Exit the loop after setting the error state
            } else {
              //handle success
              Utils.handleSuccess(field, errorField);
            }
          }

          if (key === "maxWord") {
            if (
              !this.isInMaxWordRange(
                field!.value,
                Math.floor(parseInt(specifications.maxWord))
              )
            ) {
              let errorMessage = Utils.generateError(
                specifications.maxWord,
                () =>
                  er.maxWord(
                    lang,
                    field!,
                    Math.floor(parseInt(specifications.maxWord))
                  )
              );
              //handle error
              Utils.handleError(field, errorField, errorMessage);
            } else {
              //handle success
              Utils.handleSuccess(field, errorField);
            }
          }

          if (
            key === "case" &&
            specifications.case.split("@@")[0] === "upper"
          ) {
            if (!this.isUppercase(field!.value)) {
              let errorMessage = Utils.generateError(specifications.case, () =>
                er.uppercase(lang, field!)
              );
              //handle error
              Utils.handleError(field, errorField, errorMessage);
            } else {
              //handle success
              Utils.handleSuccess(field, errorField);
            }
          }

          if (
            key === "case" &&
            specifications.case.split("@@")[0] === "lower"
          ) {
            if (!this.isLowercase(field!.value)) {
              let errorMessage = Utils.generateError(specifications.case, () =>
                er.lowercase(lang, field!)
              );
              //handle error
              Utils.handleError(field, errorField, errorMessage);
            } else {
              //handle success
              Utils.handleSuccess(field, errorField);
            }
          }

          if (
            key === "specialChar" &&
            !JSON.parse(specifications.specialChar.split("@@")[0])
          ) {
            let specialChar: any = this.specialCharScan(field!.value);

            if (specialChar != null) {
              let errorMessage = Utils.generateError(
                specifications.specialChar,
                () => er.specialChar(lang, field!, specialChar)
              );
              //handle error
              Utils.handleError(field, errorField, errorMessage);
            } else {
              //handle success
              Utils.handleSuccess(field, errorField);
            }
          }
        } else {
          console.error(
            `${key} is not a valid Veli property at ${specifications.name}. See MIGRATION.md for details on the expected properties.`
          );
        }
      });
    } catch (error) {}
  }
}
