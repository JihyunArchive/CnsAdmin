// src/pages/PostList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "./PostList.css";
import "../recipe/DeleteModal.css";

export default function PostList() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");

  useEffect(() => {
    fetchPosts(currentPage - 1);
  }, [currentPage]);

  const fetchPosts = async (page) => {
    try {
      const response = await api.get("/admin/boards", {
        params: {
          page,
          size: postsPerPage,
          sortBy: "createdAt",
        },
      });
      setPosts(
        response.data.content.map((post, index) => ({
          ...post,
          number: page * postsPerPage + index + 1,
        }))
      );
    } catch (err) {
      console.error("게시글 불러오기 실패", err);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setCheckedItems([]);
    } else {
      setCheckedItems(posts.map((p) => p.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleItem = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
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

  const handleConfirmDelete = async () => {
    const adminUsername = localStorage.getItem("adminUsername") || "admin";
    if (selectedPost) {
      try {
        await api.delete(`/admin/boards/${selectedPost.id}`, {
          data: {
            adminUsername,
            reason: deleteReason,
          },
        });
        fetchPosts(currentPage - 1);
      } catch (err) {
        console.error("삭제 실패", err);
      }
    }
    closeModal();
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    setCheckedItems([]);
  };

  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className="post-list-container">
      <div className="white-box">
        <h2>게시물 리스트</h2>
        <hr className="post-divider" />

        <div className="top-bar">
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={toggleSelectAll}
              className="check"
            />
            <label>전체</label>
          </div>

          <div className="search-box-wrapper">
            <div className="search-box">
              <input type="text" placeholder="게시물 검색" />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="delete-button-wrapper">
            <button className="top-delete-button" onClick={() => openModal(null)}>
              삭제
            </button>
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
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <input
                    type="checkbox"
                    className="check"
                    checked={checkedItems.includes(post.id)}
                    onChange={() => toggleItem(post.id)}
                  />
                </td>
                <td>{post.number}</td>
                <td>{post.writer}</td>
                <td>{post.content}</td>
                <td>{post.createdAt.slice(0, 10)}</td>
                <td className="buttons">
                  <button className="delete" onClick={() => openModal(post)}>
                    삭제
                  </button>
                  <button
                    className="detailSee"
                    onClick={() => navigate(`/comments/${post.id}/board`)}
                  >
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
            <button className="modal-button" onClick={handleConfirmDelete}>
              확인
            </button>
            <button className="modal-button cancel" onClick={closeModal}>
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
