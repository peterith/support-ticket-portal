import PropTypes from "prop-types";
import TableRow from "./TableRow";

const TableBody = ({ tickets, selectedRow, onClickRow }) => {
  return (
    <tbody>
      {tickets.map((ticket) => (
        <TableRow
          key={ticket.id}
          ticket={ticket}
          selected={selectedRow === ticket.id}
          onClick={onClickRow}
        />
      ))}
    </tbody>
  );
};

TableBody.propTypes = {
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
};

export default TableBody;
