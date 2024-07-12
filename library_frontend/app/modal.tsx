// Modal.tsx
import React from 'react';
import Modal from 'react-modal';
import { useAppContext } from './Context';

interface ModalProps {
  //isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// will go back if context doesn't work
// const ModalDialog: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
const ModalDialog: React.FC<ModalProps> = ({ onClose, title, children }) => {

    const { state } = useAppContext();

  return (
    <Modal
      isOpen={state.modalIsOpen}
      onRequestClose={onClose}
      contentLabel={title}
      ariaHideApp={false} // Disable aria-hidden error
    >
      <div className="modal-header">
        <h2>{title}</h2>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="modal-body">{children}</div>
    </Modal>
  );
};

export default ModalDialog;
