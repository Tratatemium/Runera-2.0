import styles from "./RunFormPage.module.css";
import { icons } from "../../components/icons/icons";

import { inputFields } from "../../config/inputFields";

import { Button, ButtonLink, FormField, Panel } from "../../components/ui/";
import { useFormState } from "../../hooks/form/useFormState";
import { useFormHandlers } from "../../hooks/form/useFormHandlers";
import { useRuns } from "../../hooks/useRuns";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useRunsContext } from "../../context/RunsContext";
import {
  calculatePace,
  getRunData,
  prepareRunStateValues,
} from "../../utils/runs.utils";

const durationFields = [
  inputFields.durationH,
  inputFields.durationM,
  inputFields.durationS,
];

const weatherFields = [
  inputFields.weatherSunny,
  inputFields.weatherPartlyCloudy,
  inputFields.weatherCloudy,
  inputFields.weatherRain,
  inputFields.weatherSnow,
  inputFields.weatherWindy,
  inputFields.weatherHot,
  inputFields.weatherCold,
];

const runFields = [
  inputFields.title,
  inputFields.distanceKm,
  ...durationFields,
  inputFields.startTime,
  ...weatherFields,
  inputFields.perceivedEffort,
  inputFields.notes,
] as const;

const fieldOptionsMap = Object.fromEntries(
  runFields.map((field) => {
    const { validator: _, normalizator: __, ...options } = field;
    return [field.id, options];
  }),
);

const ArrowBack = icons.arrowBack;

const weatherIconsMap = {
  sunny: icons.sunny,
  partly_cloudy: icons.partlyCloudy,
  cloudy: icons.cloudy,
  rain: icons.rain,
  snow: icons.snow,
  windy: icons.windy,
  hot: icons.hot,
  cold: icons.cold,
} as const;

function RunFormPage() {
  const navigate = useNavigate();

  /* ────────────────────────────── */
  /*  new or edit                   */
  /* ────────────────────────────── */

  const { runId } = useParams();
  const { runs } = useRunsContext();

  const isEdit = !!runId;

  /* ────────────────────────────── */
  /*  state and hooks               */
  /* ────────────────────────────── */

  type RunForm = {
    [K in (typeof runFields)[number]["id"]]: string;
  };

  const formStateHook = useFormState(runFields);
  const { formState, resetWithValues } = formStateHook;

  useEffect(() => {
    if (!runId || !runs) return;
    if (!runs[runId]) {
      navigate("/not-found");
      return;
    }
    const values = prepareRunStateValues(runs[runId]);
    resetWithValues(values);
  }, [runId, runs, resetWithValues, navigate]);

  const { inputHandlers, handleSubmit } = useFormHandlers(
    runFields,
    formStateHook,
  );

  const { loading, formError, postNewRun, updateRun } = useRuns();

  async function submitRun(data: RunForm) {
    const payload = getRunData(data);

    if (isEdit) {
      if (!runId) return;
      updateRun(runId, payload);
      return;
    }

    postNewRun(payload);
  }

  function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    handleSubmit(e, submitRun);
  }

  return (
    <main className={styles.main}>
      <Panel variant="frostedWarm" className={styles.panel}>
        <ButtonLink
          className={styles.back}
          linkDirection="."
          linkText="Go Back"
          variant="transparentAccent"
          goBack={true}
        >
          <ArrowBack />
        </ButtonLink>

        <h1 className={styles.title}>{isEdit ? "Edit Run" : "Add New Run"}</h1>
        <p className={styles.subTitle}>
          {isEdit ? "Update your run details" : "Log your running activity"}
        </p>
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <FormField
            {...fieldOptionsMap.title}
            value={formState[fieldOptionsMap.title.id].value}
            {...inputHandlers}
          />

          <FormField
            {...fieldOptionsMap.distanceKm}
            value={formState[fieldOptionsMap.distanceKm.id].value}
            inputError={formState[fieldOptionsMap.distanceKm.id].error}
            {...inputHandlers}
          />

          <span className={styles.durationLabel}>Duration *</span>
          <div className={styles.durationWrapper}>
            {durationFields.map((field) => (
              <FormField
                key={field.id}
                layout="columnReverse"
                {...field}
                value={formState[field.name].value}
                inputError={formState[field.name].error}
                {...inputHandlers}
              />
            ))}
          </div>

          <p
            className={styles.averagePace}
          >{`Pace: ${calculatePace(formState) || "-"} /km`}</p>

          <FormField
            {...fieldOptionsMap.startTime}
            value={formState[fieldOptionsMap.startTime.id].value}
            inputError={formState[fieldOptionsMap.startTime.id].error}
            {...inputHandlers}
          />

          <span className={styles.weatherLabel}>Weather</span>
          <div className={styles.weatherWrapper}>
            {weatherFields.map((field) => {
              const value = field.value as keyof typeof weatherIconsMap;
              const WeatherIcon = weatherIconsMap[value];

              return (
                <FormField
                  key={field.id}
                  {...field}
                  label={
                    <span className={styles.weatherOptionLabel}>
                      <WeatherIcon className={styles.weatherIcon} />
                      <span className={styles.weatherOptionText}>
                        {field.label}
                      </span>
                    </span>
                  }
                  value={value}
                  checked={formState["weather"].value === value}
                  {...inputHandlers}
                />
              );
            })}
          </div>

          <FormField
            {...fieldOptionsMap.perceivedEffort}
            label={`Effort level: ${formState[fieldOptionsMap.perceivedEffort.id].value || "-"}/10`}
            value={formState[fieldOptionsMap.perceivedEffort.id].value}
            {...inputHandlers}
          />

          <FormField
            {...fieldOptionsMap.notes}
            value={formState[fieldOptionsMap.notes.id].value}
            {...inputHandlers}
          />

          <div className={`${styles.submit} ${formError ? styles.error : ""}`}>
            <Button
              buttonText={isEdit ? "Update Run" : "Save Run"}
              type="submit"
              variant="primary"
              isSubmitting={loading !== "idle"}
            />
            <ButtonLink
              linkDirection="."
              linkText="Cancel"
              variant="secondary"
              goBack={true}
            />
          </div>
        </form>
      </Panel>
    </main>
  );
}

export { RunFormPage };
