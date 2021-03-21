/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";

const AccountPill = ({ className }) => {
  const pill = css`
    padding: 10px 15px;
    border: 3px solid #384;
    border-radius: 10px;
    color: #384;
    user-select: none;
    font-weight: bold;
  `;

  return (
    <span css={pill} className={className}>
      ACCOUNT
    </span>
  );
};

AccountPill.propTypes = {
  className: PropTypes.string,
};

AccountPill.defaultProps = {
  className: "",
};

export default AccountPill;
