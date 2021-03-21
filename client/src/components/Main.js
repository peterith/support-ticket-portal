/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import TicketTable from "./ticketTable";
import TicketDisplay from "./TicketDisplay";

const Main = ({ className }) => {
  const { id } = useParams();
  const history = useHistory();
  const [tickets, setTickets] = useState([]);
  const [networkError, setNetworkError] = useState(false);

  const selectedTicket = useMemo(() => {
    return tickets.find((ticket) => ticket.id === Number(id));
  }, [tickets, id]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/tickets`
        );
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        setNetworkError(true);
      }
    })();
  }, []);

  const handleClickRow = (ticket) => {
    history.push(`/tickets/${ticket.id}`);
  };

  const handleClickClose = () => {
    history.push(`/tickets`);
  };

  const mainStyle = css`
    display: flex;
  `;

  const tableStyle = css`
    flex: 1 1;
  `;

  const displayStyle = css`
    flex: 0 0 400px;
  `;

  const errorStyle = css`
    text-align: center;
    font-size: 1.2rem;
  `;

  const tableInfoStyle = css`
    text-align: center;
    font-size: 1.1rem;
  `;

  if (networkError) {
    return (
      <p role="alert" css={errorStyle}>
        Network error, please try again later :(
      </p>
    );
  }

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
          css={displayStyle}
        />
      )}
    </main>
  );
};

Main.propTypes = {
  className: PropTypes.string,
};

Main.defaultProps = {
  className: "",
};

export default Main;
