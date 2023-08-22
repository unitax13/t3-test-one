import * as React from "react";
import { SVGProps } from "react";
const HeartIconFilled = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14.63 15.75a3.376 3.376 0 1 0 0-6.751 3.376 3.376 0 0 0 0 6.751Z"
      fill="#000"
    />
    <path
      d="M31.5 31.5A4.5 4.5 0 0 1 27 36H9a4.5 4.5 0 0 1-4.5-4.5v-27A4.5 4.5 0 0 1 9 0h12.375L31.5 10.125V31.5ZM9 2.25A2.25 2.25 0 0 0 6.75 4.5V27l5.004-5.004a1.125 1.125 0 0 1 1.373-.169L18 24.75l4.853-6.795a1.125 1.125 0 0 1 1.71-.142L29.25 22.5V10.125h-4.5a3.375 3.375 0 0 1-3.375-3.375v-4.5H9Z"
      fill="#000"
    />
  </svg>
);
export default HeartIconFilled;
