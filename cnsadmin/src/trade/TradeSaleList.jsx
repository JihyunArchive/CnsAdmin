import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import "./TradeSaleList.css";

export default function TradeSaleList() {
  const [posts, setPosts] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("전체");
  //const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortBy, setSortBy] = useState("createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    try {
      const params = {
        page: currentPage - 1,
        size: 10,
        sortBy,
      };

      if (selectedStatus !== "전체") {
        params.status = selectedStatus === "거래중" ? 0 : 1;
      }

      // if (selectedCategory !== "전체") {
      //   params.keyword = selectedCategory;
      // }

      if (searchKeyword.trim()) {
        params.keyword = searchKeyword.trim();
      }

      const res = await api.get("/admin/tradeposts", { params });

      setPosts(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("거래글 불러오기 실패:", err);
    }
  }, [currentPage, selectedStatus, /* selectedCategory, */ searchKeyword, sortBy]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCheck = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCheckAll = (e) => {
    if (e.target.checked) {
      setCheckedItems(posts.map((post) => post.tradePostId));
    } else {
      setCheckedItems([]);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    let adminUsername = null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      adminUsername = payload.username;
    } catch (err) {
      console.error("JWT 디코딩 실패", err);
      alert("로그인 정보가 유효하지 않습니다.");
      return;
    }

    if (!adminUsername) {
      alert("관리자 정보를 찾을 수 없습니다.");
      return;
    }

    if (checkedItems.length === 0) {
      alert("삭제할 거래글을 선택하세요.");
      return;
    }

    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    for (const id of checkedItems) {
      try {
        await api.delete(`/admin/tradeposts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            adminUsername: adminUsername,
            reason: "운영정책 위반으로 삭제됨",
          },
        });
      } catch (err) {
        console.error(`${id}번 거래글 삭제 실패`, err);
      }
    }

    alert("삭제 완료");
    setCheckedItems([]);
    fetchPosts();
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="trade-post-list-container">
      <div className="white-box">
        <div className="top-row">
          <h2>거래글 리스트</h2>

          <div className="filter-group-inline">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="전체">전체</option>
              <option value="거래중">거래중</option>
              <option value="거래완료">거래완료</option>
            </select>

            {/*
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="전체">전체</option>
              <option value="조리기구">조리기구</option>
              <option value="팬/냄비류">팬/냄비류</option>
              <option value="용기류">용기류</option>
              <option value="식기류">식기류</option>
              <option value="수납용품">수납용품</option>
              <option value="위생용품">위생용품</option>
              <option value="소형가전">소형가전</option>
              <option value="일회용품">일회용품</option>
              <option value="기타">기타</option>
            </select>
            */}

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="createdAt">최신순</option>
              <option value="category">카테고리순</option>
            </select>
          </div>
        </div>

        <hr className="trade-divider" />
        
        <div className="top-bar">
          <div className="checkbox-group">
            <input
              type="checkbox"
              onChange={handleCheckAll}
              checked={checkedItems.length === posts.length && posts.length > 0}
            />
            <label>전체</label>
          </div>

          <div className="trade-search-box-wrapper">
            <div className="trade-search-box">
              <input
                type="text"
                placeholder="거래글 검색"
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <span className="trade-search-icon">🔍</span>
            </div>
          </div>

          <div className="delete-button-wrapper">
            <button className="top-delete-button" onClick={handleDelete}>
              삭제
            </button>
          </div>
        </div>

        <table className="trade-table">
          <thead>
            <tr>
              <th></th>
              <th>번호</th>
              <th>아이디</th>
              <th>제목</th>
              <th>카테고리</th>
              <th>거래상태</th>
              <th>게시 날짜</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.tradePostId}>
                <td>
                  <input
                    type="checkbox"
                    checked={checkedItems.includes(post.tradePostId)}
                    onChange={() => handleCheck(post.tradePostId)}
                  />
                </td>
                <td>{post.tradePostId}</td>
                <td>{post.username}</td>
                <td>{post.title}</td>
                <td>{post.category}</td>
                <td>{post.status === 0 ? "거래중" : "거래완료"}</td>
                <td>{post.createdAt?.slice(0, 10)}</td>
                <td>
                  <button onClick={() => navigate(`/admin/tradeposts/${post.tradePostId}`)}>
                    상세보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
