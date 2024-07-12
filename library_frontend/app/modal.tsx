// Modal.tsx
import React from 'react';
import Modal from 'react-modal';
import { useAppContext } from './Context';

interface ModalProps {
  children: React.ReactNode;
}

// will go back if context doesn't work
// const ModalDialog: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
const ModalDialog: React.FC<ModalProps> = ({ children }) => {

    const { state,
            closeModal 
            } = useAppContext();
    const title = state.modalType === 'add' ? "Add Book" : state.modalType === 'edit' ? "Edit Book" : "Delete Book"

  return (
    <Modal
      isOpen={state.modalIsOpen}
      onRequestClose={closeModal}
      contentLabel={title}
      ariaHideApp={false} // Disable aria-hidden error
    >
      <div className="modal-header">
        <h2>{title}</h2>
        <button onClick={closeModal}>Close</button>
      </div>
      <div className="modal-body">{children}</div>
    </Modal>
  );
};

export default ModalDialog;
