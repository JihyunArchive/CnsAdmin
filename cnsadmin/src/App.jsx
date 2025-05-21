import React, { useState } from "react";
import Login from "./Login/Login";
import Main from "./main/Main";
import "./Login/Login.css";
import "./main/Main.css";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return isLoggedIn ? (
    <Main />
  ) : (
    <Login onLogin={() => setIsLoggedIn(true)} />
  );
}
