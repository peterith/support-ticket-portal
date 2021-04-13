/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import { useAuth, useModal } from "../hooks";

const App = () => {
  const history = useHistory();
  const [tickets, setTickets] = useState([]);
  const [networkError, setNetworkError] = useState(false);
  const { signIn, signOut } = useAuth();
  const { closeModal } = useModal();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/tickets`
        );

        if (response.status === 200) {
          const data = await response.json();
          setTickets(data);
        } else {
          setNetworkError(true);
        }
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

  const handleSignIn = async (form) => {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/authenticate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      signIn(data.token);
      closeModal();
    } else if (response.status === 401) {
      throw new Error("Invalid username or password");
    }
  };

  const handleSignOut = () => {
    signOut();
    closeModal();
  };

  const handleCreateTicket = async (form) => {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/tickets`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      setTickets((previousTickets) => [...previousTickets, data]);
      closeModal();
      history.push(`/tickets/${data.id}`);
    }
  };

  const handleDeleteTicket = async (ticket) => {
    closeModal();
    await fetch(`${process.env.REACT_APP_SERVER_URL}/tickets/${ticket.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setTickets((previousTickets) => {
      return previousTickets.filter((previousTicket) => {
        return previousTicket.id !== ticket.id;
      });
    });
    history.push(`/tickets`);
  };

  const handleUpdateTicket = async (id, ticket) => {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/tickets/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(ticket),
      }
    );
    const data = await response.json();

    if (response.ok) {
      setTickets((previousTickets) =>
        previousTickets.map((previousTicket) =>
          previousTicket.id === id ? data : previousTicket
        )
      );
    }
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
      <Header
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onCreateTicket={handleCreateTicket}
      />
      <Switch>
        <Route exact path={["/tickets", "/tickets/:id"]}>
          <Main
            tickets={tickets}
            onDeleteTicket={handleDeleteTicket}
            onUpdateTicket={handleUpdateTicket}
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
