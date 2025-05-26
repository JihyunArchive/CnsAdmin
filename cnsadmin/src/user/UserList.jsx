import React, { useEffect, useState } from "react";
import "./UserList.css";
import { useNavigate } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false); // 🔹 모달 표시 여부
  const [blockReason, setBlockReason] = useState(""); // 🔹 사유 입력값

  const navigate = useNavigate();

  useEffect(() => {
    setUsers([
      { number: 1, name: "정여진", username: "jyjin1112" },
      { number: 2, name: "김민수", username: "kms2025" },
      { number: 3, name: "박지은", username: "jepark88" }
    ]);
  }, []);

  const handleBlockClick = () => {
    setShowModal(true);
  };

  const handleConfirm = () => {
    console.log("차단 사유:", blockReason);
    setShowModal(false);
    setBlockReason("");
    // 실제 차단 처리 로직 추가 가능
  };

  const handleCancel = () => {
    setShowModal(false);
    setBlockReason("");
  };

  return (
    <div className="user-list-container">
      <h2>회원 리스트</h2>

      <div className="top-bar">
        <label><input type="checkbox" /> 전체</label>
        <div className="search-box">
          <input type="text" placeholder="회원 검색" />
          <span className="search-icon">🔍</span>
        </div>
        <div className="action-buttons">
          <button className="block" onClick={handleBlockClick}>차단</button>
        </div>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>번호</th>
            <th>이름</th>
            <th>아이디</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td><input type="checkbox" /></td>
              <td>{user.number}</td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td className="buttons">
                <button className="block" onClick={() => navigate(`/users/${user.username}`)}>
                  상세보기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <span>{"<"}</span>
        <span className="active">1</span>
        <span>{">"}</span>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>회원을 차단하시는 이유가 어떻게 되나요?</p>
            <textarea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="예: 욕설이 너무 심함"
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
