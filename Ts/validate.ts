import {TextField} from "./fields/TextField";
import {PasswordField} from "./fields/PasswordField";
import {EmailField} from "./fields/EmailField";
import {NumberField} from "./fields/NumberField";
import {PhoneNumber} from "./fields/PhoneNumber";
import {CheckBox} from "./fields/CheckBox";
import {Utils} from "./utils";
import {
  FieldType,
  ScannerConfig,
  ScannerType,
  ScanResult,
} from "./scannerTypes";
import {Scanner} from "./Scanner";

interface ValidationItem {
  value: string;
  rules: Record<string, string>;
  constext?: FieldType;
}

interface ValidationError {
  name: string;
  reason: string;
}

interface ValidationResult {
  status: boolean;
  errors: ValidationError[];
  scannerRes?: ScanResult | null;
}

/**
 * @function validate
 * @description Validates an array of values against their respective validation rules
 * @param {ValidationItem[]} items - Array of objects containing value and rules
 * @param {string} lang - Language for error messages ('en' or 'fr')
 * @returns {ValidationResult} Object containing validation status and errors
 *
 * @example
 * const result = validate([
 *   {
 *     value: 'john doe',
 *     rules: { name: 'fullname', type: 'text', minWord: '2@@please enter first and second name.' }
 *   },
 *   {
 *     value: 'password123',
 *     rules: { name: 'password', type: 'password', minLen: '8@@password must be at least 8 characters long.' }
 *   }
 * ], 'en');
 */
export function validate(
  items: ValidationItem[],
  config: {
    lang?: "en" | "fr";
    scanner?: {
      scanners: ScannerType;
      config?: ScannerConfig | null;
    } | null;
  }
): ValidationResult {
  const errors: ValidationError[] = [];
  const {lang = "en", scanner} = config;
  Utils.lang = lang;
  let scannerRes: ScanResult | null = null;

  if (scanner) {
    const s = new Scanner(scanner.config ? scanner.config : {});
    const fields = items.map((item) => {
      return {
        name: item.rules.name,
        value: item.value,
        type: item.constext || "text",
      };
    });

    //start scanning

    scannerRes = s.scan(fields, "xss");
  }

  // Validate that type in rules matches the field type
  items.forEach((item, index) => {
    // Create a mock HTMLInputElement for validation
    const mockField = document.createElement("input") as any;
    mockField.value = item.value;
    mockField.type = item.rules.type || "text";

    const mockErrorField = document.createElement("span");

    const validationElement = {
      specifications: item.rules,
      field: mockField,
      errorField: mockErrorField,
    };

    try {
      switch (item.rules.type) {
        case "text":
          validateTextField(validationElement, errors, lang);
          break;
        case "password":
          validatePasswordField(validationElement, errors, lang);
          break;
        case "email":
          validateEmailField(validationElement, errors, lang);
          break;
        case "tel":
          validatePhoneField(validationElement, errors, lang);
          break;
        case "number":
          validateNumberField(validationElement, errors, lang);
          break;
        case "checkbox":
          validateCheckboxField(validationElement, errors, lang);
          break;
        default:
          errors.push({
            name: item.rules.name || `field_${index}`,
            reason: `Unknown field type: ${item.rules.type}`,
          });
      }
    } catch (error: any) {
      errors.push({
        name: item.rules.name || `field_${index}`,
        reason: error.message || "Validation failed",
      });
    }
  });

  return {
    status: errors.length === 0,
    errors: errors,
    scannerRes: scannerRes,
  };
}

