/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";

const TechnicalIssuePill = ({ className }) => {
  const pillStyle = css`
    color: #72d;
  `;

  return (
    <span css={pillStyle} className={className}>
      TECHNICAL ISSUE
    </span>
  );
};

TechnicalIssuePill.propTypes = {
  className: PropTypes.string,
};

TechnicalIssuePill.defaultProps = {
  className: "",
};

export default TechnicalIssuePill;
