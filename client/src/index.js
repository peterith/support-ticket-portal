import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider, ModalProvider } from "./context";
import App from "./components/App";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("app-root")
);
