import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import ChartCard from "./ChartCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./RecipeStats.css"; // 그대로 재사용

const USE_MOCK = true;

// 공통 요약 계산
function buildSummary(counts = []) {
  const total = counts.reduce((a, b) => a + b, 0);
  const average = counts.length ? (total / counts.length).toFixed(2) : 0;
  const max = counts.length ? Math.max(...counts) : 0;
  const min = counts.length ? Math.min(...counts) : 0;
  return { total, average, max, min };
}

// 날짜 라벨 생성 유틸
function formatDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function TradePostStats() {
  const [selectedTab, setSelectedTab] = useState("날짜별");
  const [dateFilterType, setDateFilterType] = useState("기간");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [summaryStats, setSummaryStats] = useState({ total: 0, average: 0, max: 0, min: 0 });

  // 거래글 통계는 탭 2개만
  const tabList = ["날짜별", "카테고리별"];
  const tabsWithDateFilter = ["날짜별"];

  // 📌 카테고리 enum/라벨 (질문 주신 내용 반영)
  const categoryEnumOrder = [
    "Cookware",        // 조리기구
    "PanPot",          // 팬/냄비류
    "Container",       // 용기류
    "Tableware",       // 식기류
    "StorageGoods",    // 수납용품
    "Sanitary",        // 위생용품
    "SmallAppliance",  // 소형가전
    "Disposable",      // 일회용품
    "Others",          // 기타
  ];

  const categoryLabelMap = {
    Cookware:       "조리기구",
    PanPot:         "팬/냄비류",
    Container:      "용기류",
    Tableware:      "식기류",
    StorageGoods:   "수납용품",
    Sanitary:       "위생용품",
    SmallAppliance: "소형가전",
    Disposable:     "일회용품",
    Others:         "기타",
  };

  const categoryList = ["전체", ...categoryEnumOrder.map((k) => categoryLabelMap[k])];

  // 한글 → 영문 enum key 매핑
  const categoryMapKrToEn = Object.fromEntries(
    Object.entries(categoryLabelMap).map(([eng, kor]) => [kor, eng])
  );

  // ✅ 임시 데이터 생성기들
  const makeMockDaily = (days = 14) => {
    const labels = [];
    const counts = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      labels.push(formatDate(d));
      counts.push(Math.floor(Math.random() * 20) + 1); // 1~20 랜덤
    }
    return { labels, counts };
  };

  const makeMockMonthly = (months = 6) => {
    const labels = [];
    const counts = [];
    const base = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(base.getFullYear(), base.getMonth() - i, 1);
      labels.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
      counts.push(Math.floor(Math.random() * 200) + 20); // 20~219 랜덤
    }
    return { labels, counts };
  };

  const makeMockYearly = (years = 5) => {
    const labels = [];
    const counts = [];
    const thisYear = new Date().getFullYear();
    for (let i = 0; i < years; i++) {
      const y = thisYear - i;
      labels.unshift(`${y}`);
      counts.unshift(Math.floor(Math.random() * 2000) + 200); // 200~2199 랜덤
    }
    return { labels, counts };
  };

  const makeMockCategoryAll = () => {
    const labels = categoryEnumOrder.map((eng) => categoryLabelMap[eng]);
    const counts = labels.map(() => Math.floor(Math.random() * 150) + 10); // 10~159
    return { labels, counts };
  };

  const makeMockCategoryOne = (korLabel) => {
    const english = categoryMapKrToEn[korLabel] || "Others";
    const labels = [korLabel];
    const counts = [Math.floor(Math.random() * 150) + 10];
    return { english, labels, counts };
  };

  const fetchStats = async () => {
    try {
      // 🔸 1) 임시 데이터 경로 (개발 중 즉시 그래프 확인)
      if (USE_MOCK) {
        if (tabsWithDateFilter.includes(selectedTab)) {
          if (dateFilterType === "기간") {
            // 기간 미선택이면 최근 14일로 기본값
            const noRange = !(startDate && endDate);
            if (noRange) {
              const { labels, counts } = makeMockDaily(14);
              setChartData({
                labels,
                datasets: [
                  {
                    label: "거래글 수",
                    data: counts,
                    borderColor: "#2aa52a",
                    backgroundColor: "rgba(42, 165, 42, 0.1)",
                    tension: 0.3,
                    pointBackgroundColor: "#2aa52a",
                    pointRadius: 5,
                  },
                ],
              });
              setSummaryStats(buildSummary(counts));
              return;
            }
            // 기간 길이에 따라 일/월 분기
            const diffDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
            if (diffDays > 60) {
              const { labels, counts } = makeMockMonthly(6);
              setChartData({
                labels,
                datasets: [
                  {
                    label: "거래글 수",
                    data: counts,
                    borderColor: "#2aa52a",
                    backgroundColor: "rgba(42, 165, 42, 0.1)",
                    tension: 0.3,
                    pointBackgroundColor: "#2aa52a",
                    pointRadius: 5,
                  },
                ],
              });
              setSummaryStats(buildSummary(counts));
              return;
            } else {
              // 60일 이하 → 일별
              const { labels, counts } = makeMockDaily(Math.max(3, Math.floor(diffDays) + 1));
              setChartData({
                labels,
                datasets: [
                  {
                    label: "거래글 수",
                    data: counts,
                    borderColor: "#2aa52a",
                    backgroundColor: "rgba(42, 165, 42, 0.1)",
                    tension: 0.3,
                    pointBackgroundColor: "#2aa52a",
                    pointRadius: 5,
                  },
                ],
              });
              setSummaryStats(buildSummary(counts));
              return;
            }
          } else if (dateFilterType === "연도") {
            const { labels, counts } = makeMockYearly(5);
            setChartData({
              labels,
              datasets: [
                {
                  label: "거래글 수",
                  data: counts,
                  borderColor: "#2aa52a",
                  backgroundColor: "rgba(42, 165, 42, 0.1)",
                  tension: 0.3,
                  pointBackgroundColor: "#2aa52a",
                  pointRadius: 5,
                },
              ],
            });
            setSummaryStats(buildSummary(counts));
            return;
          } else if (dateFilterType === "월") {
            // 선택된 연/월 기준으로 1개월 일별(또는 최근 6개월 월별) 중 택1 → 여기선 최근 6개월 월별로 표시
            const { labels, counts } = makeMockMonthly(6);
            setChartData({
              labels,
              datasets: [
                {
                  label: "거래글 수",
                  data: counts,
                  borderColor: "#2aa52a",
                  backgroundColor: "rgba(42, 165, 42, 0.1)",
                  tension: 0.3,
                  pointBackgroundColor: "#2aa52a",
                  pointRadius: 5,
                },
              ],
            });
            setSummaryStats(buildSummary(counts));
            return;
          }
        } else if (selectedTab === "카테고리별") {
          if (selectedCategory === "전체") {
            const { labels, counts } = makeMockCategoryAll();
            setChartData({
              labels,
              datasets: [
                {
                  label: "카테고리별 거래글 수",
                  data: counts,
                  borderColor: "#2aa52a",
                  backgroundColor: "rgba(42, 165, 42, 0.1)",
                  tension: 0.3,
                  pointBackgroundColor: "#2aa52a",
                  pointRadius: 5,
                },
              ],
            });
            setSummaryStats(buildSummary(counts));
            return;
          } else {
            const { labels, counts } = makeMockCategoryOne(selectedCategory);
            setChartData({
              labels,
              datasets: [
                {
                  label: `${selectedCategory} 거래글 수`,
                  data: counts,
                  borderColor: "#2aa52a",
                  backgroundColor: "rgba(42, 165, 42, 0.1)",
                  tension: 0.3,
                  pointBackgroundColor: "#2aa52a",
                  pointRadius: 5,
                },
              ],
            });
            setSummaryStats(buildSummary(counts));
            return;
          }
        }
      }

      // 🔸 2) 실제 API 경로 (USE_MOCK=false일 때만 실행)
      let response;
      let endpoint = "/admin/stats/tradeposts";

      if (tabsWithDateFilter.includes(selectedTab)) {
        // 날짜 기반
        if (dateFilterType === "기간" && startDate && endDate) {
          const diffDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
          if (diffDays > 60) {
            // 60일 초과 → 월별
            response = await api.get(endpoint, {
              params: {
                type: "MONTHLY",
                year: startDate.getFullYear(),
                month: startDate.getMonth() + 1,
              },
            });
          } else {
            // 60일 이하 → 일별
            response = await api.get(endpoint, {
              params: {
                type: "DAILY",
                start: startDate.toISOString().split("T")[0],
                end: endDate.toISOString().split("T")[0],
              },
            });
          }
        } else if (dateFilterType === "연도") {
          response = await api.get(endpoint, { params: { type: "YEARLY", year } });
        } else if (dateFilterType === "월") {
          response = await api.get(endpoint, { params: { type: "MONTHLY", year, month } });
        }
      } else if (selectedTab === "카테고리별") {
        // 카테고리 기반
        if (selectedCategory === "전체") {
          response = await api.get("/admin/stats/tradeposts/categories");

          const raw = response.data;
          const countMap = Object.fromEntries(raw.map((item) => [item.label, item.count]));

          const labels = categoryEnumOrder.map((eng) => categoryLabelMap[eng]);
          const counts = categoryEnumOrder.map((eng) => countMap[eng] || 0);

          setChartData({
            labels,
            datasets: [
              {
                label: "카테고리별 거래글 수",
                data: counts,
                borderColor: "#2aa52a",
                backgroundColor: "rgba(42, 165, 42, 0.1)",
                tension: 0.3,
                pointBackgroundColor: "#2aa52a",
                pointRadius: 5,
              },
            ],
          });

          setSummaryStats(buildSummary(counts));
          return; // 조기 리턴
        } else {
          const englishCategory = categoryMapKrToEn[selectedCategory] || null;
          const params = englishCategory ? { category: englishCategory } : {};
          response = await api.get("/admin/stats/tradeposts/categories", { params });
        }
      }

      const rawData = response?.data;
      const data = Array.isArray(rawData) ? rawData : rawData?.data;
      const summary = rawData?.summary;

      if (Array.isArray(data)) {
        const labels = data.map((item) => item.label || item.date || item.month);
        const counts = data.map((item) => item.count);

        setChartData({
          labels,
          datasets: [
            {
              label: "거래글 수",
              data: counts,
              borderColor: "#2aa52a",
              backgroundColor: "rgba(42, 165, 42, 0.1)",
              tension: 0.3,
              pointBackgroundColor: "#2aa52a",
              pointRadius: 5,
            },
          ],
        });

        setSummaryStats(summary || buildSummary(counts));
      }
    } catch (err) {
      console.error("❌ 거래글 통계 조회 실패:", err);

      // 에러 시에도 그래프가 비지 않도록 최소 mock fallback
      if (!USE_MOCK) {
        const { labels, counts } = makeMockDaily(7);
        setChartData({
          labels,
          datasets: [
            {
              label: "거래글 수(임시)",
              data: counts,
              borderColor: "#2aa52a",
              backgroundColor: "rgba(42, 165, 42, 0.1)",
              tension: 0.3,
              pointBackgroundColor: "#2aa52a",
              pointRadius: 5,
            },
          ],
        });
        setSummaryStats(buildSummary(counts));
      }
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab, year, month, startDate, endDate, dateFilterType, selectedCategory]);

  return (
    <div className="recipe-stats-container">
      <h2>거래글 통계</h2>

      <div className="top-bar">
        {/* 탭 */}
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

        {/* 날짜 필터 */}
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

        {/* 카테고리 필터 */}
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

      {/* 요약 카드 */}
      <div className="summary-cards">
        <div className="card">총 거래글 수: {summaryStats.total}</div>
        <div className="card">평균: {summaryStats.average}</div>
        <div className="card">최대: {summaryStats.max}</div>
        <div className="card">최소: {summaryStats.min}</div>
      </div>

      {/* 차트 */}
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
