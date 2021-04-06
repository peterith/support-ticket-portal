/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";

const BugPill = ({ className }) => {
  const pillStyle = css`
    color: #a21;
  `;

  return (
    <span css={pillStyle} className={className}>
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
