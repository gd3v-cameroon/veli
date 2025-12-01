import Countries from "../Data/tel_supported_countries";

import {Utils} from "../utils";
import * as der from "../errorHandler/dev/errors";
import * as telDer from "../errorHandler/dev/tel";
import * as uer from "../errorHandler/user/tel";
import {validationElementsTypes} from "Ts/globalTypes";

interface supportedCountry {
  name: string;
  regex: RegExp;
}

export class PhoneNumber extends Utils {
  /**
   * Validates the phone number input field based on the developer specifications.
   * @param input - The input field containing the phone number.
   * @param developerSpecifications - The developer specifications for the phone number field.
   * @param errorField - The error field to display the error message.
   */
  validate(element: validationElementsTypes): void {
    const { specifications: developerSpecifications, field:input, errorField} = element;
    try {
      // Iterate over the developer specifications
      Object.entries(developerSpecifications).forEach(([key, rawValue]) => {
        const {value} = Utils.propertyValueSplitter(Utils.trim(rawValue));
        // Check if the key is a valid property
        switch (key) {
          case "country":
            // Check if the country property is an array
            const countries = value.split(",");
            let isValidTel: boolean = false;

            // Iterate over each country in the array
            countries.forEach((country: string) => {
              // Find the country rule based on the name
              const countryRule = Countries.find(
                (rule: supportedCountry) => rule.name === country.toLowerCase()
              );

              if (countryRule) {
                // Check if the phone number matches the country rule regex
                if (countryRule.regex.test(Utils.trim(input.value))) {
                  isValidTel = true;
                }
              }
            });

            // Handle the success or error based on the validation result
            isValidTel
              ? Utils.handleSuccess(input, errorField)
              : Utils.handleError(
                  input,
                  errorField,
                  Utils.generateError(rawValue, () =>
                    uer.invalidPhoneNumber(Utils.lang, countries)
                  )
                );

            break;
        }
      });
    } catch (error) {
      
    }
  }
}
