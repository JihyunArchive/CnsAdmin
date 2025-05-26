// src/Login/Login.jsx
import React, { useState } from "react"
import "./Login.css"; // ✅ 반드시 포함!
import api from "../api/axiosInstance"

function Login(props) {
  console.log("🔥 props 확인:", props);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = async () => {
    console.log("✅ 로그인 버튼 클릭됨");

    try {
      const response = await api.post("/login", { username, password });

      const data = response.data;
      const token = data.token;

      // JWT 디코딩
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      if (role !== "ROLE_ADMIN") {
        alert("⚠ 관리자만 로그인할 수 있습니다");
        return;
      }

      // 토큰 저장
      localStorage.setItem("token", token);

      // 로그인 상태 전환
      props.onLogin();
    } catch (error) {
      console.error("로그인 에러:", error);
      alert("❌ 로그인 실패: 아이디 또는 비밀번호를 확인하세요.");
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <h1 className="title">쿡앤쉐어</h1>
        <p className="subtitle">냉장고 속 재료로 만들어보아요</p>

        <input
            type="text"
            placeholder="아이디"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />
        <input
            type="password"
            placeholder="비밀번호"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-button" onClick={handleClick}>
          로그인
        </button>
        <div className="signup-link">회원가입</div>
      </div>
    </div>
  );
}

export default Login;
