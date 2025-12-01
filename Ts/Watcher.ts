import { Utils } from "./utils";
import { validationElementsTypes } from "./globalTypes";

/**
 * @class Watcher
 * @description Tracks form field changes and validation state
 * @example
 * const watcher = new Watcher(allFields, initialData);
 * watcher.isDirty(); // true if any field has changed
 * watcher.isValid(); // true if all fields are valid
 * watcher.getChangedFields(); // returns array of changed field names
 */
export class Watcher {
  private initialData: Map<string, string> = new Map();
  private currentData: Map<string, string> = new Map();
  private fields: validationElementsTypes[] = [];
  private validationState: Map<string, boolean> = new Map();
  private _initialDataConfig?: Record<string, string>;

  constructor(
    fields: validationElementsTypes[],
    initialData?: Record<string, string>
  ) {
    this.fields = fields;
    this._initialDataConfig = initialData;

    // Initialize initial data
    this.initializeData(initialData);

    // Setup listeners for all fields
    this.setupFieldListeners();
  }

  /**
   * Initialize initialData and currentData based on config and DOM values
   */
  private initializeData(initialData?: Record<string, string>): void {
    if (initialData) {
      // Set initialData from parameter AND read DOM values for fields not in initialData
      this.fields.forEach((field) => {
        const fieldName = field.specifications.name;
        const isCheckbox = field.field.type === "checkbox";
        const hasChecked = isCheckbox && "checkedValue" in field.specifications;
        const hasUnchecked =
          isCheckbox && "unCheckedValue" in field.specifications;
        const domValue = isCheckbox
          ? (field.field as HTMLInputElement).checked
            ? hasChecked
              ? String(field.specifications.checkedValue)
              : "true"
            : hasUnchecked
              ? String(field.specifications.unCheckedValue)
              : "false"
          : field.field.value;

        // Use provided initialData value if available, otherwise use DOM value
        const initialValue = initialData.hasOwnProperty(fieldName)
          ? String(initialData[fieldName])
          : domValue;

        this.initialData.set(fieldName, initialValue);
        this.currentData.set(fieldName, domValue);
        this.validationState.set(fieldName, false);
      });
    } else {
      // Use field values as initial data
      this.fields.forEach((field) => {
        const fieldName = field.specifications.name;
        const isCheckbox = field.field.type === "checkbox";
        const hasChecked = isCheckbox && "checkedValue" in field.specifications;
        const hasUnchecked =
          isCheckbox && "unCheckedValue" in field.specifications;
        const value = isCheckbox
          ? (field.field as HTMLInputElement).checked
            ? hasChecked
              ? String(field.specifications.checkedValue)
              : "true"
            : hasUnchecked
              ? String(field.specifications.unCheckedValue)
              : "false"
          : field.field.value;
        this.initialData.set(fieldName, value);
        this.currentData.set(fieldName, value);
        this.validationState.set(fieldName, false);
      });
    }
  }

  /**
   * Setup event listeners for all fields to track changes
   */
  private setupFieldListeners(): void {
    this.fields.forEach((field) => {
      const fieldName = field.specifications.name;

      field.field.addEventListener("input", () => {
        this.updateFieldValue(fieldName);
      });

      field.field.addEventListener("change", () => {
        this.updateFieldValue(fieldName);
      });
    });
  }

  /**
   * Update the current value of a field
   */
  private updateFieldValue(fieldName: string): void {
    const field = this.fields.find((f) => f.specifications.name === fieldName);
    if (field) {
      const isCheckbox = field.field.type === "checkbox";
      const hasChecked = isCheckbox && "checkedValue" in field.specifications;
      const hasUnchecked =
        isCheckbox && "unCheckedValue" in field.specifications;
      const value = isCheckbox
        ? (field.field as HTMLInputElement).checked
          ? hasChecked
            ? String(field.specifications.checkedValue)
            : "true"
          : hasUnchecked
            ? String(field.specifications.unCheckedValue)
            : "false"
        : field.field.value;
      this.currentData.set(fieldName, value);
    }
  }

  /**
   * Check if any field has been modified from its initial value
   */
  public isDirty(): boolean {
    for (const [key, initialValue] of this.initialData.entries()) {
      const currentValue = this.currentData.get(key);
      if (initialValue !== currentValue) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if a specific field has been modified
   */
  public isFieldDirty(fieldName: string): boolean {
    return this.initialData.get(fieldName) !== this.currentData.get(fieldName);
  }

  /**
   * Check if all fields are in valid state
   */
  public isValid(): boolean {
    return Array.from(this.validationState.values()).every((v) => v === true);
  }

  /**
   * Check if a specific field is valid
   */
  public isFieldValid(fieldName: string): boolean {
    return this.validationState.get(fieldName) ?? false;
  }

  /**
   * Set validation state for a field
   */
  public setFieldValid(fieldName: string, isValid: boolean): void {
    this.validationState.set(fieldName, isValid);
  }

  /**
   * Get all fields that have been modified
   */
  public getChangedFields(): string[] {
    const changed: string[] = [];
    for (const [key] of this.initialData.entries()) {
      if (this.isFieldDirty(key)) {
        changed.push(key);
      }
    }
    return changed;
  }

  /**
   * Get all current field values
   */
  public getCurrentValues(): Record<string, string> {
    const values: Record<string, string> = {};
    this.currentData.forEach((value, key) => {
      values[key] = value;
    });
    return values;
  }

  /**
   * Reset all fields to their initial values
   */
  public reset(): void {
    this.initialData.forEach((initialValue, key) => {
      this.currentData.set(key, initialValue);
      this.validationState.set(key, false);

      const field = this.fields.find((f) => f.specifications.name === key);
      if (field) {
        if (field.field.type === "checkbox") {
          const specChecked = (field.specifications as any).checkedValue;
          const specUnchecked = (field.specifications as any).unCheckedValue;
          // If initial value equals the spec checkedValue or "true", mark checked
          (field.field as HTMLInputElement).checked =
            initialValue === String(specChecked) || initialValue === "true";
        } else {
          field.field.value = initialValue;
        }
      }
    });
  }

  /**
   * Set new initial values and reset current values
   */
  public setInitialData(data: Record<string, string>): void {
    this.initialData.clear();
    this.currentData.clear();
    this._initialDataConfig = data; // Update config

    Object.entries(data).forEach(([key, value]) => {
      this.initialData.set(key, value);
      this.currentData.set(key, value);
    });

    this.reset();
  }

  /**
   * Get validation summary
   */
  public getValidationSummary(): {
    isValid: boolean;
    isDirty: boolean;
    changedFields: string[];
  } {
    return {
      isValid: this.isValid(),
      isDirty: this.isDirty(),
      changedFields: this.getChangedFields(),
    };
  }
  /**
   * Update fields and re-initialize listeners.
   * Useful for async initialization when the form appears later in the DOM.
   */
  public updateFields(fields: validationElementsTypes[]): void {
    this.fields = fields;
    this.initialData.clear();
    this.currentData.clear();
    this.validationState.clear();

    // Re-initialize data using the stored config
    this.initializeData(this._initialDataConfig);

    this.setupFieldListeners();
  }
}
