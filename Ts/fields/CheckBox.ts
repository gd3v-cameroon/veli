import {validationElementsTypes} from "../globalTypes";
import {Utils} from "../utils";
import * as uerCheck from "../errorHandler/user/checkBox";

export class CheckBox extends Utils {
  validate(
    element: validationElementsTypes,
    allFields: Array<validationElementsTypes>
  ): void {
    const {
      specifications: developerSpecification,
      field: targetField,
      errorField,
    } = element;

    Object.entries(developerSpecification).forEach(([key, rawValue]) => {
      const {value} = Utils.propertyValueSplitter(rawValue);
      try {
        if (key === "required" && JSON.parse(developerSpecification.required)) {
          if (
            targetField instanceof HTMLInputElement &&
            targetField.type === "checkbox"
          ) {
            if (!targetField.checked) {
              // Handle error when checkbox is required but unchecked
              const err = Utils.generateError(rawValue, () =>
                uerCheck.requiredCheck(Utils.lang)
              );
              Utils.handleError(targetField, errorField, err);
            } else {
              // Handle success when checkbox is checked
              Utils.handleSuccess(targetField, errorField);
            }
          }
        }

        if (key === "linkTo") {
          const value = Utils.trim(Utils.propertyValueSplitter(rawValue).value);
          const [fieldName, relationship] = value.split(",");
          const linkedField = allFields.find(
            (f) => f.specifications.name === fieldName
          );

          if (!linkedField) {
            console.error(`Field "${fieldName}" not found`);
            return;
          }

          if (
            targetField instanceof HTMLInputElement &&
            targetField.type === "checkbox"
          ) {
            switch (relationship) {
              case "enableToggle":
                linkedField.field.disabled = targetField.checked;
                break;
              case "reset":
                linkedField.field.value = developerSpecification.value;
                break;
              case "clear":
                linkedField.field.value = "";
                break;
              case "passwordShowToggle":
                linkedField.field.setAttribute(
                  "type",
                  targetField.checked ? "text" : "password"
                );
                break;
            }
          }
        }
        if (key === "groupMembers") {
          const membersName = Utils.trim(rawValue).split(",");
          const members = allFields.filter((field) =>
            membersName.includes(field.specifications.name)
          );

          const defaultMembersNames = (
            developerSpecification.defaultSelect || ""
          )
            .split(",")
            .filter(Boolean);
          const defaultMembers = members.filter((m) =>
            defaultMembersNames.includes(m.specifications.name)
          );

          let maxSelect = parseInt(developerSpecification.maxSelect) || 1;

          // Function to update checkbox states
          const updateCheckboxStates = () => {
            const selectedCheckboxes = members.filter(
              (m) =>
                (m.field as HTMLInputElement).checked &&
                !defaultMembersNames.includes(m.specifications.name) // Ignore default members
            );

            const selectedCount =
              selectedCheckboxes.length + defaultMembers.length; // Include defaults

            // Disable unchecked checkboxes if max is reached, excluding default members
            members.forEach((m) => {
              const input = m.field as HTMLInputElement;
              input.disabled =
                selectedCount >= maxSelect &&
                !input.checked &&
                !defaultMembersNames.includes(m.specifications.name);
            });
          };

          // Ensure default members are selected and locked
          defaultMembers.forEach((m) => {
            const input = m.field as HTMLInputElement;
            input.checked = true;
            input.disabled = true; // Prevent unchecking
            input.addEventListener("click", (e) => {
              e.preventDefault(); // Prevent the checkbox from being unchecked
            });
          });

          // Add event listeners to other checkboxes
          members.forEach((member) => {
            if (
              member.field instanceof HTMLInputElement &&
              member.field.type === "checkbox" &&
              !defaultMembersNames.includes(member.specifications.name) // Only allow toggling for non-default members
            ) {
              member.field.addEventListener("change", updateCheckboxStates);
            }
          });

          // Initial state update
          updateCheckboxStates();
        }
      } catch (error) {}
    });
  }
}
