// src/user/UserRecipe.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./UserRecipe.css";

export default function UserRecipe() {
  const { username } = useParams();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // ✅ 실제 API 호출이 들어갈 자리
    // 예: fetch(`/api/recipes?username=${username}`).then(...)
    setRecipes(
      Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        number: 30,
        username: username,
        title: "알배추찜곁과 구운 두부 버섯 샐러드",
        date: "2025-05-01"
      }))
    );
  }, [username]);

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
