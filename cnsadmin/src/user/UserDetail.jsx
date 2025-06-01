import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./UserDetail.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function UserDetail() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("🔥 유저 정보 로딩 실패:", err);
      });
  }, [userId]);

  if (!user) return <div>로딩 중...</div>;

  return (
    <div className="user-detail-container">
      <div className="white-box">
        <h2>회원 상세 정보</h2>
        <hr className="detail-divider" />

        <table className="detail-table">
          <tbody>
            <tr>
              <th>이름</th>
              <td>{user.name}</td>
            </tr>
            <tr>
              <th>아이디</th>
              <td>{user.username}</td>
            </tr>
            <tr>
              <th>가입일</th>
              <td>{user.createdAt.replace("T", " ").substring(0, 16)}</td>
            </tr>
            <tr>
              <th>포인트</th>
              <td className="with-button">
                {user.point.toLocaleString()}p
                <button
                  className="view-button"
                  onClick={() => navigate(`/users/${userId}/points`)}
                >
                  보기
                </button>
              </td>
            </tr>
            <tr>
              <th>레시피 등록 건수</th>
              <td className="with-button">
                {user.recipeCount}개
                <button
                  className="view-button"
                  onClick={() => navigate(`/users/${userId}/recipes`)}
                >
                  보기
                </button>
              </td>
            </tr>
            <tr>
              <th>거래 내역</th>
              <td className="with-button">
                {user.tradePostCount}개
                <button
                  className="view-button"
                  onClick={() => navigate(`/users/${userId}/history`)}
                >
                  보기
                </button>
              </td>
            </tr>
            <tr>
              <th>거래 후기</th>
              <td className="with-button">
                {user.reviewCount}개
                <button
                  className="view-button"
                  onClick={() => navigate(`/users/${userId}/reviews`)}
                >
                  보기
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="button-wrapper">
          <button className="edit-button">정보수정</button>
        </div>
      </div>
    </div>
  );
}
