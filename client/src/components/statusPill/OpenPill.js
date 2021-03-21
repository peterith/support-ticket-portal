/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";

const OpenPill = ({ className }) => {
  const pill = css`
    background-color: #3c7;
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    user-select: none;
  `;

  return (
    <span css={pill} className={className}>
      Open
    </span>
  );
};

OpenPill.propTypes = {
  className: PropTypes.string,
};

OpenPill.defaultProps = {
  className: "",
};

export default OpenPill;
