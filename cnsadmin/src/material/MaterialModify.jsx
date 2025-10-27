// src/material/MaterialModify.jsx
import React, { useEffect, useRef, useState } from "react";
import "./MaterialModify.css";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import { toIconUrl } from "../utils/url";

// ✅ 공용 커스텀 셀렉트 (기존 유지)
function CustomSelect({ value, options, onChange, placeholder = "선택", width = "100%" }) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const wrapRef = useRef(null);
  const currentLabel = value ?? placeholder;

  useEffect(() => {
    const onClickOutside = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const onKeyDown = (e) => {
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      e.preventDefault();
      setOpen(true);
      setHighlight(Math.max(0, options.findIndex((o) => o === value)));
      return;
    }
    if (!open) return;

    if (e.key === "Escape") setOpen(false);
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + options.length) % options.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (highlight >= 0) {
        onChange(options[highlight]);
        setOpen(false);
      }
    }
  };

  return (
      <div className="cs-wrap" style={{ width }} ref={wrapRef} role="combobox" aria-expanded={open} aria-haspopup="listbox">
        <button type="button" className="cs-button" onClick={() => setOpen((v) => !v)} onKeyDown={onKeyDown} aria-label="옵션 선택">
        <span className="cs-content">
          <span className={`cs-label ${!value ? "cs-placeholder" : ""}`}>{currentLabel}</span>
          <svg className="cs-arrow" width="18" height="18" viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </span>
        </button>

        {open && (
            <ul className="cs-list" role="listbox">
              {options.map((opt, idx) => (
                  <li
                      key={opt}
                      role="option"
                      aria-selected={value === opt}
                      className={`cs-option ${value === opt ? "selected" : ""} ${idx === highlight ? "highlight" : ""}`}
                      onMouseEnter={() => setHighlight(idx)}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onChange(opt);
                        setOpen(false);
                      }}
                  >
                    {opt}
                  </li>
              ))}
            </ul>
        )}
      </div>
  );
}

export default function MaterialModify() {
  const navigate = useNavigate();
  const { id } = useParams();
  const numericId = Number(id);

  // ✅ 상태
  const [nameKo, setNameKo] = useState("");
  const [category, setCategory] = useState("");
  const [defaultUnitId, setDefaultUnitId] = useState(null);
  const [iconUrl, setIconUrl] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [unitOptions, setUnitOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  // ✅ 단위/카테고리 + 상세정보 불러오기
  useEffect(() => {
    (async () => {
      try {
        const [unitRes, catRes, detailRes] = await Promise.all([
          api.get("/admin/units"),
          api.get("/admin/ingredients/categories"),
          api.get(`/admin/ingredients/${numericId}`),
        ]);

        setUnitOptions(unitRes.data.map((u) => ({ id: u.id, name: u.name })));
        setCategoryOptions(catRes.data);

        const d = detailRes.data;
        setNameKo(d.nameKo || "");
        setCategory(d.category || "");
        setDefaultUnitId(d.defaultUnitId || null);
        setIconUrl(d.iconUrl || null);
        setPreviewUrl(d.iconUrl ? toIconUrl(d.iconUrl) : null);
      } catch (e) {
        console.error(e);
        alert("재료 정보를 불러오지 못했습니다.");
        navigate("/materials");
      }
    })();
  }, [numericId, navigate]);

  // ✅ 파일 미리보기
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setIconFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : iconUrl ? toIconUrl(iconUrl) : null);
  };

  // ✅ 저장 (PUT /api/admin/ingredients/{id})
  const handleSave = async () => {
    if (!nameKo.trim()) return alert("이름을 입력해주세요.");
    if (!category) return alert("카테고리를 선택해주세요.");
    if (!defaultUnitId) return alert("단위를 선택해주세요.");

    try {
      // 아이콘 파일은 업로드 서버 없으면 base64로 임시 저장 가능
      // 지금은 파일 업로드 로직 없으므로 iconUrl 그대로 사용
      const dto = {
        nameKo: nameKo.trim(),
        category,
        defaultUnitId,
        iconUrl,
      };

      await api.put(`/api/admin/ingredients/${numericId}`, dto);
      alert("수정이 완료되었습니다.");
      navigate("/materials");
    } catch (e) {
      console.error(e);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  return (
      <div className="material-detail-container">
        <div className="white-box">
          <h2>재료 수정</h2>
          <hr className="detail-divider" />

          <table className="detail-table">
            <tbody>
            <tr>
              <th>아이콘</th>
              <td className="icon-td">
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {previewUrl && (
                    <img src={previewUrl} alt="icon preview" className="icon-preview" />
                )}
              </td>
            </tr>

            <tr>
              <th>카테고리</th>
              <td>
                <CustomSelect value={category} options={categoryOptions} onChange={setCategory} />
              </td>
            </tr>

            <tr>
              <th>이름</th>
              <td>
                <input
                    className="inline-input"
                    type="text"
                    value={nameKo}
                    onChange={(e) => setNameKo(e.target.value)}
                    placeholder="재료 이름 입력"
                />
              </td>
            </tr>

            <tr>
              <th>단위</th>
              <td>
                <CustomSelect
                    value={
                        unitOptions.find((u) => u.id === defaultUnitId)?.name || ""
                    }
                    options={unitOptions.map((u) => u.name)}
                    onChange={(selected) => {
                      const match = unitOptions.find((u) => u.name === selected);
                      setDefaultUnitId(match ? match.id : null);
                    }}
                />
              </td>
            </tr>
            </tbody>
          </table>

          <div className="submit-bar">
            <button type="button" className="top-register-button" onClick={handleSave}>
              저장
            </button>
            <button type="button" className="top-cancel-button" onClick={() => navigate("/materials")}>
              취소
            </button>
          </div>
        </div>
      </div>
  );
}
