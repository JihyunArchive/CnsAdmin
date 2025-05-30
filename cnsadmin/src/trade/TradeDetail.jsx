import React from "react";
import { useParams } from "react-router-dom";
import "./TradeDetail.css";

export default function TradeDetail() {
  const { tradePostId } = useParams(); 

  const dummyPosts = [
    {
      tradePostId: "30",
      username: "1112jyjin",
      title: "다이소 채소 다지기 팝니다",
      content: "사놓고 사용 안 한 다이소 채소 다지기입니다.",
      date: "2025-05-01",
      imageUrl: "/image_post.png",
      location: "성리초등학교 앞",
      chatCount: 2,
      viewCount: 6,
    },
    {
      tradePostId: "29",
      username: "cookmaster",
      title: "중고 냄비 판매합니다",
      content: "상태 좋은 냄비입니다.",
      date: "2025-05-02",
      imageUrl: "/image_pot.png",
      location: "양지시장 앞",
      chatCount: 1,
      viewCount: 10,
    },
  ];

  const post = dummyPosts.find((p) => p.tradePostId === tradePostId);

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
            <tr><th>내용</th><td>{post.content}</td></tr>
            <tr><th>날짜</th><td>{post.date}</td></tr>
            <tr>
              <th>이미지</th>
              <td><img src={post.imageUrl} alt="상품 이미지" className="detail-image" /></td>
            </tr>
            <tr><th>거래 희망 장소</th><td>{post.location}</td></tr>
            <tr><th>채팅 수</th><td>{post.chatCount}개</td></tr>
            <tr><th>조회 수</th><td>{post.viewCount}번</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
