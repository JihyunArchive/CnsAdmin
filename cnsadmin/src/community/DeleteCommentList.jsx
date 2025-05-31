import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeleteCommentList.css";
import "../recipe/DeleteModal.css";

export default function DeleteCommentList() {
  const navigate = useNavigate();

  const [dcomments] = useState([
    { number: 1, id: "john123", postContent: "동해바다가 보고싶어서 펜션을 빌렸어요. 바베큐...", commentContent: "어머!! 바다사진 너무..." },
  { number: 2, id: "emma_cook", postContent: "가족 여행을 다녀왔는데 정말 힐링이었어요!", commentContent: "가족끼리 여행 부럽네요!" },
  { number: 3, id: "david456", postContent: "서울 야경을 보러 남산타워 다녀왔습니다.", commentContent: "야경 사진 공유해줘요!" },
  { number: 4, id: "cookmaster01", postContent: "강릉 커피거리 카페투어! 추천해요.", commentContent: "저도 커피 좋아하는데~ 가봐야겠어요!" },
  { number: 5, id: "foodie_lee", postContent: "제주도 흑돼지 먹고 왔어요. 인생고기!", commentContent: "군침 도네요ㅠㅠ" },
  { number: 6, id: "skylover", postContent: "비행기 타고 부산 야경 보러 갔어요.", commentContent: "로망이네요 ✈️" },
  { number: 7, id: "travel_maniac", postContent: "여수 밤바다 들으면서 걷기 너무 좋았어요.", commentContent: "노래 제목이랑 딱이네요!" },
  { number: 8, id: "mountain_hiker", postContent: "설악산 등산! 정상 뷰가 미쳤어요.", commentContent: "진짜 힐링이죠 등산은~" },
  { number: 9, id: "citysnapper", postContent: "홍대 거리 사진 찍으러 나갔다가 소품샵 탐방!", commentContent: "홍대는 진짜 볼게 많아요 ㅎㅎ" },
  { number: 10, id: "healing_trip", postContent: "온천여행 다녀왔어요. 피로가 싹 풀리네요.", commentContent: "온천 최고에요~ 몸 녹고 좋죠!" },
  { number: 11, id: "island_seeker", postContent: "울릉도 다녀왔는데 생각보다 교통이 불편했어요.", commentContent: "헉 그래도 경치는 좋았죠?" },
  { number: 12, id: "photo_jenny", postContent: "봄꽃 촬영하러 진해 갔다왔어요. 벚꽃 만개!", commentContent: "진해 벚꽃은 진리죠 🌸" }
  ]);

  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [viewReason, setViewReason] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const dcommentsPerPage = 10;

  const indexOfLastDcomment = currentPage * dcommentsPerPage;
  const indexOfFirstDcomment = indexOfLastDcomment - dcommentsPerPage;
  const currentDcomments = dcomments.slice(indexOfFirstDcomment, indexOfLastDcomment);
  const totalPages = Math.ceil(dcomments.length / dcommentsPerPage);

  const toggleSelectAll = () => {
    setCheckedItems(selectAll ? [] : currentDcomments.map((r) => r.number));
    setSelectAll(!selectAll);
  };

  const toggleItem = (number) => {
    setCheckedItems((prev) =>
      prev.includes(number) ? prev.filter((n) => n !== number) : [...prev, number]
    );
  };

  const openModal = (dcomment) => {
    setViewReason(dcomment.reason || "비속어 섞여있음");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectAll(false);
    setCheckedItems([]);
  };

  return (
    <div className="dcomment-list-container">
      <div className="white-box">
        <h2>삭제된 댓글 리스트</h2>
        <hr className="dcomment-divider" />

        <div className="top-bar">
          <div className="checkbox-wrapper">
          </div>
          <div className="search-box">
            <input type="text" placeholder="댓글 검색" />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <table className="dcomment-table">
          <thead>
            <tr>
              <th></th>
              <th>번호</th>
              <th>아이디</th>
              <th>게시물 내용</th>
              <th>댓글 내용</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentDcomments.map((dcomment) => (
              <tr key={dcomment.number}>
                <td>
                  <input
                    type="checkbox"
                    className="check"
                    checked={checkedItems.includes(dcomment.number)}
                    onChange={() => toggleItem(dcomment.number)}
                  />
                </td>
                <td>{dcomment.number}</td>
                <td>{dcomment.id}</td>
                <td>{dcomment.postContent}</td>
                <td>{dcomment.commentContent}</td>
                <td className="buttons">
                  <button className="reason" onClick={() => openModal(dcomment)}>사유</button>
                  <button className="detailSee" onClick={() => navigate(`/posts/${dcomment.number}`)}>상세보기</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <span onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}>{"<"}</span>
          {[...Array(totalPages)].map((_, i) => (
            <span
              key={i}
              className={i + 1 === currentPage ? "active" : ""}
              onClick={() => handlePageClick(i + 1)}
            >
              {i + 1}
            </span>
          ))}
          <span onClick={() => currentPage < totalPages && handlePageClick(currentPage + 1)}>{">"}</span>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{viewReason}</p>
            <button className="modal-button" onClick={closeModal}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
}
