import type { JSX, SVGProps } from "react";

export type Icon = (props: SVGProps<SVGSVGElement>) => JSX.Element;

const icons: Record<string, Icon> = {
  delete: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}
      >
        {/* Icon from Google Material Icons by Material Design Authors - https://github.com/material-icons/material-icons/blob/master/LICENSE */}
        <path
          fill="currentColor"
          d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"
        />
      </svg>
    );
  },

  edit: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}
      >
        {/* Icon from Google Material Icons by Material Design Authors - https://github.com/material-icons/material-icons/blob/master/LICENSE */}
        <path
          fill="currentColor"
          d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z"
        />
      </svg>
    );
  },

  more: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}
      >
        {/* Icon from Google Material Icons by Material Design Authors - https://github.com/material-icons/material-icons/blob/master/LICENSE */}
        <path
          fill="currentColor"
          d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2m0 2c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m0 6c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2"
        />
      </svg>
    );
  },

  arrowBack: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}
      >
        {/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}
        <path
          fill="currentColor"
          d="m7.825 13l4.9 4.9q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288l-6.6-6.6q-.15-.15-.213-.325T4.426 12t.063-.375t.212-.325l6.6-6.6q.275-.275.688-.275t.712.275q.3.3.3.713t-.3.712L7.825 11H19q.425 0 .713.288T20 12t-.288.713T19 13z"
        />
      </svg>
    );
  },

  arrowForward: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}
      >
        {/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}
        <path
          fill="currentColor"
          d="M16.175 13H5q-.425 0-.712-.288T4 12t.288-.712T5 11h11.175l-4.9-4.9q-.3-.3-.288-.7t.313-.7q.3-.275.7-.288t.7.288l6.6 6.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-6.6 6.6q-.275.275-.687.275T11.3 19.3q-.3-.3-.3-.712t.3-.713z"
        />
      </svg>
    );
  },

  spinner: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}
      >
        {/* Icon from SVG Spinners by Utkarsh Verma - https://github.com/n3r4zzurr0/svg-spinners/blob/main/LICENSE */}
        <g stroke="currentColor">
          <circle
            cx="12"
            cy="12"
            r="9.5"
            fill="none"
            strokeLinecap="round"
            strokeWidth="3"
          >
            <animate
              attributeName="stroke-dasharray"
              calcMode="spline"
              dur="1.5s"
              keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
              keyTimes="0;0.475;0.95;1"
              repeatCount="indefinite"
              values="0 150;42 150;42 150;42 150"
            />
            <animate
              attributeName="stroke-dashoffset"
              calcMode="spline"
              dur="1.5s"
              keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
              keyTimes="0;0.475;0.95;1"
              repeatCount="indefinite"
              values="0;-16;-59;-59"
            />
          </circle>
          <animateTransform
            attributeName="transform"
            dur="2s"
            repeatCount="indefinite"
            type="rotate"
            values="0 12 12;360 12 12"
          />
        </g>
      </svg>
    );
  },

  plus: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}
      >
        {/* Icon from Google Material Icons by Material Design Authors - https://github.com/material-icons/material-icons/blob/master/LICENSE */}
        <path
          fill="currentColor"
          d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"
        />
      </svg>
    );
  },

  run: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}
      >
        {/* Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE */}
        <path
          fill="currentColor"
          d="M13.5 5.5c1.09 0 2-.92 2-2a2 2 0 0 0-2-2c-1.11 0-2 .88-2 2c0 1.08.89 2 2 2M9.89 19.38l1-4.38L13 17v6h2v-7.5l-2.11-2l.61-3A7.3 7.3 0 0 0 19 13v-2c-1.91 0-3.5-1-4.31-2.42l-1-1.58c-.4-.62-1-1-1.69-1c-.31 0-.5.08-.81.08L6 8.28V13h2V9.58l1.79-.7L8.19 17l-4.9-1l-.4 2z"
        />
      </svg>
    );
  },

  runFast: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}
      >
        {/* Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE */}
        <path
          fill="currentColor"
          d="M16.5 5.5a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m-3.6 13.9l1-4.4l2.1 2v6h2v-7.5l-2.1-2l.6-3A7.3 7.3 0 0 0 22 13v-2c-1.76.03-3.4-.89-4.3-2.4l-1-1.6c-.36-.6-1-1-1.7-1c-.3 0-.5.1-.8.1L9 8.3V13h2V9.6l1.8-.7l-1.6 8.1l-4.9-1l-.4 2zM4 9a1 1 0 0 1-1-1a1 1 0 0 1 1-1h3v2zm1-4a1 1 0 0 1-1-1a1 1 0 0 1 1-1h5v2zm-2 8a1 1 0 0 1-1-1a1 1 0 0 1 1-1h4v2z"
        />
      </svg>
    );
  },

  eye: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}
      >
        {/* Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE */}
        <path
          fill="currentColor"
          d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"
        />
      </svg>
    );
  },

  eyeOff: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}
      >
        {/* Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE */}
        <path
          fill="currentColor"
          d="M2 5.27L3.28 4L20 20.72L18.73 22l-3.08-3.08c-1.15.38-2.37.58-3.65.58c-5 0-9.27-3.11-11-7.5c.69-1.76 1.79-3.31 3.19-4.54zM12 9a3 3 0 0 1 3 3a3 3 0 0 1-.17 1L11 9.17A3 3 0 0 1 12 9m0-4.5c5 0 9.27 3.11 11 7.5a11.8 11.8 0 0 1-4 5.19l-1.42-1.43A9.86 9.86 0 0 0 20.82 12A9.82 9.82 0 0 0 12 6.5c-1.09 0-2.16.18-3.16.5L7.3 5.47c1.44-.62 3.03-.97 4.7-.97M3.18 12A9.82 9.82 0 0 0 12 17.5c.69 0 1.37-.07 2-.21L11.72 15A3.064 3.064 0 0 1 9 12.28L5.6 8.87c-.99.85-1.82 1.91-2.42 3.13"
        />
      </svg>
    );
  },

  list: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}
      >
        {/* Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE */}
        <path
          fill="currentColor"
          d="M7 5h14v2H7zm0 8v-2h14v2zM4 4.5A1.5 1.5 0 0 1 5.5 6A1.5 1.5 0 0 1 4 7.5A1.5 1.5 0 0 1 2.5 6A1.5 1.5 0 0 1 4 4.5m0 6A1.5 1.5 0 0 1 5.5 12A1.5 1.5 0 0 1 4 13.5A1.5 1.5 0 0 1 2.5 12A1.5 1.5 0 0 1 4 10.5M7 19v-2h14v2zm-3-2.5A1.5 1.5 0 0 1 5.5 18A1.5 1.5 0 0 1 4 19.5A1.5 1.5 0 0 1 2.5 18A1.5 1.5 0 0 1 4 16.5"
        />
      </svg>
    );
  },

  dashboard: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}
      >
        {/* Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE */}
        <path
          fill="currentColor"
          d="M19 5v2h-4V5zM9 5v6H5V5zm10 8v6h-4v-6zM9 17v2H5v-2zM21 3h-8v6h8zM11 3H3v10h8zm10 8h-8v10h8zm-10 4H3v6h8z"
        />
      </svg>
    );
  },

  clock: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}
      >
        {/* Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE */}
        <path
          fill="currentColor"
          d="M12 20c4.4 0 8-3.6 8-8s-3.6-8-8-8s-8 3.6-8 8s3.6 8 8 8m0-18c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12S6.5 2 12 2m5 11.9l-.7 1.3l-5.3-2.9V7h1.5v4.4z"
        />
      </svg>
    );
  },

  speed: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}
      >
        {/* Icon from Tabler Icons by Paweł Kuna - https://github.com/tabler/tabler-icons/blob/master/LICENSE */}
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5.636 19.364a9 9 0 1 1 12.728 0M16 9l-4 4"
        />
      </svg>
    );
  },

  calendar: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}
      >
        {/* Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE */}
        <path
          fill="currentColor"
          d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.11 0 2-.89 2-2V5a2 2 0 0 0-2-2m0 16H5V9h14zm0-12H5V5h14z"
        />
      </svg>
    );
  },

  distance: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}
      >
        {/* Icon from TDesign Icons by TDesign - https://github.com/Tencent/tdesign-icons/blob/main/LICENSE */}
        <g fill="none">
          <path d="M21 3H3v18h18z" />
          <path d="M18 7.5c0 1.219-1.5 2.25-1.5 2.25S15 8.719 15 7.5a1.5 1.5 0 0 1 3 0m-8 3c0 1.219-1.5 2.25-1.5 2.25S7 11.719 7 10.5a1.5 1.5 0 1 1 3 0" />
          <path
            stroke="currentColor"
            strokeLinecap="square"
            strokeWidth="2"
            d="M21 3H3v18h18z"
          />
          <path
            stroke="currentColor"
            strokeLinecap="square"
            strokeWidth="2"
            d="m14.5 14.5l4-1.5m-12 4.5l4-1.5M18 7.5c0 1.219-1.5 2.25-1.5 2.25S15 8.719 15 7.5a1.5 1.5 0 0 1 3 0Zm-8 3c0 1.219-1.5 2.25-1.5 2.25S7 11.719 7 10.5a1.5 1.5 0 1 1 3 0Z"
          />
        </g>
      </svg>
    );
  },

  chart: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}
      >
        {/* Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE */}
        <path
          fill="currentColor"
          d="M9 17H7v-7h2zm4 0h-2V7h2zm4 0h-2v-4h2zm2 2H5V5h14v14.1M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2"
        />
      </svg>
    );
  },

  graph: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}
      >
        {/* Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE */}
        <path
          fill="currentColor"
          d="m16 11.78l4.24-7.33l1.73 1l-5.23 9.05l-6.51-3.75L5.46 19H22v2H2V3h2v14.54L9.5 8z"
        />
      </svg>
    );
  },

  medal: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        {...props}
      >
        {/* Icon from Solar by 480 Design - https://creativecommons.org/licenses/by/4.0/ */}
        <g fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M11.146 7.023C11.526 6.34 11.716 6 12 6s.474.34.854 1.023l.098.176c.108.194.162.29.246.354c.085.064.19.088.4.135l.19.044c.738.167 1.107.25 1.195.532s-.164.577-.667 1.165l-.13.152c-.143.167-.215.25-.247.354s-.021.215 0 .438l.02.203c.076.785.114 1.178-.115 1.352c-.23.174-.576.015-1.267-.303l-.178-.082c-.197-.09-.295-.135-.399-.135s-.202.045-.399.135l-.178.082c-.691.319-1.037.477-1.267.303s-.191-.567-.115-1.352l.02-.203c.021-.223.032-.334 0-.438s-.104-.187-.247-.354l-.13-.152c-.503-.588-.755-.882-.667-1.165c.088-.282.457-.365 1.195-.532l.19-.044c.21-.047.315-.07.4-.135c.084-.064.138-.16.246-.354z" />
          <path d="M19 9A7 7 0 1 1 5 9a7 7 0 0 1 14 0Z" />
          <path
            strokeLinecap="round"
            d="m7.351 15l-.637 2.323c-.628 2.292-.942 3.438-.523 4.065c.147.22.344.396.573.513c.652.332 1.66-.193 3.675-1.243c.67-.35 1.006-.524 1.362-.562a2 2 0 0 1 .398 0c.356.038.691.213 1.362.562c2.015 1.05 3.023 1.575 3.675 1.243c.229-.117.426-.293.573-.513c.42-.627.105-1.773-.523-4.065L16.649 15"
          />
        </g>
      </svg>
    );
  },

  sunny: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 30 30"
        color="#b26a00"
        {...props}
      >
        {/* Icon from Weather Icons by Erik Flowers - https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL */}
        <path
          fill="currentColor"
          d="M4.37 14.62c0-.24.08-.45.25-.62c.17-.16.38-.24.6-.24h2.04c.23 0 .42.08.58.25c.15.17.23.37.23.61s-.07.44-.22.61s-.35.25-.58.25H5.23c-.23 0-.43-.08-.6-.25a.83.83 0 0 1-.26-.61m2.86 6.93c0-.23.08-.43.23-.61l1.47-1.43c.15-.16.35-.23.59-.23s.44.08.6.23s.24.34.24.57c0 .24-.08.46-.24.64L8.7 22.14q-.615.48-1.23 0a.8.8 0 0 1-.24-.59m0-13.84c0-.23.08-.43.23-.61c.2-.17.41-.25.64-.25c.22 0 .42.08.59.24l1.43 1.47c.16.15.24.35.24.59q0 .36-.24.6c-.24.24-.36.24-.6.24s-.44-.08-.59-.24L7.47 8.32a.84.84 0 0 1-.24-.61m2.55 6.91c0-.93.23-1.8.7-2.6s1.1-1.44 1.91-1.91s1.67-.7 2.6-.7c.7 0 1.37.14 2.02.42c.64.28 1.2.65 1.66 1.12c.47.47.84 1.02 1.11 1.66s.41 1.32.41 2.02c0 .94-.23 1.81-.7 2.61s-1.1 1.43-1.9 1.9s-1.67.7-2.61.7s-1.81-.23-2.61-.7s-1.43-1.1-1.9-1.9c-.45-.81-.69-1.68-.69-2.62m1.7 0c0 .98.34 1.81 1.03 2.5c.68.69 1.51 1.04 2.49 1.04s1.81-.35 2.5-1.04s1.04-1.52 1.04-2.5c0-.96-.35-1.78-1.04-2.47c-.69-.68-1.52-1.02-2.5-1.02c-.97 0-1.8.34-2.48 1.02c-.7.69-1.04 1.51-1.04 2.47m2.66 7.78c0-.24.08-.44.25-.6s.37-.24.6-.24c.24 0 .45.08.61.24s.24.36.24.6v1.99c0 .24-.08.45-.25.62s-.37.25-.6.25s-.44-.08-.6-.25a.85.85 0 0 1-.25-.62zm0-15.5V4.86c0-.23.08-.43.25-.6S14.76 4 15 4s.43.08.6.25s.25.37.25.6V6.9c0 .23-.08.42-.25.58s-.37.23-.6.23s-.44-.08-.6-.23s-.26-.35-.26-.58m5.52 13.18c0-.23.08-.42.23-.56c.15-.16.34-.23.56-.23c.24 0 .44.08.6.23l1.46 1.43c.16.17.24.38.24.61s-.08.43-.24.59q-.6.465-1.2 0l-1.42-1.42a.97.97 0 0 1-.23-.65m0-10.92c0-.25.08-.45.23-.59l1.42-1.47a.84.84 0 0 1 .59-.24c.24 0 .44.08.6.25c.17.17.25.37.25.6c0 .25-.08.46-.24.62l-1.46 1.43q-.27.24-.6.24c-.23 0-.41-.08-.56-.24s-.23-.36-.23-.6m2.26 5.46c0-.24.08-.44.24-.62q.24-.24.57-.24h2.02c.23 0 .43.09.6.26s.26.37.26.6s-.09.43-.26.6s-.37.25-.6.25h-2.02c-.23 0-.43-.08-.58-.25s-.23-.36-.23-.6"
        />
      </svg>
    );
  },

  partlyCloudy: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 30 30"
        color="#5b6670"
        {...props}
      >
        {/* Icon from Weather Icons by Erik Flowers - https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL */}
        <path
          fill="currentColor"
          d="M1.56 16.9q0 1.35.66 2.49c.66 1.14 1.04 1.36 1.8 1.8s1.58.66 2.47.66h10.83c.89 0 1.72-.22 2.48-.66s1.37-1.04 1.81-1.8s.67-1.59.67-2.49c0-.66-.14-1.33-.42-2c.76-.92 1.14-2.03 1.14-3.3c0-.71-.14-1.39-.41-2.04s-.65-1.2-1.12-1.67s-1.02-.85-1.67-1.12c-.65-.28-1.33-.41-2.04-.41c-1.48 0-2.77.58-3.88 1.74q-1.155-.66-2.7-.66c-1.41 0-2.65.44-3.73 1.31a5.8 5.8 0 0 0-2.08 3.35c-1.12.26-2.03.83-2.74 1.73s-1.07 1.92-1.07 3.07m1.71 0c0-.84.28-1.56.84-2.17s1.26-.96 2.1-1.06l.5-.03c.12 0 .19-.06.19-.18l.07-.54c.14-1.08.61-1.99 1.41-2.71c.8-.73 1.74-1.09 2.81-1.09c1.1 0 2.06.37 2.87 1.1a4 4 0 0 1 1.37 2.71l.07.58c.02.11.09.17.21.17h1.61q1.32 0 2.28.96c.64.64.96 1.39.96 2.27c0 .91-.32 1.68-.95 2.32s-1.4.96-2.28.96H6.49c-.88 0-1.63-.32-2.27-.97c-.63-.65-.95-1.42-.95-2.32m6.7-12.27q0 .36.24.63l.66.64c.25.19.46.27.64.25c.21 0 .39-.09.55-.26s.24-.38.24-.62s-.09-.44-.26-.59l-.59-.66a.9.9 0 0 0-.61-.24c-.24 0-.45.08-.62.25c-.17.16-.25.36-.25.6m5.34 4.43c.69-.67 1.51-1 2.45-1c.99 0 1.83.34 2.52 1.03s1.04 1.52 1.04 2.51c0 .62-.17 1.24-.51 1.84c-.97-.96-2.13-1.44-3.49-1.44H17c-.25-1.09-.81-2.07-1.69-2.94m1.63-5.28c0 .26.08.46.23.62s.35.23.59.23c.26 0 .46-.08.62-.23c.16-.16.23-.36.23-.62V1.73c0-.24-.08-.43-.24-.59s-.36-.23-.61-.23c-.24 0-.43.08-.59.23s-.23.35-.23.59zm5.52 2.29c0 .26.07.46.22.62c.21.16.42.24.62.24c.18 0 .38-.08.59-.24l1.43-1.43c.16-.18.24-.39.24-.64q0-.36-.24-.6a.8.8 0 0 0-.59-.24c-.24 0-.43.08-.58.24l-1.47 1.43c-.15.19-.22.39-.22.62m.79 11.84c0 .24.08.45.25.63l.65.63c.15.16.34.24.58.24s.44-.08.6-.25a.86.86 0 0 0 .24-.62c0-.22-.08-.42-.24-.58l-.65-.65a.78.78 0 0 0-.57-.24q-.36 0-.6.24c-.17.16-.26.36-.26.6m1.47-6.31c0 .23.09.42.26.58c.16.16.37.24.61.24h2.04c.23 0 .42-.08.58-.23s.23-.35.23-.59s-.08-.44-.23-.6s-.35-.25-.58-.25h-2.04c-.24 0-.44.08-.61.25a.8.8 0 0 0-.26.6"
        />
      </svg>
    );
  },

  cloudy: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 30 30"
        color="#55616b"
        {...props}
      >
        {/* Icon from Weather Icons by Erik Flowers - https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL */}
        <path
          fill="currentColor"
          d="M3.89 17.6c0-.99.31-1.88.93-2.65s1.41-1.27 2.38-1.49c.26-1.17.85-2.14 1.78-2.88c.93-.75 2-1.12 3.22-1.12c1.18 0 2.24.36 3.16 1.09c.93.73 1.53 1.66 1.8 2.8h.27c1.18 0 2.18.41 3.01 1.24s1.25 1.83 1.25 3c0 1.18-.42 2.18-1.25 3.01s-1.83 1.25-3.01 1.25H8.16c-.58 0-1.13-.11-1.65-.34s-.99-.51-1.37-.89s-.68-.84-.91-1.36s-.34-1.09-.34-1.66m1.45 0c0 .76.28 1.42.82 1.96s1.21.82 1.99.82h9.28c.77 0 1.44-.27 1.99-.82s.83-1.2.83-1.96s-.27-1.42-.83-1.96c-.55-.54-1.21-.82-1.99-.82h-1.39q-.15 0-.15-.15l-.07-.49c-.1-.94-.5-1.73-1.19-2.35s-1.51-.93-2.45-.93s-1.76.31-2.46.94c-.7.62-1.09 1.41-1.18 2.34l-.07.42c0 .1-.05.15-.16.15l-.45.07c-.72.06-1.32.36-1.81.89c-.46.53-.71 1.16-.71 1.89m8.85-8.72c-.1.09-.08.16.07.21c.43.19.79.37 1.08.55c.11.03.19.02.22-.03c.61-.57 1.31-.86 2.12-.86s1.5.27 2.1.81c.59.54.92 1.21.99 2l.09.64h1.42c.65 0 1.21.23 1.68.7s.7 1.02.7 1.66c0 .6-.21 1.12-.62 1.57s-.92.7-1.53.77c-.1 0-.15.05-.15.16v1.13c0 .11.05.16.15.16c1.01-.06 1.86-.46 2.55-1.19s1.04-1.6 1.04-2.6c0-1.06-.37-1.96-1.12-2.7c-.75-.75-1.65-1.12-2.7-1.12h-.15c-.26-1-.81-1.82-1.65-2.47c-.83-.65-1.77-.97-2.8-.97c-1.4-.01-2.57.52-3.49 1.58"
        />
      </svg>
    );
  },

  rain: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 30 30"
        color="#2f5c8a"
        {...props}
      >
        {/* Icon from Weather Icons by Erik Flowers - https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL */}
        <path
          fill="currentColor"
          d="M4.64 16.91c0-1.15.36-2.17 1.08-3.07a4.82 4.82 0 0 1 2.73-1.73c.31-1.36 1.02-2.48 2.11-3.36s2.34-1.31 3.75-1.31c1.38 0 2.6.43 3.68 1.28s1.78 1.95 2.1 3.29h.32c.89 0 1.72.22 2.48.65s1.37 1.03 1.81 1.78s.67 1.58.67 2.47c0 .88-.21 1.69-.63 2.44s-1 1.35-1.73 1.8s-1.53.69-2.4.71c-.13 0-.2-.06-.2-.17v-1.33c0-.12.07-.18.2-.18c.85-.04 1.58-.38 2.18-1.02s.9-1.39.9-2.26s-.33-1.62-.98-2.26s-1.42-.96-2.31-.96h-1.61c-.12 0-.18-.06-.18-.17l-.08-.58a4.08 4.08 0 0 0-1.39-2.71c-.82-.73-1.76-1.09-2.85-1.09s-2.05.36-2.85 1.09a4.02 4.02 0 0 0-1.36 2.71l-.07.53c0 .12-.07.19-.2.19l-.53.03c-.83.1-1.53.46-2.1 1.07s-.85 1.33-.85 2.16c0 .87.3 1.62.9 2.26s1.33.98 2.18 1.02c.11 0 .17.06.17.18v1.33c0 .11-.06.17-.17.17c-1.34-.06-2.47-.57-3.4-1.53s-1.37-2.1-1.37-3.43m5.35 6.69c0-.04.01-.11.04-.2l1.63-5.77a.837.837 0 0 1 1.02-.56c.24.04.42.17.54.37s.15.42.08.67l-1.63 5.73c-.12.43-.4.64-.82.64c-.04 0-.07-.01-.11-.02c-.06-.02-.09-.03-.1-.03a.83.83 0 0 1-.49-.33a.9.9 0 0 1-.16-.5m2.62 2.81l2.44-8.77c.04-.19.14-.34.3-.44s.32-.15.49-.15q.135 0 .27.03c.22.06.38.19.49.39s.13.41.07.64l-2.43 8.78c-.04.17-.13.31-.29.43s-.32.18-.51.18c-.09 0-.18-.02-.25-.05c-.2-.05-.37-.18-.52-.39c-.11-.18-.13-.39-.06-.65m4.13-2.79c0-.04.01-.11.04-.23l1.63-5.77a.83.83 0 0 1 .3-.44c.15-.1.3-.15.46-.15c.08 0 .17.01.26.03c.21.06.36.16.46.31s.15.31.15.47c0 .03-.01.08-.02.14s-.02.1-.02.12l-1.63 5.73c-.04.19-.13.35-.28.46s-.32.17-.51.17l-.24-.05a.8.8 0 0 1-.46-.32a.9.9 0 0 1-.14-.47"
        />
      </svg>
    );
  },

  snow: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 30 30"
        color="#3f6c8d"
        {...props}
      >
        {/* Icon from Weather Icons by Erik Flowers - https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL */}
        <path
          fill="currentColor"
          d="M4.64 16.95c0-1.16.35-2.18 1.06-3.08s1.62-1.48 2.74-1.76q.465-2.04 2.1-3.36c1.635-1.32 2.34-1.31 3.75-1.31c1.38 0 2.6.43 3.68 1.28s1.78 1.95 2.1 3.29h.32c.89 0 1.72.22 2.48.66s1.37 1.04 1.81 1.8s.67 1.59.67 2.48c0 1.32-.46 2.47-1.39 3.42c-.92.96-2.05 1.46-3.38 1.5c-.13 0-.2-.06-.2-.17v-1.33c0-.12.07-.18.2-.18c.85-.04 1.58-.38 2.18-1.02s.9-1.38.9-2.23c0-.89-.32-1.65-.97-2.3s-1.42-.97-2.32-.97h-1.61c-.12 0-.18-.06-.18-.17l-.08-.58c-.11-1.08-.58-1.99-1.39-2.72c-.82-.73-1.76-1.1-2.85-1.1c-1.1 0-2.05.37-2.86 1.11s-1.27 1.65-1.37 2.75l-.06.5c0 .12-.07.19-.2.19l-.53.07c-.83.07-1.53.41-2.1 1.04s-.85 1.35-.85 2.19c0 .85.3 1.59.9 2.23s1.33.97 2.18 1.02c.11 0 .17.06.17.18v1.33c0 .11-.06.17-.17.17c-1.34-.04-2.47-.54-3.4-1.5c-.87-.96-1.33-2.11-1.33-3.43M11 21.02c0-.22.08-.42.24-.58s.35-.24.59-.24c.23 0 .43.08.59.24s.24.36.24.58q0 .36-.24.6c-.16.17-.35.25-.59.25c-.23 0-.43-.08-.59-.25a.8.8 0 0 1-.24-.6m0 3.63q0-.36.24-.6c.16-.15.35-.23.58-.23s.43.08.59.23c.16.16.24.35.24.59s-.08.43-.24.59s-.35.23-.59.23a.84.84 0 0 1-.59-.23a.8.8 0 0 1-.23-.58m3.19-1.7c0-.23.08-.44.25-.62q.24-.24.57-.24c.23 0 .43.09.6.26s.26.37.26.6s-.08.43-.25.6s-.37.25-.61.25c-.23 0-.42-.08-.58-.25s-.24-.37-.24-.6m0-3.62c0-.23.08-.43.25-.6q.27-.24.57-.24c.24 0 .44.08.61.25a.8.8 0 0 1 .25.6c0 .23-.08.43-.25.59s-.37.24-.61.24c-.23 0-.42-.08-.58-.24a.85.85 0 0 1-.24-.6m0 7.28c0-.23.08-.43.25-.61q.24-.24.57-.24c.24 0 .44.08.61.25s.25.37.25.6s-.08.43-.25.59s-.37.24-.61.24a.824.824 0 0 1-.82-.83m3.22-5.59c0-.22.08-.41.25-.58s.37-.25.6-.25s.43.08.59.24s.24.36.24.58q0 .36-.24.6c-.16.17-.35.25-.59.25s-.44-.08-.6-.25a.82.82 0 0 1-.25-.59m0 3.63c0-.22.08-.42.25-.6c.16-.15.36-.23.6-.23s.43.08.59.23s.23.35.23.59s-.08.43-.23.59c-.16.16-.35.23-.59.23q-.36 0-.6-.24a.76.76 0 0 1-.25-.57"
        />
      </svg>
    );
  },

  windy: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 30 30"
        color="#3d6b70"
        {...props}
      >
        {/* Icon from Weather Icons by Erik Flowers - https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL */}
        <path
          fill="currentColor"
          d="M3.1 16.97c0 .24.09.45.28.62c.16.19.37.28.63.28H18.7c.29 0 .53.1.73.3s.3.45.3.74q0 .435-.3.72c-.2.19-.44.29-.74.29c-.29 0-.54-.1-.73-.29a.76.76 0 0 0-.6-.26c-.25 0-.46.09-.64.26s-.27.38-.27.61c0 .25.09.46.28.63c.56.55 1.22.83 1.96.83q1.17 0 2.01-.81c.56-.54.83-1.19.83-1.97s-.28-1.44-.84-2s-1.23-.84-2-.84H4.01a.9.9 0 0 0-.64.26q-.27.255-.27.63m0-3.28c0 .23.09.43.28.61c.17.18.38.26.63.26h20.04c.78 0 1.45-.27 2.01-.82c.56-.54.84-1.2.84-1.97s-.28-1.44-.84-1.99s-1.23-.83-2.01-.83c-.77 0-1.42.27-1.95.8c-.18.16-.27.38-.27.67c0 .26.09.47.26.63q.255.24.63.24q.36 0 .63-.24c.19-.21.42-.31.7-.31c.29 0 .53.1.73.3s.3.44.3.73q0 .435-.3.72c-.2.19-.44.29-.73.29H4.01a.91.91 0 0 0-.91.91"
        />
      </svg>
    );
  },

  hot: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        color="#b54400"
        {...props}
      >
        {/* Icon from Huge Icons by Hugeicons - undefined */}
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        >
          <path
            strokeLinejoin="round"
            d="M16.5 22a4 4 0 0 0 2.902-6.752c-.506-.535-.76-.802-.83-.98c-.072-.179-.072-.415-.072-.886V4a2 2 0 0 0-4 0v9.382c0 .472 0 .707-.071.886c-.071.178-.325.445-.831.98A4 4 0 0 0 16.5 22"
          />
          <path d="M10.313 15.83c-1.635-.288-2.95-1.726-3.11-3.57c-.19-2.184 1.315-4.111 3.36-4.304q.481-.044.937.037M10.22 4l.103 1.187M6.042 7.576l-.858-.765m-.573 5.694L3.5 12.61m3.368 4.477L6.155 18" />
        </g>
      </svg>
    );
  },

  cold: (props: SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        color="#1f5f8b"
        {...props}
      >
        {/* Icon from Huge Icons by Hugeicons - undefined */}
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M17.5 22a4 4 0 0 0 2.902-6.752c-.506-.535-.76-.802-.83-.98c-.072-.179-.072-.415-.072-.886V4a2 2 0 1 0-4 0v9.382c0 .472 0 .707-.071.886c-.071.178-.325.445-.831.98A4 4 0 0 0 17.5 22M9.045 5v3.656m0 0v5.688m0-5.688l2.046-2.031M9.045 8.656L7 6.625m2.045 7.719V18m0-3.656L7 16.375m2.045-2.031l2.046 2.031M4.136 9.469L6.182 11.5m0 0l-2.046 2.031M6.182 11.5H11.5m-5.318 0H2.5"
        />
      </svg>
    );
  },
};

export { icons };
