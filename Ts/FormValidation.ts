
import * as error from "./errorHandler/dev/errors";
import {Utils} from "./utils";
import {TextField} from "./fields/TextField";
import {PasswordField} from "./fields/PasswordField";
import {EmailField} from "./fields/EmailField";
import {NumberField} from "./fields/NumberField";
import {PhoneNumber} from "./fields/PhoneNumber";
import {CheckBox} from "./fields/CheckBox";
import {finalValidationResponseType} from "./globalTypes";
import {validationElementsTypes} from "./globalTypes";
import SyntaxValidator from "./SyntaxValidator";
import {Watcher} from "./Watcher";
import {validate} from "./validate";
import { Scanner } from "./Scanner";


/**
*ENGLISH
 * @class Veli  -> This class is used to validate forms.
 * @param {HTMLFormElement} form - The form element to validate.
 * @param {string} lang - The language to display the error messages.

 * @example
 * const form = document.querySelector('form');
 * const veli = new Veli(form, language); 
 * veli.validate();
 * @returns {void} - The response of the validation. is directly sanitized and shown to the user based on developers specification any potential error is thrown to dev console and execution stops.
 * @throws {Error} - If the form is not an instance of HTMLFormElement.


*FRENCH
 * @class Veli -> Cette classe est utilisee pour valider les formulaires.
 * @param {HTMLFormElement} form - L'élément form à valider.  
 * @param {string} lang - La langue pour afficher les messages d'erreur

 * @example
 * const form = document.querySelector('form');
 * const veli = new Veli(form, langue);
 
 * veli.validate();
 * @returns {void} - La réponse de la validation. est directement nettoyé et montré à l'utilisateur en fonction des spécifications des développeurs, toute erreur potentielle est renvoyée à la console de développement et l'exécution s'arrête.
 * @throws {Error} - Si le formulaire n'est pas une instance de HTMLFormElement.
 */
export class Veli extends Utils {
  #form: HTMLFormElement | null = null;
  #selectedFieldsWrapper: NodeListOf<HTMLElement> | null = null;
  #language: string;
  #EmailField = new EmailField();
  #NumberField = new NumberField();
  #PhoneNumber = new PhoneNumber();
  #CheckboxField = new CheckBox();
  #fieldNames: Array<string> = [];
  #validationElements: Array<validationElementsTypes> = [];
  #allFields: Array<validationElementsTypes> = [];
  private isSyntaxClean: boolean = false;

