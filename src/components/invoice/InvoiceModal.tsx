import { Modal } from "../modals/Modal";
import { Invoice } from "./Invoice";
import type { ApiFactura } from "../../types/api.types";

interface InvoiceProps {
  isOpen: boolean;
  onClose: () => void;
  factura: ApiFactura | null;
}

export const InvoiceModal = ({ isOpen, onClose, factura }: InvoiceProps) => {
  if (!factura) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Invoice onClose={onClose} factura={factura} />
    </Modal>
  );
};
