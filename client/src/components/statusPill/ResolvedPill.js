/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";

const ResolvedPill = ({ className }) => {
  const pillStyle = css`
    background-color: #f88;
  `;

  return (
    <span css={pillStyle} className={className}>
      Resolved
    </span>
  );
};

ResolvedPill.propTypes = {
  className: PropTypes.string,
};

ResolvedPill.defaultProps = {
  className: "",
};

export default ResolvedPill;
