import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReportList.css";

export default function ReportList() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([
    { number: 1, id: "john123", content: "내 돈 45만원 뜯어간 놈임", date: "2025-05-01" },
    { number: 2, id: "emma_cook", content: "물건 보내기로 해놓고 잠수탐", date: "2025-05-02" },
    { number: 3, id: "david456", content: "물건 보내기는 무슨 돈 받고 잠수탐", date: "2025-05-03" },
    { number: 4, id: "cookmaster01", content: "나한테 희망을 품어준 나쁜놈임", date: "2025-05-04" },
    { number: 5, id: "foodie_lee", content: "연락 두절?? 차단 당함", date: "2025-05-05" },
    { number: 6, id: "skylover", content: "먹튀를 해?? 차단을 해??", date: "2025-05-06" },
    { number: 7, id: "travel_maniac", content: "그래놓고 내돈 45만원을 더 뜯을라고한 놈임", date: "2025-05-07" },
    { number: 8, id: "mountain_hiker", content: "직거래 약속 어기고 잠수탐", date: "2025-05-08" },
    { number: 9, id: "citysnapper", content: "반품 요청했더니 욕설함", date: "2025-05-09" },
    { number: 10, id: "healing_trip", content: "구매자인 척 접근해서 사기 시도", date: "2025-05-10" },
    { number: 11, id: "island_seeker", content: "주소 받고 도난신고까지 당함", date: "2025-05-11" },
    { number: 12, id: "photo_jenny", content: "상품 설명과 다르게 불량품 옴", date: "2025-05-12" }
  
  ]);

  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");

  const indexOfLast = currentPage * reportsPerPage;
  const indexOfFirst = indexOfLast - reportsPerPage;
  const currentReports = reports.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(reports.length / reportsPerPage);

  const toggleSelectAll = () => {
    if (selectAll) {
      setCheckedItems([]);
    } else {
      setCheckedItems(reports.map((p) => p.number));
    }
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
    if (selectedReport) {
      setReports((prev) => prev.filter((p) => p.number !== selectedReport.number).map((p, i) => ({ ...p, number: i + 1 })));
      setCheckedItems((prev) => prev.filter((id) => id !== selectedReport.number));
    } else {
      if (checkedItems.length > 5 && !window.confirm("정말 선택한 게시물들을 삭제하시겠습니까?")) return;
      setReports((prev) => prev.filter((p) => !checkedItems.includes(p.number)).map((p, i) => ({ ...p, number: i + 1 })));
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
    <div className="report-list-container">
      <div className="white-box">
        <h2>신고내역 리스트</h2>
        <hr className="report-divider" />

        <div className="top-bar">
          <div className="checkbox-wrapper">
            <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} className="check" />
            <label>전체</label>
          </div>

          <div className="search-box-wrapper">
            <div className="search-box">
              <input type="text" placeholder="신고내역 검색" />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="delete-button-wrapper">
            <button className="top-delete-button" onClick={() => openModal(null)}>삭제</button>
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
            {currentReports.map((report) => (
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
                  <button className="detailSee" onClick={() => navigate(`/posts/${report.number}`)}>상세보기</button>
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
