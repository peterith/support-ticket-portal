/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";

const ClosedPill = ({ className }) => {
  const pillStyle = css`
    background-color: #bbb;
  `;

  return (
    <span css={pillStyle} className={className}>
      Closed
    </span>
  );
};

ClosedPill.propTypes = {
  className: PropTypes.string,
};

ClosedPill.defaultProps = {
  className: "",
};

export default ClosedPill;
