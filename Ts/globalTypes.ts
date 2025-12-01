interface finalValidationResponseType {
  status: boolean;
  values: {[name: string]: string | Array<string>};
}

interface validationElementsTypes {
  specifications: Record<string, string>;
  field: HTMLInputElement | HTMLTextAreaElement;
  errorField: HTMLElement | null;
}

interface propertyValueType {
  value: string;
  errorMessage?: string;
}

interface CharCountType {
  num: number;
  lowercaseAlphabet: number;
  uppercaseAlphabet: number;
  specialChar: number;
}

interface ValidationErrorType {
  name: string;
  reason: string;
}

interface ValidationResultType {
  status: boolean;
  errors: ValidationErrorType[];
}

// Configuration type for VeliConfig
interface VeliColorConfig {
  error?: string;
  success?: string;
  warning?: string;
  info?: string;
}

interface VeliConfigType {
  colors?: VeliColorConfig;
}

export {
  finalValidationResponseType,
  validationElementsTypes,
  propertyValueType,
  CharCountType,
  ValidationErrorType,
  ValidationResultType,
  VeliColorConfig,
  VeliConfigType,
};
