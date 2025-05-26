import React, { useState } from "react";
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


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            <Route path="/" element={<Layout />}>
              <Route index element={<Main />} />
              <Route path="users" element={<UserList />} />
              <Route path="users/blocked" element={<BlockedUserList />} /> 
              <Route path="users/:username" element={<UserDetail />} />
              <Route path="users/:username/recipes" element={<UserRecipe />} />
              <Route path="posts" element={<PostList />} />
              <Route path="posts/:postId" element={<PostDetail />} />
              <Route path="users/:username/points" element={<UserPoint />} />
              <Route path="users/:username/reviews" element={<UserReview />} /> 
            </Route>
            <Route path="/login" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
