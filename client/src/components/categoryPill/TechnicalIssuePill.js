/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";

const TechnicalIssuePill = ({ className }) => {
  const pillStyle = css`
    padding: 10px 15px;
    border: 3px solid #72d;
    border-radius: 10px;
    color: #72d;
    user-select: none;
    font-weight: bold;
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
