let currentDate = new Date();

/* 表示ロジック */
function renderCalendar(date) {
  const grid = document.getElementById("calendar-grid");
  grid.innerHTML = "";

  const year = date.getFullYear();
  const month = date.getMonth();

  document.getElementById("month-label").textContent =
    `${year}年 ${month + 1}月`;

  const firstDay = new Date(year, month, 1).getDay();
  const startDate = new Date(year, month, 1 - firstDay);

  for (let i = 0; i < 42; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);

    const cell = document.createElement("div");
    cell.className = "day";

    if (d.getMonth() !== month) {
      cell.classList.add("other");
    }

	/* 本日クラス付与 */
    if (isToday(d)) {
      cell.classList.add("today");
    }
    
    
    const dayOfWeek = d.getDay();
    
    /* 日曜日クラス付与 */
    if (dayOfWeek === 0) {
      cell.classList.add("sunday");
    }
    
    /* 土曜日クラス付与 */
    if (dayOfWeek === 6) {
      cell.classList.add("saturday");
    }

    cell.dataset.date = formatDate(d);
    cell.textContent = d.getDate();

    grid.appendChild(cell);
  }

  loadEventsForMonth(year, month);
}

/* 予定読み込み */
function loadEventsForMonth(year, month) {
  const request = indexedDB.open("myCalendarDB", 1);

  request.onsuccess = () => {
    const db = request.result;
    const tx = db.transaction("events", "readonly");
    const store = tx.objectStore("events");

    store.getAll().onsuccess = e => {
      e.target.result.forEach(event => {
        const cell = document.querySelector(
          `[data-date="${event.date}"]`
        );
        if (cell) {
          const dot = document.createElement("div");
          dot.className = "event-dot";
          cell.appendChild(dot);
        }
      });
    };
  };
}

/* 日付タップ → 日記/予定画面へ */
document.getElementById("calendar-grid").addEventListener("click", e => {
  const cell = e.target.closest(".day");
  if (!cell) return;

  const date = cell.dataset.date;
  openDayView(date);
});
function openDayView(date) {
  location.href = `day.html?date=${date}`;
}

/* 月切り替え */
document.getElementById("prev").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
};

document.getElementById("next").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
};

renderCalendar(currentDate);

