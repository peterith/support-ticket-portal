import { createContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import CreateTicketForm from "../components/CreateTicketForm";
import DeleteConfirmation from "../components/DeleteConfirmation";
import Modal from "../components/Modal";
import { ModalTypeEnum } from "../enums";

const ModalContext = createContext();

const ModalProvider = ({ children }) => {
  const [modalType, setModalType] = useState();
  const [contentProps, setContentProps] = useState();

  const Content = useMemo(() => {
    switch (modalType) {
      case ModalTypeEnum.CREATE_TICKET_FORM:
        return CreateTicketForm;
      case ModalTypeEnum.DELETE_CONFIRMATION:
        return DeleteConfirmation;
      default:
        return null;
    }
  }, [modalType]);

  const title = useMemo(() => {
    switch (modalType) {
      case ModalTypeEnum.CREATE_TICKET_FORM:
        return "Create ticket";
      case ModalTypeEnum.DELETE_CONFIRMATION:
        return "Delete ticket";
      default:
        return null;
    }
  }, [modalType]);

  const openModal = (newModalType, newFormProps) => () => {
    setContentProps(newFormProps);
    setModalType(newModalType);
  };

  const closeModal = () => {
    setModalType(null);
  };

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
      }}
    >
      {modalType &&
        createPortal(
          <Modal heading={title} onClose={closeModal}>
            <Content {...contentProps} />
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
