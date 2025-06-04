import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "./ReportList.css";

export default function ReportList() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("게시물");
  const [postReports, setPostReports] = useState([]);
  const [commentReports, setCommentReports] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const reportsPerPage = 10;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const url =
          activeTab === "게시물" ? "/admin/reports/boards" : "/admin/reports/comments";
        const params = { page: currentPage - 1, size: reportsPerPage };
        const response = await api.get(url, { params });
        const data = response.data;
        const mapped = data.content.map((item, idx) => ({
          number: idx + 1 + (currentPage - 1) * reportsPerPage,
          id: item.reporterUsername,
          content: item.reportedContent,
          date: item.createdAt?.slice(0, 10),
          reportId: item.reportId,
        }));
        activeTab === "게시물" ? setPostReports(mapped) : setCommentReports(mapped);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("신고 목록 불러오기 실패:", err);
      }
    };
    fetchReports();
  }, [activeTab, currentPage]);

  const currentData = activeTab === "게시물" ? postReports : commentReports;

  const toggleSelectAll = () => {
    setCheckedItems(selectAll ? [] : currentData.map((p) => p.number));
    setSelectAll(!selectAll);
  };

  const toggleItem = (number) => {
    setCheckedItems((prev) =>
      prev.includes(number) ? prev.filter((n) => n !== number) : [...prev, number]
    );
  };

  const openModal = (report) => {
    setSelectedReport(report);
    setDeleteReason("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReport(null);
    setModalOpen(false);
  };

  const handleConfirmDelete = () => {
    const updateList = (list) =>
      list
        .filter((p) =>
          selectedReport ? p.number !== selectedReport.number : !checkedItems.includes(p.number)
        )
        .map((p, i) => ({ ...p, number: i + 1 }));
    if (selectedReport) {
      activeTab === "게시물"
        ? setPostReports((prev) => updateList(prev))
        : setCommentReports((prev) => updateList(prev));
      setCheckedItems((prev) => prev.filter((id) => id !== selectedReport.number));
    } else {
      if (checkedItems.length > 5 && !window.confirm("정말 삭제하시겠습니까?")) return;
      activeTab === "게시물"
        ? setPostReports((prev) => updateList(prev))
        : setCommentReports((prev) => updateList(prev));
      setCheckedItems([]);
      setSelectAll(false);
    }
    closeModal();
  };

  const handleSearch = async () => {
    try {
      const url =
        activeTab === "게시물"
          ? "/admin/reports/boards/search"
          : "/admin/reports/comments/search";
      const response = await api.get(url, {
        params: {
          keyword: searchKeyword,
          page: 0,
          size: reportsPerPage,
        },
      });
      const mapped = response.data.content.map((item, idx) => ({
        number: idx + 1,
        id: item.reporterUsername,
        content: item.reportedContent,
        date: item.createdAt.slice(0, 10),
        reportId: item.reportId,
      }));
      activeTab === "게시물" ? setPostReports(mapped) : setCommentReports(mapped);
      setCurrentPage(1);
    } catch (err) {
      console.error("검색 실패:", err);
    }
  };

  return (
    <div className="report-list-container">
      <div className="white-box">
        <h2>신고내역 리스트</h2>
        <hr className="report-divider" />

        <div className="tab-header">
          {["게시물", "댓글"].map((tab) => (
            <div
              key={tab}
              className={`tab-item ${activeTab === tab ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
                setCheckedItems([]);
                setSelectAll(false);
              }}
            >
              {tab}
            </div>
          ))}
        </div>

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
              <input
                type="text"
                placeholder="신고내역 검색"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <span className="search-icon" onClick={handleSearch}>🔍</span>
            </div>
          </div>

          <div className="delete-button-wrapper">
            <button className="top-delete-button" onClick={() => openModal(null)}>
              삭제
            </button>
          </div>
        </div>

        <table className="report-table">
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
            {currentData.map((report) => (
              <tr key={report.number}>
                <td>
                  <input
                    type="checkbox"
                    className="check"
                    checked={checkedItems.includes(report.number)}
                    onChange={() => toggleItem(report.number)}
                  />
                </td>
                <td>{report.number}</td>
                <td>{report.id}</td>
                <td>{report.content}</td>
                <td>{report.date}</td>
                <td className="buttons">
                  <button className="delete" onClick={() => openModal(report)}>삭제</button>
                  <button
                    className="detailSee"
                    onClick={() =>
                      navigate(
                        activeTab === "게시물"
                          ? `/posts/detail/${report.reportId}`
                          : `/comments/${report.reportId}/board`
                      )
                    }
                  >
                    상세보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <span onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>{"<"}</span>
          {[...Array(totalPages)].map((_, i) => (
            <span
              key={i}
              className={i + 1 === currentPage ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </span>
          ))}
          <span onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>{">"}</span>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>삭제 사유를 입력해주세요</p>
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