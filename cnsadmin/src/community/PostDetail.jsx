import React, { useState } from "react";
import "./PostDetail.css";

export default function PostDetail() {
  const [showComments, setShowComments] = useState(false);

  const post = {
    id: "1112jyjin",
    content:
      "동해바다가 보고싶어서 펜션을 빌렸어요. 바베큐와 레시피에서 본 삼겹살 배추 술찜 만들어 먹었는데 술 안주로 딱 좋네요 ㅎㅎ 추천합니다!",
    date: "2025-05-01",
    image: "/public/image_post.png",
    recommend: "123개",
    comment: "20개",
    user: "어머! 바다사진 너무 예쁘잖아요ㅎㅎ",
    user2: "술찜 만드는 법 레시피로 올려주세용",
    user3: "술찜 만드는 법 궁금해요!! 레시피 부탁드려요"
  };

  return (
    <div className="post-detail-container">
      <div className="white-box">
        <h2>게시물 상세</h2>
        <hr className="detail-divider" />

        <table className="detail-table">
          <tbody>
            <tr>
              <th>아이디</th>
              <td>{post.id}</td>
            </tr>
            <tr>
              <th>내용</th>
              <td>{post.content}</td>
            </tr>
            <tr>
              <th>날짜</th>
              <td>{post.date}</td>
            </tr>
            <tr>
              <th>이미지</th>
              <td>
                <img src={post.image} alt="게시물 이미지" className="detail-image" />
              </td>
            </tr>
            <tr>
              <th>추천수</th>
              <td>{post.recommend}</td>
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
              <td>{post.comment}</td>
            </tr>
          </tbody>
        </table>

        {showComments && (
          <table className="detail-comment-table">
            <tbody>
              <tr>
                <th>ralrallol12</th>
                <td>{post.user}</td>
              </tr>
              <tr>
                <th>데이비드</th>
                <td>{post.user2}</td>
              </tr>
              <tr>
                <th>피리</th>
                <td>{post.user3}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
