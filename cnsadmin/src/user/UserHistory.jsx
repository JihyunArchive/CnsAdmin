// src/user/UserHistory.jsx
import React, { useState } from "react";
import "./UserHistory.css";

export default function UserHistory() {
  const [tab, setTab] = useState("sell");

  const historyList = Array.from({ length: 10 }, (_, i) => ({
    id: 30,
    title: "다이소 채소 다지기 팝니다",
    content: "사용고 사용안 한 다이소 채소 다지기...",
    date: "2025-05-01",
    status: "거래중"
  }));

  return (
    <div className="user-history-container">
      <h2>거래 내역</h2>

      <div className="history-tab">
        <button className={tab === "sell" ? "active" : ""} onClick={() => setTab("sell")}>판매</button>
        <button className={tab === "buy" ? "active" : ""} onClick={() => setTab("buy")}>구매</button>
      </div>

      <table className="history-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>내용</th>
            <th>게시 날짜</th>
            <th>거래 상태</th>
            <th></th> {/* 보기 버튼용 열 */}
          </tr>
        </thead>
        <tbody>
          {historyList.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.content}</td>
              <td>{item.date}</td>
              <td>{item.status}</td>
              <td>
                <button className="view-button">보기</button> {/* 추가된 버튼 */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <span>{"<"}</span>
        <span className="active">1</span>
        <span>2</span>
        <span>{">"}</span>
      </div>
    </div>
  );
}
