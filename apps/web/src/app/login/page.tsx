"use client";

import Link from "next/link";

import { useAuth, useFormState, useFormHandlers } from "@/hooks";
import { inputFields } from "@/config/inputFields";
import { FormField } from "@/components/ui";
import { AuthCard } from "@/components/auth";
import runners from "@/assets/runners-wide-1.jpg";

import styles from "./page.module.css";

const loginFooter = (
  <>
    <p>Don&apos;t have an account?</p>
    <Link href="/signup">Sign Up</Link>
  </>
);

const loginFields = [inputFields.login, inputFields.password] as const;

export default function Login() {
  type LoginForm = {
    [K in (typeof loginFields)[number]["id"]]: string;
  };

  const formStateHook = useFormState(loginFields);
  const { formState } = formStateHook;
  const { inputHandlers, handleSubmit } = useFormHandlers(
    loginFields,
    formStateHook,
  );

  const { login, isFetching, formError } = useAuth();

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    handleSubmit<LoginForm>(e, async (data) => {
      const loginData = {
        password: data.password,
        ...(data.login?.includes("@")
          ? { email: data.login }
          : { username: data.login }),
      };
      await login(loginData);
    });
  }

  return (
    <main
      className={styles.main}
      style={{ backgroundImage: `url(${runners.src})` }}
    >
      <AuthCard
        onSubmit={onSubmit}
        title="Welcome Back"
        subtitle="Log in to continue tracking your runs"
        buttonText="Log In"
        footerContent={loginFooter}
        isSubmitting={isFetching}
        formError={formError}
      >
        {loginFields.map((field) => (
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
