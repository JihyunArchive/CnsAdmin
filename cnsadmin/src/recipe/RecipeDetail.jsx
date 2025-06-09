// src/pages/RecipeDetail.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import "./RecipeDetail.css";
import "./DeleteModal.css";

export default function RecipeDetail() {
  const { recipeId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("재료");
  const [recipe, setRecipe] = useState({});
  const [steps, setSteps] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/admin/recipes/${recipeId}`);
        const data = res.data;

        setRecipe({
          id: data.recipeId,
          username: data.username,
          title: data.title,
          category: data.category,
          date: data.createdAt?.split("T")[0],
          image: data.mainImageUrl,
          serving: data.servings + "인분",
          level: data.difficulty,
          time: data.cookingTime + "분",
          tag: data.tags,
          heartNumber: data.likes + "개",
          recommendNumber: data.recommends + "개",
          seeNumber: data.viewCount + "회",
        });

        setSteps(
          JSON.parse(data.cookingSteps || "[]").map((s, i) => ({
            step: s.step ?? i + 1,
            text: s.text ?? s.description ?? "",
            image: s.image ?? "",
          }))
        );

        setIngredients(
          (data.ingredients || "")
            .split(",")
            .map((item) => {
              const [name, quantity] = item.split(":");
              return { name: name?.trim(), quantity: quantity?.trim() };
            })
        );

        setReviews(
          data.reviews?.map((r, idx) => ({
            number: idx + 1,
            reviewId: r.reviewId,
            userId: r.userId,
            title: r.title,
            content: r.content,
            date: r.createdAt?.split("T")[0],
          })) || []
        );
      } catch (err) {
        console.error("레시피 상세 조회 실패:", err);
      }
    };

    fetchData();
  }, [recipeId]);

  const filteredReviews = reviews.filter((r) =>
      (r.title ?? '').includes(searchKeyword) ||
      (r.content ?? '').includes(searchKeyword) ||
      (r.userId ?? '').includes(searchKeyword)
  );


  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const toggleItem = (number) => {
    setCheckedItems((prev) =>
      prev.includes(number) ? prev.filter((n) => n !== number) : [...prev, number]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setCheckedItems([]);
    } else {
      setCheckedItems(reviews.map((r) => r.number));
    }
    setSelectAll(!selectAll);
  };

  const openModal = (review) => {
    setSelectedReview(review);
    setDeleteReason("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReview(null);
    setModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteReason.trim()) {
      alert("삭제 사유를 입력해주세요.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (selectedReview) {
        await api.delete(`/admin/recipes/reviews/${selectedReview.reviewId}`, {
          params: { reason: deleteReason },
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await Promise.all(
          reviews
            .filter((r) => checkedItems.includes(r.number))
            .map((r) =>
              api.delete(`/admin/recipes/reviews/${r.reviewId}`, {
                params: { reason: deleteReason },
                headers: { Authorization: `Bearer ${token}` },
              })
            )
        );
      }

      alert("삭제가 완료되었습니다.");
      const res = await api.get(`/admin/recipes/${recipeId}`);
      setReviews(
        res.data.reviews?.map((r, idx) => ({
          number: idx + 1,
          reviewId: r.reviewId,
          userId: r.userId,
          title: r.title,
          content: r.content,
          date: r.createdAt?.split("T")[0],
        })) || []
      );
      setCheckedItems([]);
      setSelectAll(false);
      closeModal();
    } catch (err) {
      console.error("리뷰 삭제 실패", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    setCheckedItems([]);
  };

  return (
    <div className="recipe-detail-container">
      <div className="white-box">
        <h2>레시피 상세정보</h2>
        <hr className="recipe-divider" />

        <div className="tab-wrapper">
          <button className={`tab tab-left ${activeTab === "재료" ? "active" : ""}`} onClick={() => setActiveTab("재료")}>재료</button>
          <button className={`tab tab-center ${activeTab === "조리순서" ? "active" : ""}`} onClick={() => setActiveTab("조리순서")}>조리순서</button>
          <button className={`tab tab-right ${activeTab === "리뷰" ? "active" : ""}`} onClick={() => setActiveTab("리뷰")}>리뷰</button>
        </div>

        <hr className="tab-divider" />

        {(activeTab === "재료" || activeTab === "조리순서") && (
          <>
            <table className="detail-table">
              <tbody>
                <tr><th>카테고리</th><td>{recipe.category}</td></tr>
                <tr><th>제목</th><td>{recipe.title}</td></tr>
                <tr><th>아이디</th><td>{recipe.username}</td></tr>
                <tr><th>날짜</th><td>{recipe.date}</td></tr>
                <tr>
                  <th>이미지</th>
                  <td>
                    {recipe.image ? (
                      <img src={recipe.image} alt="레시피 이미지" className="detail-image" />
                    ) : (
                      <div className="image-placeholder">이미지 없음</div>
                    )}
                  </td>
                </tr>
                <tr><th>인분</th><td>{recipe.serving}</td></tr>
                <tr><th>난이도</th><td>{recipe.level}</td></tr>
                <tr><th>시간</th><td>{recipe.time}</td></tr>
                <tr><th>태그</th><td>{recipe.tag}</td></tr>
                <tr><th>찜 수</th><td>{recipe.heartNumber}</td></tr>
                <tr><th>추천 수</th><td>{recipe.recommendNumber}</td></tr>
                <tr><th>조회 수</th><td>{recipe.seeNumber}</td></tr>
              </tbody>
            </table>

            {activeTab === "재료" && (
              <>
                <h3 className="section-title">재료</h3>
                <table className="ingredient-table">
                  <tbody>
                    {ingredients.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {activeTab === "조리순서" && (
              <div className="step-list">
                {steps.map((step) => {
                  const cleanedText = step.text.replace(/^STEP\s*\d+[:：]?/i, "");
                  return (
                    <div className="step-row" key={step.step}>
                      <div className="step-th">STEP {step.step}</div>
                      <div className="step-td">
                        {step.image && (
                          <img src={step.image} alt={`step${step.step}`} className="step-image" />
                        )}
                      </div>
                      <div className="step-td step-text">{cleanedText}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === "리뷰" && (
          <>
            <div className="top-bar">
              <div className="checkbox-wrapper">
                <input type="checkbox" className="check" checked={selectAll} onChange={toggleSelectAll} />
                <label>전체</label>
              </div>
              <div className="search-box-wrapper">
                <div className="search-box">
                  <input type="text" placeholder="리뷰 검색" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
                  <span className="search-icon">🔍</span>
                </div>
              </div>
              <div className="delete-button-wrapper">
                <button className="top-delete-button" onClick={() => {
                  if (checkedItems.length === 0) {
                    alert("삭제할 리뷰를 선택해주세요.");
                    return;
                  }
                  setSelectedReview(null);
                  setDeleteReason("");
                  setModalOpen(true);
                }}>
                  삭제
                </button>
              </div>
            </div>

            <table className="review-table">
              <thead>
                <tr>
                  <th></th>
                  <th>번호</th>
                  <th>아이디</th>
                  <th>제목</th>
                  <th>내용</th>
                  <th>작성 날짜</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentReviews.map((review) => (
                  <tr key={review.number}>
                    <td>
                      <input type="checkbox" className="check" checked={checkedItems.includes(review.number)} onChange={() => toggleItem(review.number)} />
                    </td>
                    <td>{review.number}</td>
                    <td>{review.userId}</td>
                    <td>{review.title}</td>
                    <td>{review.content}</td>
                    <td>{review.date}</td>
                    <td className="buttons">
                      <button className="delete" onClick={() => openModal(review)}>삭제</button>
                      <button className="detailSee" onClick={() => navigate(`/recipes/${recipe.id}/reviews/${review.number}`)}>상세보기</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <span onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}>{"<"}</span>
              {[...Array(totalPages)].map((_, i) => (
                <span key={i} className={i + 1 === currentPage ? "active" : ""} onClick={() => handlePageClick(i + 1)}>{i + 1}</span>
              ))}
              <span onClick={() => currentPage < totalPages && handlePageClick(currentPage + 1)}>{">"}</span>
            </div>
          </>
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>리뷰를 삭제하시는 이유가 어떻게 되시나요?</p>
            <textarea className="modal-textarea" placeholder="사유를 입력해주세요" value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} />
            <button className="modal-button" onClick={handleConfirmDelete}>확인</button>
            <button className="modal-button cancel" onClick={closeModal}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
}
