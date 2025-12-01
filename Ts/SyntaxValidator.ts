import SupportedCountries from "./Data/tel_supported_countries";
import * as chder from "./errorHandler/dev/checkbox";
import * as der from "./errorHandler/dev/errors";
import * as passder from "./errorHandler/dev/password";
import * as phoneder from "./errorHandler/dev/tel";
import {CheckBox} from "./fields/CheckBox";
import {Utils} from "./utils";

class SyntaxValidator {
  public isSyntaxClean: boolean = true;
  private supportedTypes: Array<string> = [
    "text",
    "password",
    "email",
    "tel",
    "number",
    "checkbox",
  ];

  /**
   * Map of HTML input types to supported veli field types
   */
  private inputTypeMap: Record<string, string[]> = {
    text: ["text"],
    password: ["password"],
    email: ["email"],
    tel: ["tel"],
    number: ["number"],
    checkbox: ["checkbox"],
    radio: ["checkbox"],
    textarea: ["text"],
  };

  constructor(
    specifications: Array<Record<string, string>>,
    fieldElements?: HTMLInputElement[] | HTMLTextAreaElement[]
  ) {
    try {
      specifications.forEach((specification) => {
        if (!this.supportedTypes.includes(specification.type)) {
          throw new Error(
            `${specification.type} is not a valid veli type property at ${specification.name}. Supported types are: text, password, email, tel, number, checkbox.`
          );
        }
        if (specification.required) {
          const v = Utils.propertyValueSplitter(specification.required).value;
          if (typeof JSON.parse(v) !== "boolean")
            throw new Error(
              der.invalidPropertyValue(
                "required",
                "boolean",
                specification.name,
                Utils.lang
              )
            );
        }
        switch (specification.type) {
          case "text":
            this.textField(specification);
            break;
          case "password":
            this.passwordField(specification, specifications);
            break;
          case "email":
            this.emailField(specification);
            break;
          case "tel":
            this.phone(specification);
            break;
          case "checkbox":
            this.checkbox(specification, specifications);
            break;
          case "number":
            this.number(specification);
            break;
        }
      });
    } catch (error) {
      this.isSyntaxClean = false;
      console.error(error);
    }
  }

  private textField(specification: Record<string, string>) {
    try {
      Object.entries(specification).forEach(([key, rawValue]) => {
        const value = Utils.propertyValueSplitter(rawValue).value;
        // Define properties that must be positive integers
        const integerProperties = ["minChar", "maxChar", "minWord", "maxWord"];
        if (integerProperties.includes(key)) {
          if (!Utils.isInteger(value) || parseInt(value) < 0) {
            throw new Error(
              der.invalidPropertyValue(
                specification.type,
                "positive integer",
                specification.name,
                Utils.lang
              )
            );
          }
          return;
        }

        // Check for valid case values
        if (key === "case" && !["upper", "lower"].includes(value)) {
          throw new Error(
            der.invalidPropertyValue(
              specification.type,
              "upper or lower",
              specification.name,
              Utils.lang
            )
          );
        }

        // Ensure specialChar is a boolean
        if (key === "specialChar" && !Utils.isBoolean(value)) {
          throw new Error(
            der.invalidPropertyValue(
              specification.type,
              "boolean",
              specification.name,
              Utils.lang
            )
          );
        }

        // Handle unknown properties
        if (
          ![
            "type",
            "name",
            "minChar",
            "maxChar",
            "minWord",
            "maxWord",
            "case",
            "specialChar",
            "required",
            "pattern",
          ].includes(key)
        ) {
          throw new Error(
            der.invalidGdevProperty(
              key,
              Utils.lang,
              specification.type,
              specification.name
            )
          );
        }
        // validate pattern if present
        if (key === "pattern") {
          const patternValue = Utils.propertyValueSplitter(rawValue).value;
          try {
            // allow /pattern/flags or raw pattern
            if (patternValue.startsWith("/")) {
              const lastSlash = patternValue.lastIndexOf("/");
              const pattern = patternValue.substring(1, lastSlash);
              const flags = patternValue.substring(lastSlash + 1);
              new RegExp(pattern, flags);
            } else {
              new RegExp(patternValue);
            }
          } catch (e) {
            throw new Error(
              der.invalidPropertyValue(
                "pattern",
                "valid regex",
                specification.name,
                Utils.lang
              )
            );
          }
        }
      });
    } catch (error) {
      this.isSyntaxClean = false;
      console.error(error);
    }
  }

