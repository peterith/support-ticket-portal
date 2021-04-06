import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { ModalProvider } from "./context/ModalContext";
import App from "./components/App";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ModalProvider>
        <App />
      </ModalProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("app-root")
);