function validateTextField(
  element: any,
  errors: ValidationError[],
  lang: string
): void {
  const {field, specifications} = element;
  const fieldName = specifications.name;

  // Check required
  if (specifications.required) {
    const required = JSON.parse(
      Utils.propertyValueSplitter(specifications.required).value
    );
    if (required && Utils.trim(field.value).length === 0) {
      errors.push({
        name: fieldName,
        reason:
          lang === "fr" ? "Ce champ est obligatoire" : "This field is required",
      });
      return;
    }
  }

  // Check minChar
  if (specifications.minChar) {
    const parsed = Utils.propertyValueSplitter(specifications.minChar);
    const minLen = parseInt(parsed.value);
    if (!Utils.isInRangeMin(field.value, minLen)) {
      errors.push({
        name: fieldName,
        reason: parsed.errorMessage || `Minimum ${minLen} characters required`,
      });
    }
  }

  // Check maxChar
  if (specifications.maxChar) {
    const parsed = Utils.propertyValueSplitter(specifications.maxChar);
    const maxLen = parseInt(parsed.value);
    if (!Utils.isInRangeMax(field.value, maxLen)) {
      errors.push({
        name: fieldName,
        reason: parsed.errorMessage || `Maximum ${maxLen} characters allowed`,
      });
    }
  }

  // Check minWord
  if (specifications.minWord) {
    const parsed = Utils.propertyValueSplitter(specifications.minWord);
    const minWords = parseInt(parsed.value);
    if (!Utils.isInMinWordRange(field.value, minWords)) {
      errors.push({
        name: fieldName,
        reason: parsed.errorMessage || `Minimum ${minWords} words required`,
      });
    }
  }

  // Check maxWord
  if (specifications.maxWord) {
    const parsed = Utils.propertyValueSplitter(specifications.maxWord);
    const maxWords = parseInt(parsed.value);
    if (!Utils.isInMaxWordRange(field.value, maxWords)) {
      errors.push({
        name: fieldName,
        reason: parsed.errorMessage || `Maximum ${maxWords} words allowed`,
      });
    }
  }

  // Check case
  if (specifications.case) {
    const parsed = Utils.propertyValueSplitter(specifications.case);
    const caseValue = parsed.value;
    if (caseValue === "upper" && !Utils.isUppercase(field.value)) {
      errors.push({
        name: fieldName,
        reason: parsed.errorMessage || "Text must be uppercase",
      });
    } else if (caseValue === "lower" && !Utils.isLowercase(field.value)) {
      errors.push({
        name: fieldName,
        reason: parsed.errorMessage || "Text must be lowercase",
      });
    }
  }

  // Check specialChar
  if (specifications.specialChar) {
    const parsed = Utils.propertyValueSplitter(specifications.specialChar);
    const allowSpecialChar = JSON.parse(parsed.value);
    if (!allowSpecialChar) {
      const specialChar = Utils.specialCharScan(field.value);
      if (specialChar != null) {
        errors.push({
          name: fieldName,
          reason:
            parsed.errorMessage ||
            `Special character not allowed: ${specialChar}`,
        });
      }
    }
  }

  // Check pattern
  if (specifications.pattern) {
    const parsed = Utils.propertyValueSplitter(specifications.pattern);
    const patternValue = parsed.value;
    try {
      let regex: RegExp;
      if (patternValue.startsWith("/")) {
        const lastSlash = patternValue.lastIndexOf("/");
        const p = patternValue.substring(1, lastSlash);
        const flags = patternValue.substring(lastSlash + 1);
        regex = new RegExp(p, flags);
      } else {
        regex = new RegExp(patternValue);
      }
      if (field.value && !regex.test(field.value)) {
        errors.push({
          name: fieldName,
          reason: parsed.errorMessage || `Invalid format`,
        });
      }
    } catch (e) {
      // invalid regex - treat as syntax error; push error
      errors.push({
        name: fieldName,
        reason: parsed.errorMessage || `Invalid pattern`,
      });
    }
  }
}

