import React, { useState } from "react";
import "./UserHistory.css";

import { useNavigate, useLocation } from "react-router-dom";

export default function UserHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState(location.state?.fromTab || "sell");

  const sellList = [
    {
      id: 101,
      title: "다이소 채소 다지기 팝니다",
      content: "사용 거의 안 한 제품입니다.",
      date: "2025-05-01",
      status: "거래중"
    },
    {
      id: 102,
      title: "중고 냄비 세트 판매합니다",
      content: "상태 양호한 냄비 세트입니다.",
      date: "2025-05-03",
      status: "거래완료"
    }
  ];

  const buyList = [
    {
      id: 201,
      title: "이케아 테이블 구매함",
      content: "가격 대비 만족스러워요.",
      date: "2025-04-28",
      status: "거래완료"
    },
    {
      id: 202,
      title: "중고 믹서기 구매 완료",
      content: "잘 작동합니다.",
      date: "2025-04-29",
      status: "거래완료"
    }
  ];

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
            <th>내용</th>
            <th>게시 날짜</th>
            <th>거래 상태</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentList.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.content}</td>
              <td>{item.date}</td>
              <td>{item.status}</td>
              <td>
                <button
                  className="view-button"
                  onClick={() =>
                      tab === "sell"
                        ? navigate(`/admin/user-history/sale/${item.id}`, { state: { fromTab: tab } })
                        : navigate(`/admin/user-history/purchase/${item.id}`, { state: { fromTab: tab } })
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
        <span>2</span>
        <span>{">"}</span>
      </div>
    </div>
  );
}
