// src/user/UserReview.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./UserReview.css";

export default function UserReview() {
    const { username } = useParams();
    console.log("유저명:", username); // 임시 사용
    const [tab, setTab] = useState("written");

    const reviewList = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        number: 30,
        postTitle: "다이소 채소 다지기 팝니다",
        content: "빠른 거래 감사합니다!!",
        date: "2025-05-01"
    }));

    return (
        <div className="user-review-container">
        <h2>거래 후기</h2>

        <div className="review-tab">
            <button className={tab === "written" ? "active" : ""} onClick={() => setTab("written")}>작성한 후기</button>
            <button className={tab === "received" ? "active" : ""} onClick={() => setTab("received")}>받은 후기</button>
        </div>

        <table className="review-table">
            <colgroup>
            <col style={{ width: "10%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "40%" }} />
            <col style={{ width: "20%" }} />
            </colgroup>
            <thead>
            <tr>
                <th>번호</th>
                <th>게시물 제목</th>
                <th>후기 내용</th>
                <th>작성 날짜</th>
            </tr>
            </thead>
            <tbody>
            {reviewList.map((review) => (
                <tr key={review.id}>
                <td>{review.number}</td>
                <td>{review.postTitle}</td>
                <td>{review.content}</td>
                <td>{review.date}</td>
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
