import { createContext, useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import CreateTicketForm from "../components/CreateTicketForm";
import Modal from "../components/Modal";

const ModalContext = createContext();

const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formProps, setFormProp] = useState();

  const openModal = (newFormProps) => () => {
    setFormProp(newFormProps);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setFormProp(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {isOpen &&
        createPortal(
          <Modal heading="Create ticket" onClose={closeModal}>
            <CreateTicketForm onSubmit={formProps.onSubmit} />
          </Modal>,
          document.getElementById("modal-root")
        )}
      {children}
    </ModalContext.Provider>
  );
};

ModalProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export { ModalContext, ModalProvider };
