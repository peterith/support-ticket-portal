import { createContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { SignInForm, CreateTicketForm } from "../components/forms";
import Confirmation from "../components/Confirmation";
import Modal from "../components/Modal";
import { ModalTypeEnum } from "../enums";

const ModalContext = createContext();

const ModalProvider = ({ children }) => {
  const [modalType, setModalType] = useState();
  const [contentProps, setContentProps] = useState();

  const Content = useMemo(() => {
    switch (modalType) {
      case ModalTypeEnum.SIGN_IN_FORM:
        return SignInForm;
      case ModalTypeEnum.CREATE_TICKET_FORM:
        return CreateTicketForm;
      case ModalTypeEnum.CONFIRMATION:
        return Confirmation;
      default:
        return null;
    }
  }, [modalType]);

  const title = useMemo(() => {
    switch (modalType) {
      case ModalTypeEnum.SIGN_IN_FORM:
        return "Sign In";
      case ModalTypeEnum.CREATE_TICKET_FORM:
        return "Create Ticket";
      case ModalTypeEnum.CONFIRMATION:
        return "Confirmation";
      default:
        return null;
    }
  }, [modalType]);

  const openModal = (newModalType, newContentProps) => () => {
    setContentProps(newContentProps);
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
