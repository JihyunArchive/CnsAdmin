import React from "react";

function Login(props) {
  console.log("🔥 props 확인:", props); // 이 줄 꼭 남겨줘

  const handleClick = () => {
    console.log("✅ 로그인 버튼 클릭됨");
    props.onLogin(); // props를 통해 onLogin 호출
  };

  return (
    <div className="container">
      <div className="login-box">
        <h1 className="title">쿡앤쉐어</h1>
        <p className="subtitle">냉장고 속 재료로 만들어보아요</p>

        <input type="text" placeholder="아이디" className="input" />
        <input type="password" placeholder="비밀번호" className="input" />

        <button className="login-button" onClick={handleClick}>
          로그인
        </button>
        <div className="signup-link">회원가입</div>
      </div>
    </div>
  );
}

export default Login;
