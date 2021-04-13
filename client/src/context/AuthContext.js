import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

const AuthProvider = ({ initialUser, children }) => {
  const [user, setUser] = useState(initialUser);

  const signIn = (token) => {
    localStorage.setItem("token", token);
    const claims = JSON.parse(atob(token.split(".")[1]));
    setUser({ username: claims.sub, role: claims.role });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) signIn(token);
  }, []);

  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  initialUser: PropTypes.shape({
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }),
  children: PropTypes.element.isRequired,
};

AuthProvider.defaultProps = {
  initialUser: null,
};

export { AuthContext, AuthProvider };
