import { useContext } from "react";
import { ModalContext } from "../context";

const useModal = () => {
  return useContext(ModalContext);
};

export default useModal;
