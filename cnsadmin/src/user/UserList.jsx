import React, { useEffect, useState, useCallback } from "react";
import "./UserList.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/users?page=0&size=10`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const userList = response.data.content.map((user, index) => ({
        id: user.id,
        number: index + 1 + response.data.pageable.offset,
        name: user.name,
        username: user.username,
      }));

      setUsers(userList);
    } catch (error) {
      console.error("회원 목록 불러오기 실패:", error);
    }
  }, [BASE_URL]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCheck = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCheckAll = (e) => {
    if (e.target.checked) {
      setCheckedItems(users.map((user) => user.id));
    } else {
      setCheckedItems([]);
    }
  };

  const handleBlockClick = () => {
    if (checkedItems.length === 0) {
      alert("차단할 회원을 선택하세요.");
      return;
    }
    setShowModal(true);
  };

  const handleConfirm = async () => {
    try {
      for (const userId of checkedItems) {
        await axios.post(`${BASE_URL}/admin/users/${userId}/block`,
          { reason: blockReason },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
      alert("차단이 완료되었습니다.");
      setCheckedItems([]);
      setBlockReason("");
      setShowModal(false);
      fetchUsers(); // ✅ 차단 후 자동 새로고침
    } catch (err) {
      console.error("차단 실패:", err);
      alert("차단 처리 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setBlockReason("");
  };

  return (
    <div className="user-list-container">
      <h2>회원 리스트</h2>

      <div className="top-bar">
        <label>
          <input type="checkbox" onChange={handleCheckAll} checked={checkedItems.length === users.length} /> 전체
        </label>
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
            <th><input type="checkbox" onChange={handleCheckAll} checked={checkedItems.length === users.length} /></th>
            <th>번호</th>
            <th>이름</th>
            <th>아이디</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td><input type="checkbox" checked={checkedItems.includes(user.id)} onChange={() => handleCheck(user.id)} /></td>
              <td>{user.number}</td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td className="buttons">
                <button className="block" onClick={() => navigate(`/users/${user.id}`)}>
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
