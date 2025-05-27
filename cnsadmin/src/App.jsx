// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./Login/Login";
import Main from "./main/Main";
import PostList from "./community/PostList";
import PostDetail from "./community/PostDetail";
import UserList from "./user/UserList";
import UserDetail from "./user/UserDetail";
import BlockedUserList from "./user/BlockedUserList"; 
import Layout from "./common/Layout";
import UserRecipe from "./user/UserRecipe";
import UserPoint from "./user/UserPoint";
import UserReview from "./user/UserReview"; 
import UserHistory from "./user/UserHistory";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role === "ROLE_ADMIN") {
          setIsLoggedIn(true);
        } else {
          console.warn("일반 유저는 관리자 페이지에 접근할 수 없습니다");
          localStorage.removeItem("token");
        }
      } catch (e) {
        console.error("JWT 디코딩 오류:", e);
        localStorage.removeItem("token");
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        {!isLoggedIn && (
          <>
            <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}

        {isLoggedIn && (
          <>
            <Route path="/" element={<Layout setIsLoggedIn={setIsLoggedIn} />}>
              <Route index element={<Main />} />
              <Route path="users" element={<UserList />} />
              <Route path="users/blocked" element={<BlockedUserList />} /> 
              <Route path="users/:username" element={<UserDetail />} />
              <Route path="users/:username/recipes" element={<UserRecipe />} />
              <Route path="users/:username/points" element={<UserPoint />} />
              <Route path="users/:username/reviews" element={<UserReview />} />
              <Route path="users/:username/history" element={<UserHistory />} />
              <Route path="posts" element={<PostList />} />
              <Route path="posts/:postId" element={<PostDetail />} />
            </Route>
            <Route path="/login" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
