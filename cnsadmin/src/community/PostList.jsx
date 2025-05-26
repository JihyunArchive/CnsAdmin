import React from "react";
import { useNavigate } from "react-router-dom";
import "./PostList.css";

export default function PostList() {
  const navigate = useNavigate(); 

  const posts = Array(12).fill({
    number: 30,
    id: "1112jyjin",
    postcontent: "동해바다가 보고싶어서 펜션을 빌렸어요. 바베큐...",
    date: "2025-05-01"
  });

  return (
    <div className="post-list-container">
      <h2>게시물 리스트</h2>

      <div className="top-bar">
        <label><input type="checkbox" /> 전체</label>
        <div className="search-box">
          <input type="text" placeholder="게시물 검색" />
          <span className="search-icon">🔍</span>
        </div>
        <div className="action-buttons">
          <button className="block">차단</button>
          <button className="unblock">차단 해제</button>
        </div>
      </div>

      <table className="post-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>번호</th>
            <th>아이디</th>
            <th>내용</th>
            <th>게시 날짜</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr key={index}>
              <td><input type="checkbox" /></td>
              <td>{post.number}</td>
              <td>{post.id}</td>
              <td>{post.postcontent}</td>
              <td>{post.date}</td>
              <td className="buttons">
                <button className="delete">삭제</button>
                <button
                  className="detailSee"
                  onClick={() => navigate(`/posts/${post.number}`)} //이동
                >상세보기</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <span>{"<"}</span>
        {[...Array(10)].map((_, i) => (
          <span key={i} className={i === 0 ? "active" : ""}>{i + 1}</span>
        ))}
        <span>{">"}</span>
      </div>
    </div>
  );
}