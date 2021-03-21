import PropTypes from "prop-types";
import { StatusEnum } from "../../enums";
import OpenPill from "./OpenPill";
import InProgressPill from "./InProgressPill";
import ResolvedPill from "./ResolvedPill";
import ClosedPill from "./ClosedPill";

const StatusPill = ({ status, className }) => {
  switch (status) {
    case StatusEnum.OPEN:
      return <OpenPill className={className} />;
    case StatusEnum.IN_PROGRESS:
      return <InProgressPill className={className} />;
    case StatusEnum.RESOLVED:
      return <ResolvedPill className={className} />;
    case StatusEnum.CLOSED:
      return <ClosedPill className={className} />;
    default:
      return null;
  }
};

StatusPill.propTypes = {
  status: PropTypes.string.isRequired,
  className: PropTypes.string,
};

StatusPill.defaultProps = {
  className: "",
};

export default StatusPill;
