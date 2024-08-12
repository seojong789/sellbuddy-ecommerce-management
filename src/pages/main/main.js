const today = new Date("2023-12-15");
today.setHours(0, 0, 0, 0);
let compareDate;

axios
  .get("http://localhost:5500/product.json")
  .then((res) => {
    const products = res.data;
    // 주문현황
    let orderToday = 0; // 신규 주문
    let saleToday = 0; // 금일 매출
    // 금일 주문 현황 계산
    products.forEach((product) => {
      product.sales.forEach((sale) => {
        compareDate = new Date(sale.date);
        compareDate.setHours(0, 0, 0, 0);
        if (today.getTime() == compareDate.getTime()) {
          orderToday += sale.quantity;
          saleToday += sale.quantity * product.price;
        }
      });
    });
    const orderUnknown = Math.round(orderToday / 5); // 미확인 주문 (임시)
    const orderKnown = Math.round(orderToday / 3); // 주문 확정 (임시)
    // HTML 입력
    const orderHTML = `
      <h1 class="title">주문 현황<span> (당일 0시 기준)</span></h1>
      <p>
        <span>미확인 주문 ${orderUnknown.toLocaleString()}건</span>
        <span>신규 주문 ${orderToday.toLocaleString()}건</span>
        <span>주문 확정 ${orderKnown.toLocaleString()}건</span>
        <span>금일 매출 ${saleToday.toLocaleString()}원</span>
      </p>`;
    document.querySelector("#main-order").innerHTML = orderHTML;

    // 인기 상품
    // 드롭다운 값
    const productPlatformSelect = document.getElementById("product-platform");
    // 금일 인기상품 계산
    const printPopluarProduct = () => {
      let popularProduct = [];
      products.forEach((product) => {
        product.sales.forEach((sale) => {
          if (product.platform == productPlatformSelect.value) {
            compareDate = new Date(sale.date);
            compareDate.setHours(0, 0, 0, 0);
            // console.log(today, compareDate)
            if (today.getTime() == compareDate.getTime()) {
              popularProduct.push([product.name, sale.quantity]);
            }
          }
        });
      });
      popularProduct.sort((a, b) => b[1] - a[1]);
      // HTML 입력
      let popularProductHTML = `
        <p class="list-titles">
          <span class="list-title">순위</span>
          <span class="list-title">상품</span>
          <span class="list-title">판매량</span>
        </p>`;
      // 상위 5개
      for (let i = 0; i < Math.min(5, popularProduct.length); i++) {
        if (i > 0 && popularProduct[i][1] == popularProduct[i - 1][1]) {
          popularProductHTML += `
            <li>
              <span class="list-side">${i}위</span>
              <span class="list-center">${popularProduct[i][0]}</span>
              <span class="list-side">${popularProduct[i][1]}건</span>
            </li>`;
        } else {
          popularProductHTML += `
          <li>
            <span class="list-side">${i + 1}위</span>
            <span class="list-center">${popularProduct[i][0]}</span>
            <span class="list-side">${popularProduct[i][1]}건</span>
          </li>`;
        }
      }
      document.querySelector("#main-popular-product-list").innerHTML = popularProductHTML;
    };
    printPopluarProduct();
    // 드롭다운 변경 시 재실행
    productPlatformSelect.addEventListener("change", printPopluarProduct);

    // 인기 해시태그
    // 드롭다운 값
    const hashtagPlatformSelect = document.getElementById("hashtag-platform");
    // 금일 인기상품 계산
    const printPopluarHashtag = () => {
      let popularProduct = [];
      products.forEach((product) => {
        product.sales.forEach((sale) => {
          if (product.platform == hashtagPlatformSelect.value) {
            compareDate = new Date(sale.date);
            compareDate.setHours(0, 0, 0, 0);
            if (today.getTime() == compareDate.getTime()) {
              popularProduct.push([product.name, sale.quantity]);
            }
          }
        });
      });
      popularProduct.sort((a, b) => b[1] - a[1]);
      // 상위 5개의 해시태그
      popularProduct = popularProduct.slice(0, 5);
      let hashtagList = [];
      popularProduct.forEach((hotProduct) => {
        products.forEach((product) => {
          if (product.platform == hashtagPlatformSelect.value && hotProduct[0] == product.name) {
            product.hashtags.forEach((hashtag) => {
              hashtagList.push(hashtag);
            });
          }
        });
      });
      // 건수순 정렬
      let popularHashtag = {};
      hashtagList.forEach((item) => {
        if (popularHashtag[item]) {
          popularHashtag[item] += 1;
        } else {
          popularHashtag[item] = 1;
        }
      });
      popularHashtag = Object.entries(popularHashtag);
      popularHashtag.sort((a, b) => b[1] - a[1]);
      // HTML 입력
      let popularHashtagHTML = `
        <p class="list-titles">
          <span class="list-title">순위</span>
          <span class="list-title">상품</span>
          <span class="list-title">건수</span>
        </p>`;
      // 상위 5개
      for (let i = 0; i < Math.min(5, popularHashtag.length); i++) {
        if (i > 0 && popularHashtag[i][1] == popularHashtag[i - 1][1]) {
          popularHashtagHTML += `
            <li>
              <span class="list-side">${i}위</span>
              <span class="list-center">${popularHashtag[i][0]}</span>
              <span class="list-side">${popularHashtag[i][1]}건</span>
            </li>`;
        } else {
          popularHashtagHTML += `
          <li>
            <span class="list-side">${i + 1}위</span>
            <span class="list-center">${popularHashtag[i][0]}</span>
            <span class="list-side">${popularHashtag[i][1]}건</span>
          </li>`;
        }
      }
      document.querySelector("#main-popular-hashtag-list").innerHTML = popularHashtagHTML;
    };
    printPopluarHashtag();
    // 드롭다운 변경 시 재실행
    hashtagPlatformSelect.addEventListener("change", printPopluarHashtag);
  })
  .catch((error) => {
    console.log("error 발생 : " + error);
  });

