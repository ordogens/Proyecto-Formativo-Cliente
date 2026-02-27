import type { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 dark:bg-black/80 flex justify-center items-center z-50 w-screen h-screen"
      onClick={onClose}
    >
      <div
        className="relative bg-[#f3f0eb] dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 p-8 rounded-2xl flex flex-col gap-2 shadow-xl w-96 border border-red-500 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <X className="size-5 cursor-pointer hover:text-red-500" />
        </button>
        {children}
      </div>
    </div>
  );
};
