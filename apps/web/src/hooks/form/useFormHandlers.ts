import type {
  InputFieldConfig,
  UseFormHandlersReturn,
  UseFormStateReturn,
} from "../../types/forms.types";

import { validateField, validateForm } from "../../validation/formValidation";
import { useMemo } from "react";
import { getFormData } from "../../utils/form.utils";
import { clampNumber } from "../../utils/normalize.utils";
import { scrollToTop } from "../../utils/app.utils";

function useFormHandlers(
  fields: readonly InputFieldConfig[],
  {
    formState,
    setValue,
    setError,
    mergeErrors,
    clearErrors,
  }: UseFormStateReturn,
): UseFormHandlersReturn {
  const durationFieldNames = ["durationH", "durationM", "durationS"];

  const fieldMap = useMemo(
    () => Object.fromEntries(fields.map((field) => [field.name, field])),
    [fields],
  );

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    const { name, value } = e.currentTarget;
    setValue(name, value);
  }

  function onFocus(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    setError(e.currentTarget.name, undefined);
  }

  function onBlur(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    const input = e.currentTarget;
    const name = input.name;
    const field = fieldMap[name];

    if (
      input instanceof HTMLInputElement &&
      input.type === "number" &&
      input.validity.badInput
    ) {
      const fieldName =
        typeof field?.label === "string"
          ? field.label.replace(/\s*\*+\s*$/, "")
          : name;
      setError(name, `${fieldName} must be a number.`);
      return;
    }

    const value =
      input instanceof HTMLInputElement && input.type === "number"
        ? clampNumber(input.value, input.min, input.max)
        : input.value;

    const nextFormState = {
      ...formState,
      [name]: { ...formState[name], value },
    };

    const error = validateField(field, nextFormState);

    setValue(name, value);
    setError(name, error);

    if (durationFieldNames.includes(name) && fieldMap.durationH) {
      const durationError = validateField(fieldMap.durationH, nextFormState);
      setError("durationH", durationError);
    }
  }

  function handleSubmit<T>(
    e: React.SubmitEvent<HTMLFormElement>,
    callback: (data: T) => void,
  ): void {
    e.preventDefault();
    const errors = validateForm(fields, formState);
    const hasErrors = Object.values(errors).some((v) => v !== undefined);
    if (hasErrors) {
      clearErrors();
      mergeErrors(errors);
      scrollToTop();
      return;
    }
    const data = getFormData(formState, fieldMap) as T;
    callback(data);
  }

  return {
    inputHandlers: {
      onChange,
      onBlur,
      onFocus,
    },
    handleSubmit,
  };
}

export { useFormHandlers };
