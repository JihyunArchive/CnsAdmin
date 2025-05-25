import React, { useEffect, useState } from "react";
import "./UserList.css";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // 🔹 임시 더미 유저 3명 세팅
    setUsers([
      { number: 1, name: "정여진", username: "jyjin1112" },
      { number: 2, name: "김민수", username: "kms2025" },
      { number: 3, name: "박지은", username: "jepark88" }
    ]);
  }, []);

  return (
    <div className="user-list-container">
      <h2>회원 리스트</h2>

      <div className="top-bar">
        <label><input type="checkbox" /> 전체</label>
        <div className="search-box">
          <input type="text" placeholder="회원 검색" />
          <span className="search-icon">🔍</span>
        </div>
        <div className="action-buttons">
          <button className="block">차단</button>
          <button className="unblock">차단 해제</button>
        </div>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>번호</th>
            <th>이름</th>
            <th>아이디</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td><input type="checkbox" /></td>
              <td>{user.number}</td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td className="buttons">
                <button className="edit">수정</button>
                <button className="block">차단</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <span>{"<"}</span>
        {[...Array(1)].map((_, i) => (
          <span key={i} className="active">{i + 1}</span>
        ))}
        <span>{">"}</span>
      </div>
    </div>
  );
}
