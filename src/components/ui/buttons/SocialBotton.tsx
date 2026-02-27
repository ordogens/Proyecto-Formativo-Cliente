import type { ReactNode } from "react";

interface SocialButtonProps {
  icon: ReactNode;
  text: string;
  border?: string;
  bgColor?: string;
}

export const SocialButton = ({
  icon,
  text,
  border,
  bgColor,
}: SocialButtonProps) => {
  return (
    <button
      type="button"
      className="
        group
        grid
        grid-cols-[24px_1fr]
        items-center
        gap-3
        w-full
        rounded
        border
        px-10
        py-2
        text-left
        text-gray-700
        border-zinc-300
        transition-all
        duration-300
        bg-zinc-50
        hover:text-[var(--accent-color)]
        hover:border-[var(--accent-color)]
        hover:bg-[var(--accent-bg)]
        cursor-pointer
      "
      style={
        {
          "--accent-color": border,
          "--accent-bg": bgColor,
        } as React.CSSProperties
      }
    >
      <span className="flex justify-center group-hover:transitio group-hover:duration-200">
        {icon}
      </span>

      <span className="flex justify-center group-hover:transitio group-hover:duration-200">{text}</span>
    </button>
  );
};