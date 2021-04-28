/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import TicketTable from "./ticketTable";
import TicketDisplay from "./TicketDisplay";

const Main = ({ tickets, onDeleteTicket, onUpdateTicket, className }) => {
  const { id } = useParams();
  const history = useHistory();

  const selectedTicket = useMemo(() => {
    return tickets.find((ticket) => ticket.id === Number(id));
  }, [tickets, id]);

  const mainStyle = css`
    display: flex;
  `;

  const tableStyle = css`
    flex: 1 1;
  `;

  const displayStyle = css`
    flex: 0 0 300px;
  `;

  const tableInfoStyle = css`
    text-align: center;
  `;

  const handleClickRow = (ticket) => {
    history.push(`/tickets/${ticket.id}`);
  };

  const handleClickClose = () => {
    history.push(`/tickets`);
  };

  const handleUpdate = (field) => async (value) => {
    const updatedTicket = {
      title: selectedTicket.title,
      description: selectedTicket.description,
      status: selectedTicket.status,
      category: selectedTicket.category,
      priority: selectedTicket.priority,
      agent: selectedTicket.agent,
      [field]: value,
    };

    await onUpdateTicket(selectedTicket.id, updatedTicket);
  };

  return (
    <main css={mainStyle} className={className}>
      <div css={tableStyle}>
        <TicketTable
          tickets={tickets}
          selectedRow={Number(id)}
          onClickRow={handleClickRow}
        />
        <p css={tableInfoStyle}>
          <span id="total-ticket">Total tickets:</span>{" "}
          <span aria-labelledby="total-ticket">{tickets.length}</span>
        </p>
      </div>
      {selectedTicket && (
        <TicketDisplay
          ticket={selectedTicket}
          onClose={handleClickClose}
          onDelete={onDeleteTicket}
          onUpdateDescription={handleUpdate("description")}
          onUpdateStatus={handleUpdate("status")}
          onUpdateCategory={handleUpdate("category")}
          onUpdatePriority={handleUpdate("priority")}
          onUpdateAgent={handleUpdate("agent")}
          css={displayStyle}
        />
      )}
    </main>
  );
};

Main.propTypes = {
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
  onDeleteTicket: PropTypes.func.isRequired,
  onUpdateTicket: PropTypes.func.isRequired,
  className: PropTypes.string,
};

Main.defaultProps = {
  className: "",
};

export default Main;
