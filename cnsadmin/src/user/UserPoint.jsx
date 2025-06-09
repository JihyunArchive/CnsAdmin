import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./UserPoint.css";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function UserPoint() {
  const { userId } = useParams(); // ✅ userId 기준으로 수정
  const [tab, setTab] = useState("saved"); // saved = 적립, used = 사용
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const url = `${BASE_URL}/admin/users/${userId}/points/${tab === "saved" ? "earned" : "used"}`;
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const pointList = res.data.map((item, index) => ({
          id: item.id,
          number: res.data.length - index,
          type: item.description,
          point: `${item.pointChange > 0 ? "+" : ""}${item.pointChange}p`,
          date: item.createdAt.replace("T", " ").substring(0, 16),
        }));

        setPoints(pointList);
      } catch (err) {
        console.error("❌ 포인트 내역 불러오기 실패:", err);
      }
    };

    fetchPoints();
  }, [userId, tab]);

  return (
    <div className="user-point-container">
      <div className="white-box">
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
            {points.map((item) => (
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
          <span>1</span>
          <span>{">"}</span>
        </div>
      </div>
    </div>
  );
}
