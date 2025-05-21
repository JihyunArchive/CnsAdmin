import React from "react";
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

const recipeStats = [
  { month: "9월", count: 100 },
  { month: "10월", count: 200 },
  { month: "11월", count: 300 },
  { month: "12월", count: 400 }
];

export default function Main() {
  return (
    <div className="main-container">   
      <div className="welcome">관리자님, 반가워요!</div>

      <div className="content-grid">
        <div className="box">
          <h3>인기 레시피</h3>
          {[1, 2, 3].map((i) => (
            <div key={i} className="card">
              <img src="/assets/sample.png" alt="sample" />
              <div>
                <div className="card-title">
                  건조 적당하고 겨울에 따뜻하게 맛있게 먹었어요! 예...
                </div>
                <div className="card-info">추천한식 | 12.28 20:00</div>
              </div>
            </div>
          ))}
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
