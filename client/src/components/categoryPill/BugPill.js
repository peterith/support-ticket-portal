/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";

const BugPill = ({ className }) => {
  const pill = css`
    padding: 10px 15px;
    border: 3px solid #a21;
    border-radius: 10px;
    color: #a21;
    user-select: none;
    font-weight: bold;
  `;

  return (
    <span css={pill} className={className}>
      BUG
    </span>
  );
};

BugPill.propTypes = {
  className: PropTypes.string,
};

BugPill.defaultProps = {
  className: "",
};

export default BugPill;
