import React, { useEffect, useState } from "react";
import "./TradeReportList.css";
import { useNavigate } from "react-router-dom";

export default function TradeReportList() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;

  const [showModal, setShowModal] = useState(false);
  const [blockReason, setBlockReason] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const data = [
      {
        tradePostId: 30,
        username: "xxx9kf",
        title: "채소 다지기 팝니다",
        reason: "돈 들고 튀었어요",
        date: "2025-05-21",
      },
      {
        tradePostId: 29,
        username: "1x9dfj",
        title: "중고 냄비 판매합니다",
        reason: "욕을 해요",
        date: "2025-05-06",
      },
    ];
    setReports(data);
    setFilteredReports(data);
  }, []);

  const indexOfLast = currentPage * reportsPerPage;
  const indexOfFirst = indexOfLast - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const handleSearchChange = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    const result = reports.filter(
      (r) =>
        r.username.toLowerCase().includes(keyword.toLowerCase()) ||
        r.reason.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredReports(result);
    setCurrentPage(1);
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(currentReports.map((r) => r.tradePostId));
    } else {
      setSelectedIds([]);
    }
  };

  const isAllSelected =
    currentReports.length > 0 &&
    currentReports.every((r) => selectedIds.includes(r.tradePostId));

  const handleDelete = () => {
    const updated = reports.filter((r) => !selectedIds.includes(r.tradePostId));
    setReports(updated);
    setFilteredReports(updated);
    setSelectedIds([]);
  };

  const handleBlockClick = () => {
    if (selectedIds.length === 0) {
      alert("차단할 사용자를 선택하세요.");
      return;
    }
    setShowModal(true);
  };

  const handleConfirm = () => {
    console.log("차단 사유:", blockReason);
    console.log("차단 대상:", selectedIds);
    setShowModal(false);
    setBlockReason("");
    // TODO: 차단 API 호출
  };

  const handleCancel = () => {
    setShowModal(false);
    setBlockReason("");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="trade-post-list-container">
      <div className="header-row">
        <h2>신고내역 리스트</h2>
      </div>

      <div className="top-bar">
        <label>
          <input
            type="checkbox"
            onChange={handleSelectAll}
            checked={isAllSelected}
          /> 전체
        </label>
        <div className="search-box">
          <input
            type="text"
            placeholder="동네 주방 검색"
            value={searchKeyword}
            onChange={handleSearchChange}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="action-buttons">
          <button className="delete" onClick={handleDelete}>삭제</button>
          <button className="block" onClick={handleBlockClick}>차단</button>
        </div>
      </div>

      <table className="trade-table">
        <thead>
          <tr>
            <th></th>
            <th>번호</th>
            <th>아이디</th>
            <th>제목</th>
            <th>사유</th>
            <th>신고 날짜</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentReports.map((r) => (
            <tr key={r.tradePostId}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(r.tradePostId)}
                  onChange={() => handleCheckboxChange(r.tradePostId)}
                />
              </td>
              <td>{r.tradePostId}</td>
              <td>{r.username}</td>
              <td>{r.title}</td>
              <td>{r.reason}</td>
              <td>{r.date}</td>
              <td className="buttons">
                <button
                  className="detail"
                  onClick={() => navigate(`/trade/${r.tradePostId}`)}
                >
                  상세보기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>{"<"}</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>{">"}</button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>차단 사유를 입력해주세요.</p>
            <textarea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="예: 반복적으로 욕설을 사용함"
            />
            <div className="modal-buttons">
              <button className="confirm" onClick={handleConfirm}>확인</button>
              <button className="cancel" onClick={handleCancel}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
