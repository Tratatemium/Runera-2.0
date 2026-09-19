import type { JSX, SVGProps } from "react";
import type { IconBaseProps } from "react-icons";

import {
  FaPlus,
  FaCircle,
  FaRegClock,
  FaRunning,
  FaWalking,
  FaFlagCheckered,
} from "react-icons/fa";
import {
  MdDeleteOutline,
  MdEdit,
  MdClose,
  MdMinimize,
  MdMoreVert,
  MdArrowBack,
  MdArrowForward,
  MdOutlineFormatListBulleted,
  MdOutlineDashboard,
  MdOutlineCalendarToday,
  MdOutlineInsertChart,
  MdSpeed,
  MdRepeat,
} from "react-icons/md";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { LuRoute } from "react-icons/lu";
import { GoGraph } from "react-icons/go";
import { PiMedal } from "react-icons/pi";
import {
  TbNumber1Small,
  TbNumber5Small,
  TbNumber10Small,
  TbNumber21Small,
  TbNumber42Small,
} from "react-icons/tb";
import { GiPathDistance, GiSpeedometer } from "react-icons/gi";
import { FiClock } from "react-icons/fi";
import {
  WiDaySunny,
  WiDayCloudy,
  WiCloudy,
  WiRain,
  WiSnow,
  WiStrongWind,
} from "react-icons/wi";
import { PiThermometerCold, PiThermometerHot } from "react-icons/pi";

import { Spinner } from "./Spinner";

export type Icon =
  | ((props: SVGProps<SVGSVGElement>) => JSX.Element)
  | ((props: IconBaseProps) => JSX.Element);

type Icons = Record<string, Record<string, Icon>>;

const icons: Icons = {
  general: {
    delete: (props: IconBaseProps) => <MdDeleteOutline {...props} />,
    edit: (props: IconBaseProps) => <MdEdit {...props} />,
    more: (props: IconBaseProps) => <MdMoreVert {...props} />,
    close: (props: IconBaseProps) => <MdClose {...props} />,
    minimize: (props: IconBaseProps) => <MdMinimize {...props} />,
    arrowBack: (props: IconBaseProps) => <MdArrowBack {...props} />,
    arrowForward: (props: IconBaseProps) => <MdArrowForward {...props} />,
    plus: (props: IconBaseProps) => <FaPlus {...props} />,
    circle: (props: IconBaseProps) => <FaCircle {...props} />,
    eye: (props: IconBaseProps) => <IoMdEye {...props} />,
    eyeOff: (props: IconBaseProps) => <IoMdEyeOff {...props} />,
    list: (props: IconBaseProps) => <MdOutlineFormatListBulleted {...props} />,
    dashboard: (props: IconBaseProps) => <MdOutlineDashboard {...props} />,
    calendar: (props: IconBaseProps) => <MdOutlineCalendarToday {...props} />,
    chart: (props: IconBaseProps) => <MdOutlineInsertChart {...props} />,
    graph: (props: IconBaseProps) => <GoGraph {...props} />,
  },
  running: {
    run: (props: IconBaseProps) => <FaRunning {...props} />,
    walk: (props: IconBaseProps) => <FaWalking {...props} />,
    distance: (props: IconBaseProps) => <LuRoute {...props} />,
    clock: (props: IconBaseProps) => <FaRegClock {...props} />,
    speed: (props: IconBaseProps) => <MdSpeed {...props} />,
    medal: (props: IconBaseProps) => <PiMedal {...props} />,
  },
  spinners: {
    spinner: (props: SVGProps<SVGSVGElement>) => <Spinner {...props} />,
  },
  records: {
    number1: (props: IconBaseProps) => <TbNumber1Small {...props} />,
    number5: (props: IconBaseProps) => <TbNumber5Small {...props} />,
    number10: (props: IconBaseProps) => <TbNumber10Small {...props} />,
    number21: (props: IconBaseProps) => <TbNumber21Small {...props} />,
    number42: (props: IconBaseProps) => <TbNumber42Small {...props} />,
    distance: (props: IconBaseProps) => <GiPathDistance {...props} />,
    speed: (props: IconBaseProps) => <GiSpeedometer {...props} />,
    time: (props: IconBaseProps) => <FiClock {...props} />,
  },
  weather: {
    sunny: (props: IconBaseProps) => <WiDaySunny color="#b26a00" {...props} />,
    partlyCloudy: (props: IconBaseProps) => (
      <WiDayCloudy color="#5b6670" {...props} />
    ),
    cloudy: (props: IconBaseProps) => <WiCloudy color="#55616b" {...props} />,
    rain: (props: IconBaseProps) => <WiRain color="#2f5c8a" {...props} />,
    snow: (props: IconBaseProps) => <WiSnow color="#3f6c8d" {...props} />,
    windy: (props: IconBaseProps) => (
      <WiStrongWind color="#3d6b70" {...props} />
    ),
    hot: (props: IconBaseProps) => (
      <PiThermometerHot color="#b54400" {...props} />
    ),
    cold: (props: IconBaseProps) => (
      <PiThermometerCold color="#1f5f8b" {...props} />
    ),
  },

  runType: {
    base: (props: IconBaseProps) => <FaRunning {...props} />,
    recovery: (props: IconBaseProps) => <FaWalking {...props} />,
    tempo: (props: IconBaseProps) => <MdSpeed {...props} />,
    longRun: (props: IconBaseProps) => <LuRoute {...props} />,
    interval: (props: IconBaseProps) => <MdRepeat {...props} />,
    race: (props: IconBaseProps) => <FaFlagCheckered {...props} />,
  },
};

export { icons };
