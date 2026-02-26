import type { ReactNode } from "react";

interface SocialButtonProps {
  icon: ReactNode;
  text: string;
}

export const SocialButton = ({ icon, text }: SocialButtonProps) => {
  return (
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-emerald-600 transition-colors duration-300">
        {icon}
      </div>

      <button
        type="button"
        className="border w-full rounded p-2 transition-all duration-300 text-gray-700 border-gray-300 hover:bg-gray-200"
      >
        {text}
      </button>
    </div>
  );
};