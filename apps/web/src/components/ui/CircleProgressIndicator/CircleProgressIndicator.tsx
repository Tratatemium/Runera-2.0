import styles from "CircleProgressIndicator.module.css";

interface CircleProgressIndicatorProps {
  radius: number;
  percentage: number;
  showNumber: "percentage" | "decimal" | null;
}

function CircleProgressIndicator({
  radius,
  percentage,
  showNumber,
}: CircleProgressIndicatorProps) {
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

  return (
    <div>
      <svg
        width="500"
        height="500"
        viewBox="0 0 500 500"
        fill="gray"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/** background circle */}
        <circle
          r={radius}
          cx="250"
          cy="250"
          fill="transparent"
          stroke="darkgrey"
          stroke-width="4"
        ></circle>

        {/** progress bar circle */}
        <circle
          id="progress-bar"
          cx="250"
          cy="250"
          fill="transparent"
          stroke="green"
          stroke-width="4"
          stroke-linecap="round"
          r={radius}
          stroke-dasharray={dashArray}
          stroke-dashoffset={dashOffset}
        ></circle>
      </svg>
    </div>
  );
}

export { CircleProgressIndicator };
