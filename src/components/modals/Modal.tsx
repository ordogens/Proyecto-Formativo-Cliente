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
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 w-screen h-screen"
      onClick={onClose}
    >
      <div
        className="relative bg-[#f3f0eb] p-8 rounded-2xl flex flex-col gap-2 shadow-xl w-96 border-1 border-red-500"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="size-5 cursor-pointer hover:text-red-500" />
        </button>
        {children}
      </div>
    </div>
  );
};