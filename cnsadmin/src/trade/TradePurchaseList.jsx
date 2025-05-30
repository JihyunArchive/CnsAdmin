import React, { useEffect, useState } from "react";
import "./TradePurchaseList.css";
import { useNavigate } from "react-router-dom";

export default function TradePurchaseList() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const data = [
      { tradePostId: 30, username: "1112jyjin", title: "채소 다지기 팝니다", category: "조리기구", date: "2025-05-01" },
      { tradePostId: 29, username: "cookmaster", title: "중고 냄비 판매합니다", category: "팬/냄비류", date: "2025-05-02" },
      { tradePostId: 28, username: "kitchenlover", title: "예쁜 식기세트 팝니다", category: "식기류", date: "2025-05-03" },
      { tradePostId: 27, username: "user4", title: "소형가전 싸게 팝니다", category: "소형가전", date: "2025-05-04" },
      { tradePostId: 26, username: "user5", title: "용기류 새상품 팝니다", category: "용기류", date: "2025-05-05" },
      { tradePostId: 25, username: "user6", title: "일회용품 다량 보유", category: "일회용품", date: "2025-05-06" },
      { tradePostId: 24, username: "1112jyjin", title: "채소 다지기 팝니다", category: "조리기구", date: "2025-05-01" },
      { tradePostId: 23, username: "cookmaster", title: "중고 냄비 판매합니다", category: "팬/냄비류", date: "2025-05-02" },
      { tradePostId: 22, username: "kitchenlover", title: "예쁜 식기세트 팝니다", category: "식기류", date: "2025-05-03" },
      { tradePostId: 21, username: "user4", title: "소형가전 싸게 팝니다", category: "소형가전", date: "2025-05-04" },
      { tradePostId: 20, username: "user11", title: "용기류 새상품 팝니다", category: "용기류", date: "2025-05-05" },
      { tradePostId: 19, username: "user6", title: "일회용품 다량 보유", category: "일회용품", date: "2025-05-06" },
    ];
    setPosts(data);
    setFilteredPosts(data);
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const filterPosts = (keyword, category) => {
    let result = [...posts];
    if (category !== "전체") {
      result = result.filter((post) => post.category === category);
    }
    if (keyword.trim() !== "") {
      result = result.filter(
        (post) =>
          post.title.includes(keyword) || post.username.includes(keyword)
      );
    }
    setFilteredPosts(result);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterPosts(searchKeyword, category);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    filterPosts(keyword, selectedCategory);
    setCurrentPage(1);
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = currentPosts.map((post) => post.tradePostId);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const isAllSelected =
    currentPosts.length > 0 &&
    currentPosts.every((post) => selectedIds.includes(post.tradePostId));

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      alert("삭제할 거래글을 선택해주세요.");
      return;
    }
    const updated = posts.filter((post) => !selectedIds.includes(post.tradePostId));
    setPosts(updated);
    setFilteredPosts(updated);
    setSelectedIds([]);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="trade-post-list-container">
      <div className="header-row">
        <h2>구매 리스트</h2>
        <div className="category-filter-inline">
          <select value={selectedCategory} onChange={handleCategoryChange}>
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
        </div>
      </div>

      <div className="top-bar">
        <label>
          <input
            type="checkbox"
            onChange={handleSelectAll}
            checked={isAllSelected}
          />
          전체
        </label>
        <div className="search-box">
          <input
            type="text"
            placeholder="동네 주방 검색"
            value={searchKeyword}
            onChange={handleSearchChange}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="action-buttons">
          <button className="delete" onClick={handleDeleteSelected}>
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
            <th>구매 날짜</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post) => (
            <tr key={post.tradePostId}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(post.tradePostId)}
                  onChange={() => handleCheckboxChange(post.tradePostId)}
                />
              </td>
              <td>{post.tradePostId}</td>
              <td>{post.username}</td>
              <td>{post.title}</td>
              <td>{post.category}</td>
              <td>{post.date}</td>
              <td className="buttons">
                <button
                  className="detail"
                  onClick={() => navigate(`/trade/${post.tradePostId}`)}
                >
                  상세보기
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          {"<"}
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
