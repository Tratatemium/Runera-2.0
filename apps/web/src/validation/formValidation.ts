import type { InputFieldConfig, FormStateValue } from "@runera/shared";

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
    field.name,
    validateField(field, formState),
  ]);
  return Object.fromEntries(entries);
}

export { validateField, validateForm };
