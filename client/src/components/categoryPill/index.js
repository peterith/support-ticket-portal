import PropTypes from "prop-types";
import { CategoryEnum } from "../../enums";
import BugPill from "./BugPill";
import FeatureRequestPill from "./FeatureRequestPill";
import TechnicalIssuePill from "./TechnicalIssuePill";
import AccountPill from "./AccountPill";

const CategoryPill = ({ category, className }) => {
  switch (category) {
    case CategoryEnum.BUG:
      return <BugPill className={className} />;
    case CategoryEnum.FEATURE_REQUEST:
      return <FeatureRequestPill className={className} />;
    case CategoryEnum.TECHNICAL_ISSUE:
      return <TechnicalIssuePill className={className} />;
    case CategoryEnum.ACCOUNT:
      return <AccountPill className={className} />;
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
