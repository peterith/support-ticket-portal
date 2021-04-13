/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";

const Confirmation = ({ message, onConfirm }) => {
  const buttonStyle = css`
    float: right;
    background-color: #f77;
    border-radius: 5px;
    padding: 10px;
    user-select: none;
    transition: background-color 0.5s;
    color: #fff;
    border: none;
    font-size: 1rem;
    cursor: pointer;
    &:hover {
      background-color: #f55;
    }
  `;

  const textStyle = css`
    margin: 30px;
  `;

  return (
    <div>
      <p css={textStyle}>{message}</p>
      <button type="button" onClick={onConfirm} css={buttonStyle}>
        Confirm
      </button>
    </div>
  );
};

Confirmation.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default Confirmation;