  private emailField(specification: Record<string, string>) {
    const props: Array<string> = [
      "name",
      "type",
      "required",
      "provider",
      "pattern",
    ];
    try {
      Object.entries(specification).forEach(([key, rawValue]) => {
        const propValue = Utils.propertyValueSplitter(rawValue).value;
        if (
          key === "provider" &&
          !["gmail", "outlook", "yahoo", "any"].includes(propValue)
        ) {
          throw new Error(
            der.invalidPropertyValue(
              specification.type,
              "gmail, outlook, yahoo or any",
              specification.name,
              Utils.lang
            )
          );
        }

        if (!props.includes(key)) {
          throw new Error(
            der.invalidGdevProperty(
              key,
              Utils.lang,
              specification.type,
              specification.name
            )
          );
        }
        if (key === "pattern") {
          const patternValue = Utils.propertyValueSplitter(rawValue).value;
          try {
            if (patternValue.startsWith("/")) {
              const lastSlash = patternValue.lastIndexOf("/");
              const pattern = patternValue.substring(1, lastSlash);
              const flags = patternValue.substring(lastSlash + 1);
              new RegExp(pattern, flags);
            } else {
              new RegExp(patternValue);
            }
          } catch (e) {
            throw new Error(
              der.invalidPropertyValue(
                "pattern",
                "valid regex",
                specification.name,
                Utils.lang
              )
            );
          }
        }
      });
    } catch (error) {
      this.isSyntaxClean = false;
      console.error(error);
    }
  }

  private passwordField(
    specification: Record<string, string>,
    allSpecifications: Array<Record<string, string>>
  ) {
    const props: Array<string> = [
      "name",
      "type",
      "securityLevel",
      "maxCharRepeat",
      "sequentialPatternCount",
      "confirmWith",
      "required",
      "pattern",
      "minLen",
      "minNumCount",
      "minLowercaseAlphabetCount",
      "minUppercaseAlphabetCount",
      "minSpecialCharCount",
    ];
    try {
      Object.entries(specification).forEach(([key, rawValue]) => {
        const propValue = Utils.propertyValueSplitter(rawValue).value;
        if (
          key === "securityLevel" &&
          !["s1", "s2", "s3", "s4"].includes(propValue)
        ) {
          throw new Error(
            der.invalidPropertyValue(
              key,
              "s1, s2, s3 or s4",
              specification.name,
              Utils.lang
            )
          );
        }
        if (
          key === "maxCharRepeat" &&
          (!Utils.isInteger(propValue) || parseInt(propValue) < 1)
        ) {
          throw new Error(
            der.invalidPropertyValue(
              key,
              "Integer >= 1",
              specification.name,
              Utils.lang
            )
          );
        }

        if (
          key === "sequentialPatternCount" &&
          (!Utils.isInteger(propValue) || parseInt(propValue) < 2)
        ) {
          throw new Error(
            der.invalidPropertyValue(
              key,
              "Integer >= 2",
              specification.name,
              Utils.lang
            )
          );
        }
        if (
          key === "confirmWith" &&
          !allSpecifications.find((sp) => propValue === sp.name)
        ) {
          throw new Error(
            passder.missingField(Utils.lang, propValue, specification.name)
          );
        }
        if (
          key === "minLen" ||
          key === "minNumCount" ||
          key === "minLowercaseAlphabet" ||
          key === "minUppercaseAlphabet" ||
          key === "minSpecialCharCount"
        ) {
          // they all have to be positive integers greather than or equal to 0
          const value = Utils.propertyValueSplitter(rawValue).value;
          if (
            !Utils.isInteger(value) ||
            parseInt(value) < 0 ||
            isNaN(parseInt(value))
          ) {
            throw new Error(
              der.invalidPropertyValue(
                key,
                "'Positive Integer'",
                specification.name,
                Utils.lang
              )
            );
          }
        }
        if (!props.includes(key)) {
          throw new Error(
            der.invalidGdevProperty(
              key,
              Utils.lang,
              specification.type,
              specification.name
            )
          );
        }
        if (key === "pattern") {
          const patternValue = Utils.propertyValueSplitter(rawValue).value;
          try {
            if (patternValue.startsWith("/")) {
              const lastSlash = patternValue.lastIndexOf("/");
              const pattern = patternValue.substring(1, lastSlash);
              const flags = patternValue.substring(lastSlash + 1);
              new RegExp(pattern, flags);
            } else {
              new RegExp(patternValue);
            }
          } catch (e) {
            throw new Error(
              der.invalidPropertyValue(
                "pattern",
                "valid regex",
                specification.name,
                Utils.lang
              )
            );
          }
        }
      });
    } catch (error) {
      this.isSyntaxClean = false;
      console.error(error);
    }
  }

