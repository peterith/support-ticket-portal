import { useEffect } from "react";

const useOutsideClick = (ref, callback, condition = true) => {
  const handleClick = (event) => {
    if (condition && ref.current && !ref.current.contains(event.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};

export default useOutsideClick;