function validatePasswordField(
  element: any,
  errors: ValidationError[],
  lang: string
): void {
  const {field, specifications} = element;
  const fieldName = specifications.name;

  // Check required
  if (specifications.required) {
    const required = JSON.parse(
      Utils.propertyValueSplitter(specifications.required).value
    );
    if (required && Utils.trim(field.value).length === 0) {
      errors.push({
        name: fieldName,
        reason:
          lang === "fr" ? "Ce champ est obligatoire" : "This field is required",
      });
      return;
    }
  }

  // Check minLen
  if (specifications.minLen) {
    const parsed = Utils.propertyValueSplitter(specifications.minLen);
    const minLen = parseInt(parsed.value);
    if (field.value.length < minLen) {
      errors.push({
        name: fieldName,
        reason:
          parsed.errorMessage ||
          `Password must be at least ${minLen} characters long`,
      });
    }
  }

  // Check minNumCount
  if (specifications.minNumCount) {
    const parsed = Utils.propertyValueSplitter(specifications.minNumCount);
    const minCount = parseInt(parsed.value);
    const charCount = Utils.countChars(field.value);
    if (charCount.num < minCount) {
      errors.push({
        name: fieldName,
        reason:
          parsed.errorMessage ||
          `Password must contain at least ${minCount} numbers`,
      });
    }
  }

  // Check minLowercaseAlphabetCount
  if (specifications.minLowercaseAlphabetCount) {
    const parsed = Utils.propertyValueSplitter(
      specifications.minLowercaseAlphabetCount
    );
    const minCount = parseInt(parsed.value);
    const charCount = Utils.countChars(field.value);
    if (charCount.lowercaseAlphabet < minCount) {
      errors.push({
        name: fieldName,
        reason:
          parsed.errorMessage ||
          `Password must contain at least ${minCount} lowercase letters`,
      });
    }
  }

  // Check minUppercaseAlphabetCount
  if (specifications.minUppercaseAlphabetCount) {
    const parsed = Utils.propertyValueSplitter(
      specifications.minUppercaseAlphabetCount
    );
    const minCount = parseInt(parsed.value);
    const charCount = Utils.countChars(field.value);
    if (charCount.uppercaseAlphabet < minCount) {
      errors.push({
        name: fieldName,
        reason:
          parsed.errorMessage ||
          `Password must contain at least ${minCount} uppercase letters`,
      });
    }
  }

  // Check minSpecialCharCount
  if (specifications.minSpecialCharCount) {
    const parsed = Utils.propertyValueSplitter(
      specifications.minSpecialCharCount
    );
    const minCount = parseInt(parsed.value);
    const charCount = Utils.countChars(field.value);
    if (charCount.specialChar < minCount) {
      errors.push({
        name: fieldName,
        reason:
          parsed.errorMessage ||
          `Password must contain at least ${minCount} special characters`,
      });
    }
  }

  // Check pattern
  if (specifications.pattern) {
    const parsed = Utils.propertyValueSplitter(specifications.pattern);
    const patternValue = parsed.value;
    try {
      let regex: RegExp;
      if (patternValue.startsWith("/")) {
        const lastSlash = patternValue.lastIndexOf("/");
        const p = patternValue.substring(1, lastSlash);
        const flags = patternValue.substring(lastSlash + 1);
        regex = new RegExp(p, flags);
      } else {
        regex = new RegExp(patternValue);
      }
      if (field.value && !regex.test(field.value)) {
        errors.push({
          name: fieldName,
          reason: parsed.errorMessage || `Invalid format`,
        });
      }
    } catch (e) {
      errors.push({
        name: fieldName,
        reason: parsed.errorMessage || `Invalid pattern`,
      });
    }
  }
}

