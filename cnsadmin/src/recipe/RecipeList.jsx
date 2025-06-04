import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "./RecipeList.css";
import "./DeleteModal.css";

export default function RecipeList() {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const recipesPerPage = 10;

  const fetchRecipes = async () => {
    try {
      const res = searchKeyword
        ? await api.get("/admin/recipes/search", {
            params: {
              title: searchKeyword,
              page: currentPage - 1,
              size: recipesPerPage,
            },
          })
        : await api.get("/admin/recipes", {
            params: {
              page: currentPage - 1,
              size: recipesPerPage,
            },
          });

      const content = res.data.content;
      setRecipes(
        content.map((r, idx) => ({
          number: idx + 1 + (currentPage - 1) * recipesPerPage,
          id: r.username,
          title: r.title,
          content: "",
          date: r.createdAt.slice(0, 10),
          recipeId: r.recipeId,
        }))
      );
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("레시피 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [currentPage, searchKeyword]);

  const toggleSelectAll = () => {
    if (selectAll) {
      setCheckedItems([]);
    } else {
      setCheckedItems(recipes.map((r) => r.recipeId));
    }
    setSelectAll(!selectAll);
  };

  const toggleItem = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    setDeleteReason("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
    setModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteReason) {
      alert("삭제 사유를 입력해주세요.");
      return;
    }

    try {
      if (selectedRecipe) {
        await api.delete(`/admin/recipes/${selectedRecipe.recipeId}`, {
          data: { reason: deleteReason },
        });
      } else {
        for (const id of checkedItems) {
          await api.delete(`/admin/recipes/${id}`, {
            data: { reason: deleteReason },
          });
        }
      }

      setCheckedItems([]);
      setSelectAll(false);
      fetchRecipes();
      closeModal();
    } catch (err) {
      console.error("삭제 실패", err);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    setCheckedItems([]);
  };

  return (
    <div className="recipe-list-container">
      <div className="white-box">
        <h2>레시피 리스트</h2>
        <hr className="recipe-divider" />

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

          <div className="search-box-wrapper">
            <div className="search-box">
              <input
                type="text"
                placeholder="레시피 검색"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") fetchRecipes();
                }}
              />
              <span className="search-icon" onClick={fetchRecipes}>🔍</span>
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
                setSelectedRecipe(null);
                setDeleteReason("");
                setModalOpen(true);
              }}
            >
              삭제
            </button>
          </div>
        </div>

        <table className="recipe-table">
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
            {recipes.map((recipe) => (
              <tr key={recipe.recipeId}>
                <td>
                  <div className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      className="check"
                      checked={checkedItems.includes(recipe.recipeId)}
                      onChange={() => toggleItem(recipe.recipeId)}
                    />
                  </div>
                </td>
                <td>{recipe.number}</td>
                <td>{recipe.id}</td>
                <td>{recipe.title}</td>
                <td>{recipe.content}</td>
                <td>{recipe.date}</td>
                <td className="buttons">
                  <button className="delete" onClick={() => openModal(recipe)}>삭제</button>
                  <button
                    className="detailSee"
                    onClick={() => navigate(`/recipes/${recipe.recipeId}`)}
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
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>레시피를 삭제하시는 이유가 어떻게 되시나요?</p>
            <textarea
              className="modal-textarea"
              placeholder="사유를 입력해주세요"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
            />
            <button className="modal-button" onClick={handleConfirmDelete}>확인</button>
            <button className="modal-button cancel" onClick={closeModal}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
}