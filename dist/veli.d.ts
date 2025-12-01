// --- Global Types ---
export interface finalValidationResponseType {
    status: boolean;
    values: {
        [name: string]: string | Array<string>;
    };
}
export interface validationElementsTypes {
    specifications: Record<string, string>;
    field: HTMLInputElement | HTMLTextAreaElement;
    errorField: HTMLElement | null;
}
export interface propertyValueType {
    value: string;
    errorMessage?: string;
}
export interface CharCountType {
    num: number;
    lowercaseAlphabet: number;
    uppercaseAlphabet: number;
    specialChar: number;
}
export interface ValidationErrorType {
    name: string;
    reason: string;
}
export interface ValidationResultType {
    status: boolean;
    errors: ValidationErrorType[];
}
export interface VeliColorConfig {
    error?: string;
    success?: string;
    warning?: string;
    info?: string;
}
export interface VeliConfigType {
    colors?: VeliColorConfig;
}

// --- Scanner Types ---
export type Severity = "HIGH" | "MEDIUM" | "LOW";
export type ScannerType = "sqlInjection" | "noSqlInjection" | "xss" | "pathTraversal" | "tokenLeakage";
export type FieldType = "text" | "email" | "number" | "password" | "tel" | "html" | "textarea" | string;
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

// --- Utils ---
export declare class Utils {
    #private;
    private static validationResponse;
    static finalValidationResponse: finalValidationResponseType;
    static lang: string;
    static trim(text: any): string;
    static get getValidationResponse(): boolean;
    static get getuserValidationRate(): number;
    static set setValidationResponse(response: boolean);
    static isInRangeMin(text: string, length: number): boolean;
    static isInRangeMax(text: string, length: number): boolean;
    static isInMinWordRange(phrase: string, length: number): boolean;
    static isInMaxWordRange(phrase: string, length: number): boolean;
    static isUppercase(text: string): boolean;
    static isLowercase(text: string): boolean;
    static specialCharScan(str: string): string | null;
    static handleSuccess(inputField: any, errorField: any): void;
    static handleError(inputField: any, errorField: any, errorMessage: string): void;
    static isBoolean(value: any): boolean;
    static generateError: (value: string, fallback: () => string) => string;
    static isArray(value: any): boolean;
    static isNumber(value: any): boolean;
    static isString(value: any): boolean;
    static isArrayOfStrings(value: any): boolean;
    static isArrayOfNumbers(value: any): boolean;
    static isInteger(value: any): boolean;
    static isArrayOfBooleans(value: any): boolean;
    static propertyValueSplitter(value: any): propertyValueType;
    static countChars(value: string): CharCountType;
}

// --- Watcher ---
/**
 * @class Watcher
 * @description Tracks form field changes and validation state
 * @example
 * const watcher = new Watcher(allFields, initialData);
 * watcher.isDirty(); // true if any field has changed
 * watcher.isValid(); // true if all fields are valid
 * watcher.getChangedFields(); // returns array of changed field names
 */
export declare class Watcher {
    private initialData;
    private currentData;
    private fields;
    private validationState;
    private _initialDataConfig?;
    constructor(fields: validationElementsTypes[], initialData?: Record<string, string>);
    /**
     * Initialize initialData and currentData based on config and DOM values
     */
    private initializeData;
    /**
     * Setup event listeners for all fields to track changes
     */
    private setupFieldListeners;
    /**
     * Update the current value of a field
     */
    private updateFieldValue;
    /**
     * Check if any field has been modified from its initial value
     */
    isDirty(): boolean;
    /**
     * Check if a specific field has been modified
     */
    isFieldDirty(fieldName: string): boolean;
    /**
     * Check if all fields are in valid state
     */
    isValid(): boolean;
    /**
     * Check if a specific field is valid
     */
    isFieldValid(fieldName: string): boolean;
    /**
     * Set validation state for a field
     */
    setFieldValid(fieldName: string, isValid: boolean): void;
    /**
     * Get all fields that have been modified
     */
    getChangedFields(): string[];
    /**
     * Get all current field values
     */
    getCurrentValues(): Record<string, string>;
    /**
     * Reset all fields to their initial values
     */
    reset(): void;
    /**
     * Set new initial values and reset current values
     */
    setInitialData(data: Record<string, string>): void;
    /**
     * Get validation summary
     */
    getValidationSummary(): {
        isValid: boolean;
        isDirty: boolean;
        changedFields: string[];
    };
    /**
     * Update fields and re-initialize listeners.
     * Useful for async initialization when the form appears later in the DOM.
     */
    updateFields(fields: validationElementsTypes[]): void;
    /**
     * Subscribe to events
     */
    on(eventName: string, cb: () => void): () => void;
    /**
     * Unsubscribe from events
     */
    off(eventName: string, cb: () => void): void;
    /**
     * Destroy the watcher instance
     */
    destroy(): void;
}

