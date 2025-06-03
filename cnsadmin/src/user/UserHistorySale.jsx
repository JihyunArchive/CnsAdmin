import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./UserHistorySale.css";

export default function UserHistorySale() {
  const { tradePostId } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios.get(`${BASE_URL}/admin/tradeposts/${tradePostId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then((res) => setPost(res.data))
    .catch(() => setPost(null));
  }, [tradePostId, BASE_URL]);

  if (!post) {
    return <div className="post-detail-container">해당 게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="post-detail-container">
      <div className="white-box">
        <h2>게시물 상세 내용</h2>
        <hr className="detail-divider" />
        <table className="detail-table">
          <tbody>
            <tr><th>아이디</th><td>{post.username}</td></tr>
            <tr><th>제목</th><td>{post.title}</td></tr>
            <tr><th>내용</th><td>{post.description}</td></tr>
            <tr><th>날짜</th><td>{post.createdAt}</td></tr>
            <tr><th>이미지</th>
              <td>
                {post.imageUrls?.map((url, i) => (
                  <img key={i} src={url} alt="상품 이미지" className="detail-image" />
                ))}
              </td>
            </tr>
            <tr><th>거래 희망 장소</th><td>{post.location}</td></tr>
            <tr><th>채팅 수</th><td>{post.chatCount}개</td></tr>
            <tr><th>조회 수</th><td>{post.viewCount}번</td></tr>
          </tbody>
        </table>
        <button onClick={() => navigate("/admin/user-history", { state: { fromTab: location.state?.fromTab } })}>
          목록으로
        </button>
      </div>
    </div>
  );
}
