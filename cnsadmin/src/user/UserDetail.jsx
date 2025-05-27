// src/user/UserDetail.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserDetail.css";

export default function UserDetail() {
    const navigate = useNavigate();

    const user = {
        name: "정여진",
        username: "1112jyjin",
        joinedAt: "2023-12-31 09:22",
        point: "150p",
        recipeCount: "10개",
        trades: "4개",
        reviews: "4개",
        preference: "한식, 채식"
    };

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
                <td>{user.joinedAt}</td>
                </tr>
                <tr>
                <th>포인트</th>
                <td className="with-button">
                    {user.point}
                    <button
                    className="view-button"
                    onClick={() => navigate(`/users/${user.username}/points`)} // 포인트로 이동
                    >
                    보기
                    </button>
                </td>
                </tr>
                <tr>
                <th>레시피 등록 건수</th>
                <td className="with-button">
                    {user.recipeCount}
                    <button
                    className="view-button"
                    onClick={() => navigate(`/users/${user.username}/recipes`)} // 실제 이동
                    >
                    보기
                    </button>
                </td>
                </tr>
                <tr>
                <th>거래 내역</th>
                <td className="with-button">
                    {user.trades}
                    <button
                    className="view-button"
                    onClick={() => navigate(`/users/${user.username}/history`)} // ✅ 이동 경로 추가
                    >
                    보기
                    </button>
                </td>
                </tr>
                <tr>
                    <th>거래 후기</th>
                    <td className="with-button">
                        {user.reviews}
                        <button
                        className="view-button"
                        onClick={() => navigate(`/users/${user.username}/reviews`)} // 리뷰 화면으로 이동
                        >
                        보기
                        </button>
                    </td>
                    </tr>

                    <tr>
                    <th>선호 요리</th>
                    <td>{user.preference}</td>
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