// --- Scanner ---
/**
 * Enhanced Security Scanner - Robust input normalization and threat detection
 *
 * A comprehensive security scanning class that protects against multiple attack vectors
 * by normalizing obfuscated input and detecting malicious patterns. The scanner provides
 * fine-grained control over threat detection with configurable strictness levels and
 * early termination options for performance optimization.
 *
 * ## Supported Threat Types
 * - **SQL Injection**: UNION SELECT, OR conditions, stacked queries, time-based attacks
 * - **NoSQL Injection**: MongoDB operators, function injection, array injection
 * - **XSS (Cross-Site Scripting)**: Script tags, event handlers, javascript: protocol, data URIs
 * - **Path Traversal**: Directory traversal, encoded traversal, absolute paths
 * - **Token Leakage**: JWT tokens, AWS keys, GitHub tokens, API keys, private keys, DB connections
 *
 * ## Normalization Strategy
 * The scanner applies a multi-layer normalization approach before pattern matching:
 * 1. Trim whitespace
 * 2. Remove zero-width Unicode characters and BOMs
 * 3. Percent-decode (URL encoding)
 * 4. Decode HTML entities (numeric and named)
 * 5. Decode JavaScript escape sequences (\uXXXX, \xXX)
 * 6. Remove null bytes
 * 7. Normalize whitespace within tags
 * 8. Collapse multiple whitespace sequences
 *
 * ## Usage Example
 * ```typescript
 * const scanner = new Scanner({
 *   strictMode: true,
 *   stopOnFirstThreat: false,
 *   includeValueInResponse: false
 * });
 *
 * const result = scanner.scanAll([
 *   { name: 'email', value: 'user@example.com', type: 'text' },
 *   { name: 'comment', value: '<script>alert(1)</script>', type: 'html', allowedTags: ['p', 'br'] }
 * ]);
 * ```
 *
 * ## Security Note
 * This file is self-contained with no external dependencies. All patterns are defined
 * internally and can be customized via the `customPatterns` config option for your
 * specific security requirements.
 *
 * @class Scanner
 * @public
 */