  private phone(specification: Record<string, string>) {
    try {
      const props: Array<string> = [
        "name",
        "type",
        "country",
        "required",
        "pattern",
      ];
      Object.entries(specification).forEach(([key, rawValue]) => {
        const propValue: string = Utils.propertyValueSplitter(rawValue)
          .value.trim()
          .toLowerCase();
        if (key === "country") {
          const parsedCountries: Array<string> = propValue.split(",");
          parsedCountries.forEach((country, i) => {
            if (
              !SupportedCountries.find(
                (supportedCountry) =>
                  supportedCountry.name.toLowerCase() === country
              )
            ) {
              throw new Error(
                phoneder.notSupported(Utils.lang, specification.name, country)
              );
            }
          });
        }

        if (!props.includes(key)) {
          throw new Error(
            der.invalidGdevProperty(
              key,
              Utils.lang,
              specification.type,
              specification.name
            )
          );
        }
        if (key === "pattern") {
          const patternValue = Utils.propertyValueSplitter(rawValue).value;
          try {
            if (patternValue.startsWith("/")) {
              const lastSlash = patternValue.lastIndexOf("/");
              const pattern = patternValue.substring(1, lastSlash);
              const flags = patternValue.substring(lastSlash + 1);
              new RegExp(pattern, flags);
            } else {
              new RegExp(patternValue);
            }
          } catch (e) {
            throw new Error(
              der.invalidPropertyValue(
                "pattern",
                "valid regex",
                specification.name,
                Utils.lang
              )
            );
          }
        }
      });
    } catch (error) {
      this.isSyntaxClean = false;
      console.error(error);
    }
  }

  private checkbox(
    specification: Record<string, string>,
    allSpecifications: Array<Record<string, string>>
  ) {
    const props: Array<string> = [
      "type",
      "name",
      "required",
      "maxSelect",
      "required",
      "checkedValue",
      "unCheckedValue",
      "linkTo",
      "groupName",
      "groupMembers",
      "defaultSelect",
    ];
    try {
      Object.entries(specification).forEach(([key, rawValue]) => {
        const propValue: string =
          Utils.propertyValueSplitter(rawValue).value.trim();
        if (
          key === "maxSelect" &&
          (!Utils.isInteger(propValue) || parseInt(propValue) < 0)
        ) {
          throw new Error(
            der.invalidPropertyValue(
              key,
              "integer >= 0",
              specification.name,
              Utils.lang
            )
          );
        }

        if (key === "groupMembers") {
          if (!specification.groupName) {
            throw new Error(
              der.missingProperty(Utils.lang, "groupName", specification.name)
            );
          }

          const members = propValue.split(",");
          members.forEach((member) => {
            if (!allSpecifications.find((sp) => sp.name === member)) {
              throw new Error(
                der.missingField(Utils.lang, member, specification.name)
              );
            }
          });
          allSpecifications.forEach((sp) => {
            if (members.includes(sp.name) && sp.type !== "checkbox") {
              chder.invalidGroupMemberType(
                sp.name,
                Utils.lang,
                specification.name
              );
            }
          });
        }

        if (key === "defaultSelect") {
          if (!specification.groupMembers) {
            throw new Error(
              der.missingProperty(
                Utils.lang,
                "groupMembers",
                specification.name
              )
            );
          }

          const defaultMembers = propValue.split(",");
          const groupMembers = Utils.propertyValueSplitter(
            specification.groupMembers
          )
            .value.trim()
            .split(",");

          if (specification.maxSelect) {
            if (defaultMembers.length > parseInt(specification.maxSelect)) {
              throw new Error(
                chder.invalidDefaultSelect_maxSelect_propUsage(
                  Utils.lang,
                  specification.name
                )
              );
            }
          }
          defaultMembers.forEach((dm) => {
            if (!groupMembers.includes(dm)) {
              throw new Error(
                der.missingField(Utils.lang, dm, specification.name)
              );
            }
          });
        }

        if (key === "linkTo") {
          const value = Utils.propertyValueSplitter(rawValue).value.trim();
          const fieldName = value.split(",")[0];
          const relationship = value.split(",")[1];
          if (!fieldName || !relationship) {
            throw new Error(
              der.invalidPropertyValue(
                key,
                "fildName,relationship",
                specification.name,
                Utils.name
              )
            );
          }
          //check if field name is exits
          if (
            !allSpecifications.find(
              (specification) => specification.name === fieldName
            )
          ) {
            throw new Error(
              der.missingField(Utils.name, fieldName, specification.name)
            );
          }

          //check if relationship is valid or not
          if (
            !["enableToggle", "clear", "reset", "passwordShowToggle"].includes(
              relationship
            )
          ) {
            throw new Error(
              chder.invalidRelationshipType(
                Utils.lang,
                relationship,
                specification.name
              )
            );
          }
        }
        // checkbox must declare checkedValue and unCheckedValue
        if (
          !("checkedValue" in specification) ||
          Utils.trim(specification.checkedValue).length === 0
        ) {
          throw new Error(
            der.missingProperty(Utils.lang, "checkedValue", specification.name)
          );
        }
        if (
          !("unCheckedValue" in specification) ||
          Utils.trim(specification.unCheckedValue).length === 0
        ) {
          throw new Error(
            der.missingProperty(
              Utils.lang,
              "unCheckedValue",
              specification.name
            )
          );
        }
        if (!props.includes(key)) {
          throw new Error(
            der.invalidGdevProperty(
              key,
              Utils.lang,
              specification.type,
              specification.name
            )
          );
        }
      });
    } catch (error) {
      this.isSyntaxClean = false;
      console.error(error);
    }
  }

