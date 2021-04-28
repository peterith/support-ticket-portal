/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";

const InProgressPill = ({ className }) => {
  const pillStyle = css`
    background-color: #06a;
  `;

  return (
    <span css={pillStyle} className={className}>
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
