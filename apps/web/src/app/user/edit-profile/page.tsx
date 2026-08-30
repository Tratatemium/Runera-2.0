"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useFormState } from "@/hooks/form/useFormState";
import { useFormHandlers } from "@/hooks/form/useFormHandlers";
import { useUser } from "@/hooks/useUser";
import { inputFields } from "@/config/inputFields";
import { getUserData } from "@/utils/user.utils";
import { Button, ButtonLink, FormField, Panel } from "@/components/ui";

import styles from "./page.module.css";

const userFields = [
  inputFields.firstName,
  inputFields.lastName,
  inputFields.dateOfBirth,
  inputFields.heightCm,
  inputFields.weightKg,
] as const;

export default function EditProfile() {
  type UserEditForm = {
    [K in (typeof userFields)[number]["id"]]: string;
  };

  const { user } = useAuthContext();
  const formStateHook = useFormState(userFields, getUserData(user));
  const { formState } = formStateHook;
  const { inputHandlers, handleSubmit } = useFormHandlers(
    userFields,
    formStateHook,
  );

  const { isFetching, formError, updateProfile } = useUser();

  async function submitUserEdit(data: UserEditForm) {
    const payload = {
      profile: data,
    };
    await updateProfile(payload);
  }

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    handleSubmit(e, submitUserEdit);
  }

  return (
    <main className={styles.main}>
      <Panel variant="frosted">
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          {userFields.map((field) => (
            <FormField
              {...field}
              key={field.id}
              layout="row"
              value={formState[field.id].value}
              inputError={formState[field.id].error}
              {...inputHandlers}
            />
          ))}

          <div className={styles.submitWrapper}>
            {formError && (
              <div role="alert" className={styles.errorWrapper}>
                <p className={styles.errorText}>{formError}</p>
              </div>
            )}
            <div
              className={`${styles.submit} ${formError ? styles.error : ""}`}
            >
              <Button
                buttonText="Save changes"
                type="submit"
                variant="primary"
                isSubmitting={isFetching}
              />
              <ButtonLink
                linkDirection="."
                linkText="Go Back"
                variant="secondary"
                goBack={true}
              />
            </div>
          </div>
        </form>
      </Panel>
    </main>
  );
}
