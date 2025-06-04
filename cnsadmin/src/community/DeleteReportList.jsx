import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DeleteReportList.css";
import "../recipe/DeleteModal.css";

export default function DeleteReportList() {
  const navigate = useNavigate();
  const [dreports, setDreports] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [viewReason, setViewReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dreportsPerPage = 10;

  useEffect(() => {
    fetchCommentReports();
  }, [currentPage]);

  const fetchCommentReports = async () => {
    try {
      const res = await axios.get("/api/admin/reports/comments", {
        params: {
          page: currentPage - 1,
          size: dreportsPerPage
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const formatted = res.data.content.map((r, i) => ({
        number: i + 1 + (currentPage - 1) * dreportsPerPage,
        id: r.reporterUsername,
        content: r.content,
        date: r.createdAt,
        idValue: r.id,
        reason: r.reason || "비속어 포함"
      }));

      setDreports(formatted);
    } catch (error) {
      console.error("댓글 신고내역 불러오기 실패", error);
    }
  };

  const totalPages = 1; // 필요 시 백엔드 응답에서 totalPages 받아서 반영
  const indexOfLastDreport = currentPage * dreportsPerPage;
  const indexOfFirstDreport = indexOfLastDreport - dreportsPerPage;
  const currentDreports = dreports.slice(indexOfFirstDreport, indexOfLastDreport);

  const toggleSelectAll = () => {
    setCheckedItems(selectAll ? [] : currentDreports.map((r) => r.number));
    setSelectAll(!selectAll);
  };

  const toggleItem = (number) => {
    setCheckedItems((prev) =>
      prev.includes(number) ? prev.filter((n) => n !== number) : [...prev, number]
    );
  };

  const openModal = (dreport) => {
    setViewReason(dreport.reason || "비속어 섞여있음");
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
    <div className="dreport-list-container">
      <div className="white-box">
        <h2>댓글 신고내역 리스트</h2>
        <hr className="dreport-divider" />

        <div className="top-bar">
          <div className="checkbox-wrapper">
            <input type="checkbox" className="check" checked={selectAll} onChange={toggleSelectAll} />
            <label>전체</label>
          </div>
          <div className="search-box">
            <input type="text" placeholder="신고내역 검색" disabled />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <table className="dreport-table">
          <thead>
            <tr>
              <th></th>
              <th>번호</th>
              <th>아이디</th>
              <th>내용</th>
              <th>신고 날짜</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentDreports.map((dreport) => (
              <tr key={dreport.number}>
                <td>
                  <input
                    type="checkbox"
                    className="check"
                    checked={checkedItems.includes(dreport.number)}
                    onChange={() => toggleItem(dreport.number)}
                  />
                </td>
                <td>{dreport.number}</td>
                <td>{dreport.id}</td>
                <td>{dreport.content}</td>
                <td>{dreport.date}</td>
                <td className="buttons">
                  <button className="reason" onClick={() => openModal(dreport)}>사유</button>
                  <button className="detailSee" onClick={() => navigate(`/reports/comments/${dreport.idValue}`)}>상세보기</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <span onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}> {"<"} </span>
          {[...Array(totalPages)].map((_, i) => (
            <span key={i} className={i + 1 === currentPage ? "active" : ""} onClick={() => handlePageClick(i + 1)}>
              {i + 1}
            </span>
          ))}
          <span onClick={() => currentPage < totalPages && handlePageClick(currentPage + 1)}> {">"} </span>
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