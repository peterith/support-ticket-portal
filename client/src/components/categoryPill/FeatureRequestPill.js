/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";

const FeatureRequestPill = ({ className }) => {
  const pillStyle = css`
    color: #567;
  `;

  return (
    <span css={pillStyle} className={className}>
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
