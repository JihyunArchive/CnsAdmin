import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RecipeDetail.css";
import "./DeleteModal.css";

export default function RecipeDetail() {
  const [activeTab, setActiveTab] = useState("판매");
  const [checkedItems, setCheckedItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const navigate = useNavigate(); 
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  const recipe = {
    category: "채식",
    title: "알배추전골과 구운 두부 버섯 샐러드",
    id: "1112jyjin",
    date: "2025-05-01",
    image: "/image_recipe.png",
    serving: "4인분",
    level: "초급",
    time: "30분",
    tag: "알배추, 두부, 버섯, 샐러드, 전골골",
    star: "5점",
    heartNumber: "54개",
    recommendNumber: "70개",
    seeNumber: "804회"
  };

  const steps = [
    {
      step: 1,
      image: "/image_recipe_step1.png",
      text: `다진 돼지고기에 밑간 재료를 넣어 골고루 섞어주세요.
            쪽파는 4cm 길이로 자르고, 양파는 채 썰고, 느타리버섯과 만가닥 버섯은 밑동을 자르고 먹기 좋게 찢어주세요.
            채소는 흐르는 물에 씻은 후 물기를 제거해 주세요.`
    },
    {
      step: 2,
      image: "/image_recipe_step2.png",
      text: `알배추는 길게 반으로 자른 후 잎 사이에 밑간한 돼지고기를 얇게 바르듯이 채워주세요.`
    },
    {
      step: 3,
      image: "/image_recipe_step3.png",
      text: `두부는 키친타월로 물기를 제거한 후 칼집을 넣고 소금, 후춧가루를 뿌려주세요. 드레싱 재료도 미리 섞어주세요.`
    },
    {
      step: 4,
      image: "/image_recipe_step4.png",
      text: `콤비팬에 알배추와 육수, 된장을 넣고, 2단에는 두부와 채소를 놓은 트레이를 넣고 도어를 닫아주세요.`
    },
    {
      step: 5,
      image: "/image_recipe_step5.png",
      text: `smart switch를 combi meals로 선택하고 온도 200도, 시간 15분 설정 후 START.`
    },
    {
      step: 6,
      image: "/image_recipe_step6.png",
      text: `완료음이 울리면 팬을 꺼내주세요.`
    },
    {
      step: 7,
      image: "/image_recipe_step7.png",
      text: `알배추 전골 위에 고명을 뿌리고 자른 후, 두부와 샐러드는 접시에 담아 드레싱 소스를 뿌려주세요.`
    }
  ];

  const [reviews, setReviews] = useState([
  { number: 1, userId: "1112jyjin", title: "알배추전골과 구운 두부...", content: "재료도 간단하고 맛있어요!", date: "2025-05-01" },
  { number: 2, userId: "1112jyjin", title: "알배추전골과 구운 두부...", content: "정말 쉽게 만들 수 있었어요.", date: "2025-05-01" },
  { number: 3, userId: "1112jyjin", title: "알배추전골과 구운 두부...", content: "담백하고 맛있었어요!", date: "2025-05-01" },
  { number: 4, userId: "emma_cook", title: "채소볶음 후기", content: "간편하게 할 수 있어 좋아요.", date: "2025-05-02" },
  { number: 5, userId: "kimchef", title: "두부스테이크 굿", content: "아이도 잘 먹었어요.", date: "2025-05-03" },
  { number: 6, userId: "david456", title: "전골 맛집", content: "이 레시피만 보고 따라했는데 완벽!", date: "2025-05-04" },
  { number: 7, userId: "cooklover", title: "구운 두부 샐러드", content: "상큼하고 건강해요.", date: "2025-05-05" },
  { number: 8, userId: "sally12", title: "알배추전골 후기", content: "양이 푸짐해서 만족!", date: "2025-05-06" },
  { number: 9, userId: "minji_cook", title: "담백하고 좋아요", content: "자극적이지 않고 딱 좋아요.", date: "2025-05-07" },
  { number: 10, userId: "foodqueen", title: "전골 후기", content: "냄새도 안 나고 깔끔해요.", date: "2025-05-08" },
  { number: 11, userId: "yummy89", title: "강추합니다", content: "너무 맛있게 잘 먹었어요!", date: "2025-05-09" },
  { number: 12, userId: "johnny45", title: "최고의 레시피", content: "이건 진짜 저장각입니다.", date: "2025-05-10" },
]);

const filteredReviews = reviews.filter(
    (r) =>
      r.title.includes(searchKeyword) ||
      r.content.includes(searchKeyword) ||
      r.userId.includes(searchKeyword)
  );

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const toggleItem = (number) => {
    setCheckedItems(prev =>
      prev.includes(number) ? prev.filter(n => n !== number) : [...prev, number]
    );
  };

  const toggleSelectAll = () => {
  const allIds = currentReviews.map((r) => r.number);
  setCheckedItems(
    checkedItems.length === allIds.length ? [] : allIds
  );
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

  const handleConfirmDelete = () => {
  if (selectedReview) {
    // 단일 삭제 (모달에서 특정 리뷰 삭제)
    setReviews((prev) =>
      prev.filter((r) => r.number !== selectedReview.number)
          .map((r, i) => ({ ...r, number: i + 1 }))
    );
    setCheckedItems((prev) => prev.filter((id) => id !== selectedReview.number));
    closeModal();
  } else if (checkedItems.length > 0) {
    setReviews((prev) =>
      prev.filter((r) => !checkedItems.includes(r.number))
          .map((r, i) => ({ ...r, number: i + 1 }))
    );
    setCheckedItems([]);
    closeModal();
  }
};

const handlePageClick = (pageNumber) => {
  setCurrentPage(pageNumber);
  setCheckedItems([]); // 페이지 이동 시 선택 초기화
};


  return (
    <div className="recipe-detail-container">
      <div className="white-box">
        <h2>레시피 상세정보</h2>
        <hr className="recipe-divider" />

        <div className="tab-wrapper">
          <button
            className={`tab tab-left ${activeTab === "판매" ? "active" : ""}`}
            onClick={() => setActiveTab("판매")}
          >
            판매
          </button>
          <button
            className={`tab tab-center ${activeTab === "조리순서" ? "active" : ""}`}
            onClick={() => setActiveTab("조리순서")}
          >
            조리순서
          </button>
          <button
            className={`tab tab-right ${activeTab === "리뷰" ? "active" : ""}`}
            onClick={() => setActiveTab("리뷰")}
          >
            리뷰
          </button>
        </div>

        <hr className="tab-divider" />

        {activeTab === "판매" && (
          <>
            <table className="detail-table">
              <tbody>
                <tr><th>카테고리</th><td>{recipe.category}</td></tr>
                <tr><th>제목</th><td>{recipe.title}</td></tr>
                <tr><th>아이디</th><td>{recipe.id}</td></tr>
                <tr><th>날짜</th><td>{recipe.date}</td></tr>
                <tr><th>이미지</th><td><img src={recipe.image} alt="게시물 이미지" className="detail-image" /></td></tr>
                <tr><th>인분</th><td>{recipe.serving}</td></tr>
                <tr><th>난이도</th><td>{recipe.level}</td></tr>
                <tr><th>시간</th><td>{recipe.time}</td></tr>
                <tr><th>태그</th><td>{recipe.tag}</td></tr>
                <tr><th>별점</th><td>{recipe.star}</td></tr>
                <tr><th>찜 수</th><td>{recipe.heartNumber}</td></tr>
                <tr><th>추천 수</th><td>{recipe.recommendNumber}</td></tr>
                <tr><th>조회 수</th><td>{recipe.seeNumber}</td></tr>
              </tbody>
            </table>

            <h3 className="section-title">재료</h3>
            <table className="ingredient-table">
              <tbody>
                <tr><td>알배추</td><td>1/2통</td></tr>
                <tr><td>다진 돼지고기</td><td>400g</td></tr>
                <tr><td>쪽파</td><td>3대</td></tr>
                <tr><td>고춧가루</td><td>1큰술</td></tr>
                <tr><td>통깨</td><td>2큰술</td></tr>
                <tr><td>멸치육수</td><td>5큰술</td></tr>
              </tbody>
            </table>
          </>
        )}

        {activeTab === "조리순서" && (
          <>
            <table className="detail-table">
              <tbody>
                <tr><th>카테고리</th><td>{recipe.category}</td></tr>
                <tr><th>제목</th><td>{recipe.title}</td></tr>
                <tr><th>아이디</th><td>{recipe.id}</td></tr>
                <tr><th>날짜</th><td>{recipe.date}</td></tr>
                <tr><th>이미지</th><td><img src={recipe.image} alt="게시물 이미지" className="detail-image" /></td></tr>
                <tr><th>인분</th><td>{recipe.serving}</td></tr>
                <tr><th>난이도</th><td>{recipe.level}</td></tr>
                <tr><th>시간</th><td>{recipe.time}</td></tr>
                <tr><th>태그</th><td>{recipe.tag}</td></tr>
                <tr><th>별점</th><td>{recipe.star}</td></tr>
                <tr><th>찜 수</th><td>{recipe.heartNumber}</td></tr>
                <tr><th>추천 수</th><td>{recipe.recommendNumber}</td></tr>
                <tr><th>조회 수</th><td>{recipe.seeNumber}</td></tr>
              </tbody>
            </table>

            <div className="step-list">
              {steps.map((step) => (
                <div className="step-row" key={step.step}>
                  <div className="step-th">STEP {step.step}</div>
                  <div className="step-td">
                    <img src={step.image} alt={`step${step.step}`} className="step-image" />
                  </div>
                  <div className="step-td step-text">{step.text}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "리뷰" && (
          <>
        <div className="top-bar">
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                className="check"
                checked={checkedItems.length === currentReviews.length && currentReviews.length !== 0}
                onChange={toggleSelectAll}
              />
              <label>전체</label>
            </div>

            <div className="search-box-wrapper">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="리뷰 검색"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <span className="search-icon">🔍</span>
              </div>
            </div>

            <div className="delete-button-wrapper">
            <button
              className="top-delete-button"
              onClick={() => {
                if (checkedItems.length === 0) {
                  alert("삭제할 레시피를 선택해주세요.");
                  return;
                }
                setSelectedReview(null);
                setDeleteReason("");
                setModalOpen(true);
              }}
            >
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
                      <button className="delete" onClick={() => openModal(review)}>삭제</button>
                      <button
                        className="detailSee"
                        onClick={() => navigate(`/recipes/${recipe.id}/reviews/${review.number}`)}
                      >
                        상세보기
                      </button>
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
          </>
        )}
      </div>

      {modalOpen && ( // isModalOpen → modalOpen
        <div className="modal-overlay">
          <div className="modal-content">
            <p>리뷰를 삭제하시는 이유가 어떻게 되시나요?</p>
            <textarea
              className="modal-textarea"
              placeholder="사유를 입력해주세요"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
            />
            <button className="modal-button" onClick={handleConfirmDelete}>
              확인
            </button>
            <button className="modal-button cancel" onClick={closeModal}>
              취소
            </button>
          </div>
        </div>
)}
    </div>
  );
}
