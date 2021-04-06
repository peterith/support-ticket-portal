/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { EditableSelect, EditableTextArea } from "./editables";
import StatusPill from "./statusPill";
import CategoryPill from "./categoryPill";
import PriorityDisplay from "./PriorityDisplay";
import { useModal } from "../hooks";
import {
  CategoryEnum,
  ModalTypeEnum,
  PriorityEnum,
  StatusEnum,
} from "../enums";

const TicketDisplay = ({
  ticket,
  onClose,
  onDelete,
  onUpdateDescription,
  onUpdateStatus,
  onUpdateCategory,
  onUpdatePriority,
  className,
}) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const { openModal } = useModal();

  useEffect(() => {
    setErrorMessage(null);
  }, [ticket]);

  const displayStyle = css`
    background-color: #222b41;
    color: #fff;
    padding: 40px;
  `;

  const buttonStyle = css`
    color: #fff;
    background-color: transparent;
    border: none;
    font-size: 20px;
    &:hover {
      cursor: pointer;
    }
  `;

  const closeButtonStyle = css`
    float: right;
  `;

  const h2Style = css`
    margin: 20px 0px 40px 0px;
  `;

  const h3Style = css`
    padding: 0px 10px;
    margin: 15px 0px;
  `;

  const gridStyle = css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: minmax(40px, auto);
    margin: 40px 0px;
  `;

  const cellStyle = css`
    display: flex;
    align-items: center;
    padding: 0px 10px;
  `;

  const statusPillStyle = css`
    font-size: 0.8rem;
    padding: 7px;
    border-radius: 7px;
  `;

  const categoryPillStyle = css`
    font-size: 0.8rem;
    padding: 6px 8px;
    border: 1px solid;
    border-radius: 7px;
  `;

  const priorityDisplayStyle = css`
    justify-content: left;
  `;

  const errorStyle = css`
    background-color: #86e;
    border-radius: 5px;
    text-align: center;
    padding: 10px;
    margin-top: 15px;
    color: #fff;
  `;

  const onConfirm = async () => {
    try {
      onDelete(ticket);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <article
      aria-labelledby="ticket-title"
      css={[displayStyle]}
      className={className}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="close"
        css={[buttonStyle, closeButtonStyle]}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <h2 id="ticket-title" css={h2Style}>
        {ticket.title}
      </h2>
      <h3 id="ticket-description" css={h3Style}>
        Description
      </h3>
      <EditableTextArea
        onBlur={onUpdateDescription}
        ariaLabelledBy="ticket-description"
      >
        {ticket.description}
      </EditableTextArea>
      <div css={gridStyle}>
        <div id="ticket-id" css={cellStyle}>
          <strong>ID</strong>
        </div>
        <div aria-labelledby="ticket-id" css={cellStyle}>
          {ticket.id}
        </div>
        <div id="ticket-status" css={cellStyle}>
          <strong>Status</strong>
        </div>
        <EditableSelect
          options={[
            { label: "Open", value: StatusEnum.OPEN },
            { label: "In Progress", value: StatusEnum.IN_PROGRESS },
            { label: "Resolved", value: StatusEnum.RESOLVED },
            { label: "Closed", value: StatusEnum.CLOSED },
          ]}
          onChange={onUpdateStatus}
          ariaLabelledBy="ticket-status"
        >
          <StatusPill status={ticket.status} css={statusPillStyle} />
        </EditableSelect>
        <div id="ticket-category" css={cellStyle}>
          <strong>Category</strong>
        </div>
        <EditableSelect
          options={[
            { label: "Bug", value: CategoryEnum.BUG },
            { label: "Feature Request", value: CategoryEnum.FEATURE_REQUEST },
            { label: "Technical Issue", value: CategoryEnum.TECHNICAL_ISSUE },
            { label: "Account", value: CategoryEnum.ACCOUNT },
          ]}
          onChange={onUpdateCategory}
          ariaLabelledBy="ticket-category"
        >
          <CategoryPill category={ticket.category} css={categoryPillStyle} />
        </EditableSelect>
        <div id="ticket-priority" css={cellStyle}>
          <strong>Priority</strong>
        </div>
        <EditableSelect
          options={[
            { label: "Low", value: PriorityEnum.LOW },
            { label: "Medium", value: PriorityEnum.MEDIUM },
            { label: "High", value: PriorityEnum.HIGH },
          ]}
          onChange={onUpdatePriority}
          ariaLabelledBy="ticket-priority"
        >
          <PriorityDisplay
            priority={ticket.priority}
            css={priorityDisplayStyle}
          />
        </EditableSelect>
        <div id="ticket-author" css={cellStyle}>
          <strong>Author</strong>
        </div>
        <span aria-labelledby="ticket-author" css={cellStyle}>
          {ticket.author}
        </span>
        <div id="ticket-agent" css={cellStyle}>
          <strong>Agent</strong>
        </div>
        <span aria-labelledby="ticket-agent" css={cellStyle}>
          {ticket.agent}
        </span>
        <div id="ticket-created" css={cellStyle}>
          <strong>Created</strong>
        </div>
        <span aria-labelledby="ticket-created" css={cellStyle}>
          {new Date(ticket.createdAt).toLocaleString()}
        </span>
        <div id="ticket-modified" css={cellStyle}>
          <strong>Modified</strong>
        </div>
        <span aria-labelledby="ticket-modified" css={cellStyle}>
          {new Date(ticket.updatedAt).toLocaleString()}
        </span>
      </div>
      <button
        type="button"
        onClick={openModal(ModalTypeEnum.DELETE_CONFIRMATION, { onConfirm })}
        aria-label="delete"
        css={buttonStyle}
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
      {errorMessage && (
        <div role="alert" css={errorStyle}>
          {errorMessage}
        </div>
      )}
    </article>
  );
};

TicketDisplay.propTypes = {
  ticket: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    agent: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdateDescription: PropTypes.func.isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
  onUpdateCategory: PropTypes.func.isRequired,
  onUpdatePriority: PropTypes.func.isRequired,
  className: PropTypes.string,
};

TicketDisplay.defaultProps = {
  className: "",
};

export default TicketDisplay;
