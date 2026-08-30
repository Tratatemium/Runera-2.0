"use client";

import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";
import { useFormState } from "@/hooks/form/useFormState";
import { useFormHandlers } from "@/hooks/form/useFormHandlers";
import { inputFields } from "@/config/inputFields";
import { FormField } from "@/components/ui";
import { AuthCard } from "@/components/auth";
import runners from "@/assets/runners-wide-3.jpg";

import styles from "./page.module.css";

const signupFooter = (
  <>
    <p>Already have an account?</p>
    <Link href="/login">Log in</Link>
  </>
);

const signupFields = [
  inputFields.username,
  inputFields.email,
  inputFields.password,
  inputFields.confirmPassword,
] as const;

export default function Signup() {
  type SignupForm = {
    [K in (typeof signupFields)[number]["id"]]: string;
  };

  const formStateHook = useFormState(signupFields);
  const { formState, mergeErrors } = formStateHook;
  const { inputHandlers, handleSubmit } = useFormHandlers(
    signupFields,
    formStateHook,
  );
  const { signup, isFetching, formError } = useAuth();

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    handleSubmit<SignupForm>(e, async (data) => {
      const payload = {
        username: data.username,
        email: data.email,
        password: data.password,
      };
      const serverErrors = await signup(payload);
      if (serverErrors) mergeErrors(serverErrors);
    });
  }

  return (
    <main
      className={styles.main}
      style={{ backgroundImage: `url(${runners})` }}
    >
      <AuthCard
        onSubmit={onSubmit}
        title="Create account"
        subtitle="Start tracking your running journey"
        buttonText="Sign Up"
        footerContent={signupFooter}
        isSubmitting={isFetching}
        formError={formError}
      >
        {signupFields.map((field) => (
          <FormField
            key={field.id}
            {...field}
            value={formState[field.id].value}
            inputError={formState[field.id].error}
            {...inputHandlers}
          />
        ))}
      </AuthCard>
    </main>
  );
}
