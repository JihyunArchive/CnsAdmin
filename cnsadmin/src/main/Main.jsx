import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Main.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Main() {
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [popularTrades, setPopularTrades] = useState([]);
  const [popularBoards, setPopularBoards] = useState([]);
  const [recipeStats, setRecipeStats] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchPopularRecipes = async () => {
      try {
        const res = await axios.get(BASE_URL + "/admin/recipes/top3", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPopularRecipes(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("🔥 인기 레시피 실패:", err);
      }
    };

    const fetchPopularTrades = async () => {
      try {
        const res = await axios.get(BASE_URL + "/admin/popular/top3", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPopularTrades(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("🔥 인기 거래글 실패:", err);
      }
    };

    const fetchPopularBoards = async () => {
      try {
        const res = await axios.get(BASE_URL + "/admin/boards/top3", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPopularBoards(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("🔥 인기 커뮤니티 실패:", err);
      }
    };

    const fetchRecipeStats = async () => {
      try {
        const res = await axios.get(BASE_URL + "/admin/recipe/monthly", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const formatted = Array.isArray(res.data)
          ? res.data.map(stat => ({
              month: stat.yearMonth?.split("-")[1]?.replace(/^0/, "") + "월",
              count: stat.count ?? 0
            }))
          : [];
        setRecipeStats(formatted);
      } catch (err) {
        console.error("🔥 레시피 통계 실패:", err);
      }
    };

    fetchPopularRecipes();
    fetchPopularTrades();
    fetchPopularBoards();
    fetchRecipeStats();
  }, []);

  return (
    <div className="main-container">
      <div className="welcome">관리자님, 반가워요!</div>

      <div className="content-grid">
        {/* 인기 레시피 */}
        <div className="box">
          <h3>인기 레시피</h3>
          {popularRecipes.length === 0 ? (
            <div>로딩 중...</div>
          ) : (
            popularRecipes.map((recipe, index) => (
              <div key={index} className="card">
                <img
                  src={recipe.mainImageUrl ? `${BASE_URL}${recipe.mainImageUrl}` : "/assets/sample.png"}
                  alt="recipe"
                />
                <div>
                  <div className="card-title">
                    {recipe.title && recipe.title.length > 30
                      ? recipe.title.substring(0, 30) + "..."
                      : recipe.title || "(제목 없음)"}
                  </div>
                  <div className="card-info">
                    {recipe.category ?? "카테고리 없음"} |{" "}
                    {recipe.createdAt?.substring(5, 16).replace("T", " ") ?? "날짜 없음"}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 레시피 통계 */}
        <div className="box">
          <h3>레시피 통계</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={recipeStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2aa52a" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 인기 거래글 */}
        <div className="box">
          <h3>동네주방 거래글</h3>
          {popularTrades.length === 0 ? (
            <div>로딩 중...</div>
          ) : (
            popularTrades.map((trade, i) => (
              <div key={i} className="card">
                <img
                  src={trade.imageUrl ? `${BASE_URL}${trade.imageUrl}` : "/assets/sample.png"}
                  alt="trade"
                />
                <div>
                  <div className="card-title">
                    {trade.title && trade.title.length > 30
                      ? trade.title.substring(0, 30) + "..."
                      : trade.title || "(제목 없음)"}
                  </div>
                  <div className="card-info">
                    {trade.username ?? "사용자 없음"} |{" "}
                    {trade.createdAt?.substring(5, 16).replace("T", " ") ?? "날짜 없음"}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 인기 커뮤니티 */}
        <div className="box">
          <h3>커뮤니티</h3>
          {popularBoards.length === 0 ? (
            <div>로딩 중...</div>
          ) : (
            popularBoards.map((board, i) => (
              <div key={i} className="card">
                <img src="/assets/sample.png" alt="board" />
                <div>
                  <div className="card-title">
                    {board.title && board.title.length > 30
                      ? board.title.substring(0, 30) + "..."
                      : board.title || "(제목 없음)"}
                  </div>
                  <div className="card-info">
                    {board.username ?? "작성자 없음"} |{" "}
                    {board.createdAt?.substring(5, 16).replace("T", " ") ?? "날짜 없음"}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