  /**
   * Class constructor for FormValidator
   * @param {HTMLFormElement | null} form - The form element to validate.
   */
  constructor(form: HTMLFormElement | null, lang: string = "en") {
    super();
    // Check if the specified language is supported
    if (lang.toLowerCase() === "en" || lang.toLowerCase() === "fr") {
      this.#language = lang.toLowerCase();
      Veli.setLang(this.#language);
    } else {
      throw new Error(
        `${lang} is not a supported language. Please use 'en' or 'fr'`
      );
    }
    // Check if the form is an instance of HTMLFormElement
    if (form instanceof HTMLFormElement) {
      this.#form = form;
      // Get all the field wrappers, inputs, and textareas that do are not children of field wrapper in the form
      this.#selectedFieldsWrapper = this.#form.querySelectorAll(
        ".veli-field-wrapper, input[data-veli-rules]:not(:is(.veli-field-wrapper *)):not([disabled]), textarea[data-veli-rules]:not(:is(.veli-field-wrapper *)):not([disabled])"
      );

      // Check if there are any field wrappers in the form
      if (this.#selectedFieldsWrapper?.length === 0) {
        error.missingFieldWrappers(this.#language);
        Utils.setValidationResponse = false;
      } else {
        // Loop through each field wrapper
        this.#selectedFieldsWrapper?.forEach((fieldsWrapper) => {
          let input: HTMLInputElement | HTMLTextAreaElement | null;

          if (
            fieldsWrapper instanceof HTMLInputElement ||
            fieldsWrapper instanceof HTMLTextAreaElement
          ) {
            input = fieldsWrapper;
          } else {
            input = fieldsWrapper.querySelector(
              "input[data-veli-rules]:not([disabled]), textarea[data-veli-rules]:not([disabled])"
            );
          }

          // Check if the input field has a data-veli-rules attribute
          if (input === undefined || input === null) {
            error.missingGdevAttribute(this.#language, fieldsWrapper);
          } else {
            let errorField: HTMLElement | null =
              fieldsWrapper.querySelector(".veli-error");

            const parsedProps = input?.getAttribute("data-veli-rules");
            let jsonParsedProps: any;

            jsonParsedProps = JSON.parse(parsedProps!);
            // Check if the current input has a type and name properties
            if (
              jsonParsedProps.type === undefined ||
              jsonParsedProps.name === undefined ||
              jsonParsedProps.type === null ||
              jsonParsedProps.name === null
            ) {
              // Throw an error if the specifications are missing required properties
              throw new Error(
                error.missingRequiredGdevProps(
                  input,
                  jsonParsedProps.name || null,
                  this.#language
                )
              );
            } else if (!this.#isFieldTypeValid(input, jsonParsedProps.type)) {
              // Check if the field type in rules matches the input type
              throw new Error(
                `Field type mismatch: data-veli-rules specifies type "${jsonParsedProps.type}" but the HTML input has type "${input.type}" at ${jsonParsedProps.name}`
              );
            } else {
              // Check if the current input name is already in the fieldNames array
              if (
                this.#fieldNames.includes(jsonParsedProps.name.toLowerCase())
              ) {
                // Throw an error if the input name is a duplicate
                throw new Error(
                  error.duplicateData(jsonParsedProps.name, this.#language)
                );
              } else {
                // Add the input name to the fieldNames array
                this.#fieldNames.push(jsonParsedProps.name.toLowerCase());
                // Add the validation element to the validationElements array
                this.#validationElements.push({
                  specifications: jsonParsedProps,
                  field: input,
                  errorField: errorField,
                });
              }
            }
          }
        });

        const sValidator = new SyntaxValidator(
          this.#validationElements.map((ve) => ve.specifications)
        );

        this.isSyntaxClean = sValidator.isSyntaxClean;
        // Set the validationElements array to the allFields array
        this.#allFields = this.#validationElements;
        //select and process all groups if syntax is clean
        if (this.isSyntaxClean) {
          this.#allFields.forEach((field) => {
            if (
              field.specifications.type === "checkbox" &&
              field.specifications.groupMembers
            ) {
              this.#CheckboxField.validate(field, this.#allFields);
            }
          });
        }
      }
    } else {
      // Throw an error if the form is not an instance of HTMLFormElement
      error.formInstanceMismatch(form!, this.#language);
    }
  }

  static setLang(lang: string) {
    Utils.lang = lang;
  }

  /**
   * Validates that the field type in data-veli-rules matches the HTML input type
   */
  #isFieldTypeValid(
    input: HTMLInputElement | HTMLTextAreaElement,
    ruleType: string
  ): boolean {
    const inputType = input.type || "text";
    const typeMap: Record<string, string[]> = {
      text: ["text", "textarea"],
      password: ["password"],
      email: ["email"],
      tel: ["tel"],
      number: ["number"],
      checkbox: ["checkbox"],
      radio: ["radio"],
    };

    const allowedInputTypes = typeMap[ruleType] || [];
    return allowedInputTypes.includes(inputType);
  }

  public validate(): finalValidationResponseType {
    if (!this.isSyntaxClean) {
      return {status: false, values: {}};
    }

    Utils.setValidationResponse = true;
    this.#startValidation(this.#allFields);

    if (!Utils.getValidationResponse) {
      return {status: false, values: {}};
    }

    try {
      const excludedFields: string[] = JSON.parse(
        this.#form?.getAttribute("data-veli-response-exclude") || "[]"
      );

      // Filter out excluded fields
      let fields = this.#allFields.filter(
        (field) => !excludedFields.includes(field.specifications.name)
      );

      const groupedValues: Record<string, string[]> = {};
      const remainingFields = new Set(fields);

      // Process grouped fields
      for (const field of fields) {
        if (!field.specifications.groupMembers) continue;

        const groupName = field.specifications.groupName;
        const memberNames = Utils.trim(field.specifications.groupMembers).split(
          ","
        );

        const selected = memberNames
          .map((name) => fields.find((f) => f.specifications.name === name))
          .filter(
            (member) =>
              member?.field instanceof HTMLInputElement && member.field.checked
          )
          .map((member) => member!.specifications.checkedValue);

        if (selected.length) {
          groupedValues[groupName] = selected;
        }

        // Remove processed group members from remaining fields
        memberNames.forEach((name) => {
          const member = fields.find((f) => f.specifications.name === name);
          if (member) remainingFields.delete(member);
        });
      }

      // Assign grouped values
      Object.assign(Utils.finalValidationResponse.values, groupedValues);

      // Process remaining individual fields
      remainingFields.forEach((f) => {
        let value = f.field.value || "";
        if (f.field.type === "checkbox") {
          const checkedVal =
            "checkedValue" in f.specifications
              ? f.specifications.checkedValue
              : "true";
          const uncheckedVal =
            "unCheckedValue" in f.specifications
              ? f.specifications.unCheckedValue
              : "false";
          value = (f.field as HTMLInputElement).checked
            ? checkedVal
            : uncheckedVal;
        }
        Utils.finalValidationResponse.values[f.specifications.name] = value;
      });
    } catch (e) {
      throw new Error(
        this.#language === "fr"
          ? "L'attribut exclude doit contenir une liste de noms de champs séparés par des virgules"
          : "The exclude attribute must contain an array of field names separated by commas"
      );
    }

    Utils.finalValidationResponse.status = true;
    return Utils.finalValidationResponse;
  }

  /**
   * Validates each field in the form individually as the user types.
   * @returns {boolean} The validation response.
   */
  public validateEach(): boolean {
    if (!this.isSyntaxClean) {
      return false;
    }
    // Get all the field wrappers in the form
    const wrappers: NodeListOf<HTMLElement> | null =
      this.#form!.querySelectorAll(
        ".veli-field-wrapper, input[data-veli-rules]:not(:is(.veli-field-wrapper *)):not([disabled]), textarea[data-veli-rules]:not(:is(.veli-field-wrapper *)):not([disabled])"
      );
      
    if (wrappers != null) {
      // Loop through each field wrapper

      wrappers.forEach((parsedFieldWrapper) => {
        // Get the input field within the wrapper
        Utils.setValidationResponse = true;
        let wrappedField: HTMLInputElement | HTMLTextAreaElement | null;
           if (
             parsedFieldWrapper instanceof HTMLInputElement ||
             parsedFieldWrapper instanceof HTMLTextAreaElement
           ) {
             wrappedField = parsedFieldWrapper;
           } else {
             wrappedField = parsedFieldWrapper.querySelector(
               "input[data-veli-rules]:not([disabled]), textarea[data-veli-rules]:not([disabled])"
             );
           }
        if (wrappedField != null) {
          // Get the error field within the wrapper
          const errorField: HTMLElement | null =
            parsedFieldWrapper.querySelector(".veli-error");

          // Add an event listener to the input field to validate it as the user types
          wrappedField.addEventListener("input", () => {
            // Parse the data-veli-rules attribute of the input field
            const specifications = JSON.parse(
              wrappedField?.getAttribute("data-veli-rules")!
            );

            // Check if the specifications have required properties
            if (
              specifications.type === undefined ||
              specifications.name === undefined ||
              specifications.type === null ||
              specifications.name === null
            ) {
              // If the specifications are missing required properties, throw an error
              error.missingRequiredGdevProps(
                wrappedField,
                specifications.name || null,
                this.#language
              );
            } else {
              // If the specifications are valid, create a validation element
              this.#validationElements = [];
              this.#validationElements.push({
                specifications: specifications,
                field: wrappedField,
                errorField: errorField,
              });
            }

            // Start the validation using the created validation element
            this.#startValidation(this.#validationElements);
          });
        } else {
          // If the input field is missing the data-veli-rules attribute, throw an error
          error.missingGdevAttribute(this.#language, parsedFieldWrapper);
        }
      });
    }

    // Return the validation response
    return Utils.getValidationResponse;
  }

  /**
   * Starts the validation of the form based on the provided validation elements.
   * @param {Array<validationElementsTypes>} vE - The validation elements to start the validation with.
   * @returns {void} - The response of the validation is directly sanitized and shown to the user based on the developer's specification.
   */
  #startValidation(vE: Array<validationElementsTypes>): void {
    vE.forEach((element) => {
      let proceed = true;
      try {
        const required = JSON.parse(
          Utils.propertyValueSplitter(element.specifications.required || "true")
            .value
        );
        if (
          element.specifications.required &&
          required &&
          Utils.trim(element.field.value).length === 0
        ) {
          proceed = false;
          Utils.handleError(
            element.field,
            element.errorField,
            Utils.generateError(element.specifications.required || "@@", () =>
              this.#language === "fr"
                ? "Ce champ est obligatoire"
                : "This field is required"
            )
          );
        } else if (
          element.specifications.required &&
          !required &&
          Utils.trim(element.field.value).length === 0
        ) {
          proceed = false;
          Utils.handleSuccess(element.field, element.errorField);
        }
      } catch (error) {}
      if (proceed) {
        // Switch through the type of the field and call the corresponding validation method
        switch (element.specifications.type) {
          case "text":
            // Validate the text field
            TextField.validate(element, this.#language);
            break;
          case "password":
            // Validate the password field
            PasswordField.validate(element, this.#allFields);
            break;
          case "email":
            // Validate the email field
            this.#EmailField.validate(element);
            break;
          case "tel":
            // Validate the phone number field
            this.#PhoneNumber.validate(element);
            break;
          case "url":
            // TODO: Implement the URL field validation
            break;
          case "number":
            // Validate the number field
            this.#NumberField.validate(element);
            break;
          case "date":
            // TODO: Implement the date field validation
            break;
          case "checkbox":
            this.#CheckboxField.validate(element, this.#allFields);
            break;
        }
      }
    });
  }
}

// Backward compatibility alias
export const FormValidator = Veli;
export {Watcher, validate, Scanner};
