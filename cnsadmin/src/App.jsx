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
import DeletePostList from "./community/DeletePostList";
import PostDetail from "./community/PostDetail";
import CommentList from "./community/CommentList";
import DeleteCommentList from "./community/DeleteCommentList";
import ReportList from "./community/ReportList";
import DeleteReportList from "./community/DeleteReportList";
import RecipeList from "./recipe/RecipeList";
import DeleteList from "./recipe/DeleteList";
import RecipeDetail from "./recipe/RecipeDetail";
import ReviewDetail from "./recipe/ReviewDetail";
import ReviewDeleteList from "./recipe/ReviewDeleteList";
import UserList from "./user/UserList";
import UserDetail from "./user/UserDetail";
import BlockedUserList from "./user/BlockedUserList"; 
import Layout from "./common/Layout";
import UserRecipe from "./user/UserRecipe";
import UserPoint from "./user/UserPoint";
import UserReview from "./user/UserReview"; 
import UserHistory from "./user/UserHistory";
import RecipeStats from "./stats/RecipeStats";
import TradeSaleList from "./trade/TradeSaleList";
import TradePurchaseList from "./trade/TradePurchaseList";
import TradeReportList from "./trade/TradeReportList";
import TradeDetail from "./trade/TradeDetail";
import UserRecipeDetail from "./user/UserRecipeDetail";
import UserHistoryPurchase from "./user/UserHistoryPurchase";
import UserHistorySale from "./user/UserHistorySale";

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
              <Route path="users/:userId" element={<UserDetail />} />
              <Route path="users/:userId/recipes" element={<UserRecipe />} />
              <Route path="users/:userId/points" element={<UserPoint />} />
              <Route path="users/:userId/reviews" element={<UserReview />} />
              <Route path="users/:userId/history" element={<UserHistory />} />
              <Route path="posts" element={<PostList />} />
              <Route path="dposts" element={<DeletePostList />} />
              <Route path="posts/:postId" element={<PostDetail />} />
              <Route path="dcomments" element={<DeleteCommentList />} />
              <Route path="comments" element={<CommentList />} />
              <Route path="reports" element={<ReportList />} />
              <Route path="dreports" element={<DeleteReportList />} />
              <Route path="recipes" element={<RecipeList />} />
              <Route path="deletes" element={<DeleteList />} />
              <Route path="recipes/:postId/reviews/:reviewId" element={<ReviewDetail />} />
              <Route path="recipes/:postId" element={<RecipeDetail />} />
              <Route path="rdeletes" element={<ReviewDeleteList />} />
              <Route path="trade/sales" element={<TradeSaleList />} />
              <Route path="trade/purchase" element={<TradePurchaseList />} />
              <Route path="trade/report" element={<TradeReportList />} />
              <Route path="trade/:tradePostId" element={<TradeDetail />} />
              <Route path="recipe/stats" element={<RecipeStats />} />
              <Route path="/admin/users/:userId/recipes/:recipeId" element={<UserRecipeDetail />} />
              <Route path="/admin/user-history/purchase/:tradePostId" element={<UserHistoryPurchase />} />
              <Route path="/admin/user-history/sale/:tradePostId" element={<UserHistorySale />} />
            </Route>
            <Route path="/login" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
