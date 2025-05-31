// src/components/DeleteModal.jsx
import React from 'react';
import './DeleteModal.css'; // CSS는 아래 따로 설명

function DeleteModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>레시피를 삭제하시는 이유가 어떻게 되시나요?</p>
        <div className="modal-reason-box">
          거짓된 정보나 확인되지 않은 정보를 올림
        </div>
        <button className="modal-button" onClick={onConfirm}>확인</button>
        <button className="modal-button cancel" onClick={onCancel}>취소</button>
      </div>
    </div>
  );
}

export default DeleteModal;