// 주간 통계
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      ticks: {
        font: {
          size: 15
        }
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          size: 15
        }
      }
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};
// 드롭다운 값
const dataSelect = document.getElementById("chart-data");
let weeklyChart;
// 차트 함수
const updateChart = (charLabel, chartData, dataLabel) => {
  if (weeklyChart) {
    weeklyChart.destroy();
  }

  weeklyChart = new Chart(
    document.getElementById("week-chart").getContext("2d"),
    {
      type: "bar",
      data: {
        labels: charLabel,
        datasets: [
          {
            label: dataLabel,
            data: chartData,
            borderWidth: 1,
            backgroundColor: [
              'dodgerblue',
              'dodgerblue',
              'dodgerblue',
              'dodgerblue',
              'dodgerblue',
              'dodgerblue',
              'orange'
            ],
            maxBarThickness: 50
          },
        ],
      },
      options: chartOptions,
    }
  );
};

const printChart = () => {
  let charLabel = [];
  let chartData = [];
  let dataLabel;

  axios
    .get("http://localhost:5500/product.json")
    .then((res) => {
      const products = res.data;
      for (let n = 0; n < 7; n++) {
        // 차트 X축
        let date = new Date(today);
        date.setDate(today.getDate() - n);
        charLabel.unshift(date.getMonth() + 1 + "/" + date.getDate());
        // 차트 Y축
        let orderDate = 0;
        let saleDate = 0;
        products.forEach((product) => {
          product.sales.forEach((sale) => {
            compareDate = new Date(sale.date);
            compareDate.setHours(0, 0, 0, 0);
            if (date.getTime() == compareDate.getTime()) {
              orderDate += sale.quantity;
              saleDate += sale.quantity * product.price;
            }
          });
        });
        // 주문, 매출 구분해서 저장
        if (dataSelect.value == "product-count") {
          chartData.unshift(orderDate);
        } else {
          chartData.unshift(saleDate);
        }
      }
      // 주문, 매출 구분해서 저장
      if (dataSelect.value == "product-count") {
        dataLabel = "주문";
      } else {
        dataLabel = "매출";
      }
      document.querySelector("#main-sales-chart > .title").innerText = `주간 ${dataLabel} 통계`;
      updateChart(charLabel, chartData, dataLabel);
    })
    .catch((error) => {
      console.log("error 발생 : " + error);
    });
};
printChart();
// 드롭다운 변경 시 재실행
dataSelect.addEventListener("change", printChart);