export declare class Scanner {
    private config;
    private patterns;
    /**
     * Creates a new Scanner instance with optional configuration.
     *
     * @param {ScannerConfig} [options={}] - Configuration options for the scanner
     *
     * @param {boolean} [options.strictMode=false] - Enables strict scanning mode
     *   - When `false` (default): Medium severity threats are reported as-is
     *   - When `true`: Elevates MEDIUM severity threats to HIGH severity for stricter validation
     *   - **Use case**: Set to true for high-security contexts (admin panels, financial data)
     *   - **Impact on scanning**: More aggressive threat classification; reduces false negatives at cost of false positives
     *
     * @param {boolean} [options.stopOnFirstThreat=false] - Enables early termination on first threat
     *   - When `false` (default): Scans all fields and collects all threats
     *   - When `true`: Stops scanning after detecting the first threat
     *   - **Use case**: Set to true for performance-critical paths or quick validation checks
     *   - **Impact on scanning**: Significantly improves performance for inputs with multiple threats; reduces response time
     *   - **Trade-off**: Users won't see all issues at once; they'll need to fix and re-submit to see remaining threats
     *
     * @param {boolean} [options.includeValueInResponse=false] - Includes the scanned value in response
     *   - When `false` (default): Response contains only metadata about threats
     *   - When `true`: Response includes the original field value alongside threat information
     *   - **Use case**: Set to true for logging, debugging, or audit trails
     *   - **Impact on scanning**: Increases response payload size; useful for detailed incident analysis
     *   - **Security note**: Be cautious when enabling in production; sensitive data may be logged
     *
     * @param {Partial<Record<ScannerType, Pattern[]>>} [options.customPatterns={}] - Custom threat detection patterns
     *   - Allows extending or overriding built-in patterns for specific scanner types
     *   - Patterns follow the same structure as built-in patterns: `{ pattern: RegExp, type: string, severity: "HIGH"|"MEDIUM"|"LOW" }`
     *   - Supports all scanner types: "sqlInjection", "noSqlInjection", "xss", "pathTraversal", "tokenLeakage"
     *   - **Use case**: Add organization-specific threat patterns or domain-specific validation rules
     *   - **Impact on scanning**: Custom patterns are checked alongside built-in patterns
     *   - **Example**: Adding custom XSS patterns for your specific framework
     *
     * @example
     * // Minimal configuration (default safe settings)
     * const scanner = new Scanner();
     *
     * @example
     * // High-security configuration
     * const scanner = new Scanner({
     *   strictMode: true,
     *   stopOnFirstThreat: false,
     *   includeValueInResponse: false
     * });
     *
     * @example
     * // Performance-optimized configuration
     * const scanner = new Scanner({
     *   strictMode: false,
     *   stopOnFirstThreat: true,
     *   includeValueInResponse: false
     * });
     *
     * @example
     * // With custom patterns
     * const scanner = new Scanner({
     *   customPatterns: {
     *     xss: [
     *       {
     *         pattern: /myCustomThreat/gi,
     *         type: 'CUSTOM_THREAT',
     *         severity: 'HIGH'
     *       }
     *     ]
     *   }
     * });
     */
    constructor(options?: ScannerConfig);
    private removeInvisibleCharacters;
    private decodeNumericEntities;
    private percentDecode;
    private decodeJsEscapes;
    private normalizeInput;
    private containsHiddenChars;
    private initializePatterns;
    private scanField;
    private isAllowedHtml;
    private getRecommendation;
    private calculateSecurityScore;
    /**
     * Scan all fields with all scanner types (comprehensive security scan)
     *
     * Performs a complete security analysis of the provided fields, checking each field
     * against all available threat detection patterns: SQL Injection, NoSQL Injection, XSS,
     * Path Traversal, and Token Leakage. Results include a security score, individual threat
     * details, and recommendations for remediation.
     *
     * @param {FieldInput[]} fields - Array of fields to scan
     *   Each field should have a `name`, `value`, and optional `type` and `allowedTags`
     *   - `name` (string): Unique identifier for the field
     *   - `value` (string): The content to scan for threats
     *   - `type` (string, optional): Field context ('text', 'email', 'html', etc.)
     *   - `allowedTags` (string[], optional): Allowed HTML tags for 'html' type fields
     *
     * @returns {ScanResult} Comprehensive scan result object containing:
     *   - `securityScore` (number 0-1): Overall security score across all fields
     *   - `scanner` (string): "all" indicating all scanners were used
     *   - `passed` (boolean): True if no threats were detected
     *   - `duration` (number): Time taken to scan in milliseconds
     *   - `result` (FieldResult[]): Array of per-field scan results with threats and scores
     *
     * @throws {TypeError} If fields is not an array
     *
     * @example
     * const scanner = new Scanner({ strictMode: true });
     * const result = scanner.scanAll([
     *   { name: 'username', value: 'john_doe', type: 'text' },
     *   { name: 'bio', value: '<p>Hello world</p>', type: 'html', allowedTags: ['p', 'strong'] },
     *   { name: 'comment', value: '<!--<script>alert(1)</script>-->', type: 'text' }
     * ]);
     *
     * if (result.passed) {
     *   console.log('All fields are secure!');
     * } else {
     *   result.result.forEach(field => {
     *     if (field.threats.length > 0) {
     *       console.log(`${field.name} has ${field.threats.length} threats`);
     *       field.threats.forEach(threat => {
     *         console.log(`  - ${threat.type}: ${threat.recommendation}`);
     *       });
     *     }
     *   });
     * }
     *
     * @example
     * // Check security score for a field
     * const result = scanner.scanAll([
     *   { name: 'email', value: 'test@example.com' }
     * ]);
     * const emailField = result.result[0];
     * console.log(`Security Score: ${emailField.securityScore}`); // 1.0 = no threats
     */
    scanAll(fields: FieldInput[]): ScanResult;
    /**
     * Async version of scanAll for large datasets
     *
     * Provides a non-blocking scanning operation using Promise, allowing the main thread
     * to remain responsive when processing large arrays of fields. Internally uses setTimeout
     * to defer execution, making it suitable for UI-heavy applications.
     *
     * @param {FieldInput[]} fields - Array of fields to scan (same format as scanAll)
     *
     * @returns {Promise<ScanResult>} Promise that resolves to the complete scan result
     *
     * @example
     * // Use with async/await for cleaner code
     * const scanner = new Scanner();
     * try {
     *   const result = await scanner.scanAsync(largeFieldArray);
     *   console.log(`Scan completed in ${result.duration}ms`);
     * } catch (error) {
     *   console.error('Scan failed:', error);
     * }
     *
     * @example
     * // Use with .then() for compatibility
     * scanner.scanAsync(fields)
     *   .then(result => console.log('Scan complete:', result))
     *   .catch(error => console.error('Scan error:', error));
     */
    scanAsync(fields: FieldInput[]): Promise<ScanResult>;
    /**
     * Scan fields with a specific scanner type (targeted security scan)
     *
     * Performs targeted threat detection for a specific attack vector type. Useful when you
     * want to focus on particular vulnerabilities or when you need to optimize performance
     * by checking only relevant threat types for your use case.
     *
     * @param {FieldInput[]} fields - Array of fields to scan
     * @param {ScannerType} scannerType - The type of scanner to use:
     *   - `"sqlInjection"`: Detects SQL injection attempts (UNION SELECT, OR/AND conditions, comments, etc.)
     *   - `"noSqlInjection"`: Detects NoSQL injection attempts (MongoDB operators, function injection)
     *   - `"xss"`: Detects Cross-Site Scripting attempts (script tags, event handlers, protocols)
     *   - `"pathTraversal"`: Detects directory traversal attempts (../ sequences, absolute paths)
     *   - `"tokenLeakage"`: Detects sensitive credential leakage (JWT, API keys, AWS keys, etc.)
     *
     * @returns {ScanResult} Scan result object with same format as scanAll, but using only the specified scanner
     *
     * @throws {Error} If scannerType is not a valid scanner type
     *
     * @example
     * const scanner = new Scanner();
     *
     * // Check only for XSS threats
     * const result = scanner.scan(fields, 'xss');
     * console.log(`Found ${result.result[0].threats.length} XSS threats in first field`);
     *
     * @example
     * // Check only for SQL injection
     * const sqlResult = scanner.scan(
     *   [{ name: 'query', value: "'; DROP TABLE users; --" }],
     *   'sqlInjection'
     * );
     * if (!sqlResult.passed) {
     *   console.log('SQL injection detected!');
     *   sqlResult.result[0].threats.forEach(threat => {
     *     console.log(`Type: ${threat.type}, Recommendation: ${threat.recommendation}`);
     *   });
     * }
     *
     * @example
     * // Performance optimization: scan only for token leakage
     * const tokenResult = scanner.scan(fields, 'tokenLeakage');
     * // Much faster than scanAll() for checking only credentials
     */
    scan(fields: FieldInput[], scannerType: ScannerType): ScanResult;
    /**
     * Scan fields with multiple specific scanner types (flexible multi-threat scan)
     *
     * Performs targeted threat detection across multiple specified attack vector types.
     * This method provides flexibility to check only the threats you care about, combining
     * the focused approach of `scan()` with the multi-type capability of `scanAll()`.
     *
     * **When to use:**
     * - Check for specific threats relevant to your business logic (e.g., only SQL and XSS)
     * - Optimize performance by excluding irrelevant threat categories
     * - Mix and match threat types based on context or field type
     * - Reduce false positives from unused scanner types
     *
     * @param {FieldInput[]} fields - Array of fields to scan
     * @param {ScannerType[]} scannerTypes - Array of scanner types to apply:
     *   - `"sqlInjection"` - Check for SQL injection
     *   - `"noSqlInjection"` - Check for NoSQL injection
     *   - `"xss"` - Check for XSS attacks
     *   - `"pathTraversal"` - Check for directory traversal
     *   - `"tokenLeakage"` - Check for exposed credentials
     *   Pass any combination, order doesn't matter. Empty array throws error.
     *
     * @returns {ScanResult} Comprehensive scan result with same structure as scanAll()
     *   - `securityScore` (number 0-1): Overall security score
     *   - `scanner` (string): "multiple" indicating multiple scanner types were used
     *   - `passed` (boolean): True only if no threats detected
     *   - `duration` (number): Time taken in milliseconds
     *   - `result` (FieldResult[]): Per-field results with threats and scores
     *
     * @throws {TypeError} If scannerTypes is not an array or is empty
     * @throws {Error} If any scannerType in the array is invalid
     *
     * @example
     * const scanner = new Scanner();
     *
     * // Check only for XSS and SQL injection (skip others)
     * const result = scanner.scanMultiple(fields, ['xss', 'sqlInjection']);
     * console.log(`Security Score: ${result.securityScore}`);
     *
     * @example
     * // Check for injection attacks only
     * const result = scanner.scanMultiple(fields, ['sqlInjection', 'noSqlInjection']);
     * if (!result.passed) {
     *   result.result.forEach(field => {
     *     if (field.threats.length > 0) {
     *       console.log(`${field.name}: ${field.threats[0].type}`);
     *     }
     *   });
     * }
     *
     * @example
     * // Context-aware scanning: different threats for different fields
     * const apiFields = [
     *   { name: 'query', value: userQuery, type: 'text' },
     *   { name: 'filepath', value: userPath, type: 'text' }
     * ];
     * // Only check for SQL and path traversal (XSS/tokens less relevant for APIs)
     * const result = scanner.scanMultiple(apiFields, ['sqlInjection', 'pathTraversal']);
     *
     * @example
     * // Performance-optimized: skip expensive scanners not needed
     * const htmlContent = userBio;
     * const result = scanner.scanMultiple(
     *   [{ name: 'bio', value: htmlContent, type: 'html' }],
     *   ['xss', 'tokenLeakage']  // Only check relevant threats
     * );
     */
    scanMultiple(fields: FieldInput[], scannerTypes: ScannerType[]): ScanResult;
}

