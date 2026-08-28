import type {
  InputFieldConfig,
  FormStateValue,
  FormAction,
  UseFormStateReturn,
} from "../../types/forms.types";

import { useCallback, useReducer } from "react";

/* ────────────────────────────── */
/* initial state creator          */
/* ────────────────────────────── */

function createFieldState(
  field: InputFieldConfig,
  initialValues?: Record<string, unknown>,
) {
  const value = initialValues?.[field.name];
  return [
    field.name,
    {
      value: value ?? "",
      error: undefined,
    },
  ];
}

function createInitialState<T extends FormStateValue>(
  fields: readonly InputFieldConfig[],
  initialValues?: Record<string, unknown>,
): T {
  const entries = fields.map((field) => createFieldState(field, initialValues));
  return Object.fromEntries(entries) as T;
}

/* ────────────────────────────── */
/* reducer                        */
/* ────────────────────────────── */

function formReducer(
  state: FormStateValue,
  action: FormAction,
): FormStateValue {
  switch (action.type) {
    case "setValue": {
      const { key, value } = action;
      return {
        ...state,
        [key]: { ...state[key], value: value },
      };
    }
    case "setError": {
      const { key, error } = action;
      return {
        ...state,
        [key]: { ...state[key], error: error },
      };
    }
    case "mergeErrors": {
      return {
        ...state,
        ...Object.keys(action.errors).reduce((acc, key) => {
          if (state[key]) {
            acc[key] = { ...state[key], error: action.errors[key] };
          }
          return acc;
        }, {} as FormStateValue),
      };
    }
    case "reset": {
      return action.state;
    }
    case "clearErrors": {
      return Object.fromEntries(
        Object.entries(state).map(([k, v]) => [k, { ...v, error: undefined }]),
      );
    }
    default:
      return state;
  }
}

/* ────────────────────────────── */
/* useFormState                   */
/* ────────────────────────────── */

function useFormState(
  fields: readonly InputFieldConfig[],
  initialValues?: Record<string, unknown>,
): UseFormStateReturn {
  const [state, dispatch] = useReducer(
    formReducer,
    createInitialState(fields, initialValues),
  );

  const setValue = useCallback(
    (key: string, value: string) => dispatch({ type: "setValue", key, value }),
    [],
  );
  const setError = useCallback(
    (key: string, error?: string) => dispatch({ type: "setError", key, error }),
    [],
  );
  const mergeErrors = useCallback(
    (errors: Record<string, string | undefined>) =>
      dispatch({ type: "mergeErrors", errors }),
    [],
  );
  const resetFormState = useCallback(
    () =>
    dispatch({
      type: "reset",
      state: createInitialState(fields, initialValues),
    }),
    [fields, initialValues],
  );
  const resetWithValues = useCallback(
    (values?: Record<string, unknown>) =>
    dispatch({
      type: "reset",
      state: createInitialState(fields, values),
    }),
    [fields],
  );
  const clearErrors = useCallback(() => dispatch({ type: "clearErrors" }), []);

  return {
    formState: state,
    setValue,
    setError,
    mergeErrors,
    resetFormState,
    resetWithValues,
    clearErrors,
  };
}

export { useFormState };
