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
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative mt-1">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-md border py-2 text-sm shadow-sm focus:outline-none focus:border-emerald-500 ${
            icon ? "pl-10" : "pl-3"
          } ${rightElement ? "pr-10" : "pr-3"}`}
        />

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};