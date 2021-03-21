/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const Header = () => {
  const headerStyle = css`
    display: flex;
    align-items: center;
    padding: 10px 20px;
    background-color: #222;
    color: #fff;
    height: 80px;
  `;

  const buttonStyle = css`
    background-color: #1a8cff;
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
      background-color: #0073e6;
    }
  `;

  return (
    <header css={headerStyle}>
      <h1>Support Ticket Portal</h1>
      <button type="button" css={buttonStyle}>
        Create
      </button>
    </header>
  );
};

export default Header;
