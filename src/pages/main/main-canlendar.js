let today = new Date("2023-12-31");

const printCalender = () => {
  const viewYear = today.getFullYear();
  const viewMonth = today.getMonth();

  document.querySelector(".year-month").textContent = `
    ${viewYear}년 ${viewMonth + 1}월
    `;

  const prevLast = new Date(viewYear, viewMonth, 0);
  const thisLast = new Date(viewYear, viewMonth + 1, 0);

  const prevLastDate = prevLast.getDate();
  const preLastDay = prevLast.getDay();

  const thisLastDate = thisLast.getDate();
  const thisLastDay = thisLast.getDay();

  const prevDates = [];
  const thisDates = [...Array(thisLastDate + 1).keys()].slice(1);
  const nextDates = [];

  if (preLastDay !== 6) {
    for (let i = 0; i < preLastDay + 1; i++) {
      prevDates.unshift(prevLastDate - i);
    }
  }

  for (let i = 1; i < 7 - thisLastDay; i++) {
    nextDates.push(i);
  }

  const dates = prevDates.concat(thisDates, nextDates);
  const firstDateIndex = dates.indexOf(1);
  const lastDateIndex = dates.lastIndexOf(thisLastDate);

  dates.forEach((date, i) => {
    const condition =
      i >= firstDateIndex && i < lastDateIndex + 1 ? "this" : "other";
    dates[i] = `
      <div class="day ${condition}">
        <div class="dayNumber">${date}</div>
        <div class="daySale">0,000</div>
      </div>
      `;
  });

  document.querySelector(".days").innerHTML = dates.join("");

  if (viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
    for (let date of document.querySelectorAll(".this")) {
      if (+date.innerText === today.getDate()) {
        date.classList.add("today");
        break;
      }
    }
  }
};

printCalender();
