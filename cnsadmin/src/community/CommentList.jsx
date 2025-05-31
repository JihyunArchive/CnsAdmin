import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CommentList.css";

export default function CommentList() {
  const navigate = useNavigate();

  const [comments, setComments] = useState([
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
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");

  const indexOfLast = currentPage * commentsPerPage;
  const indexOfFirst = indexOfLast - commentsPerPage;
  const currentComments = comments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  const toggleSelectAll = () => {
    if (selectAll) {
      setCheckedItems([]);
    } else {
      setCheckedItems(comments.map((p) => p.number));
    }
    setSelectAll(!selectAll);
  };

  const toggleItem = (number) => {
    setCheckedItems((prev) =>
      prev.includes(number) ? prev.filter((n) => n !== number) : [...prev, number]
    );
  };

  const openModal = (comment) => {
    setSelectedComment(comment);
    setDeleteReason("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedComment(null);
    setModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedComment) {
      setComments((prev) => prev.filter((p) => p.number !== selectedComment.number).map((p, i) => ({ ...p, number: i + 1 })));
      setCheckedItems((prev) => prev.filter((id) => id !== selectedComment.number));
    } else {
      if (checkedItems.length > 5 && !window.confirm("정말 선택한 게시물들을 삭제하시겠습니까?")) return;
      setComments((prev) => prev.filter((p) => !checkedItems.includes(p.number)).map((p, i) => ({ ...p, number: i + 1 })));
      setCheckedItems([]);
      setSelectAll(false);
    }
    closeModal();
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    setCheckedItems([]);
  };

  return (
    <div className="comment-list-container">
      <div className="white-box">
        <h2>댓글 리스트</h2>
        <hr className="comment-divider" />

        <div className="top-bar">
          <div className="checkbox-wrapper">
            <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} className="check" />
            <label>전체</label>
          </div>

          <div className="search-box-wrapper">
            <div className="search-box">
              <input type="text" placeholder="댓글 검색" />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="delete-button-wrapper">
            <button className="top-delete-button" onClick={() => openModal(null)}>삭제</button>
          </div>
        </div>

        <table className="comment-table">
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
            {currentComments.map((comment) => (
              <tr key={comment.number}>
                <td>
                  <input
                    type="checkbox"
                    className="check"
                    checked={checkedItems.includes(comment.number)}
                    onChange={() => toggleItem(comment.number)}
                  />
                </td>
                <td>{comment.number}</td>
                <td>{comment.id}</td>
                <td>{comment.postContent}</td>
                <td>{comment.commentContent}</td>
                <td className="buttons">
                  <button className="delete" onClick={() => openModal(comment)}>삭제</button>
                  <button className="detailSee" onClick={() => navigate(`/comments/${comment.number}`)}>
                    상세보기
                  </button>
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
            <p>댓글을 삭제하시는 이유가 어떻게 되시나요?</p>
            <textarea
              className="modal-textarea"
              placeholder="사유를 입력해주세요"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
            />
            <button className="modal-button" onClick={handleConfirmDelete}>확인</button>
            <button className="modal-button cancel" onClick={closeModal}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
}
