import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeleteList.css";
import "./DeleteModal.css";

export default function DeleteList() {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([
    { number: 1, id: "john123", title: "알배추전골 재료", content: "다진 돼지고기에 밑간 재료를...", date: "2025-05-01", reason: "욕설이 너무 심함" },
    { number: 2, id: "emma_cook", title: "된장찌개 끓이기", content: "된장과 멸치 육수를 준비해서...", date: "2025-05-01", reason: "부적절한 언어 사용" },
    { number: 3, id: "david456", title: "김치볶음밥 만들기", content: "김치와 밥, 햄을 준비해서...", date: "2025-05-03", reason: "허위 정보 포함" },
    { number: 4, id: "cookmaster01", title: "잡채밥 만들기", content: "잡채와 밥, 고추장을 준비해서...", date: "2025-05-05", reason: "욕설이 너무 심함" },
    { number: 5, id: "foodie_lee", title: "케찹밥 만들기", content: "케찹와 밥, 계란을 준비해서...", date: "2025-05-07", reason: "부적절한 언어 사용" },
    { number: 6, id: "chef_kim", title: "만두국 만들기", content: "먼저 재료는 만두와 육수를 준비합니다.", date: "2025-05-11", reason: "허위 정보 포함" },
    { number: 7, id: "recipequeen", title: "라면 만들기", content: "물과 라면 봉투를 준비해서...", date: "2025-05-11", reason: "욕설이 너무 심함" },
    { number: 8, id: "kitchenhero", title: "복숭아 아이스티 만들기", content: "뜨거운 물과 가루, 차가운 물을 준비해서...", date: "2025-05-11", reason: "부적절한 언어 사용"},
    { number: 9, id: "chef_sun", title: "계란말이 만들기", content: "계란을 풀고 간을 해서...", date: "2025-05-13", reason: "허위 정보 포함" },
    { number: 10, id: "ricegod", title: "밥짓기", content: "쌀을 씻고 물을 맞춰서...", date: "2025-05-15", reason: "욕설이 너무 심함" },
    { number: 11, id: "cooknara", title: "닭갈비 만들기", content: "닭고기와 양념장을 준비해서...", date: "2025-05-16", reason: "부적절한 언어 사용" },
    { number: 12, id: "kimfood", title: "떡볶이 만들기", content: "떡과 어묵, 고추장을 넣고...", date: "2025-05-17", reason: "허위 정보 포함" },
  
  ]);

  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [viewReason, setViewReason] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 10;

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  const toggleSelectAll = () => {
    if (selectAll) {
      setCheckedItems([]);
    } else {
      setCheckedItems(currentRecipes.map((r) => r.number));
    }
    setSelectAll(!selectAll);
  };

  const toggleItem = (number) => {
    setCheckedItems((prev) =>
      prev.includes(number) ? prev.filter((n) => n !== number) : [...prev, number]
    );
  };

  const openModal = (recipe) => {
    setViewReason(recipe.reason || "사유가 없습니다.");
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
        <h2>삭제된 레시피 리스트</h2>
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
            <input type="text" placeholder="레시피 검색" />
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
            {currentRecipes.map((recipe) => (
              <tr key={recipe.number}>
                <td>
                  <input
                    type="checkbox"
                    className="check"
                    checked={checkedItems.includes(recipe.number)}
                    onChange={() => toggleItem(recipe.number)}
                  />
                </td>
                <td>{recipe.number}</td>
                <td>{recipe.id}</td>
                <td>{recipe.title}</td>
                <td>{recipe.content}</td>
                <td>{recipe.date}</td>
                <td className="buttons">
                  <button className="reason" onClick={() => openModal(recipe)}>사유</button>
                  <button className="detailSee" onClick={() => navigate(`/recipes/${recipe.number}`)}>상세보기</button>
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
