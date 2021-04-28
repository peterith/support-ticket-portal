/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useMemo, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import TicketTable from "./ticketTable";
import TicketDisplay from "./TicketDisplay";
import SearchFilter from "./SearchFilter";

const Main = ({ tickets, onDeleteTicket, onUpdateTicket, className }) => {
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [filteredTickets, setFilteredTickets] = useState(tickets);
  const query = useMemo(() => new URLSearchParams(location.search), [location]);

  useEffect(() => {
    let newFilteredTickets = tickets;

    const status = query.get("status");
    if (status) {
      newFilteredTickets = tickets.filter((ticket) => ticket.status === status);
    }

    setFilteredTickets(newFilteredTickets);
  }, [tickets, query]);

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

  const handleFilterByStatus = (newStatus) => {
    let path = "/tickets";

    if (id) {
      path = path.concat(`/${id}`);
    }

    query.delete("status");

    if (newStatus) {
      query.append("status", newStatus);
      path = path.concat(`?${query.toString()}`);
    }

    history.push(path);
  };

  const handleClickRow = (ticket) => {
    history.push(`/tickets/${ticket.id}?${query.toString()}`);
  };

  const handleClickClose = () => {
    history.push(`/tickets?${query.toString()}`);
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
        <SearchFilter
          status={query.get("status")}
          onFilterByStatus={handleFilterByStatus}
        />
        <TicketTable
          tickets={filteredTickets}
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
