import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PostList.css";

export default function PostList() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([
    { number: 1, id: "john123", postcontent: "동해바다가 보고싶어서 펜션을 빌렸어요. 바베큐...", date: "2025-05-01" },
    { number: 2, id: "emma_cook", postcontent: "가족 여행을 다녀왔는데 정말 힐링이었어요!", date: "2025-05-03" },
    { number: 3, id: "david456", postcontent: "서울 야경을 보러 남산타워 다녀왔습니다.", date: "2025-05-04" },
    { number: 4, id: "cookmaster01", postcontent: "강릉 커피거리 카페투어! 추천해요.", date: "2025-05-05" },
    { number: 5, id: "foodie_lee", postcontent: "주말에 캠핑 다녀왔어요~ 날씨도 좋고 음식도 맛있고!", date: "2025-05-06" },
    { number: 6, id: "chef_kim", postcontent: "여수 밤바다 감성 제대로 느끼고 왔어요.", date: "2025-05-07" },
    { number: 7, id: "recipequeen", postcontent: "인천 차이나타운 먹방 투어 추천!", date: "2025-05-08" },
    { number: 8, id: "kitchenhero", postcontent: "벚꽃 시즌에 진해 다녀왔어요~ 사진 대박!", date: "2025-05-09" },
    { number: 9, id: "chef_sun", postcontent: "설악산 등산으로 체력 단련했습니다!", date: "2025-05-10" },
    { number: 10, id: "ricegod", postcontent: "속초 대게찜 먹고 왔어요. 완전 강추!", date: "2025-05-11" },
    { number: 11, id: "cooknara", postcontent: "제주도 우도 투어는 언제나 옳아요.", date: "2025-05-12" },
    { number: 12, id: "kimfood", postcontent: "남해 다랭이 마을, 조용한 힐링 장소였어요.", date: "2025-05-13" }
  ]);

  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = posts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const toggleSelectAll = () => {
    if (selectAll) {
      setCheckedItems([]);
    } else {
      setCheckedItems(posts.map((p) => p.number));
    }
    setSelectAll(!selectAll);
  };

  const toggleItem = (number) => {
    setCheckedItems((prev) =>
      prev.includes(number) ? prev.filter((n) => n !== number) : [...prev, number]
    );
  };

  const openModal = (post) => {
    setSelectedPost(post);
    setDeleteReason("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedPost) {
      setPosts((prev) => prev.filter((p) => p.number !== selectedPost.number).map((p, i) => ({ ...p, number: i + 1 })));
      setCheckedItems((prev) => prev.filter((id) => id !== selectedPost.number));
    } else {
      if (checkedItems.length > 5 && !window.confirm("정말 선택한 게시물들을 삭제하시겠습니까?")) return;
      setPosts((prev) => prev.filter((p) => !checkedItems.includes(p.number)).map((p, i) => ({ ...p, number: i + 1 })));
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
    <div className="post-list-container">
      <div className="white-box">
        <h2>게시물 리스트</h2>
        <hr className="post-divider" />

        <div className="top-bar">
          <div className="checkbox-wrapper">
            <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} className="check" />
            <label>전체</label>
          </div>

          <div className="search-box-wrapper">
            <div className="search-box">
              <input type="text" placeholder="게시물 검색" />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="delete-button-wrapper">
            <button className="top-delete-button" onClick={() => openModal(null)}>삭제</button>
          </div>
        </div>

        <table className="post-table">
          <thead>
            <tr>
              <th></th>
              <th>번호</th>
              <th>아이디</th>
              <th>내용</th>
              <th>게시 날짜</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((post) => (
              <tr key={post.number}>
                <td>
                  <input
                    type="checkbox"
                    className="check"
                    checked={checkedItems.includes(post.number)}
                    onChange={() => toggleItem(post.number)}
                  />
                </td>
                <td>{post.number}</td>
                <td>{post.id}</td>
                <td>{post.postcontent}</td>
                <td>{post.date}</td>
                <td className="buttons">
                  <button className="delete" onClick={() => openModal(post)}>삭제</button>
                  <button className="detailSee" onClick={() => navigate(`/posts/${post.number}`)}>
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
            <p>게시물을 삭제하시는 이유가 어떻게 되시나요?</p>
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
