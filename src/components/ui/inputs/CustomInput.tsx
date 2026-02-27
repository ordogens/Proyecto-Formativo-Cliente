import type { ReactNode } from "react";

interface InputProps {
  label: string;
  name: string;
  type: string;
  value: string;
  placeholder: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomInput = ({
  label,
  name,
  type,
  value,
  placeholder,
  icon,
  rightElement,
  onChange,
}: InputProps) => {
  return (
    <div className="group">
      <label className="block text-sm font-medium text-black dark:text-gray-200">
        {label}
      </label>

      <div className="relative mt-1">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
            {icon}
          </div>
        )}

        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full
            rounded-md
            border
            border-gray-300
            bg-white
            text-gray-900
            placeholder:text-gray-400
            py-2
            text-sm
            shadow-sm
            transition-colors
            focus:outline-none
            focus:border-red-500
            dark:border-gray-600
            dark:bg-gray-800
            dark:text-gray-100
            dark:placeholder:text-gray-400
            ${icon ? "pl-10" : "pl-3"}
            ${rightElement ? "pr-10" : "pr-3"}
          `}
        />

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 group-focus-within:text-red-500 transition-colors">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};
