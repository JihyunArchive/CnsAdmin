import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReviewDeleteList.css";
import "./DeleteModal.css";

export default function ReviewDeleteList() {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([
    {
      number: 1,
      postId: 100,
      userId: "john123",
      title: "알배추전골 재료",
      content: "웩",
      date: "2025-05-01",
      reason: "부적절한 언어 사용"
    },
    {
      number: 2,
      postId: 100,
      userId: "emma_cook",
      title: "된장찌개 끓이기",
      content: "웩",
      date: "2025-05-01",
      reason: "부적절한 언어 사용"
    },
    {
      number: 3,
      postId: 100,
      userId: "david456",
      title: "김치볶음밥 만들기",
      content: "웩",
      date: "2025-05-01",
      reason: "부적절한 언어 사용"
    },
    {
      number: 4,
      postId: 100,
      userId: "cookmaster01",
      title: "잡채밥 만들기",
      content: "웩",
      date: "2025-05-01",
      reason: "부적절한 언어 사용"
    },
    {
      number: 5,
      postId: 100,
      userId: "foodie_lee",
      title: "케찹밥 만들기",
      content: "웩",
      date: "2025-05-01",
      reason: "부적절한 언어 사용"
    },
    {
      number: 6,
      postId: 100,
      userId: "chef_kim",
      title: "만두국 만들기",
      content: "웩",
      date: "2025-05-01",
      reason: "부적절한 언어 사용"
    },
    {
      number: 7,
      postId: 100,
      userId: "recipequeen",
      title: "라면 만들기",
      content: "웩",
      date: "2025-05-01",
      reason: "부적절한 언어 사용"
    },
    {
      number: 8,
      postId: 100,
      userId: "kitchenhero",
      title: "복숭아 아이스티 만들기",
      content: "웩",
      date: "2025-05-01",
      reason: "부적절한 언어 사용"
    },
    {
      number: 9,
      postId: 100,
      userId: "chef_sun",
      title: "계란말이 만들기",
      content: "웩",
      date: "2025-05-01",
      reason: "부적절한 언어 사용"
    },
    {
      number: 10,
      postId: 100,
      userId: "ricegod",
      title: "밥짓기",
      content: "웩",
      date: "2025-05-01",
      reason: "부적절한 언어 사용"
    },
    {
      number: 11,
      postId: 100,
      userId: "cooknara",
      title: "닭갈비 만들기",
      content: "웩",
      date: "2025-05-01",
      reason: "부적절한 언어 사용"
    },
    {
      number: 12,
      postId: 100,
      userId: "kimfood",
      title: "떡볶이 만들기",
      content: "웩",
      date: "2025-05-01",
      reason: "부적절한 언어 사용"
    },
  ]);

  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [viewReason, setViewReason] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const toggleSelectAll = () => {
    if (selectAll) {
      setCheckedItems([]);
    } else {
      setCheckedItems(currentReviews.map((r) => r.number));
    }
    setSelectAll(!selectAll);
  };

  const toggleItem = (number) => {
    setCheckedItems((prev) =>
      prev.includes(number) ? prev.filter((n) => n !== number) : [...prev, number]
    );
  };

  const openModal = (review) => {
    setViewReason(review.reason || "사유가 없습니다.");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectAll(false);
    setCheckedItems([]);
  };

  return (
    <div className="delete-list-container">
      <div className="white-box">
        <h2>삭제된 리뷰 리스트</h2>
        <hr className="delete-divider" />

        <div className="top-bar">
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              className="check"
              checked={selectAll}
              onChange={toggleSelectAll}
            />
            <label>전체</label>
          </div>
          <div className="search-box">
            <input type="text" placeholder="리뷰 검색" />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <table className="delete-table">
          <thead>
            <tr>
              <th></th>
              <th>번호</th>
              <th>아이디</th>
              <th>제목</th>
              <th>내용</th>
              <th>게시 날짜</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentReviews.map((review) => (
              <tr key={review.number}>
                <td>
                  <input
                    type="checkbox"
                    className="check"
                    checked={checkedItems.includes(review.number)}
                    onChange={() => toggleItem(review.number)}
                  />
                </td>
                <td>{review.number}</td>
                <td>{review.userId}</td>
                <td>{review.title}</td>
                <td>{review.content}</td>
                <td>{review.date}</td>
                <td className="buttons">
                  <button className="reason" onClick={() => openModal(review)}>사유</button>
                  <button className="detailSee" onClick={() => navigate(`/recipes/${review.postId}/reviews/${review.number}`)}>상세보기</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <span onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}>{"<"}</span>
          {[...Array(totalPages)].map((_, i) => (
            <span
              key={i}
              className={i + 1 === currentPage ? "active" : ""}
              onClick={() => handlePageClick(i + 1)}
            >
              {i + 1}
            </span>
          ))}
          <span onClick={() => currentPage < totalPages && handlePageClick(currentPage + 1)}>{">"}</span>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{viewReason}</p>
            <button className="modal-button" onClick={closeModal}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}
