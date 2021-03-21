/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";

const ClosedPill = ({ className }) => {
  const pill = css`
    background-color: #bbb;
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    user-select: none;
  `;

  return (
    <span css={pill} className={className}>
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
