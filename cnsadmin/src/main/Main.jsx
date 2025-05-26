import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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

const recipeStats = [
  { month: "9월", count: 100 },
  { month: "10월", count: 200 },
  { month: "11월", count: 300 },
  { month: "12월", count: 400 }
];



export default function Main() {

  const [popularRecipes, setPopularRecipes] = useState([]);

  useEffect(() => {
    const fetchPopularRecipes = async () => {
      try {
        const response = await axios.get(BASE_URL+"/admin/recipes/top3", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        console.log("📦 API 응답:", response.data);
        setPopularRecipes(response.data); // ← 여기서 조정 필요할 수도
      } catch (error) {
        console.error("🔥 인기 레시피 가져오기 실패:", error);
      }
    };

    fetchPopularRecipes();
  }, []);

  return (
    <div className="main-container">   
      <div className="welcome">관리자님, 반가워요!</div>

      <div className="content-grid">
        <div className="box">
          <h3>인기 레시피</h3>
          {popularRecipes.length === 0 ? (
              <div>로딩 중...</div>
          ) : (
              popularRecipes.map((recipe, index) => (
                  <div key={index} className="card">
                    <img
                        src={
                          recipe.mainImageUrl
                              ? `${BASE_URL}${recipe.mainImageUrl}`
                              : "/assets/sample.png"
                        }
                        alt="recipe"
                    />

                    <div>
                      <div className="card-title">
                        {recipe.title.length > 30
                            ? recipe.title.substring(0, 30) + "..."
                            : recipe.title}
                      </div>
                      <div className="card-info">
                        {recipe.category} | {recipe.createdAt?.substring(5, 16).replace("T", " ")}
                      </div>
                    </div>
                  </div>
              ))
          )}
        </div>

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

        <div className="box">
          <h3>동네주방 거래글</h3>
          {[1, 2, 3].map((i) => (
            <div key={i} className="card">
              <img src="/assets/sample.png" alt="sample" />
              <div>
                <div className="card-title">와 약이랑 수프 중에 이게 제일 맛있어요…T</div>
                <div className="card-info">초보건강관리인 | 12.26 10:02</div>
              </div>
            </div>
          ))}
        </div>

        <div className="box">
          <h3>커뮤니티</h3>
          <div className="tabs">
            <button>인기 게시판</button>
            <button>자유 게시판</button>
            <button>요리 게시판</button>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="card">
              <img src="/assets/sample.png" alt="sample" />
              <div>
                <div className="card-title">
                  숙취끝에 시들시들하던 저에게 한 줄기 빛...
                </div>
                <div className="card-info">피로스타일 | 12.23 11:27</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
