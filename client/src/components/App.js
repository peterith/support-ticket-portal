/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";

const App = () => {
  const appStyle = css`
    display: flex;
    flex-direction: column;
    height: 100vh;
  `;

  const mainStyle = css`
    flex: 1;
  `;

  return (
    <Router>
      <div css={appStyle}>
        <Header />
        <Switch>
          <Route exact path={["/", "/tickets", "/tickets/:id"]}>
            <Main css={mainStyle} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
