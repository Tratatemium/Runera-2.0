import type { InputFieldConfig, FormStateValue } from "@runera/shared";
import type { InputHandlers } from "@/hooks/form/useFormHandlers";

import { FormField } from "../FormField/FormField";
import { icons } from "@/components/icons/icons";
import { hasKey } from "@/utils/general.utils";

import styles from "./FormRadio.module.css";

interface FormRadioProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  name: string;
  fieldsArray: InputFieldConfig[];
  formState: FormStateValue;
  inputHandlers: InputHandlers;
}

function FormRadio({
  label,
  name,
  fieldsArray,
  formState,
  inputHandlers,
}: FormRadioProps) {
  if (!hasKey(icons, name)) throw new Error(`No icons set for ${name}`);
  return (
    <div className={styles.radioWrapper}>
      <span className={styles.radioLabel}>{label}</span>
      <div className={styles.buttonsWrapper}>
        {fieldsArray.map((field) => {
          const value = field.value;

          if (typeof value !== "string") {
            throw new Error(
              `All values of ${name} must be strings, got ${value}`,
            );
          }

          const iconsSet = icons[name];

          if (!hasKey(iconsSet, value)) {
            throw new Error(`No icon set for ${value}`);
          }

          const Icon = iconsSet[value];

          return (
            <FormField
              key={field.id}
              {...field}
              label={
                <span className={styles.radioOptionLabel}>
                  <Icon className={styles.radioIcon} />
                  <span className={styles.radioOptionText}>{field.label}</span>
                </span>
              }
              value={value}
              checked={formState["runType"].value === value}
              {...inputHandlers}
            />
          );
        })}
      </div>
      {formState.runType.error && (
        <span className={styles.errorText}>{formState.runType.error}</span>
      )}
    </div>
  );
}

export { FormRadio };
