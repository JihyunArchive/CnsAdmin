import React, { useEffect, useState } from "react";
import "./UserList.css";

export default function BlockedUserList() {
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [showUnblockModal, setShowUnblockModal] = useState(false); // 🔹 해제 모달
    const [targetUser, setTargetUser] = useState(null); // 🔹 대상 유저 저장

    useEffect(() => {
        setBlockedUsers([
        { number: 1, name: "이차단", username: "blocked001", reason: "욕설이 너무 심함" },
        { number: 2, name: "김블락", username: "blackkim", reason: "지속적인 광고성 댓글 작성" }
        ]);
    }, []);

    const handleShowReason = (reason) => {
        setSelectedReason(reason);
        setShowReasonModal(true);
    };

    const handleCloseReasonModal = () => {
        setShowReasonModal(false);
        setSelectedReason("");
    };

    const handleUnblockClick = (user) => {
        setTargetUser(user);
        setShowUnblockModal(true);
    };

    const confirmUnblock = () => {
        console.log("차단 해제된 유저:", targetUser.username);
        setBlockedUsers(blockedUsers.filter(u => u.username !== targetUser.username));
        setShowUnblockModal(false);
        setTargetUser(null);
    };

    const cancelUnblock = () => {
        setShowUnblockModal(false);
        setTargetUser(null);
    };

    return (
        <div className="user-list-container">
        <h2>차단된 사용자 리스트</h2>

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
            {blockedUsers.map((user, index) => (
                <tr key={index}>
                <td><input type="checkbox" /></td>
                <td>{user.number}</td>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td className="buttons">
                    <button className="block" onClick={() => handleUnblockClick(user)}>해제</button>
                    <button className="reason" onClick={() => handleShowReason(user.reason)}>사유</button>
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

        {/* 🔹 사유 보기 모달 */}
        {showReasonModal && (
            <div className="modal-overlay">
            <div className="modal-box">
                <textarea
                value={selectedReason}
                readOnly
                className="readonly-textarea"
                />
                <div className="modal-buttons">
                <button className="confirm" onClick={handleCloseReasonModal}>확인</button>
                </div>
            </div>
            </div>
        )}

        {/* 🔹 해제 확인 모달 */}
        {showUnblockModal && (
            <div className="modal-overlay">
            <div className="modal-box">
                <p>회원을 차단 해제 하시겠습니까?</p>
                <div className="modal-buttons">
                <button className="confirm" onClick={confirmUnblock}>확인</button>
                <button className="cancel" onClick={cancelUnblock}>취소</button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
}
