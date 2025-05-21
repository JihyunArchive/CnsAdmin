import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import Main from "./main/Main";
import UserList from "./user/UserList";
import Layout from "./common/Layout";

import "./Login/Login.css";
import "./main/Main.css";
import "./user/UserList.css";
import "./common/Layout.css";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      {isLoggedIn ? (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Main />} />
            <Route path="users" element={<UserList />} />
          </Route>
        </Routes>
      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} />
      )}
    </Router>
  );
}
