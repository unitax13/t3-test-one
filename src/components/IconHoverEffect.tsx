import { ReactNode } from "react";

type IconHoverEffectProps = {
  children: ReactNode;
  red?: boolean;
};

export function IconHoverEffect({
  children,
  red = false,
}: IconHoverEffectProps) {
  const colorClasses = red
    ? "outline-rose-500 hover:bg-rose-300 group-hover:bg-rose-300 group-focus-visible:bg-rose-300 focus-visible:bg-rose-300"
    : "outline-gray-500 hover:bg-gray-300 group-hover:bg-gray-300 group-focus-visible:bg-gray-300 focus-visible:bg-gray-300";

  return (
    <div
      className={`rounded-full p-2 transition-colors duration-200 ${colorClasses}`}
    >
      {children}
    </div>
  );
}
