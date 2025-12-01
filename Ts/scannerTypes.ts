// ==================== Types & Interfaces ====================

export type Severity = "HIGH" | "MEDIUM" | "LOW";

export type ScannerType =
  | "sqlInjection"
  | "noSqlInjection"
  | "xss"
  | "pathTraversal"
  | "tokenLeakage";

export type FieldType =
  | "text"
  | "email"
  | "number"
  | "password"
  | "tel"
  | "html"
  | "textarea"
  | string;
export interface Pattern {
  pattern: RegExp;
  type: string;
  severity: Severity;
}

export interface ScannerConfig {
  strictMode?: boolean;
  stopOnFirstThreat?: boolean;
  includeValueInResponse?: boolean;
  customPatterns?: Partial<Record<ScannerType, Pattern[]>>;
}

export interface FieldInput {
  name: string;
  value: string;
  type?: FieldType;
  allowedTags?: string[];
}

export interface Threat {
  type: string;
  severity: Severity;
  pattern: string;
  matched: string;
  position: number;
  recommendation: string;
}

export interface FieldResult {
  name: string;
  value?: string;
  securityScore: number;
  passed: boolean;
  threats: Threat[];
}

export interface ScanResult {
  securityScore: number;
  scanner: ScannerType | "all" | "multiple";
  passed: boolean;
  duration: number;
  result: FieldResult[];
}

export interface InternalScanResult {
  threats: Threat[];
  scanned: boolean;
}
