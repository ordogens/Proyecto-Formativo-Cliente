import { Modal } from "../modals/Modal";
import { Invoice } from "./Invoice";

interface InvoiceProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal = ({ isOpen, onClose }: InvoiceProps) => {

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Invoice onClose={onClose} />
    </Modal>
  );
};
