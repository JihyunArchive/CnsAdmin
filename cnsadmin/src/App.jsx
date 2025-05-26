import React, { useState, useEffect } from "react" //useEffect 추가
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
import Layout from "./common/Layout";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 로그인 상태 유지
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                if (payload.role === "ROLE_ADMIN") {
                    setIsLoggedIn(true); //로그인 true로 설정
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
              <Route path="posts" element={<PostList />} />
              <Route path="posts/:postId" element={<PostDetail />} />
            </Route>
            {/* 로그인된 상태에서 /login 접근하면 메인으로 보내기 */}
            <Route path="/login" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