  private number(specification: Record<string, string>) {
    const props: Array<string> = [
      "name",
      "type",
      "required",
      "range",
      "numClass",
      "numType",
      "fancyNum",
      "factorOf",
      "min",
      "multipleOf",
      "max",
      "pattern",
    ];
    try {
      Object.entries(specification).forEach(([key, rawValue]) => {
        const {value} = Utils.propertyValueSplitter(Utils.trim(rawValue));
        if (key === "range") {
          const [min, max] = value.split(",");
          if (
            !min ||
            !max ||
            parseFloat(min) >= parseFloat(max) ||
            isNaN(parseFloat(min)) ||
            isNaN(parseFloat(max))
          ) {
            throw new Error(
              der.invalidPropertyValue(
                key,
                "'min,max'",
                specification.name,
                Utils.lang
              )
            );
          }
        }
        if (key === "numClass") {
          if (!["odd", "even", "prime"].includes(value)) {
            throw new Error(
              der.invalidPropertyValue(
                key,
                "'odd' or 'even 'or 'prime'",
                specification.name,
                Utils.lang
              )
            );
          }
        }
        if (key === "numType") {
          if (!["integer", "decimal", "real"].includes(value)) {
            throw new Error(
              der.invalidPropertyValue(
                key,
                "'integer' or 'decimal' or 'real'",
                specification.name,
                Utils.lang
              )
            );
          }
        }
        if (key === "fancyNum") {
          if (!["perfectsquare"].includes(value)) {
            throw new Error(
              der.invalidPropertyValue(
                key,
                "'perfectsquare'",
                specification.name,
                Utils.lang
              )
            );
          }
        }

        if (
          key === "factorOf" ||
          key === "multipleOf" ||
          key === "min" ||
          key === "max"
        ) {
          if (!Utils.isNumber(parseFloat(value))) {
            throw new Error(
              der.invalidPropertyValue(
                key,
                "Number",
                specification.name,
                Utils.lang
              )
            );
          }
        }
        if (!props.includes(key)) {
          throw new Error(
            der.invalidGdevProperty(
              key,
              Utils.lang,
              specification.type,
              specification.name
            )
          );
        }
        if (key === "pattern") {
          const patternValue = Utils.propertyValueSplitter(rawValue).value;
          try {
            if (patternValue.startsWith("/")) {
              const lastSlash = patternValue.lastIndexOf("/");
              const pattern = patternValue.substring(1, lastSlash);
              const flags = patternValue.substring(lastSlash + 1);
              new RegExp(pattern, flags);
            } else {
              new RegExp(patternValue);
            }
          } catch (e) {
            throw new Error(
              der.invalidPropertyValue(
                "pattern",
                "valid regex",
                specification.name,
                Utils.lang
              )
            );
          }
        }
      });
    } catch (error) {
      this.isSyntaxClean = false;
      console.error(error);
    }
  }
}

export default SyntaxValidator;
