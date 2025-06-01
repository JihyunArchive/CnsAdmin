// src/user/UserRecipe.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./UserRecipe.css";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function UserRecipe() {
  const { userId } = useParams(); // ✅ userId로 받기
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin/users/${userId}/recipes`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const recipeList = res.data.map((item, index) => ({
          id: index + 1,
          number: res.data.length - index, // 내림차순 번호
          username: item.username,
          title: item.title,
          date: item.createdAt?.replace("T", " ").substring(0, 16),
        }));

        setRecipes(recipeList);
      } catch (err) {
        console.error("❌ 레시피 불러오기 실패:", err);
      }
    };

    fetchRecipes();
  }, [userId]);

  return (
    <div className="user-recipe-container">
      <h2>등록한 레시피</h2>

      <div className="recipe-top-bar">
        <input type="text" placeholder="레시피 검색" />
        <button className="search-button">🔍</button>
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
          {recipes.map((recipe) => (
            <tr key={recipe.id}>
              <td>{recipe.number}</td>
              <td>{recipe.username}</td>
              <td>{recipe.title}</td>
              <td>{recipe.date}</td>
              <td className="buttons">
                <button className="view-button">보기</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <span>{"<"}</span>
        {[...Array(10)].map((_, i) => (
          <span key={i} className={i === 0 ? "active" : ""}>
            {i + 1}
          </span>
        ))}
        <span>{">"}</span>
      </div>
    </div>
  );
}
