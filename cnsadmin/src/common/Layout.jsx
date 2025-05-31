// src/common/Layout.jsx
import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./Layout.css";

export default function Layout({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);  // 🔑 상태 변경
    navigate("/login");
  };

  return (
    <>
      <div className="navbar">
        <div className="logo">
          <Link to="/" className="logo">
            <img src="/assets/logo.png" alt="logo" className="logo-img" />
            <span>쿡앤쉐어</span>
          </Link>
        </div>

        <div className="nav-menu">
          <div className="nav-item">
            <a href="#">사용자 관리</a>
            <div className="submenu">
              <Link to="/users">회원 리스트</Link>
              <Link to="/users/blocked">차단된 사용자</Link>
            </div>
          </div>
          <div className="nav-item">
            <a href="#">레시피 관리</a>
            <div className="submenu">
              <Link to="/recipes">레시피 리스트</Link>
              <Link to="/deletes">레시피 삭제 리스트</Link>
              <Link to="/rdeletes">리뷰 삭제 리스트</Link>
            </div>
          </div>
          <div className="nav-item">
            <a href="#">커뮤니티 관리</a>
            <div className="submenu">
              <Link to="/posts">게시글</Link>  
              <Link to="/dposts">게시글 삭제 리스트</Link>  
              <Link to="/comments">댓글</Link>  
              <Link to="/dcomments">댓글 삭제 리스트</Link>  
              <Link to="/reports">신고내역</Link>  
              <Link to="/dreports">댓글 신고내역역 리스트</Link>  
            </div>
          </div>
          <div className="nav-item">
            <a href="#">동네주방 관리</a>
            <div className="submenu">
              <Link to="/trade/sales">판매</Link>
              <Link to="/trade/purchase">구매</Link>
              <Link to="/trade/report">신고관리</Link>
            </div>
          </div>
          <div className="nav-item">
            <a href="#">통계 관리</a>
            <div className="submenu">
              <Link to="/recipe/stats">레시피 통계</Link> 
            </div>
          </div>
        </div>

        <div className="logout" onClick={handleLogout}>로그아웃</div>
      </div>

      <div className="layout-content">
        <Outlet />
      </div>
    </>
  );
}
