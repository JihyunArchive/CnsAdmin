import React, { useEffect, useState } from "react";
import "./DeleteMaterialList.css";

const STORAGE_KEY = "admin_materials_v1";
const TRASH_KEY   = "admin_materials_deleted_v1";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}
function getAdminIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const p = parseJwt(token);
  return (
    p?.username ||
    p?.userId ||
    p?.sub ||
    p?.preferred_username ||
    p?.email ||
    null
  );
}

export default function DeleteMaterialList() {
  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem(TRASH_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalElements, setTotalElements] = useState(0);

  const [isReasonOpen, setReasonOpen] = useState(false);
  const [reasonItem, setReasonItem] = useState(null); // {name, deleteReason, deletedBy, deletedAt}

  const saveTrash  = (list) => localStorage.setItem(TRASH_KEY, JSON.stringify(list));
  const saveActive = (list) => localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

  const totalPages = Math.max(1, Math.ceil(materials.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageItems = materials.slice(start, start + pageSize);

  useEffect(() => { setTotalElements(materials.length); }, [materials]);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages, page]);

  const restoreOne = (id) => {
    setMaterials((prev) => {
      const target = prev.find((m) => m.id === id);
      if (!target) return prev;

      const keptTrash = prev.filter((m) => m.id !== id);

      const activeOld = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const { deletedAt, deleteReason, deletedBy, ...rest } = target;
      const dedupActive = activeOld.filter((a) => a.id !== rest.id);
      const activeNew = [...dedupActive, rest];

      saveActive(activeNew);
      saveTrash(keptTrash);
      return keptTrash;
    });
  };

  const openReason = (id) => {
    const item = materials.find((m) => m.id === id);
    setReasonItem(item || null);
    setReasonOpen(true);
  };
  const closeReason = () => setReasonOpen(false);

  const formatKo = (iso) =>
    iso
      ? new Date(iso).toLocaleString("ko-KR", {
          year: "numeric", month: "numeric", day: "numeric",
          hour: "numeric", minute: "2-digit", second: "2-digit",
          hour12: true,
        })
      : "-";

  const displayAdmin = (() => {
    const raw = (reasonItem?.deletedBy || getAdminIdFromToken() || "관리자").toString();
    return raw.includes("@") ? raw.split("@")[0] : raw; 
  })();
  const displayWhen = formatKo(reasonItem?.deletedAt);

  const handlePageClick = (p) => setPage(p);

  return (
    <div className="material-list-container">
      <div className="white-box">
        <h2>삭제된 재료 리스트</h2>
        <hr className="material-divider" />

        <table className="material-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>아이콘</th>
              <th>이름</th>
              <th>카테고리</th>
              <th>단위</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((material, idx) => (
              <tr key={material.id}>
                <td>{start + idx + 1}</td>
                <td className="icon-cell">
                  {material.iconUrl ? (
                    <img src={material.iconUrl} alt={material.name} className="icon-img" />
                  ) : (material.icon || "🧩")}
                </td>
                <td>{material.name}</td>
                <td>{material.category}</td>
                <td>{material.unit}</td>

                <td className="buttons">
                  <button className="restore" onClick={() => restoreOne(material.id)}>
                    복원
                  </button>
                  <button className="reason" onClick={() => openReason(material.id)}>
                    사유
                  </button>
                </td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "#888" }}>
                  휴지통이 비어 있습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          <span onClick={() => page > 1 && handlePageClick(page - 1)}>{"<"}</span>
          {Array.from({ length: totalPages }, (_, i) => (
            <span
              key={i}
              className={i + 1 === page ? "active" : ""}
              onClick={() => handlePageClick(i + 1)}
            >
              {i + 1}
            </span>
          ))}
          <span onClick={() => page < totalPages && handlePageClick(page + 1)}>{">"}</span>
        </div>
      </div>

      {isReasonOpen && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ textAlign: "center" }}>
            <p style={{ fontWeight: 700, fontSize: 20, marginBottom: 12 }}>
              삭제 사유{reasonItem?.name ? ` - ${reasonItem.name}` : ""}:
            </p>

            <textarea
              readOnly
              value={reasonItem?.deleteReason || "사유가 입력되지 않았습니다."}
              style={{
                width: "86%", height: 140, resize: "none",
                border: "1px solid #ccc", borderRadius: 6, padding: 12
              }}
            />

            <div style={{ marginTop: 18, color: "#333", fontWeight: 700 }}>
              관리자: {displayAdmin}
            </div>
            <div style={{ marginTop: 6, color: "#333", fontWeight: 700 }}>
              일시: {displayWhen}
            </div>

            <div style={{ marginTop: 18 }}>
              <button
                className="confirm"
                onClick={closeReason}
                style={{
                  background: "#2aa52a", color: "#fff", border: "1px solid #2aa52a",
                  borderRadius: 8, padding: "10px 18px", fontWeight: 700, cursor: "pointer"
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
