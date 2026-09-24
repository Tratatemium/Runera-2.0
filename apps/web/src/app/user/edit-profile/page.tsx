"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useFormState, useFormHandlers, useUser } from "@/hooks";
import { inputFields } from "@/config/inputFields";
import { getUserData } from "@/utils/user.utils";
import {
  Button,
  ButtonLink,
  FormField,
  FormRadio,
  Panel,
} from "@/components/ui";

import styles from "./page.module.css";

const userFields = [
  inputFields.firstName,
  inputFields.lastName,
  inputFields.dateOfBirth,
  inputFields.heightCm,
  inputFields.weightKg,
] as const;

const genderFields = [
  inputFields.genderFemale,
  inputFields.genderMale,
  inputFields.genderNonBinary,
  inputFields.genderPreferNotToSay,
] as const;

const runningExperienceFields = [
  inputFields.runningExperienceBeginner,
  inputFields.runningExperienceSome,
  inputFields.runningExperienceExperienced,
  inputFields.runningExperienceCompetitive,
] as const;

export default function EditProfile() {
  type UserEditForm = {
    [K in (typeof userFields)[number]["id"]]: string;
  };

  const { user } = useAuthContext();
  const formStateHook = useFormState(
    [...userFields, ...genderFields, ...runningExperienceFields],
    getUserData(user),
  );
  const { formState, mergeErrors } = formStateHook;
  const { inputHandlers, handleSubmit } = useFormHandlers(
    [...userFields, ...genderFields, ...runningExperienceFields],
    formStateHook,
  );

  const { isFetching, formError, updateProfile } = useUser();

  async function submitUserEdit(data: UserEditForm) {
    const payload = {
      profile: data,
    };
    const fieldErrors = await updateProfile(payload);
    if (fieldErrors) mergeErrors(fieldErrors);
  }

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    handleSubmit(e, submitUserEdit);
  }

  return (
    <main className={styles.main}>
      <Panel variant="frosted" className={styles.panel}>
        <div className={styles.header}>
          <h1 className={styles.title}>Edit Profile</h1>
        </div>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <section className={styles.section}>
            <span className={styles.sectionLabel}>Your Name</span>
            <div className={styles.rowFields}>
              <FormField
                {...inputFields.firstName}
                layout="column"
                value={formState.firstName.value}
                inputError={formState.firstName.error}
                className={styles.field}
                inputClassName={styles.fieldInput}
                labelClassName={styles.fieldLabel}
                {...inputHandlers}
              />
              <FormField
                {...inputFields.lastName}
                layout="column"
                value={formState.lastName.value}
                inputError={formState.lastName.error}
                className={styles.field}
                inputClassName={styles.fieldInput}
                labelClassName={styles.fieldLabel}
                {...inputHandlers}
              />
            </div>
          </section>

          <section className={styles.section}>
            <span className={styles.sectionLabel}>Personal Details</span>
            <div className={styles.stack}>
              <FormField
                {...inputFields.dateOfBirth}
                layout="column"
                value={formState.dateOfBirth.value}
                inputError={formState.dateOfBirth.error}
                className={styles.field}
                inputClassName={styles.fieldInput}
                labelClassName={styles.fieldLabel}
                {...inputHandlers}
              />
              <div className={styles.rowFields}>
                <FormField
                  {...inputFields.heightCm}
                  layout="column"
                  value={formState.heightCm.value}
                  inputError={formState.heightCm.error}
                  className={styles.field}
                  inputClassName={styles.fieldInput}
                  labelClassName={styles.fieldLabel}
                  {...inputHandlers}
                />
                <FormField
                  {...inputFields.weightKg}
                  layout="column"
                  value={formState.weightKg.value}
                  inputError={formState.weightKg.error}
                  className={styles.field}
                  inputClassName={styles.fieldInput}
                  labelClassName={styles.fieldLabel}
                  {...inputHandlers}
                />
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <span className={styles.sectionLabel}>Gender</span>
            <FormRadio
              variant="profile"
              name="gender"
              fieldsArray={[...genderFields]}
              formState={formState}
              inputHandlers={inputHandlers}
            />
          </section>

          <section className={styles.section}>
            <span className={styles.sectionLabel}>Running Experience</span>
            <FormRadio
              variant="profile"
              name="runningExperience"
              fieldsArray={[...runningExperienceFields]}
              formState={formState}
              inputHandlers={inputHandlers}
            />
          </section>

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
                linkText="Cancel"
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
