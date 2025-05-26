import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./Layout.css";

export default function Layout() {
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
            </div>
          </div>
          <div className="nav-item">
            <a href="#">레시피 관리</a>
            <div className="submenu">
              <a href="#">레시피 리스트</a>
              <a href="#">통계</a>
            </div>
          </div>
          <div className="nav-item">
            <a href="#">커뮤니티 관리</a>
            <div className="submenu">
              <Link to="/posts">게시글</Link>  
              <Link to="/comments">댓글</Link>  
              <Link to="/reports">신고내역</Link>  
            </div>
          </div>
          <div className="nav-item">
            <a href="#">동네주방 관리</a>
            <div className="submenu">
              <a href="#">판매</a>
              <a href="#">구매</a>
              <a href="#">신고관리</a>
            </div>
          </div>
          <div className="nav-item">
            <a href="#">통계 관리</a>
            <div className="submenu">
              <a href="#">사용자 통계</a>
              <a href="#">레시피 통계</a>
            </div>
          </div>
        </div>
        <div className="logout">로그아웃</div>
      </div>

      <div className="layout-content">
        <Outlet />
      </div>
    </>
  );
}