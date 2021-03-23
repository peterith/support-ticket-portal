/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const Modal = ({ heading, children, onClose }) => {
  const backgroundStyle = css`
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.4);
    width: 100vw;
    height: 100vh;
  `;

  const modalStyle = css`
    width: 400px;
    margin: 0px auto;
    padding: 30px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.3);
    max-height: 50vh;
    overflow-x: hidden;
    overflow-y: auto;
  `;

  const buttonStyle = css`
    float: right;
    background-color: transparent;
    border: none;
    font-size: 20px;
    &:hover {
      cursor: pointer;
    }
  `;

  const headingStyle = css`
    text-align: center;
  `;

  return (
    <div css={backgroundStyle}>
      <div css={modalStyle} aria-labelledby="modal-title">
        <button
          type="button"
          onClick={onClose}
          aria-label="close"
          css={buttonStyle}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 id="modal-title" css={headingStyle}>
          {heading}
        </h2>
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  heading: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
