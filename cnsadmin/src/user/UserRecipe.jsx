import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserRecipe.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function UserRecipe() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  const fetchRecipes = useCallback(async () => {
    try {
      const url = searchKeyword
        ? `${BASE_URL}/admin/users/${userId}/recipes/search?keyword=${encodeURIComponent(searchKeyword)}`
        : `${BASE_URL}/admin/users/${userId}/recipes`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const recipeList = res.data.content.map((item) => ({
        id: item.recipeId,
        username: item.username,
        title: item.title,
        date: item.createdAt?.replace("T", " ").substring(0, 16),
      }));

      setRecipes(recipeList);
    } catch (err) {
      console.error("❌ 레시피 불러오기 실패:", err);
    }
  }, [userId, searchKeyword]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleSearch = () => {
    fetchRecipes();
  };

  return (
    <div className="user-recipe-container">
      <h2>등록한 레시피</h2>

      <div className="recipe-top-bar">
        <input
          type="text"
          placeholder="레시피 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>🔍</button>
      </div>

      <table className="recipe-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>아이디</th>
            <th>제목</th>
            <th>게시 날짜</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe, index) => (
            <tr key={`${recipe.id}-${index}`}>
              <td>{index + 1}</td>
              <td>{recipe.username}</td>
              <td>{recipe.title}</td>
              <td>{recipe.date}</td>
              <td className="buttons">
                <button
                  className="view-button"
                  onClick={() => navigate(`/admin/recipes/${recipe.id}`)}
                >
                  보기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <span>{"<"}</span>
        {[...Array(1)].map((_, i) => (
          <span key={`page-${i}`} className={i === 0 ? "active" : ""}>
            {i + 1}
          </span>
        ))}
        <span>{">"}</span>
      </div>
    </div>
  );
}
