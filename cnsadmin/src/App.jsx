import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Login from "./Login/Login";
import Main from "./main/Main";
import UserList from "./user/UserList";
import Layout from "./common/Layout";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/* 로그인 전에는 login 페이지만 보이게 */}
        {!isLoggedIn && (
          <>
            <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}

        {/* 로그인 후에는 Layout 하위 라우팅 */}
        {isLoggedIn && (
          <>
            <Route path="/" element={<Layout />}>
              <Route index element={<Main />} />
              <Route path="users" element={<UserList />} />
            </Route>
            {/* 로그인된 상태에서 /login 접근하면 메인으로 보내기 */}
            <Route path="/login" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
