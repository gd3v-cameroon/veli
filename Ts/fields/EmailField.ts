/*******
properties[name, type, provider]
*/

import {Utils} from "../utils";
import * as uer from "../errorHandler/user/errors";
import * as der from "../errorHandler/dev/errors";
import {validationElementsTypes} from "Ts/globalTypes";
interface provider {
  name: string;
  domainName: Array<string>;
}
export class EmailField extends Utils {
  #providers: Array<provider> = [
    {name: "gmail", domainName: ["gmail.com", "googlemail.com"]},
    {
      name: "outlook",
      domainName: ["outlook.com", "hotmail.com", "live.com", "msn.com"],
    },
    {
      name: "yahoo",
      domainName: ["yahoo.com", "ymail.com", "rocketmail.com", "yahoo-inc.com"],
    },
    {name: "any", domainName: [""]},
  ];

  validate(element: validationElementsTypes): void {
    const {
      specifications: developerSpecifications,
      field: inputField,
      errorField,
    } = element;
    try {
      Object.keys(developerSpecifications).forEach((key) => {
        if (key === "provider") {
          const value = developerSpecifications.provider.split("@@")[0];
          if (value === "any") {
            if (this.#anyValidate(inputField.value)) {
              Utils.handleSuccess(inputField, errorField);
            } else {
              let errorMessage = Utils.generateError(
                developerSpecifications.provider,
                () => uer.invalidEmailAddress(Utils.lang, "")
              );
              Utils.handleError(inputField, errorField, errorMessage);
            }
          } else if (value === "gmail") {
            if (this.#gmailValidate(inputField.value)) {
              Utils.handleSuccess(inputField, errorField);
            } else {
              let errorMessage = Utils.generateError(
                developerSpecifications.provider,
                () => uer.invalidEmailAddress(Utils.lang, "gmail")
              );
              Utils.handleError(inputField, errorField, errorMessage);
            }
          } else if (value === "outlook") {
            if (this.#outlookValidate(inputField.value)) {
              Utils.handleSuccess(inputField, errorField);
            } else {
              let errorMessage = Utils.generateError(
                developerSpecifications.provider,
                () => uer.invalidEmailAddress(Utils.lang, "outlook")
              );
              Utils.handleError(inputField, errorField, errorMessage);
            }
          } else if (value === "yahoo") {
            if (this.#yahooValidate(inputField.value)) {
              Utils.handleSuccess(inputField, errorField);
            } else {
              let errorMessage = Utils.generateError(
                developerSpecifications.provider,
                () => uer.invalidEmailAddress(Utils.lang, "yahoo")
              );
              Utils.handleError(inputField, errorField, errorMessage);
            }
          }
        }
      });
    } catch (error) {}
  }
  #anyValidate(email: string): boolean {
    let regex = new RegExp(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    );
    if (regex.test(email)) {
      return true;
    }
    return false;
  }

  #gmailValidate(email: string): boolean {
    if (this.#anyValidate(email)) {
      return this.#providers[0].domainName.includes(email.split("@")[1]);
    } else {
      return false;
    }
  }

  #outlookValidate(email: string): boolean {
    if (this.#anyValidate(email)) {
      return this.#providers[1].domainName.includes(email.split("@")[1]);
    } else {
      return false;
    }
  }

  #yahooValidate(email: string): boolean {
    if (this.#anyValidate(email)) {
      return this.#providers[2].domainName.includes(email.split("@")[1]);
    } else {
      return false;
    }
  }
}
