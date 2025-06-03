import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./TradeDetail.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function TradeDetail() {
  const { tradePostId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/tradeposts/${tradePostId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPost(response.data);
      } catch (err) {
        console.error("거래글 상세 조회 실패:", err);
        setError("해당 게시글을 찾을 수 없습니다.");
      }
    };

    fetchPostDetail();
  }, [tradePostId]);

  if (error) {
    return <div className="post-detail-container">{error}</div>;
  }

  if (!post) {
    return <div className="post-detail-container">로딩 중...</div>;
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
            <tr><th>작성일</th><td>{post.createdAt?.slice(0, 10)}</td></tr>
            <tr>
              <th>이미지</th>
              <td>
                {post.imageUrls && post.imageUrls.length > 0 ? (
                  post.imageUrls.map((url, idx) => (
                    <img key={idx} src={url} alt={`이미지 ${idx + 1}`} className="detail-image" />
                  ))
                ) : (
                  "이미지 없음"
                )}
              </td>
            </tr>
            <tr><th>거래 희망 장소</th><td>{post.location}</td></tr>
            <tr><th>채팅 수</th><td>{post.chatCount}개</td></tr>
            <tr><th>조회 수</th><td>{post.viewCount}번</td></tr>
            <tr><th>거래 상태</th><td>{post.status}</td></tr> 
          </tbody>
        </table>
      </div>
    </div>
  );
}
