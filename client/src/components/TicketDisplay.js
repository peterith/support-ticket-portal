/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import StatusPill from "./statusPill";
import CategoryPill from "./categoryPill";
import PriorityDisplay from "./PriorityDisplay";

const TicketDisplay = ({ ticket, onClose, className }) => {
  const displayStyle = css`
    background-color: #222b41;
    color: #fff;
    padding: 40px;
  `;

  const buttonStyle = css`
    float: right;
    color: #fff;
    background-color: transparent;
    border: none;
    font-size: 20px;
    &:hover {
      cursor: pointer;
    }
  `;

  const h2Style = css`
    margin: 20px 0px 40px 0px;
  `;

  const h3Style = css`
    margin: 15px 0px;
  `;

  const gridStyle = css`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 40px;
    align-items: center;
    margin: 40px 0px;
  `;

  const statusPillStyle = css`
    font-size: 0.8rem;
    padding: 8px;
  `;

  const categoryPillStyle = css`
    font-size: 0.8rem;
    padding: 5px 8px;
  `;

  const priorityDisplayStyle = css`
    justify-content: left;
  `;

  return (
    <article
      aria-labelledby="ticket-title"
      css={displayStyle}
      className={className}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="close"
        css={buttonStyle}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <h2 id="ticket-title" css={h2Style}>
        {ticket.title}
      </h2>
      <h3 id="ticket-description" css={h3Style}>
        Description
      </h3>
      <p aria-labelledby="ticket-description">{ticket.description}</p>
      <div css={gridStyle}>
        <strong id="ticket-id">ID</strong>
        <span aria-labelledby="ticket-id">{ticket.id}</span>
        <strong id="ticket-status">Status</strong>
        <span aria-labelledby="ticket-status">
          <StatusPill status={ticket.status} css={statusPillStyle} />
        </span>
        <strong id="ticket-category">Category</strong>
        <span aria-labelledby="ticket-category">
          <CategoryPill category={ticket.category} css={categoryPillStyle} />
        </span>
        <strong id="ticket-priority">Priority</strong>
        <span aria-labelledby="ticket-priority">
          <PriorityDisplay
            priority={ticket.priority}
            css={priorityDisplayStyle}
          />
        </span>
        <strong id="ticket-author">Author</strong>
        <span aria-labelledby="ticket-author">{ticket.author}</span>
        <strong id="ticket-agent">Agent</strong>
        <span aria-labelledby="ticket-agent">{ticket.agent}</span>
        <strong id="ticket-created">Created</strong>
        <span aria-labelledby="ticket-created">
          {new Date(ticket.createdAt).toLocaleString()}
        </span>
        <strong id="ticket-modified">Modified</strong>
        <span aria-labelledby="ticket-modified">
          {new Date(ticket.updatedAt).toLocaleString()}
        </span>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="delete ticket"
        css={buttonStyle}
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
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
  className: PropTypes.string,
};

TicketDisplay.defaultProps = {
  className: "",
};

export default TicketDisplay;