// --- Validate ---
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
export declare function validate(items: ValidationItem[], config: {
    lang?: "en" | "fr";
    scanner?: {
        scanners: ScannerType;
        config?: ScannerConfig | null;
    } | null;
}): ValidationResult;

// --- Veli ---
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
 *
 *
*FRENCH
 * @class Veli -> Cette classe est utilisee pour valider les formulaires.
 * @param {HTMLFormElement} form - L'élément form à valider.
 * @param {string} lang - La langue pour afficher les messages d'erreur
 * @example
 * const form = document.querySelector('form');
 * const veli = new Veli(form, langue);
 * 
 * veli.validate();
 * @returns {void} - La réponse de la validation. est directement nettoyé et montré à l'utilisateur en fonction des spécifications des développeurs, toute erreur potentielle est renvoyée à la console de développement et l'exécution s'arrête.
 * @throws {Error} - Si le formulaire n'est pas une instance de HTMLFormElement.
 */
export declare class Veli extends Utils {
    #private;
    private isSyntaxClean;
    /**
     * Class constructor for FormValidator
     * @param {HTMLFormElement | null} form - The form element to validate.
     */
    constructor(form: HTMLFormElement | null, lang?: string);
    static setLang(lang: string): void;
    validate(): finalValidationResponseType;
    /**
     * Validates each field in the form individually as the user types.
     * @returns {boolean} The validation response.
     */
    validateEach(): boolean;
}
export declare const FormValidator: typeof Veli;

