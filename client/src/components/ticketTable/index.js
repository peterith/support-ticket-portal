/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PropTypes from "prop-types";
import TableHead from "./TableHead";
import TableBody from "./TableBody";

const TicketTable = ({ tickets, selectedRow, onClickRow, className }) => {
  const tableStyle = css`
    text-align: center;
    border-collapse: collapse;
    width: 100%;
  `;

  return (
    <table css={tableStyle} className={className}>
      <TableHead />
      <TableBody
        tickets={tickets}
        selectedRow={selectedRow}
        onClickRow={onClickRow}
      />
    </table>
  );
};

TicketTable.propTypes = {
  tickets: PropTypes.arrayOf(
    PropTypes.shape({
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
    })
  ).isRequired,
  selectedRow: PropTypes.number.isRequired,
  onClickRow: PropTypes.func.isRequired,
  className: PropTypes.string,
};

TicketTable.defaultProps = {
  className: "",
};

export default TicketTable;
