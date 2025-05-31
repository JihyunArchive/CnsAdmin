import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeleteReportList.css";
import "../recipe/DeleteModal.css";

export default function DeleteReportList() {
  const navigate = useNavigate();

  const [dreports] = useState([
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
  const [isModalOpen, setModalOpen] = useState(false);
  const [viewReason, setViewReason] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const dreportsPerPage = 10;

  const indexOfLastDreport = currentPage * dreportsPerPage;
  const indexOfFirstDreport = indexOfLastDreport - dreportsPerPage;
  const currentDreports = dreports.slice(indexOfFirstDreport, indexOfLastDreport);
  const totalPages = Math.ceil(dreports.length / dreportsPerPage);

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
        <h2>삭제된 신고내역 리스트</h2>
        <hr className="dreport-divider" />

        <div className="top-bar">
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              className="check"
              checked={selectAll}
              onChange={toggleSelectAll}
            />
            <label>전체</label>
          </div>
          <div className="search-box">
            <input type="text" placeholder="신고내역 검색" />
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
                  <button className="detailSee" onClick={() => navigate(`/posts/${dreport.number}`)}>상세보기</button>

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
