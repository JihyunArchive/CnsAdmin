// src/user/UserReview.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./UserReview.css";
import axios from "axios";

export default function UserReview() {
  const { userId } = useParams(); // username → userId 로 수정
  const [tab, setTab] = useState("written");
  const [reviewList, setReviewList] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const url =
          tab === "written"
            ? `${BASE_URL}/admin/users/${userId}/reviews/written`
            : `${BASE_URL}/admin/users/${userId}/reviews/received`;

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setReviewList(res.data);
      } catch (err) {
        console.error("리뷰 불러오기 실패:", err);
      }
    };

    fetchReviews();
  }, [tab, userId, BASE_URL]);

  return (
    <div className="user-review-container">
      <div className="white-box">
        <h2>거래 후기</h2>

        <div className="review-tab">
          <button
            className={tab === "written" ? "active" : ""}
            onClick={() => setTab("written")}
          >
            작성한 후기
          </button>
          <button
            className={tab === "received" ? "active" : ""}
            onClick={() => setTab("received")}
          >
            받은 후기
          </button>
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
            {reviewList.map((review, index) => (
              <tr key={review.id}>
                <td>{index + 1}</td>
                <td>{review.postTitle}</td>
                <td>{review.content}</td>
                <td>{new Date(review.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <span>{"<"}</span>
          <span className="active">1</span>
          <span>{">"}</span>
        </div>
      </div>
    </div>
  );
}
