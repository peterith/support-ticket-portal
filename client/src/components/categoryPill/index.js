/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";
import { CategoryEnum } from "../../enums";
import BugPill from "./BugPill";
import FeatureRequestPill from "./FeatureRequestPill";
import TechnicalIssuePill from "./TechnicalIssuePill";
import AccountPill from "./AccountPill";

const CategoryPill = ({ category, className }) => {
  const pillStyle = css`
    padding: 8px 10px;
    border: 2px solid;
    border-radius: 10px;
    user-select: none;
    font-weight: bold;
    white-space: nowrap;
  `;

  switch (category) {
    case CategoryEnum.BUG:
      return <BugPill css={pillStyle} className={className} />;
    case CategoryEnum.FEATURE_REQUEST:
      return <FeatureRequestPill css={pillStyle} className={className} />;
    case CategoryEnum.TECHNICAL_ISSUE:
      return <TechnicalIssuePill css={pillStyle} className={className} />;
    case CategoryEnum.ACCOUNT:
      return <AccountPill css={pillStyle} className={className} />;
    default:
      return null;
  }
};

CategoryPill.propTypes = {
  category: PropTypes.string.isRequired,
  className: PropTypes.string,
};

CategoryPill.defaultProps = {
  className: "",
};

export default CategoryPill;
