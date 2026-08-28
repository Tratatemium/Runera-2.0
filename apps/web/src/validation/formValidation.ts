import type { InputFieldConfig } from "../types/forms.types";
import type { FormStateValue } from "../types/forms.types";

function validateField(
  field: InputFieldConfig,
  formState: FormStateValue,
): string | undefined {
  if (!field) return undefined;
  const value = formState[field.name].value;
  return field.validator?.(value, formState);
}

function validateForm(
  fields: readonly InputFieldConfig[],
  formState: FormStateValue,
): Record<string, string | undefined> {
  const entries = fields.map((field) => [
    field.id,
    validateField(field, formState),
  ]);
  return Object.fromEntries(entries);
}

export { validateField, validateForm };
