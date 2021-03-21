/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";
import StatusPill from "../statusPill";
import CategoryPill from "../categoryPill";
import PriorityDisplay from "../PriorityDisplay";

const TableRow = ({ ticket, onClick, selected }) => {
  const trStyle = css`
    transition: background-color 0.5s;
    border-bottom: 2px solid #e0e0e0;
    background-color: ${selected && "#e0e0e0"};
    outline: none;
    &:hover {
      cursor: pointer;
      background-color: #e0e0e0;
    }
  `;

  const tdStyle = css`
    padding: 35px 10px;
  `;

  const handleClick = () => {
    onClick(ticket);
  };

  return (
    <tr onClick={handleClick} css={trStyle}>
      <td css={tdStyle}>{ticket.id}</td>
      <td css={tdStyle}>{ticket.title}</td>
      <td css={tdStyle}>
        <StatusPill status={ticket.status} />
      </td>
      <td css={tdStyle}>
        <CategoryPill category={ticket.category} />
      </td>
      <td css={tdStyle}>
        <PriorityDisplay priority={ticket.priority} />
      </td>
    </tr>
  );
};

TableRow.propTypes = {
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
  onClick: PropTypes.func,
  selected: PropTypes.bool,
};

TableRow.defaultProps = {
  onClick: null,
  selected: false,
};

export default TableRow;
