/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import useModal from "../hooks/useModal";

const App = () => {
  const history = useHistory();
  const [tickets, setTickets] = useState([]);
  const [networkError, setNetworkError] = useState(false);
  const { closeModal } = useModal();

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

  const appStyle = css`
    display: flex;
    flex-direction: column;
    height: 100vh;
  `;

  const mainStyle = css`
    flex: 1;
  `;

  const errorStyle = css`
    text-align: center;
    font-size: 1.2rem;
  `;

  const handleCreateTicket = async (ticket) => {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/tickets`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticket),
      }
    );
    const data = await response.json();

    setTickets((previousTickets) => {
      return [...previousTickets, data];
    });
    closeModal();
    history.push(`/tickets/${data.id}`);
  };

  const handleDeleteTicket = async (ticket) => {
    await fetch(`${process.env.REACT_APP_SERVER_URL}/tickets/${ticket.id}`, {
      method: "DELETE",
    });
    setTickets((previousTickets) => {
      return previousTickets.filter((previousTicket) => {
        return previousTicket.id !== ticket.id;
      });
    });
    closeModal();
    history.push(`/tickets`);
  };

  if (networkError) {
    return (
      <p role="alert" css={errorStyle}>
        Network error, please try again later :(
      </p>
    );
  }

  return (
    <div css={appStyle}>
      <Header onCreateTicket={handleCreateTicket} />
      <Switch>
        <Route exact path={["/tickets", "/tickets/:id"]}>
          <Main
            tickets={tickets}
            onDeleteTicket={handleDeleteTicket}
            css={mainStyle}
          />
        </Route>
        <Route path="*">
          <Redirect to="/tickets" />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
