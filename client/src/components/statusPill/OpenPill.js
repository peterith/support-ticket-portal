/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";

const OpenPill = ({ className }) => {
  const pillStyle = css`
    background-color: #3c7;
  `;

  return (
    <span css={pillStyle} className={className}>
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
