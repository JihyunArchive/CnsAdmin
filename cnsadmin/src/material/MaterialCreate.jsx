import React, { useEffect, useRef, useState } from "react";
import "./MaterialCreate.css";
import { useNavigate } from "react-router-dom";

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

export default function MaterialCreate() {
  const navigate = useNavigate();
  const [iconFile, setIconFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [material, setmaterial] = useState("채소류");
  const [unit, setUnit] = useState("개");
  const [name, setName] = useState("");

  const materialOptions = [
    "채소류", "육류", "해산물", "곡류", "과일류", "유제품",
    "양념류", "가공식품", "면류", "기타", "김치 종류", "음료 종류",
  ];
  const unitOptions = ["개", "mL", "L", "g", "kg"];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setIconFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleRegister = async () => {
    if (!name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

      let iconUrl = null;
      if (iconFile) {
        iconUrl = await readFileAsDataUrl(iconFile);
      }

      const newItem = {
        id: Date.now(),
        name: name.trim(),
        material,
        unit,
        iconUrl,   
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify([...saved, newItem]));
      alert("재료가 등록되었습니다.");
      navigate("/material");
    } catch (e) {
      console.error(e);
      alert("등록 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="material-detail-container">
      <div className="white-box">
        <h2>재료 등록</h2>
        <hr className="detail-divider" />

        <table className="detail-table">
          <tbody>
            <tr>
              <th>아이콘</th>
              <td className="icon-td">
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {previewUrl && <img src={previewUrl} alt="icon preview" className="icon-preview" />}
              </td>
            </tr>

            <tr>
              <th>카테고리</th>
              <td>
                <CustomSelect value={material} options={materialOptions} onChange={setmaterial} />
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
          <button type="button" className="top-register-button" onClick={handleRegister}>
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
