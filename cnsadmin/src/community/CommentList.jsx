// src/pages/CommentList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "./CommentList.css";
import "../recipe/DeleteModal.css";

export default function CommentList() {
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const fetchComments = async () => {
    try {
      const response = await api.get("/admin/comments", {
        params: {
          page: currentPage - 1,
          size: commentsPerPage,
        },
      });
      const data = response.data;
      setComments(
        data.content.map((comment, index) => ({
          ...comment,
          number: (currentPage - 1) * commentsPerPage + index + 1,
        }))
      );
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("댓글 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [currentPage]);

  const toggleSelectAll = () => {
    if (selectAll) {
      setCheckedItems([]);
    } else {
      setCheckedItems(comments.map((c) => c.commentId));
    }
    setSelectAll(!selectAll);
  };

  const toggleItem = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
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

  const handleConfirmDelete = async () => {
    const adminUsername = localStorage.getItem("adminUsername") || "admin";
    try {
      if (selectedComment) {
        await api.delete(`/admin/comments/${selectedComment.commentId}`, {
          data: { adminUsername, reason: deleteReason },
        });
      } else {
        await Promise.all(
          checkedItems.map((id) =>
            api.delete(`/admin/comments/${id}`, {
              data: { adminUsername, reason: deleteReason },
            })
          )
        );
      }
      fetchComments();
    } catch (err) {
      console.error("삭제 실패", err);
    }
    closeModal();
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    setCheckedItems([]);
  };

  const handleSearch = async () => {
    try {
      const response = await api.get("/admin/comments/search", {
        params: {
          keyword: searchKeyword,
          page: 0,
          size: commentsPerPage,
        },
      });
      setCurrentPage(1);
      setComments(
        response.data.content.map((comment, index) => ({
          ...comment,
          number: index + 1,
        }))
      );
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("검색 실패", err);
    }
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
              <input
                type="text"
                placeholder="댓글 검색"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <span className="search-icon" onClick={handleSearch}>🔍</span>
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
            {comments.map((comment) => (
              <tr key={comment.commentId}>
                <td>
                  <input
                    type="checkbox"
                    className="check"
                    checked={checkedItems.includes(comment.commentId)}
                    onChange={() => toggleItem(comment.commentId)}
                  />
                </td>
                <td>{comment.number}</td>
                <td>{comment.writer}</td>
                <td>{comment.boardContent}</td>
                <td>{comment.content}</td>
                <td className="buttons">
                  <button className="delete" onClick={() => openModal(comment)}>삭제</button>
                  <button className="detailSee" onClick={() => navigate(`/comments/${comment.commentId}/board`)}>
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