// 매출 달력
const printCalender = () => {
  // 달력의 연, 월
  const viewYear = today.getFullYear();
  const viewMonth = today.getMonth();
  document.querySelector(".year-month").innerHTML = `<p>${viewYear}년 ${viewMonth + 1}월</p>`;
  // 전월과 당일의 마지막날
  const prevLast = new Date(viewYear, viewMonth, 0);
  const thisLast = new Date(viewYear, viewMonth + 1, 0);
  // 전월 막일의 일자, 요일
  const prevLastDate = prevLast.getDate();
  const preLastDay = prevLast.getDay();
  // 당월 막일의 일자, 요일
  const thisLastDate = thisLast.getDate();
  const thisLastDay = thisLast.getDay();
  // 전월 배열
  const prevDates = [];
  if (preLastDay !== 6) {
    for (let i = 0; i < preLastDay + 1; i++) {
      prevDates.unshift(prevLastDate - i);
    }
  }
  // 당월 배열
  const thisDates = [...Array(thisLastDate + 1).keys()].slice(1);
  // 익월 배열
  const nextDates = [];
  for (let i = 1; i < 7 - thisLastDay; i++) {
    nextDates.push(i);
  }
  // 배열 합치기
  const dates = prevDates.concat(thisDates, nextDates);
  const firstDateIndex = dates.indexOf(1);
  const lastDateIndex = dates.lastIndexOf(thisLastDate);
  // 기준일자
  let dateBase = new Date(viewYear, viewMonth, 1);
  dateBase.setDate(1 - firstDateIndex);

  axios
    .get("http://localhost:5500/product.json")
    .then((res) => {
      const products = res.data;
      dates.forEach((date, i) => {
        // 기준일자에 해당하는 매출 계산
        let saleDate = 0;
        products.forEach((product) => {
          product.sales.forEach((sale) => {
            compareDate = new Date(sale.date);
            compareDate.setHours(0, 0, 0, 0);
            if (dateBase.getTime() === compareDate.getTime()) {
              saleDate += sale.quantity * product.price;
            }
          });
        });
        const condition = firstDateIndex <= i && i <= lastDateIndex ? "this" : "other";
        const saleText = saleDate ? `${Math.round(saleDate / Math.pow(10, 4 - 1)) / 10}만원` : " - ";
        // HTML
        dates[i] = `
          <div class="day ${condition}">
            <div class="day-number">${date}</div>
            <div class="day-sale day-sale-detail">${dateBase.getMonth() + 1
          }월 ${dateBase.getDate()}일 매출 : ${saleDate.toLocaleString()}원</div>
            <div class="day-sale">${saleText}</div>
          </div>
        `;
        // 기준일자 증가
        dateBase.setDate(dateBase.getDate() + 1);
      });
      document.querySelector(".days").innerHTML = dates.join("");
      // 금일에 해당하는 일자
      if (today.getMonth() == viewMonth && today.getFullYear() == viewYear) {
        document.querySelectorAll(".this > .day-number").forEach((date) => {
          if (+date.innerText == today.getDate()) {
            date.classList.add("today");
          }
        });
      }
      let holiday2023 = [
        "01-01",
        "01-21",
        "01-22",
        "01-23",
        "01-24",
        "03-01",
        "05-05",
        "05-27",
        "06-06",
        "08-15",
        "09-28",
        "09-29",
        "09-30",
        "10-03",
        "10-09",
        "12-25",
      ];

      // 휴일에 해당하는 일자
      holiday2023.forEach((holiday) => {
        if (viewMonth + 1 == holiday[0] * 10 + holiday[1] * 1) {
          document.querySelectorAll(".this > .day-number").forEach((date) => {
            if (+date.innerText == holiday[3] * 10 + holiday[4] * 1) {
              date.classList.add("holiday");
            }
          });
        }
      });
    })
    .catch((error) => {
      console.log("error 발생 : " + error);
    });
};

printCalender();
