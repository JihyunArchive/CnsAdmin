import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Material.css";

const STORAGE_KEY = "admin_materials_v1";
const TRASH_KEY   = "admin_materials_deleted_v1";

export default function Material() {
  const navigate = useNavigate();

  const INITIAL_MATERIALS = [
  { id: 1, name: "당근", category: "채소", unit: "개", icon: "🥕" },
  { id: 2, name: "양파", category: "채소", unit: "개", icon: "🧅" },
  { id: 3, name: "오징어", category: "해산물", unit: "마리", icon: "🦑" },
];

  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [query, setQuery] = useState(""); 

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
  }, [materials]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/\s+/g, "");
    if (!q) return materials;
    return materials.filter((m) => {
      const name = (m.name || "").toLowerCase().replace(/\s+/g, "");
      const cat  = (m.category || "").toLowerCase().replace(/\s+/g, "");
      const unit = (m.unit || "").toLowerCase().replace(/\s+/g, "");
      return name.includes(q) || cat.includes(q) || unit.includes(q);
    });
  }, [materials, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  useEffect(() => {
    setTotalElements(filtered.length);
  }, [filtered]);

  useEffect(() => { setPage(1); }, [query, materials]);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const isAllOnPageChecked =
    pageItems.length > 0 &&
    pageItems.every((m) => checkedItems.includes(m.id));

  const toggleSelectAll = () => {
    if (isAllOnPageChecked) {
      const idsOnPage = pageItems.map((m) => m.id);
      setCheckedItems((prev) => prev.filter((id) => !idsOnPage.includes(id)));
    } else {
      const idsOnPage = pageItems.map((m) => m.id);
      setCheckedItems((prev) => Array.from(new Set([...prev, ...idsOnPage])));
    }
    setSelectAll(false); 
  };

  const toggleItem = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const openDeleteModal = () => {
    if (checkedItems.length === 0) {
      alert("삭제할 재료를 선택해주세요.");
      return;
    }
    setDeleteReason("");
    setModalOpen(true);
  };

  const handleConfirmDelete = () => {
  if (!deleteReason.trim()) {
    alert("삭제 사유를 입력해주세요.");
    return;
  }

  const nowISO = new Date().toISOString();

  setMaterials((prev) => {
    const toDelete = prev.filter((m) => checkedItems.includes(m.id));
    const kept     = prev.filter((m) => !checkedItems.includes(m.id));

    const trashOld = JSON.parse(localStorage.getItem(TRASH_KEY) || "[]");
    const moved = toDelete.map((m) => ({
      ...m,
      deleteReason: deleteReason.trim(),
      deletedAt: nowISO,
    }));
    localStorage.setItem(TRASH_KEY, JSON.stringify([...moved, ...trashOld]));

    return kept;
  });

  setCheckedItems([]);
  setSelectAll(false);
  setModalOpen(false);
};

  const closeModal = () => {
    setModalOpen(false);
    setDeleteReason("");
  };

  const handlePageClick = (p) => {
    setPage(p);
    setSelectAll(false);
  };

  return (
    <div className="material-list-container">
      <div className="white-box">
        <h2>재료 관리</h2>
        <hr className="material-divider" />

        <div className="top-bar">
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              className="check"
              checked={isAllOnPageChecked}
              onChange={toggleSelectAll}
            />
            <label>전체</label>
          </div>

          <div className="search-box-wrapper">
            <div className="search-box">
              <input
                type="text"
                placeholder="재료 검색"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectAll(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setPage(1);
                }}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="create-button-wrapper">
            <button
              className="top-create-button"
              onClick={() => navigate("/materials/new")}
            >
              생성
            </button>
          </div>

          <div className="modify-button-wrapper">
            <button
              className="top-modify-button"
              onClick={() => {
                if (checkedItems.length === 0) {
                  alert("수정할 재료를 선택해주세요.");
                  return;
                }
                if (checkedItems.length > 1) {
                  alert("한 번에 하나의 재료만 수정할 수 있습니다.");
                  return;
                }
                const id = checkedItems[0];
                navigate(`/materials/modify/${id}`);
              }}
            >
              수정
            </button>
          </div>

          <div className="delete-button-wrapper">
            <button className="top-delete-button" onClick={openDeleteModal}>
              삭제
            </button>
          </div>
        </div>

        <table className="material-table">
          <thead>
            <tr>
              <th></th>
              <th>번호</th>
              <th>아이콘</th>
              <th>이름</th>
              <th>카테고리</th>
              <th>단위</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((material, idx) => (
              <tr key={material.id}>
                <td>
                  <div className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      className="check"
                      checked={checkedItems.includes(material.id)}
                      onChange={() => toggleItem(material.id)}
                    />
                  </div>
                </td>
                <td>{start + idx + 1}</td>

                <td className="icon-cell">
                  {material.iconUrl ? (
                    <img
                      src={material.iconUrl}
                      alt={material.name}
                      className="icon-img"
                    />
                  ) : (
                    material.icon || "🧩"
                  )}
                </td>

                <td>{material.name}</td>
                <td>{material.category}</td>
                <td>{material.unit}</td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "#888" }}>
                  검색 결과가 없습니다.
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>재료를 삭제하시는 이유가 어떻게 되시나요?</p>
            <textarea
              className="modal-textarea"
              placeholder="사유를 입력해주세요"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
            />
            <button className="modal-button" onClick={handleConfirmDelete}>
              확인
            </button>
            <button className="modal-button cancel" onClick={closeModal}>
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
