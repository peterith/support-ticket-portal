/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";

const InProgressPill = ({ className }) => {
  const pill = css`
    background-color: #06a;
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    user-select: none;
  `;

  return (
    <span css={pill} className={className}>
      In Progress
    </span>
  );
};

InProgressPill.propTypes = {
  className: PropTypes.string,
};

InProgressPill.defaultProps = {
  className: "",
};

export default InProgressPill;
