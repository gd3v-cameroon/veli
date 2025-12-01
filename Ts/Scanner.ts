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

//==================== import types =====================
import {
  FieldInput,
  FieldResult,
  InternalScanResult,
  Pattern,
  ScannerConfig,
  ScannerType,
  ScanResult,
  Severity,
  Threat,
} from "./scannerTypes";

// ==================== Scanner Class ====================

class Scanner {
  private config: Required<ScannerConfig>;
  private patterns: Record<ScannerType, Pattern[]>;

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
  constructor(options: ScannerConfig = {}) {
    this.config = {
      strictMode: options.strictMode ?? false,
      stopOnFirstThreat: options.stopOnFirstThreat ?? false,
      includeValueInResponse: options.includeValueInResponse ?? false,
      customPatterns: options.customPatterns ?? {},
    };

    this.patterns = this.initializePatterns();
  }

  // -------------------- Normalization Helpers --------------------

  /**
   * Remove invisible / zero-width Unicode characters, soft hyphens, BOMs, etc.
   *
   * This method eliminates zero-width and invisible Unicode characters that attackers
   * often use to obfuscate malicious code and bypass pattern matching.
   *
   * **Characters removed:**
   * - Soft hyphen (\u00AD)
   * - Arabic diacritics (\u0600-\u0605)
   * - Hebrew aleph lam (\u061C)
   * - Arabic end of ayah (\u06DD)
   * - Mongolian vowel separator (\u070F)
   * - Khmer vowel modifiers (\u17B4-\u17B5)
   * - General space separators (\u2000-\u200F)
   * - Line and paragraph separators (\u2028-\u202F)
   * - Format characters (\u205F-\u206F)
   * - Byte order mark - BOM (\uFEFF)
   *
   * @private
   * @param {string} value - The input string to process
   * @returns {string} String with invisible characters removed
   *
   * @example
   * // Before: "s\u200Bc\u200Dript" (s, zero-width space, c, zero-width joiner, r, i, p, t)
   * // After: "script"
   */
  private removeInvisibleCharacters(value: string): string {
    // list derived from common zero-width/formatting characters
    return value.replace(
      /[\u00AD\u0600-\u0605\u061C\u06DD\u070F\u17B4\u17B5\u2000-\u200F\u2028-\u202F\u205F\u2060-\u206F\uFEFF]/g,
      ""
    );
  }

  /**
   * Decode numeric HTML entities: decimal and hex
   *
   * Converts HTML-encoded characters back to their original form. Attackers often use
   * HTML entity encoding to bypass filters. This decoder handles:
   * - Decimal entities: &#60; (less-than), &#x3C; (hex form)
   * - Named entities: &lt; &gt; &amp; &quot; &apos;
   *
   * **Examples decoded:**
   * - &#60; → <
   * - &#x3C; → <
   * - &lt; → <
   * - &#x73;&#x63;&#x72;&#x69;&#x70;&#x74; → script
   *
   * @private
   * @param {string} value - The input string containing HTML entities
   * @returns {string} String with HTML entities decoded
   *
   * @example
   * // Input: "&#x3C;script&#x3E;"
   * // Output: "<script>"
   */
  private decodeNumericEntities(value: string): string {
    value = value.replace(/&#(\d+);?/g, (_m, num) => {
      try {
        return String.fromCharCode(parseInt(num, 10));
      } catch {
        return "";
      }
    });

