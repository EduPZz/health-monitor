import React, { createContext } from "react";

import useAuth from "./hooks/useAuth";

const Context = createContext();

function AuthProvider({ children }) {
  const { authenticated, user, handleLogin, handleLogout, loading } = useAuth();

  return (
    <Context.Provider
      value={{ authenticated, handleLogin, handleLogout, loading, user }}
    >
      {children}
    </Context.Provider>
  );
}

export { Context, AuthProvider };
