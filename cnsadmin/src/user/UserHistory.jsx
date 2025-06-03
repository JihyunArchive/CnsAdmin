import React, { useEffect, useState } from "react";
import "./UserHistory.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function UserHistory() {
  const navigate = useNavigate();
  const { userId } = useParams(); // ✅ userId는 URL에서 받는다
  const [tab, setTab] = useState("sell");
  const [sellList, setSellList] = useState([]);
  const [buyList, setBuyList] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [salesRes, purchasesRes] = await Promise.all([
          axios.get(`${BASE_URL}/admin/users/${userId}/sales`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${BASE_URL}/admin/users/${userId}/purchases`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setSellList(salesRes.data);
        setBuyList(purchasesRes.data);
      } catch (err) {
        console.error("🔥 거래 내역 불러오기 실패:", err);
      }
    };

    fetchData();
  }, [userId, BASE_URL]);

  const currentList = tab === "sell" ? sellList : buyList;

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
            <th>게시 날짜</th>
            <th>거래 상태</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentList.map((item, index) => (
            <tr key={index}>
              <td>{item.tradePostId}</td>
              <td>{item.title}</td>
              <td>{item.createdAt?.substring(0, 10)}</td>
              <td>{item.status === 0 ? "거래중" : "거래완료"}</td>
              <td>
                <button
                  className="view-button"
                  onClick={() =>
                    tab === "sell"
                      ? navigate(`/admin/user-history/sale/${item.tradePostId}`)
                      : navigate(`/admin/user-history/purchase/${item.tradePostId}`)
                  }
                >
                  보기
                </button>
              </td>
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
  );
}
