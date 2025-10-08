// MaterialModify.jsx
import React, { useEffect, useRef, useState } from "react";
import "./MaterialModify.css";
import { useNavigate, useParams } from "react-router-dom";

const STORAGE_KEY = "admin_materials_v1";

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

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

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [iconUrl, setIconUrl] = useState(null); 
  const [emojiIcon, setEmojiIcon] = useState(""); 
  const [iconFile, setIconFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const categoryOptions = [
    "채소류", "육류", "해산물", "곡류", "과일류", "유제품",
    "양념류", "가공식품", "면류", "기타", "김치 종류", "음료 종류",
  ];
  const unitOptions = ["개", "mL", "L", "g", "kg"];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const found = saved.find((m) => m.id === numericId);
    if (!found) {
      alert("해당 재료를 찾을 수 없습니다.");
      navigate("/material");
      return;
    }

    setName(found.name || "");
    setCategory(found.category || "");
    setUnit(found.unit || "");
    setIconUrl(found.iconUrl || null);
    setEmojiIcon(found.icon || ""); 
    setPreviewUrl(found.iconUrl || null); 
  }, [numericId, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setIconFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : iconUrl || null);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    if (!category) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    if (!unit) {
      alert("단위를 선택해주세요.");
      return;
    }

    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

      let nextIconUrl = iconUrl;
      if (iconFile) {
        nextIconUrl = await readFileAsDataUrl(iconFile);
      }

      const updated = list.map((m) =>
        m.id === numericId
          ? {
              ...m,
              name: name.trim(),
              category,
              unit,
              iconUrl: nextIconUrl || null,
              icon: nextIconUrl ? undefined : (emojiIcon || m.icon),
            }
          : m
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      alert("수정되었습니다.");
      navigate("/material");
    } catch (e) {
      console.error(e);
      alert("수정 중 문제가 발생했습니다.");
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
                {previewUrl ? (
                  <img src={previewUrl} alt="icon preview" className="icon-preview" />
                ) : emojiIcon ? (
                  <span style={{ fontSize: 28, display: "inline-block", marginLeft: 12 }}>
                    {emojiIcon}
                  </span>
                ) : null}
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="재료 이름 입력"
                />
              </td>
            </tr>

            <tr>
              <th>단위</th>
              <td>
                <CustomSelect value={unit} options={unitOptions} onChange={setUnit} />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="submit-bar">
          <button type="button" className="top-register-button" onClick={handleSave}>
            저장
          </button>
          <button type="button" className="top-cancel-button" onClick={() => navigate("/material")}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