// --- Init ---
export function VeliConfig(config?: VeliConfigType): void;
export function buildWatcherFieldFromElement(el: any): {
    specifications: any;
    field: any;
    errorField: null;
} | null;
export function createWatcherFromElements(elements: any, initialData: any): Watcher;
export function bindDirtyToButton(watcher: any, button: any, options?: {}): () => void;
export function bindDirty(watcher: any, options?: {}): () => void;
/**
 * Creates a Watcher instance for a form or set of fields.
 *
 * @param {string|HTMLElement|HTMLFormElement|NodeList|Array} source - The form ID, form element, or list of fields to watch.
 * @param {Object.<string, string>} [initialData] - Initial values for the fields. Keys match field names.
 * @param {Object} [options] - Configuration options.
 * @param {string[]} [options.fieldNames] - Array of specific field names to watch. If omitted, watches all fields.
 * @param {number} [options.debounceMs=100] - Debounce time in milliseconds for event emission.
 * @returns {Watcher} The Watcher instance with added .on() and .off() methods for event handling.
 */
export function createWatch(source: string | HTMLElement | HTMLFormElement | NodeList | any[], initialData?: {
    [x: string]: string;
}, options?: {
    fieldNames?: string[] | undefined;
    debounceMs?: number | undefined;
}): Watcher;
