/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { PriorityEnum } from "../enums";

const PriorityDisplay = ({ priority, className }) => {
  const displayStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
  `;

  const iconStyle1 = css`
    font-size: 0.9rem;
    color: #a00;
  `;

  const iconStyle2 = css`
    font-size: 1.1rem;
    color: #c00;
  `;

  const iconStyle3 = css`
    font-size: 1.3rem;
    color: #e00;
  `;

  if (!Object.values(PriorityEnum).includes(priority)) {
    return null;
  }

  return (
    <div
      role="img"
      aria-label={`${priority.toLowerCase()} priority`}
      css={displayStyle}
      className={className}
    >
      <FontAwesomeIcon icon={faCircle} css={iconStyle1} />
      {(priority === PriorityEnum.MEDIUM || priority === PriorityEnum.HIGH) && (
        <FontAwesomeIcon icon={faCircle} css={iconStyle2} />
      )}
      {priority === PriorityEnum.HIGH && (
        <FontAwesomeIcon icon={faCircle} css={iconStyle3} />
      )}
    </div>
  );
};

PriorityDisplay.propTypes = {
  priority: PropTypes.string.isRequired,
  className: PropTypes.string,
};

PriorityDisplay.defaultProps = {
  className: "",
};

export default PriorityDisplay;
