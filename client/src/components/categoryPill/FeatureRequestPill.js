/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";

const FeatureRequestPill = ({ className }) => {
  const pill = css`
    padding: 10px 15px;
    border: 3px solid #567;
    border-radius: 10px;
    color: #567;
    user-select: none;
    font-weight: bold;
  `;

  return (
    <span css={pill} className={className}>
      FEATURE REQUEST
    </span>
  );
};

FeatureRequestPill.propTypes = {
  className: PropTypes.string,
};

FeatureRequestPill.defaultProps = {
  className: "",
};

export default FeatureRequestPill;
