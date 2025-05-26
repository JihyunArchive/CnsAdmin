// src/user/UserPoint.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./UserPoint.css";

export default function UserPoint() {
  const { username } = useParams();
  console.log("현재 유저:", username);
  const [tab, setTab] = useState("saved");

  const pointList = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    type: tab === "saved" ? "커뮤니티 글 작성" : "레시피 열람",
    point: tab === "saved" ? "3p" : "-5p",
    date: "2025-05-01",
    number: 30
  }));

  return (
    <div className="user-point-container">
      <h2>포인트 내역</h2>

      <div className="point-tab">
        <button className={tab === "saved" ? "active" : ""} onClick={() => setTab("saved")}>적립</button>
        <button className={tab === "used" ? "active" : ""} onClick={() => setTab("used")}>사용</button>
      </div>

      <table className="point-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>유형</th>
            <th>{tab === "saved" ? "적립 포인트" : "사용 포인트"}</th>
            <th>{tab === "saved" ? "적립날짜" : "사용날짜"}</th>
          </tr>
        </thead>
        <tbody>
          {pointList.map((item) => (
            <tr key={item.id}>
              <td>{item.number}</td>
              <td>{item.type}</td>
              <td>{item.point}</td>
              <td>{item.date}</td>
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
