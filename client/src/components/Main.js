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
    const status = query.get("status");
    let newFilteredTickets = status
      ? tickets.filter((ticket) => ticket.status === status)
      : tickets;

    const category = query.get("category");
    newFilteredTickets = category
      ? newFilteredTickets.filter((ticket) => ticket.category === category)
      : newFilteredTickets;

    const priority = query.get("priority");
    newFilteredTickets = priority
      ? newFilteredTickets.filter((ticket) => ticket.priority === priority)
      : newFilteredTickets;

    let search = query.get("search");
    if (search) {
      search = search.toLowerCase().trim();
      newFilteredTickets = newFilteredTickets.filter(
        (ticket) =>
          ticket.id.toString().includes(search) ||
          ticket.title.toLowerCase().includes(search) ||
          ticket.description.toLowerCase().includes(search) ||
          ticket.author.toLowerCase().includes(search) ||
          ticket.agent?.toLowerCase().includes(search)
      );
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

  const handleFilter = ({ status, category, priority, search }) => {
    let path = id ? `/tickets/${id}` : "/tickets";
    query.delete("status");
    query.delete("category");
    query.delete("priority");
    query.delete("search");

    if (status) query.append("status", status);
    if (category) query.append("category", category);
    if (priority) query.append("priority", priority);
    if (search) query.append("search", search);

    path = path.concat(`?${query.toString()}`);
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
          initialSearch={query.get("search")}
          initialStatus={query.get("status")}
          initialCategory={query.get("category")}
          initialPriority={query.get("priority")}
          onFilter={handleFilter}
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
