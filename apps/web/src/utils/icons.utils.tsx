import type { Run } from "../types/runs.types";
import { icons } from "../components/icons/icons";
import type { ReactNode, SVGProps } from "react";

const {
  sunny: SunnyIcon,
  partlyCloudy: PartlyCloudyIcon,
  cloudy: CloudyIcon,
  rain: RainIcon,
  snow: SnowIcon,
  windy: WindyIcon,
  hot: HotIcon,
  cold: ColdIcon,
} = icons;

const weatherDict = {
  sunny: SunnyIcon,
  partly_cloudy: PartlyCloudyIcon,
  cloudy: CloudyIcon,
  rain: RainIcon,
  snow: SnowIcon,
  windy: WindyIcon,
  hot: HotIcon,
  cold: ColdIcon,
};

function getWeatherIcon(
  key: NonNullable<Run["weather"]>,
  props?: SVGProps<SVGSVGElement>,
): ReactNode {
  const WeatherIcon = weatherDict[key];

  return <WeatherIcon {...props} />;
}

export { getWeatherIcon };
