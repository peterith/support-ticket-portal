/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";
import useModal from "../hooks/useModal";

const Header = ({ onCreateTicket }) => {
  const { openModal } = useModal();

  const headerStyle = css`
    display: flex;
    align-items: center;
    padding: 10px 20px;
    background-color: #222;
    color: #fff;
    height: 80px;
  `;

  const buttonStyle = css`
    background-color: #09f;
    border-radius: 10px;
    padding: 12px;
    margin: 0px 10px 0px auto;
    user-select: none;
    transition: background-color 0.5s;
    color: #fff;
    border: none;
    font-size: 1.1rem;
    &:hover {
      cursor: pointer;
      background-color: #08f;
    }
  `;

  return (
    <header css={headerStyle}>
      <h1>Support Ticket Portal</h1>
      <button
        type="button"
        onClick={openModal({ onSubmit: onCreateTicket })}
        css={buttonStyle}
      >
        Create
      </button>
    </header>
  );
};

Header.propTypes = {
  onCreateTicket: PropTypes.func.isRequired,
};

export default Header;
