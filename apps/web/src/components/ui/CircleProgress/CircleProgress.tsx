import styles from "./CircleProgress.module.css";

interface CircleProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  radius: number;
  percentage: number;
  showNumber?: "percentage" | "decimal" | null;
}

function CircleProgress({
  radius,
  percentage,
  showNumber = null,
  ...props
}: CircleProgressProps) {
  const calculateDasharray = (r: number): number => {
    return Math.PI * r * 2;
  };

  const calculateDashoffset = (
    percentageShown: number,
    circumference: number,
  ): number => {
    return ((100 - percentageShown) / 100) * circumference;
  };

  const dashArray = calculateDasharray(radius);
  const dashOffset = calculateDashoffset(percentage, dashArray);
  const size = radius * 2 + 10;
  const center = size / 2;

  function getScaleColor(value: number): string {
    const hue = 120 - (value / 100) * 120;

    return `hsl(${hue}, 80%, 55%)`;
  }

  return (
    <div className={styles.wrapper} {...props}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="gray"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/** background circle */}
        <circle
          r={radius}
          cx={center}
          cy={center}
          fill="transparent"
          stroke="darkgrey"
          strokeWidth="4"
        ></circle>

        {/** progress bar circle */}
        <circle
          className={styles.progressBar}
          cx={center}
          cy={center}
          fill="transparent"
          stroke={getScaleColor(percentage)}
          strokeWidth="4"
          strokeLinecap="round"
          r={radius}
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
        ></circle>
      </svg>
      {showNumber && (
        <span className={styles.number}>
          {showNumber === "decimal" && Math.floor(percentage / 10)}
          {showNumber === "percentage" && `${percentage} %`}
        </span>
      )}
    </div>
  );
}

export { CircleProgress };
