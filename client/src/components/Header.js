/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";
import { useAuth, useModal } from "../hooks";
import { ModalTypeEnum, RoleEnum } from "../enums";

const Header = ({ onSignIn, onSignOut, onCreateTicket }) => {
  const { user } = useAuth();
  const { openModal } = useModal();

  const headerStyle = css`
    display: flex;
    align-items: center;
    padding: 10px 20px;
    background-color: #222;
    color: #fff;
    height: 60px;
  `;

  const buttonStyle = css`
    border-radius: 10px;
    padding: 10px;
    user-select: none;
    transition: background-color 0.5s;
    color: #fff;
    border: none;
    font-size: 1rem;
  `;

  const createButtonStyle = css`
    margin-left: 20px;
    background-color: #09f;
    cursor: pointer;
    &:hover {
      background-color: #08f;
    }
  `;

  const disabledButtonStyle = css`
    cursor: not-allowed;
    background-color: #999;
    &:hover {
      background-color: #777;
    }
  `;

  const signInButtonStyle = css`
    margin: 0px 10px 0px auto;
    background-color: #3d3;
    cursor: pointer;
    &:hover {
      background-color: #1c1;
    }
  `;

  const authStyle = css`
    display: flex;
    align-items: center;
    margin: 0px 10px 0px auto;
  `;

  const signOutButtonStyle = css`
    margin-left: 20px;
    background-color: #f77;
    cursor: pointer;
    &:hover {
      background-color: #f55;
    }
  `;

  return (
    <header css={headerStyle}>
      <h1>Support Ticket Portal</h1>
      <button
        type="button"
        onClick={openModal(ModalTypeEnum.CREATE_TICKET_FORM, {
          onSubmit: onCreateTicket,
        })}
        disabled={!user || user.role === RoleEnum.AGENT}
        css={[
          buttonStyle,
          createButtonStyle,
          (!user || user.role === RoleEnum.AGENT) && disabledButtonStyle,
        ]}
      >
        Create
      </button>
      <div css={authStyle}>
        {!user && (
          <button
            type="button"
            onClick={openModal(ModalTypeEnum.SIGN_IN_FORM, {
              onSubmit: onSignIn,
            })}
            css={[buttonStyle, signInButtonStyle]}
          >
            Sign In
          </button>
        )}
        {user && (
          <div>
            <p>
              Signed in as <strong>{user.username}</strong>
            </p>
          </div>
        )}
        {user && (
          <div>
            <button
              type="button"
              onClick={openModal(ModalTypeEnum.CONFIRMATION, {
                message: "Are you sure you want to sign out?",
                onConfirm: onSignOut,
              })}
              css={[buttonStyle, signOutButtonStyle]}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  onSignIn: PropTypes.func.isRequired,
  onSignOut: PropTypes.func.isRequired,
  onCreateTicket: PropTypes.func.isRequired,
};

export default Header;
