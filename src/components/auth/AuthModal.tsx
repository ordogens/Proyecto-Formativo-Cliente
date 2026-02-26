import { Modal } from "../modals/Modal";
import { AuthForm } from "./AuthForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  }

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <AuthForm onSuccess={onClose} />
    </Modal>
  );
};