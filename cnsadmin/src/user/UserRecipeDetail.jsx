import React, { useState } from "react";
import "./UserRecipeDetail.css";

export default function UserRecipeDetail() {
  const [activeTab, setActiveTab] = useState("정보");

  const recipe = {
    category: "채식",
    title: "알배추전골과 구운 두부 버섯 샐러드",
    id: "1112jyjin",
    date: "2025-05-01",
    image: "/image_recipe.png",
    serving: "4인분",
    level: "초급",
    time: "30분",
    tag: "알배추, 두부, 버섯, 샐러드, 전골골",
    star: "5점",
    heartNumber: "54개",
    recommendNumber: "70개",
    seeNumber: "804회"
  };

  const steps = [
    {
      step: 1,
      image: "/image_recipe_step1.png",
      text: `다진 돼지고기에 밑간 재료를 넣어 골고루 섞어주세요.
            쪽파는 4cm 길이로 자르고, 양파는 채 썰고, 느타리버섯과 만가닥 버섯은 밑동을 자르고 먹기 좋게 찢어주세요.
            채소는 흐르는 물에 씻은 후 물기를 제거해 주세요.`
    },
    {
      step: 2,
      image: "/image_recipe_step2.png",
      text: `알배추는 길게 반으로 자른 후 잎 사이에 밑간한 돼지고기를 얇게 바르듯이 채워주세요.`
    },
    {
      step: 3,
      image: "/image_recipe_step3.png",
      text: `두부는 키친타월로 물기를 제거한 후 칼집을 넣고 소금, 후춧가루를 뿌려주세요. 드레싱 재료도 미리 섞어주세요.`
    },
    {
      step: 4,
      image: "/image_recipe_step4.png",
      text: `콤비팬에 알배추와 육수, 된장을 넣고, 2단에는 두부와 채소를 놓은 트레이를 넣고 도어를 닫아주세요.`
    },
    {
      step: 5,
      image: "/image_recipe_step5.png",
      text: `smart switch를 combi meals로 선택하고 온도 200도, 시간 15분 설정 후 START.`
    },
    {
      step: 6,
      image: "/image_recipe_step6.png",
      text: `완료음이 울리면 팬을 꺼내주세요.`
    },
    {
      step: 7,
      image: "/image_recipe_step7.png",
      text: `알배추 전골 위에 고명을 뿌리고 자른 후, 두부와 샐러드는 접시에 담아 드레싱 소스를 뿌려주세요.`
    }
  ];

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
                <tr><td>알배추</td><td>1/2통</td></tr>
                <tr><td>다진 돼지고기</td><td>400g</td></tr>
                <tr><td>쪽파</td><td>3대</td></tr>
                <tr><td>고춧가루</td><td>1큰술</td></tr>
                <tr><td>통깨</td><td>2큰술</td></tr>
                <tr><td>멸치육수</td><td>5큰술</td></tr>
              </tbody>
            </table>
          </>
        )}

        {activeTab === "조리순서" && (
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

            <div className="step-list">
              {steps.map((step) => (
                <div className="step-row" key={step.step}>
                  <div className="step-th">STEP {step.step}</div>
                  <div className="step-td">
                    <img src={step.image} alt={`step${step.step}`} className="step-image" />
                  </div>
                  <div className="step-td step-text">{step.text}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
