import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import ChartCard from "./ChartCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./RecipeStats.css";

export default function RecipeStats() {
  const [selectedTab, setSelectedTab] = useState("날짜별");
  const [dateFilterType, setDateFilterType] = useState("기간");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [summaryStats, setSummaryStats] = useState({ total: 0, average: 0, max: 0, min: 0 });

  const tabList = ["날짜별", "카테고리별", "찜별", "추천별", "공유별"];
  const tabsWithDateFilter = ["날짜별", "찜별", "추천별", "공유별"];
  const categoryList = ["전체", "한식", "중식", "양식", "일식", "채식", "간식", "안주", "밑반찬"];

  const fetchStats = async () => {
    try {
      let response;
      let endpoint = "/admin/stats/recipes";

      if (selectedTab === "찜별") endpoint += "/likes";
      else if (selectedTab === "추천별") endpoint += "/recommends";
      else if (selectedTab === "공유별") endpoint += "/shares";

      if (tabsWithDateFilter.includes(selectedTab)) {
        if (dateFilterType === "기간" && startDate && endDate) {
          const diffDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
          const type = diffDays > 60 ? "MONTHLY" : "DAILY";

          response = await api.get(endpoint, {
            params: {
              type,
              start: startDate.toISOString().split("T")[0],
              end: endDate.toISOString().split("T")[0],
            },
          });
        } else if (dateFilterType === "연도") {
          response = await api.get(endpoint, {
            params: { type: "YEARLY", year },
          });
        } else if (dateFilterType === "월") {
          response = await api.get(endpoint, {
            params: { type: "MONTHLY", year, month },
          });
        }
      } else if (selectedTab === "카테고리별") {
        response = await api.get("/admin/stats/recipes/categories");
      }

      console.log("✅ 백엔드 응답 데이터:", response?.data);

      const rawData = response?.data;

      if (typeof rawData !== "object") {
        throw new Error("⚠️ JSON 형식이 아님 (HTML 페이지일 수 있음)");
      }

      const data = Array.isArray(rawData) ? rawData : rawData.data;
      const summary = rawData.summary;

      if (Array.isArray(data)) {
        const labels = data.map((item) => item.label || item.date || item.month);
        const counts = data.map((item) => item.count);

        setChartData({
          labels,
          datasets: [
            {
              label: "레시피 수",
              data: counts,
              borderColor: "#2aa52a",
              backgroundColor: "rgba(42, 165, 42, 0.1)",
              tension: 0.3,
              pointBackgroundColor: "#2aa52a",
              pointRadius: 5,
            },
          ],
        });

        if (summary) {
          setSummaryStats(summary);
        } else {
          setSummaryStats({
            total: counts.reduce((a, b) => a + b, 0),
            average: counts.length > 0 ? (counts.reduce((a, b) => a + b, 0) / counts.length).toFixed(2) : 0,
            max: Math.max(...counts, 0),
            min: Math.min(...counts, 0),
          });
        }
      }
    } catch (err) {
      console.error("❌ 레시피 통계 조회 실패:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedTab, year, month, startDate, endDate, dateFilterType, selectedCategory]);

  return (
    <div className="recipe-stats-container">
      <h2>레시피 통계</h2>

      <div className="top-bar">
        <div className="tab-buttons">
          {tabList.map((tab) => (
            <button
              key={tab}
              className={selectedTab === tab ? "active" : ""}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {tabsWithDateFilter.includes(selectedTab) && (
          <div className="filter-box">
            <select value={dateFilterType} onChange={(e) => setDateFilterType(e.target.value)}>
              <option value="기간">기간 선택</option>
              <option value="연도">연도별</option>
              <option value="월">월별</option>
            </select>

            {dateFilterType === "기간" && (
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                dateFormat="yyyy-MM-dd"
                placeholderText="날짜 선택"
                isClearable
              />
            )}

            {dateFilterType === "연도" && (
              <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {[2025, 2024, 2023, 2022, 2021].map((y) => (
                  <option key={y} value={y}>
                    {y}년
                  </option>
                ))}
              </select>
            )}

            {dateFilterType === "월" && (
              <>
                <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                  {[2025, 2024, 2023, 2022, 2021].map((y) => (
                    <option key={y} value={y}>
                      {y}년
                    </option>
                  ))}
                </select>
                <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}월
                    </option>
                  ))}
                </select>
              </>
            )}

            <button onClick={fetchStats}>조회</button>
          </div>
        )}

        {selectedTab === "카테고리별" && (
          <div className="filter-box">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              {categoryList.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button onClick={fetchStats}>조회</button>
          </div>
        )}
      </div>

      <div className="summary-cards">
        <div className="card">총 레시피 수: {summaryStats.total}</div>
        <div className="card">평균: {summaryStats.average}</div>
        <div className="card">최대: {summaryStats.max}</div>
        <div className="card">최소: {summaryStats.min}</div>
      </div>

      <ChartCard
        chartData={chartData}
        xAxisLabel={
          dateFilterType === "연도"
            ? "(연도)"
            : dateFilterType === "월" ||
              (startDate && endDate && (endDate - startDate) / (1000 * 60 * 60 * 24) > 60)
            ? "(월)"
            : "(일)"
        }
      />
    </div>
  );
}
