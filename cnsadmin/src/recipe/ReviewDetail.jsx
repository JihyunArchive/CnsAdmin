import React from "react";
import { useParams } from "react-router-dom";
import "./ReviewDetail.css";

export default function ReviewDetail() {
  const { postId, reviewId } = useParams();

  const review = {
    id: "1112jyjin",
    image: "/public/image_review.png",
    content: "재료도 간단하고 맛있어요! 크리스마스 파티 때 먹으려고 했는데 다들 맛있게 먹어서 좋네요ㅎㅎㅎ",
    star: "5점"
  };

  return (
    <div className="review-detail-container">
      <div className="white-box">
        <h2>리뷰 상세 정보</h2>
        <hr className="detail-divider" />

        <table className="detail-table">
          <tbody>
            <tr>
              <th>아이디</th>
              <td>{review.id}</td>
            </tr>
            <tr>
              <th>이미지</th>
              <td>
                <img
                  src={review.image}
                  alt="리뷰 이미지"
                  className="detail-image"
                />
              </td>
            </tr>
            <tr>
              <th>내용</th>
              <td>{review.content}</td>
            </tr>
            <tr>
              <th>별점</th>
              <td>{review.star}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
