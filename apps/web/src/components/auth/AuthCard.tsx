import styles from "./AuthCard.module.css";

import { Button, Logo } from "../ui/";

interface AuthCardProps {
  children?: React.ReactNode;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  title: string;
  subtitle: string;
  buttonText: string;
  footerContent?: React.ReactNode;
  isSubmitting?: boolean;
  formError?: string | undefined;
}

function AuthCard({
  children,
  onSubmit,
  title,
  subtitle,
  buttonText,
  footerContent,
  isSubmitting = false,
  formError,
}: AuthCardProps) {
  return (
    <section className={styles.authCard} aria-labelledby="authTitle">
      <header className={styles.authHeader}>
        <Logo variant="secondary" />
        <h1 id="authTitle" className={styles.authTitle}>
          {title}
        </h1>
        <p className={styles.authSubtitle}>{subtitle}</p>
      </header>

      <form className={styles.authForm} onSubmit={onSubmit} noValidate>
        {children}

        <div className={styles.submitWrapper}>
          {formError && (
            <div role="alert" className={styles.errorWrapper}>
              <p className={styles.errorText}>{formError}</p>
            </div>
          )}
          <div className={`${styles.submit} ${formError ? styles.error : ""}`}>
            <Button
              buttonText={buttonText}
              type="submit"
              variant="primary"
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </form>

      {footerContent && (
        <footer className={styles.authFooter}>{footerContent}</footer>
      )}
    </section>
  );
}

export { AuthCard };
