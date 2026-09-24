import type { InputFieldConfig, FormStateValue } from "@runera/shared";
import type { InputHandlers } from "@/hooks";

import { FormField } from "../FormField/FormField";
import { icons } from "@/components/icons/icons";
import { hasKey } from "@runera/shared";

import styles from "./FormRadio.module.css";

interface FormRadioProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  name: string;
  variant: "withIcon" | "profile";
  fieldsArray: InputFieldConfig[];
  formState: FormStateValue;
  inputHandlers: InputHandlers;
}

function FormRadio({
  label,
  variant,
  name,
  fieldsArray,
  formState,
  inputHandlers,
}: FormRadioProps) {
  return (
    <div className={`${styles.radioWrapper} ${styles[variant]}`}>
      {label && <span className={styles.radioLabel}>{label}</span>}
      <div className={styles.buttonsWrapper}>
        {fieldsArray.map((field) => {
          const value = field.value;

          if (typeof value !== "string") {
            throw new Error(
              `All values of ${name} must be strings, got ${value}`,
            );
          }

          const iconsSet = icons[name];
          let Icon;

          if (iconsSet) {
            if (!hasKey(iconsSet, value)) {
              throw new Error(`No icon set for ${value}`);
            }

            Icon = iconsSet[value];
          }

          return (
            <FormField
              key={field.id}
              className={styles.button}
              {...field}
              label={
                <span className={styles.radioOptionLabel}>
                  {Icon && <Icon className={styles.radioIcon} />}
                  <span className={styles.radioOptionText}>{field.label}</span>
                </span>
              }
              value={value}
              checked={formState[name].value === value}
              {...inputHandlers}
            />
          );
        })}
      </div>
      {formState[name].error && (
        <span className={styles.errorText}>{formState[name].error}</span>
      )}
    </div>
  );
}

export { FormRadio };
