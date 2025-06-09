// src/user/BlockedUserList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserList.css";

export default function BlockedUserList() {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin/users/blocked`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const users = res.data.content || [];
        const mapped = users.map((user, index) => ({
          id: user.id,
          number: index + 1,
          name: user.name,
          username: user.username,
        }));
        setBlockedUsers(mapped);
      } catch (err) {
        console.error("차단된 사용자 불러오기 에러:", err);
      }
    };

    fetchBlockedUsers();
  }, [BASE_URL]);

  const handleShowReason = async (userId) => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/users/${userId}/block-reason`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSelectedReason(res.data);
      setShowReasonModal(true);
    } catch (err) {
      console.error("차단 사유 불러오기 실패:", err);
      alert("차단 사유를 불러올 수 없습니다.");
    }
  };

  const handleCloseReasonModal = () => {
    setShowReasonModal(false);
    setSelectedReason(null);
  };

  const handleUnblockClick = (user) => {
    setTargetUser(user);
    setShowUnblockModal(true);
  };

  const confirmUnblock = async () => {
    if (!targetUser) return;
    try {
      await axios.post(
        `${BASE_URL}/admin/users/${targetUser.id}/unblock`,
        {
          reason: "관리자에 의해 해제됨",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("차단이 해제되었습니다.");
      setBlockedUsers((prev) => prev.filter((u) => u.id !== targetUser.id));
      setShowUnblockModal(false);
      setTargetUser(null);
    } catch (err) {
      console.error("차단 해제 실패:", err);
      alert("차단 해제 중 오류가 발생했습니다.");
    }
  };

  const cancelUnblock = () => {
    setShowUnblockModal(false);
    setTargetUser(null);
  };

  return (
    <div className="user-list-container">
      <div className="white-box">
        <h2>차단된 사용자 리스트</h2>
        <hr className="user-divider" />
        <table className="user-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>이름</th>
              <th>아이디</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {blockedUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.number}</td>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td className="buttons">
                  <button className="block" onClick={() => handleUnblockClick(user)}>
                    해제
                  </button>
                  <button className="reason" onClick={() => handleShowReason(user.id)}>
                    사유
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

        {showReasonModal && selectedReason && (
          <div className="modal-overlay">
            <div className="modal-box">
              <p>
                <strong>차단 사유:</strong>
              </p>
              <textarea value={selectedReason.reason} readOnly className="readonly-textarea" />
              <p>관리자: {selectedReason.blockedBy}</p>
              <p>
                일시:{" "}
                {selectedReason.blockedAt
                  ? new Date(selectedReason.blockedAt).toLocaleString()
                  : "알 수 없음"}
              </p>
              <div className="modal-buttons">
                <button className="confirm" onClick={handleCloseReasonModal}>
                  확인
                </button>
              </div>
            </div>
          </div>
        )}

        {showUnblockModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <p>회원을 차단 해제하시겠습니까?</p>
              <div className="modal-buttons">
                <button className="confirm" onClick={confirmUnblock}>
                  확인
                </button>
                <button className="cancel" onClick={cancelUnblock}>
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