    value = value.replace(/&#x([0-9a-fA-F]+);?/g, (_m, hex) => {
      try {
        return String.fromCharCode(parseInt(hex, 16));
      } catch {
        return "";
      }
    });

    // common named entities (extend as needed)
    value = value.replace(/&(lt|gt|amp|quot|apos);/gi, (m) => {
      switch (m.toLowerCase()) {
        case "&lt;":
          return "<";
        case "&gt;":
          return ">";
        case "&amp;":
          return "&";
        case "&quot;":
          return '"';
        case "&apos;":
          return "'";
        default:
          return m;
      }
    });

    return value;
  }

  /**
   * Percent-decode (URL encode) and minimal URI decoding - safe single pass
   *
   * Decodes URL-encoded characters. Many XSS and injection attacks are hidden using
   * URL encoding. This method safely decodes %XX sequences without throwing errors
   * on malformed input.
   *
   * **Examples decoded:**
   * - %3C → <
   * - %3E → >
   * - %73%63%72%69%70%74 → script
   * - %2F → /
   * - %5C → \
   *
   * @private
   * @param {string} value - The URL-encoded input string
   * @returns {string} String with percent-encoding decoded
   *
   * @example
   * // Input: "%3Cscript%3E"
   * // Output: "<script>"
   */
  private percentDecode(value: string): string {
    // Replace common percent-encodings without throwing on malformed sequences
    try {
      // decodeURIComponent will throw for malformed sequences; handle gracefully
      return decodeURIComponent(value.replace(/\+/g, " "));
    } catch {
      // best-effort decode numeric hex escapes like %3C, and leave others intact
      return value.replace(/%([0-9a-fA-F]{2})/g, (_m, hex) =>
        String.fromCharCode(parseInt(hex, 16))
      );
    }
  }

  /**
   * Decode JS Unicode escape sequences like \u0063 and \x63
   *
   * JavaScript provides multiple ways to encode characters, allowing attackers to hide
   * malicious code. This method decodes these escape sequences:
   * - \uXXXX format (4-digit hex, e.g., \u0073 = s)
   * - \u{XXXXX} format (braces, variable length)
   * - \xXX format (2-digit hex, e.g., \x73 = s)
   *
   * **Examples decoded:**
   * - \u0073 → s
   * - \x73 → s
   * - \u{73} → s
   *
   * @private
   * @param {string} value - The input string with JS escape sequences
   * @returns {string} String with JS escapes decoded
   *
   * @example
   * // Input: "\u0073\u0063\u0072\u0069\u0070\u0074"
   * // Output: "script"
   */
  private decodeJsEscapes(value: string): string {
    // \u0063 or \u{63} variants
    value = value.replace(/\\u\{([0-9a-fA-F]+)\}/g, (_m, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
    value = value.replace(/\\u([0-9a-fA-F]{4})/g, (_m, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
    // \x63 style
    value = value.replace(/\\x([0-9a-fA-F]{2})/g, (_m, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
    // unicode escaped numeric entities like &#x3C; already handled earlier
    return value;
  }

  /**
   * Normalize input by applying a sequence of decodes and removals to reduce obfuscation.
   *
   * This is the core normalization pipeline that defeats common obfuscation techniques.
   * The order of operations is critical - each step enables detection of the next layer.
   *
   * **Normalization Pipeline:**
   * 1. Trim - Remove leading/trailing whitespace
   * 2. Remove BOM and invisible Unicode characters - Defeats zero-width character tricks
   * 3. Percent-decode - Converts %XX to characters (defeats URL encoding)
   * 4. HTML entities - Converts &#XX; to characters (defeats HTML encoding)
   * 5. JS escapes - Converts \uXXXX to characters (defeats JS encoding)
   * 6. Null bytes - Removes \0, %00, \\0, &#0; variants
   * 7. Tag whitespace normalization - Converts "< s c r i p t >" to "<script>"
   * 8. Whitespace collapse - Converts multiple spaces to single space
   *
   * @private
   * @param {string} value - The input string to normalize
   * @returns {string} Normalized string with obfuscation removed
   *
   * @example
   * // Input with multiple obfuscation techniques:
   * // "%3C%73%63%72%69%70%74%3E%20%61%6C%65%72%74%28%31%29%20%3C%2F%73%63%72%69%70%74%3E"
   * // (URL-encoded <script> alert(1) </script>)
   * //
   * // After normalization:
   * // "<script> alert(1) </script>"
   *
   * @example
   * // Input with HTML entities:
   * // "&#60;script&#62;alert(1)&#60;/script&#62;"
   * //
   * // After normalization:
   * // "<script>alert(1)</script>"
   *
   * @example
   * // Input with JS escapes:
   * // "\\u0073\\u0063\\u0072\\u0069\\u0070\\u0074"
   * //
   * // After normalization:
   * // "script"
   *
   * @example
   * // Input with space-separated characters:
   * // "< s c r i p t >"
   * //
   * // After normalization:
   * // "<script>"
   */
  private normalizeInput(value: string): string {
    if (!value || typeof value !== "string") return value;

    // 1. Trim
    value = value.trim();

    // 2. Remove BOM and invisible characters
    value = this.removeInvisibleCharacters(value);

    // 3. Percent-decode (URL encoded attempts)
    value = this.percentDecode(value);

    // 4. Decode numeric HTML entities (&#x; and &#;), and named small set
    value = this.decodeNumericEntities(value);

    // 5. Decode JS-style escapes (\uXXXX, \xXX)
    value = this.decodeJsEscapes(value);

    // 6. Remove explicit null bytes and common encoded forms
    value = value.replace(/(\0|%00|\\0|&#0;)/g, "");

    // 7. Normalize whitespace inside tags to a single space to detect exploded tags
    //    e.g., < s c r i p t >  => <script>
    value = value.replace(/<\s*([^\s>]+)\s*/g, (_m, tag) => `<${tag}`);

    // 8. Collapse multiple internal whitespace sequences - helpful for obfuscation
    value = value.replace(/[\u0000-\u0020]{2,}/g, " ");

    return value;
  }

  /**
   * Check for presence of suspicious invisible characters that were removed.
   * If any were present they may indicate deliberate obfuscation.
   *
   * This method detects when an attacker has intentionally inserted zero-width or
   * invisible characters to bypass security filters. The presence of such characters
   * indicates a likely attack attempt and is reported as a HIDDEN_CHAR_OBFUSCATION threat.
   *
   * @private
   * @param {string} original - The original, unmodified input string
   * @param {string} normalized - The string after normalization
   * @returns {boolean} True if invisible characters were detected and removed
   *
   * @example
   * // Input: "s\u200Bc\u200Dript" (contains zero-width space and joiner)
   * // Returns: true (detects obfuscation attempt)
   *
   * @example
   * // Input: "script" (normal text)
   * // Returns: false (no obfuscation detected)
   */
  private containsHiddenChars(original: string, normalized: string): boolean {
    if (!original || !normalized) return false;
    // if normalization changed the string in a way that removed hidden characters
    return (
      original !== normalized &&
      /[\u00AD\u200B\u200C\u200D\u2060\uFEFF]/.test(original)
    );
  }

  // -------------------- Patterns --------------------

  /**
   * Initialize all threat detection patterns (enhanced XSS rules included)
   *
   * Sets up comprehensive regex patterns for detecting five major threat types:
   * - SQL Injection: UNION SELECT, OR/AND conditions, stacked queries, time-based attacks
   * - NoSQL Injection: MongoDB operators ($where, $ne), function injection
   * - XSS: Script tags, event handlers, javascript: protocol, data URIs, SVG attacks
   * - Path Traversal: Directory traversal (../), encoded variants, absolute paths
   * - Token Leakage: JWT, AWS keys, GitHub tokens, API keys, private keys, DB connections
   *
   * Each pattern includes a type identifier for detailed threat classification and
   * a severity level (HIGH, MEDIUM, LOW) for risk assessment.
   *
   * Custom patterns from config are merged with built-in patterns for each threat type,
   * allowing organization-specific threat detection without losing default coverage.
   *
   * @private
   * @returns {Record<ScannerType, Pattern[]>} Map of scanner types to their pattern arrays
   *
   * @example
   * // Results in a structure like:
   * // {
   * //   sqlInjection: [
   * //     { pattern: /UNION.*SELECT/gi, type: 'UNION_SELECT', severity: 'HIGH' },
   * //     ...
   * //   ],
   * //   xss: [
   * //     { pattern: /<script/gi, type: 'SCRIPT_TAG', severity: 'HIGH' },
   * //     ...
   * //   ],
   * //   ...
   * // }
   */
  private initializePatterns(): Record<ScannerType, Pattern[]> {
    // Helper regex pieces
    // matches 's c r i p t' or 'script' ignoring interleaved whitespace or escape sequences
    const explodedScript =
      /<\s*s\s*[^\S\r\n]*\s*c\s*[^\S\r\n]*\s*r\s*[^\S\r\n]*\s*i\s*[^\S\r\n]*\s*p\s*[^\S\r\n]*\s*t[^>]*>[\s\S]*?<\s*\/\s*s\s*c\s*r\s*i\s*p\s*t\s*>/gi;

    // a more permissive opening tag detector (mixed case / whitespace)
    const scriptOpen = /<\s*script\b[^>]*>/gi;

    // nested / broken constructions like <scr<script>ipt>
    const nestedScript = /s\s*c\s*r\s*<\s*script[^>]*>\s*i\s*p\s*t/gi;

    // javascript: with exploded characters
    const jsProtocol = /j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/gi;

    return {
      sqlInjection: [
        {
          pattern: /(\bUNION\b.*\bSELECT\b)/gi,
          type: "UNION_SELECT",
          severity: "HIGH",
        },
        {
          pattern: /(\bOR\b\s+['"]*\d+['"]*\s*=\s*['"]*\d+)/gi,
          type: "OR_CONDITION",
          severity: "HIGH",
        },
        {
          pattern: /(\bAND\b\s+['"]*\d+['"]*\s*=\s*['"]*\d+)/gi,
          type: "AND_CONDITION",
          severity: "MEDIUM",
        },
        {pattern: /(--|#|\/\*|\*\/)/g, type: "SQL_COMMENT", severity: "MEDIUM"},
        {
          pattern: /;\s*(DROP|DELETE|UPDATE|INSERT|ALTER|CREATE)\b/gi,
          type: "STACKED_QUERY",
          severity: "HIGH",
        },
        {
          pattern: /\b(SLEEP|BENCHMARK|WAITFOR\s+DELAY)\b/gi,
          type: "TIME_BASED",
          severity: "HIGH",
        },
        {pattern: /\\['"`]/g, type: "QUOTE_ESCAPE", severity: "MEDIUM"},
        {pattern: /0x[0-9a-f]+/gi, type: "HEX_ENCODING", severity: "LOW"},
        {
          pattern: /'\s*(OR|AND)\s+'?[a-z0-9]/gi,
          type: "KEYWORD_INJECTION",
          severity: "HIGH",
        },
        {
          pattern: /\b(information_schema|sysobjects|syscolumns)\b/gi,
          type: "SCHEMA_ACCESS",
          severity: "HIGH",
        },
        ...(this.config.customPatterns.sqlInjection || []),
      ],

      noSqlInjection: [
        {
          pattern: /\$where|\$ne|\$gt|\$lt|\$gte|\$lte|\$in|\$nin|\$regex/gi,
          type: "MONGO_OPERATOR",
          severity: "HIGH",
        },
        {
          pattern: /\{\s*['"]\$\w+['"]\s*:/gi,
          type: "OPERATOR_INJECTION",
          severity: "HIGH",
        },
        {
          pattern: /\bfunction\s*\(|\bthis\./gi,
          type: "JS_INJECTION",
          severity: "HIGH",
        },
        {
          pattern: /\[\s*\{\s*['"]\$/gi,
          type: "ARRAY_INJECTION",
          severity: "MEDIUM",
        },
        ...(this.config.customPatterns.noSqlInjection || []),
      ],

      xss: [
        // Highly permissive exploded <script> detection (handles spaces between letters)
        {pattern: explodedScript, type: "SCRIPT_TAG", severity: "HIGH"},

        // Standard script open tag (mixed case, optional attributes)
        {pattern: scriptOpen, type: "SCRIPT_TAG_OPEN", severity: "HIGH"},

        // Nested / broken script constructs
        {pattern: nestedScript, type: "NESTED_SCRIPT_TAG", severity: "HIGH"},

        // javascript: protocol (exploded)
        {pattern: jsProtocol, type: "JS_PROTOCOL", severity: "HIGH"},

        // Event handlers - covers quoted and unquoted assignment forms
        {
          pattern: /\bon\w+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi,
          type: "EVENT_HANDLER",
          severity: "HIGH",
        },

        // data URIs that embed HTML or script
        {
          pattern: /data\s*:\s*text\/html[^,]*,[\s\S]*?<\s*script/gi,
          type: "DATA_URI_SCRIPT",
          severity: "HIGH",
        },

        // Dangerous tags other than script (iframe/embed/object/style)
        {
          pattern: /<(iframe|embed|object|applet|meta|link|style)\b[^>]*>/gi,
          type: "DANGEROUS_TAG",
          severity: "MEDIUM",
        },

        // SVG inline scripts
        {
          pattern: /<svg[^>]*>[\s\S]*?<script/gi,
          type: "SVG_SCRIPT",
          severity: "HIGH",
        },

        // Encoded script attempts like %3Cscript%3E or &lt;script&gt;
        {
          pattern: /(%3C|&lt;)\s*script/gi,
          type: "ENCODED_TAG",
          severity: "MEDIUM",
        },

        // Inline JS usage
        {
          pattern:
            /\b(alert|confirm|prompt|eval|setTimeout|setInterval)\s*\(/gi,
          type: "INLINE_JS",
          severity: "MEDIUM",
        },

        // Attempt to use VBScript
        {
          pattern: /vbscript\s*:/gi,
          type: "VBSCRIPT_PROTOCOL",
          severity: "HIGH",
        },

        ...(this.config.customPatterns.xss || []),
      ],

      pathTraversal: [
        {pattern: /\.\.[\/\\]/g, type: "DIRECTORY_TRAVERSAL", severity: "HIGH"},
        {
          pattern: /(%2e%2e[\/\\]|\.\.%2f|\.\.%5c)/gi,
          type: "ENCODED_TRAVERSAL",
          severity: "HIGH",
        },
        {
          pattern: /(\.\.%c0%af|\.\.%c1%9c)/gi,
          type: "UNICODE_TRAVERSAL",
          severity: "HIGH",
        },
        {
          pattern: /(^\/etc\/|^\/var\/|^\/proc\/|^C:\\|^\/root\/)/gi,
          type: "ABSOLUTE_PATH",
          severity: "HIGH",
        },
        {pattern: /%00/g, type: "NULL_BYTE", severity: "MEDIUM"},
        {
          pattern: /[A-Z]:\\|\\\\[^\\]+\\/gi,
          type: "WINDOWS_PATH",
          severity: "MEDIUM",
        },
        ...(this.config.customPatterns.pathTraversal || []),
      ],

      tokenLeakage: [
        {
          pattern:
            /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g,
          type: "JWT_TOKEN",
          severity: "HIGH",
        },
        {
          pattern: /AKIA[0-9A-Z]{16}/g,
          type: "AWS_ACCESS_KEY",
          severity: "HIGH",
        },
        {
          pattern: /aws_secret_access_key\s*=\s*[A-Za-z0-9/+=]{40}/gi,
          type: "AWS_SECRET_KEY",
          severity: "HIGH",
        },
        {pattern: /ghp_[A-Za-z0-9]{36}/g, type: "GITHUB_PAT", severity: "HIGH"},
        {
          pattern: /gho_[A-Za-z0-9]{36}/g,
          type: "GITHUB_OAUTH",
          severity: "HIGH",
        },
        {
          pattern: /sk_live_[0-9a-zA-Z]{24,}/g,
          type: "STRIPE_SECRET",
          severity: "HIGH",
        },
        {
          pattern: /pk_live_[0-9a-zA-Z]{24,}/g,
          type: "STRIPE_PUBLIC",
          severity: "MEDIUM",
        },
        {
          pattern: /api[_-]?key[_-]?[=:]\s*['"]?[A-Za-z0-9_\-]{20,}['"]?/gi,
          type: "API_KEY",
          severity: "HIGH",
        },
        {
          pattern: /-----BEGIN (RSA |EC |DSA )?PRIVATE KEY-----/g,
          type: "PRIVATE_KEY",
          severity: "HIGH",
        },
        {
          pattern: /(mongodb|mysql|postgresql):\/\/[^\s]+/gi,
          type: "DB_CONNECTION",
          severity: "HIGH",
        },
        ...(this.config.customPatterns.tokenLeakage || []),
      ],
    };
  }

  // -------------------- Scanning Logic --------------------

  /**
   * Scan a single field for a specific threat type.
   * Adds pre-normalization and hidden-character checks.
   *
   * This is the core scanning method used internally by the public API. It performs
   * a complete analysis of a single field against patterns for a specific threat type,
   * including obfuscation detection and normalization.
   *
   * @private
   * @param {FieldInput} field - The field to scan
   * @param {ScannerType} scannerType - The type of threats to check for
   * @returns {InternalScanResult} Object containing threats array and scanned flag
   *
   * @example
   * // Returns:
   * // { threats: [...], scanned: true }
   */
  private scanField(
    field: FieldInput,
    scannerType: ScannerType
  ): InternalScanResult {
    const originalValue = field.value;
    let value = typeof originalValue === "string" ? originalValue : "";

    // Skip empty
    if (!value) {
      return {threats: [], scanned: false};
    }

    // Normalize first (remove obfuscation)
    const normalized = this.normalizeInput(value);

    // If normalization removed visible content or removed hidden chars, flag as obfuscation attempt
    const threats: Threat[] = [];
    if (this.containsHiddenChars(value, normalized)) {
      threats.push({
        type: "HIDDEN_CHAR_OBFUSCATION",
        severity: this.config.strictMode ? "HIGH" : "MEDIUM",
        pattern: "invisible-unicode",
        matched: originalValue,
        position: 0,
        recommendation: "Remove invisible unicode characters or reject input",
      });

      if (this.config.stopOnFirstThreat) {
        return {threats, scanned: true};
      }
    }

    // Replace working value with normalized string for regex scanning
    value = normalized;

    // For HTML context: we may allow some tags - check isAllowedHtml before pattern checks
    const isHtmlContext = field.type === "html";
    const allowedTags = field.allowedTags;

    const patterns = this.patterns[scannerType];

    for (const {pattern, type: threatType, severity} of patterns) {
      // Skip certain XSS checks for explicitly allowed HTML content, but don't allow script or event handlers
      if (isHtmlContext && scannerType === "xss") {
        if (this.isAllowedHtml(value, allowedTags, threatType)) {
          continue;
        }
      }

      // Execute pattern
      const matches = value.matchAll(pattern);
      for (const match of matches) {
        threats.push({
          type: threatType,
          severity:
            this.config.strictMode && severity === "MEDIUM" ? "HIGH" : severity,
          pattern: pattern.source,
          matched: match[0],
          position: match.index ?? 0,
          recommendation: this.getRecommendation(scannerType, threatType),
        });

        if (this.config.stopOnFirstThreat) {
          return {threats, scanned: true};
        }
      }
    }

    return {threats, scanned: true};
  }

  /**
   * Check if HTML content uses only allowed tags.
   * Script and event handler threats are never allowed.
   *
   * @private
   * @param {string} value - The normalized field value
   * @param {string[]} [allowedTags] - List of allowed HTML tags
   * @param {string} threatType - The threat type being evaluated
   * @returns {boolean} True if this threat should be allowed for this HTML context
   */
  private isAllowedHtml(
    value: string,
    allowedTags: string[] | undefined,
    threatType: string
  ): boolean {
    if (!allowedTags || !Array.isArray(allowedTags)) {
      return false;
    }

    // Never allow script or inline JS even if allowedTags includes 'script'
    if (
      threatType === "SCRIPT_TAG" ||
      threatType === "EVENT_HANDLER" ||
      threatType === "JS_PROTOCOL" ||
      threatType === "DATA_URI_SCRIPT" ||
      threatType === "SVG_SCRIPT"
    ) {
      return false;
    }

    if (threatType === "DANGEROUS_TAG") {
      const tagMatch = value.match(/<\s*([a-z0-9\-]+)/i);
      if (tagMatch && allowedTags.includes(tagMatch[1].toLowerCase())) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get recommendation text for a detected threat.
   *
   * Provides actionable remediation advice specific to the threat type and attack vector.
   * These recommendations help developers understand how to fix the vulnerability.
   *
   * @private
   * @param {ScannerType} scannerType - The scanner type for context
   * @param {string} threatType - The specific threat type
   * @returns {string} Human-readable recommendation for remediation
   */
  private getRecommendation(
    scannerType: ScannerType,
    threatType: string
  ): string {
    const recommendations: Record<ScannerType, Record<string, string>> = {
      sqlInjection: {
        UNION_SELECT: "Use parameterized queries or prepared statements",
        OR_CONDITION: "Validate input and use parameterized queries",
        SQL_COMMENT: "Remove SQL comment characters from input",
        STACKED_QUERY: "Disable multiple statement execution",
        default: "Use parameterized queries and input validation",
      },
      noSqlInjection: {
        MONGO_OPERATOR: "Sanitize MongoDB operators from input",
        OPERATOR_INJECTION: "Use proper query parameterization",
        default: "Validate and sanitize NoSQL query inputs",
      },
      xss: {
        SCRIPT_TAG:
          "Remove script tags or encode HTML entities; sanitize input",
        EVENT_HANDLER: "Remove inline event handlers or sanitize attributes",
        JS_PROTOCOL: "Remove javascript: protocol from URLs",
        DATA_URI_SCRIPT:
          "Disallow data:text/html URIs or sanitize and decode first",
        HIDDEN_CHAR_OBFUSCATION:
          "Reject input containing invisible Unicode characters or normalize before rendering",
        default: "Encode HTML entities and sanitize user input",
      },
      pathTraversal: {
        DIRECTORY_TRAVERSAL: "Use basename() or validate against whitelist",
        ABSOLUTE_PATH: "Reject absolute paths, use relative paths only",
        default: "Validate file paths against whitelist",
      },
      tokenLeakage: {
        JWT_TOKEN: "Remove JWT token from input",
        AWS_ACCESS_KEY: "Remove AWS credentials immediately",
        API_KEY: "Remove API key from input",
        PRIVATE_KEY: "Remove private key immediately",
        default: "Remove sensitive credentials from input",
      },
    };

    return (
      recommendations[scannerType]?.[threatType] ||
      recommendations[scannerType]?.default ||
      "Review and sanitize input"
    );
  }

  /**
   * Calculate security score based on threats found.
   *
   * Computes a normalized security score from 0 to 1 based on the number and
   * severity of threats detected. A score of 1.0 indicates no threats.
   *
   * **Severity Weights:**
   * - HIGH severity: -0.4 per threat
   * - MEDIUM severity: -0.2 per threat
   * - LOW severity: -0.1 per threat
   *
   * Score is capped at minimum 0.0.
   *
   * @private
   * @param {Threat[]} threats - Array of threats detected
   * @returns {number} Security score from 0 (compromised) to 1 (secure)
   *
   * @example
   * // Score calculation:
   * // 1 HIGH threat: 1.0 - 0.4 = 0.6
   * // 2 MEDIUM threats: 1.0 - (0.2 * 2) = 0.6
   * // 3 HIGH + 2 MEDIUM: 1.0 - 0.4 - 0.4 - 0.4 - 0.2 - 0.2 = -0.6, capped to 0.0
   */
  private calculateSecurityScore(threats: Threat[]): number {
    if (threats.length === 0) return 1.0;

    const severityWeights: Record<Severity, number> = {
      HIGH: 0.4,
      MEDIUM: 0.2,
      LOW: 0.1,
    };

    let penalty = 0;
    for (const threat of threats) {
      penalty += severityWeights[threat.severity] || 0.1;
    }

    // Cap at 0, minimum score is 0
    return Math.max(0, 1.0 - penalty);
  }

  // -------------------- Public API --------------------

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
  public scanAll(fields: FieldInput[]): ScanResult {
    if (!Array.isArray(fields)) {
      throw new TypeError("Fields must be an array");
    }

    const startTime = Date.now();
    const scannerTypes: ScannerType[] = [
      "sqlInjection",
      "noSqlInjection",
      "xss",
      "pathTraversal",
      "tokenLeakage",
    ];
    const results: FieldResult[] = [];
    let overallThreats: Threat[] = [];

    for (const field of fields) {
      const fieldResult: FieldResult = {
        name: field.name,
        securityScore: 1.0,
        passed: true,
        threats: [],
      };

      if (this.config.includeValueInResponse && field.value) {
        fieldResult.value = field.value;
      }

      for (const scannerType of scannerTypes) {
        const {threats, scanned} = this.scanField(field, scannerType);

        if (scanned && threats.length > 0) {
          fieldResult.threats.push(...threats);
          overallThreats.push(...threats);
        }

        if (this.config.stopOnFirstThreat && threats.length > 0) {
          break;
        }
      }

      fieldResult.securityScore = this.calculateSecurityScore(
        fieldResult.threats
      );
      fieldResult.passed = fieldResult.threats.length === 0;

      results.push(fieldResult);

      if (this.config.stopOnFirstThreat && !fieldResult.passed) {
        break;
      }
    }

    const passedFields = results.filter((r) => r.passed).length;
    const avgFieldScore =
      results.reduce((sum, r) => sum + r.securityScore, 0) /
      (results.length || 1);
    const passRate = results.length > 0 ? passedFields / results.length : 1;
    const overallScore = avgFieldScore * passRate;

    return {
      securityScore: parseFloat(overallScore.toFixed(2)),
      scanner: "all",
      passed: overallThreats.length === 0,
      duration: Date.now() - startTime,
      result: results,
    };
  }

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
  public async scanAsync(fields: FieldInput[]): Promise<ScanResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.scanAll(fields));
      }, 0);
    });
  }

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
  public scan(fields: FieldInput[], scannerType: ScannerType): ScanResult {
    if (!this.patterns[scannerType]) {
      throw new Error(`Invalid scanner type: ${scannerType}`);
    }

    const startTime = Date.now();
    const results: FieldResult[] = [];
    let overallThreats: Threat[] = [];

    for (const field of fields) {
      const {threats, scanned} = this.scanField(field, scannerType);

      const fieldResult: FieldResult = {
        name: field.name,
        securityScore: this.calculateSecurityScore(threats),
        passed: threats.length === 0,
        threats,
      };

      if (this.config.includeValueInResponse && field.value) {
        fieldResult.value = field.value;
      }

      results.push(fieldResult);
      overallThreats.push(...threats);

      if (this.config.stopOnFirstThreat && threats.length > 0) {
        break;
      }
    }

    const passedFields = results.filter((r) => r.passed).length;
    const avgFieldScore =
      results.reduce((sum, r) => sum + r.securityScore, 0) /
      (results.length || 1);
    const passRate = results.length > 0 ? passedFields / results.length : 1;
    const overallScore = avgFieldScore * passRate;

    return {
      securityScore: parseFloat(overallScore.toFixed(2)),
      scanner: scannerType,
      passed: overallThreats.length === 0,
      duration: Date.now() - startTime,
      result: results,
    };
  }

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
  public scanMultiple(
    fields: FieldInput[],
    scannerTypes: ScannerType[]
  ): ScanResult {
    if (!Array.isArray(scannerTypes) || scannerTypes.length === 0) {
      throw new TypeError(
        "scannerTypes must be a non-empty array of valid scanner types"
      );
    }

    // Validate all scanner types
    for (const type of scannerTypes) {
      if (!this.patterns[type]) {
        throw new Error(`Invalid scanner type: ${type}`);
      }
    }

    const startTime = Date.now();
    const results: FieldResult[] = [];
    let overallThreats: Threat[] = [];

    for (const field of fields) {
      const fieldResult: FieldResult = {
        name: field.name,
        securityScore: 1.0,
        passed: true,
        threats: [],
      };

      if (this.config.includeValueInResponse && field.value) {
        fieldResult.value = field.value;
      }

      // Scan with each specified scanner type
      for (const scannerType of scannerTypes) {
        const {threats, scanned} = this.scanField(field, scannerType);

        if (scanned && threats.length > 0) {
          fieldResult.threats.push(...threats);
          overallThreats.push(...threats);
        }

        if (this.config.stopOnFirstThreat && threats.length > 0) {
          break;
        }
      }

      fieldResult.securityScore = this.calculateSecurityScore(
        fieldResult.threats
      );
      fieldResult.passed = fieldResult.threats.length === 0;

      results.push(fieldResult);

      if (this.config.stopOnFirstThreat && !fieldResult.passed) {
        break;
      }
    }

    const passedFields = results.filter((r) => r.passed).length;
    const avgFieldScore =
      results.reduce((sum, r) => sum + r.securityScore, 0) /
      (results.length || 1);
    const passRate = results.length > 0 ? passedFields / results.length : 1;
    const overallScore = avgFieldScore * passRate;

    return {
      securityScore: parseFloat(overallScore.toFixed(2)),
      scanner: "multiple",
      passed: overallThreats.length === 0,
      duration: Date.now() - startTime,
      result: results,
    };
  }
}

// // -------------------- Example usage --------------------

// // Example scanner instantiation
// const scanner = new Scanner({
//   strictMode: true,
//   stopOnFirstThreat: false,
//   includeValueInResponse: false,
//   customPatterns: {
//     // Example of adding a custom XSS pattern if needed
//     // xss: [{ pattern: /my_custom_xss_pattern/gi, type: 'CUSTOM', severity: 'HIGH' }]
//   },
// });

// // Example test data
// const testData: FieldInput[] = [
//   {name: "normal", value: "Hello world", type: "text"},
//   {name: "plainScript", value: '<script>alert("x")</script>', type: "text"},
//   {
//     name: "obfuscatedScript",
//     value: '<sc\u00ADript>alert("x")</sc\u00ADript>',
//     type: "text",
//   },
//   {
//     name: "encodedScript",
//     value: "&#x3C;script&#x3E;alert(1)&#x3C;/script&#x3E;",
//     type: "text",
//   },
//   {
//     name: "percentEncoded",
//     value: "%3Cscript%3Ealert(1)%3C/script%3E",
//     type: "text",
//   },
//   {name: "jsProtocol", value: "jaVascr\\u0069pt:alert(1)", type: "text"},
//   {name: "eventHandler", value: "<img src=x onerror=alert(1)>", type: "html"},
//   {
//     name: "allowedHtml",
//     value: "<p>Hello <strong>World</strong></p>",
//     type: "html",
//     allowedTags: ["p", "strong", "em"],
//   },
// ];

// // Run sample scan
// console.log("=== Scan All ===");
// console.log(JSON.stringify(scanner.scanAll(testData), null, 2));

// Export the class for reuse
export {
  Scanner,
  type ScannerConfig,
  type FieldInput,
  type ScanResult,
  type Threat,
};
