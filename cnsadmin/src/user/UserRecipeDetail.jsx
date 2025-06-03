// src/user/UserRecipeDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./UserRecipeDetail.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function UserRecipeDetail() {
  const [activeTab, setActiveTab] = useState("정보");
  const [recipe, setRecipe] = useState(null);
  const [steps, setSteps] = useState([]);
  const { recipeId } = useParams();

  useEffect(() => {
  const fetchRecipe = async () => {
    try {
      if (!recipeId) {
        console.error("recipeId가 없습니다.");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("토큰이 없습니다.");
        return;
      }

      const res = await axios.get(`${BASE_URL}/admin/recipes/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;

      let parsedTags = "";
      if (Array.isArray(data.tags)) {
        parsedTags = data.tags.join(", ");
      } else if (typeof data.tags === "string") {
        parsedTags = data.tags;
      }

      let parsedIngredients = [];
      try {
        parsedIngredients = JSON.parse(data.ingredients);
        if (!Array.isArray(parsedIngredients)) parsedIngredients = [];
      } catch {
        parsedIngredients = [];
      }

      let parsedSteps = [];
      try {
        parsedSteps = JSON.parse(data.cookingSteps);
        if (!Array.isArray(parsedSteps)) parsedSteps = [];
      } catch {
        parsedSteps = [];
      }

      setRecipe({
        category: data.category,
        title: data.title,
        id: data.username,
        date: data.createdAt?.substring(0, 10),
        image: data.thumbnailUrl,
        serving: data.serving,
        level: data.level,
        time: data.time,
        tag: parsedTags,
        star: data.star + "점",
        heartNumber: data.likeCount + "개",
        recommendNumber: data.recommendCount + "개",
        seeNumber: data.viewCount + "회",
        ingredients: parsedIngredients,
      });

      setSteps(parsedSteps); // ✅ 이것만 남기기
    } catch (err) {
      console.error("레시피 정보를 불러올 수 없습니다:", err);
      setRecipe(null);
    }
  };

  fetchRecipe();
}, [recipeId]);

  if (!recipe) {
    return <div className="recipe-detail-container">레시피 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="recipe-detail-container">
      <div className="white-box">
        <h2>레시피 상세정보</h2>
        <hr className="recipe-divider" />

        <div className="tab-wrapper">
          <button
            className={`tab tab-left ${activeTab === "정보" ? "active" : ""}`}
            onClick={() => setActiveTab("정보")}
          >
            정보
          </button>
          <button
            className={`tab tab-right ${activeTab === "조리순서" ? "active" : ""}`}
            onClick={() => setActiveTab("조리순서")}
          >
            조리순서
          </button>
        </div>

        <hr className="tab-divider" />

        {activeTab === "정보" && (
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
                {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
                  recipe.ingredients.map((ing, idx) => (
                    <tr key={`${ing.name}-${idx}`}>
                      <td>{ing.name}</td>
                      <td>{ing.amount}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="2">재료 정보가 없습니다</td></tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "조리순서" && (
          <div className="step-list">
            {steps.map((step, index) => (
              <div className="step-row" key={index}>
                <div className="step-th">STEP {step.step}</div>
                <div className="step-td">
                  <img src={step.imageUrl} alt={`step${step.step}`} className="step-image" />
                </div>
                <div className="step-td step-text">{step.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
