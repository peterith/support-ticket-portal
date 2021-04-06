/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";

const AccountPill = ({ className }) => {
  const pillStyle = css`
    color: #384;
  `;

  return (
    <span css={pillStyle} className={className}>
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
