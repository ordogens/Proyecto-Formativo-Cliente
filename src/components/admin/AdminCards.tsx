import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  icon: LucideIcon;
  value: string | number;
  description?: string;
}

export const AdminCards = ({
  title,
  icon: Icon,
  value,
  description,
}: Props) => {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-zinc-300 bg-white p-4 w-full">
      <div className="flex justify-between items-center">
        <p className="text-sm text-zinc-500">{title}</p>
        <Icon className="h-4 w-4 text-zinc-400" />
      </div>

      <div className="mt-2">
        <p className="text-2xl font-bold">{value}</p>
        {description && (
          <p className="text-xs text-zinc-400">{description}</p>
        )}
      </div>
    </div>
  );
};
