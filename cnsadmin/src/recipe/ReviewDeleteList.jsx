import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "./ReviewDeleteList.css";
import "./DeleteModal.css";

export default function ReviewDeleteList() {
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [viewReason, setViewReason] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const logsPerPage = 10;

  useEffect(() => {
    fetchLogs(currentPage - 1);
  }, [currentPage]);

  const fetchLogs = async (page) => {
    try {
      const response = await api.get("/admin/recipes/reviews/logs/deleted", {
        params: { page, size: logsPerPage },
      });
      setLogs(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("삭제된 리뷰 로그 불러오기 실패:", error);
    }
  };

  const toggleSelectAll = () => {
    setCheckedItems(selectAll ? [] : logs.map((log) => log.targetId));
    setSelectAll(!selectAll);
  };

  const toggleItem = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const openModal = (log) => {
    setViewReason(log.reason || "삭제 사유 없음");
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectAll(false);
    setCheckedItems([]);
  };

  return (
    <div className="delete-list-container">
      <div className="white-box">
        <h2>삭제된 리뷰 리스트</h2>
        <hr className="delete-divider" />

        <div className="top-bar">
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={toggleSelectAll}
            />
          </div>
          <div className="search-box">
            <input type="text" placeholder="리뷰 검색" />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <table className="delete-table">
          <thead>
            <tr>
              <th></th>
              <th>번호</th>
              <th>관리자 ID</th>
              <th>리뷰 ID</th>
              <th>삭제일시</th>
              <th>삭제 사유</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={log.targetId}>
                <td>
                  <input
                    type="checkbox"
                    className="check"
                    checked={checkedItems.includes(log.targetId)}
                    onChange={() => toggleItem(log.targetId)}
                  />
                </td>
                <td>{index + 1 + (currentPage - 1) * logsPerPage}</td>
                <td>{log.adminUsername}</td>
                <td>{log.targetId}</td>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
                <td>{log.reason || "없음"}</td>
                <td className="buttons">
                  <button className="reason" onClick={() => openModal(log)}>사유</button>
                  <button className="detailSee" onClick={() => navigate(`/recipes/reviews/${log.targetId}`)}>상세보기</button>
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
