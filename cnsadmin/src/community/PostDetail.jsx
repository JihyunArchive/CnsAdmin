// src/pages/PostDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import "./PostDetail.css";

export default function PostDetail() {
  const { commentId } = useParams();
  const [post, setPost] = useState(null);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/admin/comments/${commentId}/board`);
        setPost(res.data);
      } catch (err) {
        console.error("게시물 상세 조회 실패", err);
      }
    };
    fetchPost();
  }, [commentId]);

  if (!post) return <div>로딩 중...</div>;

  return (
    <div className="post-detail-container">
      <div className="white-box">
        <h2>게시물 상세</h2>
        <hr className="detail-divider" />

        <table className="detail-table">
          <tbody>
            <tr>
              <th>아이디</th>
              <td>{post.writer}</td>
            </tr>
            <tr>
              <th>내용</th>
              <td>{post.content}</td>
            </tr>
            <tr>
              <th>날짜</th>
              <td>{post.createdAt?.slice(0, 10)}</td>
            </tr>
            <tr>
              <th>이미지</th>
              <td>
                {post.imageUrls?.length > 0 ? (
                  <img
                    src={post.imageUrls[0]}
                    alt="게시물 이미지"
                    className="detail-image"
                  />
                ) : (
                  "이미지 없음"
                )}
              </td>
            </tr>
            <tr>
              <th>추천수</th>
              <td>{post.likeCount}개</td>
            </tr>
            <tr>
              <th>
                <div className="comment-toggle-header">
                  댓글 수
                  <button
                    className="comment-toggle-button"
                    onClick={() => setShowComments(!showComments)}
                  >
                    {showComments ? "▲" : "▼"}
                  </button>
                </div>
              </th>
              <td>{post.commentCount}개</td>
            </tr>
          </tbody>
        </table>

        {showComments && (
          <table className="detail-comment-table">
            <tbody>
              {post.comments.map((comment, index) => (
                <tr key={index}>
                  <th>{comment.username}</th> {/* ✅ writer → username 으로 수정 */}
                  <td>{comment.content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
