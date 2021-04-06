/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";
import { StatusEnum } from "../../enums";
import OpenPill from "./OpenPill";
import InProgressPill from "./InProgressPill";
import ResolvedPill from "./ResolvedPill";
import ClosedPill from "./ClosedPill";

const StatusPill = ({ status, className }) => {
  const pillStyle = css`
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    user-select: none;
    white-space: nowrap;
  `;

  switch (status) {
    case StatusEnum.OPEN:
      return <OpenPill css={pillStyle} className={className} />;
    case StatusEnum.IN_PROGRESS:
      return <InProgressPill css={pillStyle} className={className} />;
    case StatusEnum.RESOLVED:
      return <ResolvedPill css={pillStyle} className={className} />;
    case StatusEnum.CLOSED:
      return <ClosedPill css={pillStyle} className={className} />;
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