function validateEmailField(
  element: any,
  errors: ValidationError[],
  lang: string
): void {
  const {field, specifications} = element;
  const fieldName = specifications.name;

  // Check required
  if (specifications.required) {
    const required = JSON.parse(
      Utils.propertyValueSplitter(specifications.required).value
    );
    if (required && Utils.trim(field.value).length === 0) {
      errors.push({
        name: fieldName,
        reason:
          lang === "fr" ? "Ce champ est obligatoire" : "This field is required",
      });
      return;
    }
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (field.value && !emailRegex.test(field.value)) {
    errors.push({
      name: fieldName,
      reason: "Invalid email format",
    });
  }

  // Check provider
  if (specifications.provider && field.value) {
    const provider = Utils.propertyValueSplitter(specifications.provider).value;
    if (provider !== "any") {
      const emailDomain = field.value.split("@")[1]?.toLowerCase() || "";
      const providerDomains: Record<string, string[]> = {
        gmail: ["gmail.com"],
        outlook: ["outlook.com", "hotmail.com"],
        yahoo: ["yahoo.com"],
      };

      if (
        providerDomains[provider] &&
        !providerDomains[provider].includes(emailDomain)
      ) {
        errors.push({
          name: fieldName,
          reason: `Email must be from ${provider}`,
        });
      }
    }
  }

  // Check pattern
  if (specifications.pattern && field.value) {
    const parsed = Utils.propertyValueSplitter(specifications.pattern);
    const patternValue = parsed.value;
    try {
      let regex: RegExp;
      if (patternValue.startsWith("/")) {
        const lastSlash = patternValue.lastIndexOf("/");
        const p = patternValue.substring(1, lastSlash);
        const flags = patternValue.substring(lastSlash + 1);
        regex = new RegExp(p, flags);
      } else {
        regex = new RegExp(patternValue);
      }
      if (!regex.test(field.value)) {
        errors.push({
          name: fieldName,
          reason: parsed.errorMessage || `Invalid format`,
        });
      }
    } catch (e) {
      errors.push({
        name: fieldName,
        reason: parsed.errorMessage || `Invalid pattern`,
      });
    }
  }
}

function validatePhoneField(
  element: any,
  errors: ValidationError[],
  lang: string
): void {
  const {field, specifications} = element;
  const fieldName = specifications.name;

  // Check required
  if (specifications.required) {
    const required = JSON.parse(
      Utils.propertyValueSplitter(specifications.required).value
    );
    if (required && Utils.trim(field.value).length === 0) {
      errors.push({
        name: fieldName,
        reason:
          lang === "fr" ? "Ce champ est obligatoire" : "This field is required",
      });
      return;
    }
  }

  // Basic phone validation
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (field.value && !phoneRegex.test(field.value)) {
    errors.push({
      name: fieldName,
      reason: "Invalid phone format",
    });
  }

  // Check pattern
  if (specifications.pattern && field.value) {
    const parsed = Utils.propertyValueSplitter(specifications.pattern);
    const patternValue = parsed.value;
    try {
      let regex: RegExp;
      if (patternValue.startsWith("/")) {
        const lastSlash = patternValue.lastIndexOf("/");
        const p = patternValue.substring(1, lastSlash);
        const flags = patternValue.substring(lastSlash + 1);
        regex = new RegExp(p, flags);
      } else {
        regex = new RegExp(patternValue);
      }
      if (!regex.test(field.value)) {
        errors.push({
          name: fieldName,
          reason: parsed.errorMessage || `Invalid format`,
        });
      }
    } catch (e) {
      errors.push({
        name: fieldName,
        reason: parsed.errorMessage || `Invalid pattern`,
      });
    }
  }
}

function validateNumberField(
  element: any,
  errors: ValidationError[],
  lang: string
): void {
  const {field, specifications} = element;
  const fieldName = specifications.name;

  // Check required
  if (specifications.required) {
    const required = JSON.parse(
      Utils.propertyValueSplitter(specifications.required).value
    );
    if (required && Utils.trim(field.value).length === 0) {
      errors.push({
        name: fieldName,
        reason:
          lang === "fr" ? "Ce champ est obligatoire" : "This field is required",
      });
      return;
    }
  }

  const num = parseFloat(field.value);

  // Check if it's a valid number
  if (isNaN(num)) {
    errors.push({
      name: fieldName,
      reason: "Must be a valid number",
    });
    return;
  }

  // Check min
  if (specifications.min) {
    const parsed = Utils.propertyValueSplitter(specifications.min);
    const minVal = parseFloat(parsed.value);
    if (num < minVal) {
      errors.push({
        name: fieldName,
        reason: parsed.errorMessage || `Must be at least ${minVal}`,
      });
    }
  }

  // Check max
  if (specifications.max) {
    const parsed = Utils.propertyValueSplitter(specifications.max);
    const maxVal = parseFloat(parsed.value);
    if (num > maxVal) {
      errors.push({
        name: fieldName,
        reason: parsed.errorMessage || `Must be at most ${maxVal}`,
      });
    }
  }

  // Check range
  if (specifications.range) {
    const parsed = Utils.propertyValueSplitter(specifications.range);
    const [min, max] = parsed.value.split(",").map((v) => parseFloat(v));
    if (num < min || num > max) {
      errors.push({
        name: fieldName,
        reason: parsed.errorMessage || `Must be between ${min} and ${max}`,
      });
    }
  }

  // Check pattern
  if (specifications.pattern && field.value) {
    const parsed = Utils.propertyValueSplitter(specifications.pattern);
    const patternValue = parsed.value;
    try {
      let regex: RegExp;
      if (patternValue.startsWith("/")) {
        const lastSlash = patternValue.lastIndexOf("/");
        const p = patternValue.substring(1, lastSlash);
        const flags = patternValue.substring(lastSlash + 1);
        regex = new RegExp(p, flags);
      } else {
        regex = new RegExp(patternValue);
      }
      if (!regex.test(field.value)) {
        errors.push({
          name: fieldName,
          reason: parsed.errorMessage || `Invalid format`,
        });
      }
    } catch (e) {
      errors.push({
        name: fieldName,
        reason: parsed.errorMessage || `Invalid pattern`,
      });
    }
  }
}

function validateCheckboxField(
  element: any,
  errors: ValidationError[],
  lang: string
): void {
  const {field, specifications} = element;
  const fieldName = specifications.name;

  // Check required
  if (specifications.required) {
    const required = JSON.parse(
      Utils.propertyValueSplitter(specifications.required).value
    );
    if (required && !(field as HTMLInputElement).checked) {
      errors.push({
        name: fieldName,
        reason:
          lang === "fr" ? "Ce champ est obligatoire" : "This field is required",
      });
    }
  }
}
