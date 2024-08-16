const today = new Date('2023-12-15');
today.setHours(0, 0, 0, 0);
let compareDate;

axios
  .get('/assets/json/product.json')
  .then((res) => {
    const products = res.data;
    let orderToday = 0;
    let saleToday = 0;
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
    const orderUnknown = Math.round(orderToday / 5);
    const orderKnown = Math.round(orderToday / 3);
    const orderHTML = `
      <h1 class="title">주문 현황<span> (당일 0시 기준)</span></h1>
      <p>
        <span>미확인 주문 ${orderUnknown.toLocaleString()}건</span>
        <span>신규 주문 ${orderToday.toLocaleString()}건</span>
        <span>주문 확정 ${orderKnown.toLocaleString()}건</span>
        <span>금일 매출 ${saleToday.toLocaleString()}원</span>
      </p>`;
    document.querySelector('#main-order').innerHTML = orderHTML;

    const productPlatformSelect = document.getElementById('product-platform');
    const printPopluarProduct = () => {
      let popularProduct = [];
      products.forEach((product) => {
        product.sales.forEach((sale) => {
          if (product.platform == productPlatformSelect.value) {
            compareDate = new Date(sale.date);
            compareDate.setHours(0, 0, 0, 0);
            if (today.getTime() == compareDate.getTime()) {
              popularProduct.push([product.name, sale.quantity]);
            }
          }
        });
      });
      popularProduct.sort((a, b) => b[1] - a[1]);
      let popularProductHTML = `
        <p class="list-titles">
          <span class="list-title">순위</span>
          <span class="list-title">상품</span>
          <span class="list-title">판매량</span>
        </p>`;
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
      document.querySelector('#main-popular-product-list').innerHTML =
        popularProductHTML;
    };
    printPopluarProduct();
    productPlatformSelect.addEventListener('change', printPopluarProduct);
    const hashtagPlatformSelect = document.getElementById('hashtag-platform');
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
      popularProduct = popularProduct.slice(0, 5);
      let hashtagList = [];
      popularProduct.forEach((hotProduct) => {
        products.forEach((product) => {
          if (
            product.platform == hashtagPlatformSelect.value &&
            hotProduct[0] == product.name
          ) {
            product.hashtags.forEach((hashtag) => {
              hashtagList.push(hashtag);
            });
          }
        });
      });
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
      let popularHashtagHTML = `
        <p class="list-titles">
          <span class="list-title">순위</span>
          <span class="list-title">상품</span>
          <span class="list-title">건수</span>
        </p>`;
      for (let i = 0; i < Math.min(5, popularHashtag.length); i++) {
        if (i > 0 && popularHashtag[i][1] == popularHashtag[i - 1][1]) {
          popularHashtagHTML += `
            <li>
              <span class="list-side">${i}위</span>
              <span class="list-center">#${popularHashtag[i][0]}</span>
              <span class="list-side">${popularHashtag[i][1]}건</span>
            </li>`;
        } else {
          popularHashtagHTML += `
          <li>
            <span class="list-side">${i + 1}위</span>
            <span class="list-center">#${popularHashtag[i][0]}</span>
            <span class="list-side">${popularHashtag[i][1]}건</span>
          </li>`;
        }
      }
      document.querySelector('#main-popular-hashtag-list').innerHTML =
        popularHashtagHTML;
    };
    printPopluarHashtag();
    hashtagPlatformSelect.addEventListener('change', printPopluarHashtag);
  })
  .catch((error) => {
    console.error('error 발생 : ' + error);
  });

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};
const dataSelect = document.getElementById('chart-data');
let weeklyChart;
const updateChart = (charLabel, chartData, dataLabel) => {
  if (weeklyChart) {
    weeklyChart.destroy();
  }

  weeklyChart = new Chart(
    document.getElementById('week-chart').getContext('2d'),
    {
      type: 'bar',
      data: {
        labels: charLabel,
        datasets: [
          {
            label: dataLabel,
            data: chartData,
            borderWidth: 1,
            backgroundColor: [
              '#3F7AB5',
              '#3F7AB5',
              '#3F7AB5',
              '#3F7AB5',
              '#3F7AB5',
              '#3F7AB5',
              '#1F4078',
            ],
            maxBarThickness: 50,
          },
        ],
      },
      options: {
        ...chartOptions,
        indexAxis: 'y',
        scales: {
          y: {
            reverse: true,
          },
        },
      },
    },
  );
};

const printChart = () => {
  let charLabel = [];
  let chartData = [];
  let dataLabel;

  axios
    .get('/assets/json/product.json')
    .then((res) => {
      const products = res.data;
      for (let n = 0; n < 7; n++) {
        let date = new Date(today);
        date.setDate(today.getDate() - n);
        charLabel.unshift(date.getMonth() + 1 + '/' + date.getDate());
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
        if (dataSelect.value == 'product-count') {
          chartData.unshift(orderDate);
        } else {
          chartData.unshift(saleDate);
        }
      }
      if (dataSelect.value == 'product-count') {
        dataLabel = '주문';
      } else {
        dataLabel = '매출';
      }
      document.querySelector('#main-sales-chart > .title').innerText =
        `주간 ${dataLabel} 통계`;
      updateChart(charLabel, chartData, dataLabel);
    })
    .catch((error) => {
      console.error('error 발생 : ' + error);
    });
};
printChart();
dataSelect.addEventListener('change', printChart);

const printCalender = () => {
  const viewYear = today.getFullYear();
  const viewMonth = today.getMonth();
  document.querySelector('.year-month').innerHTML =
    `<p>${viewYear}년 ${viewMonth + 1}월</p>`;
  const prevLast = new Date(viewYear, viewMonth, 0);
  const thisLast = new Date(viewYear, viewMonth + 1, 0);
  const prevLastDate = prevLast.getDate();
  const preLastDay = prevLast.getDay();
  const thisLastDate = thisLast.getDate();
  const thisLastDay = thisLast.getDay();
  const prevDates = [];
  if (preLastDay !== 6) {
    for (let i = 0; i < preLastDay + 1; i++) {
      prevDates.unshift(prevLastDate - i);
    }
  }
  const thisDates = [...Array(thisLastDate + 1).keys()].slice(1);
  const nextDates = [];
  for (let i = 1; i < 7 - thisLastDay; i++) {
    nextDates.push(i);
  }
  const dates = prevDates.concat(thisDates, nextDates);
  const firstDateIndex = dates.indexOf(1);
  const lastDateIndex = dates.lastIndexOf(thisLastDate);
  let dateBase = new Date(viewYear, viewMonth, 1);
  dateBase.setDate(1 - firstDateIndex);

  axios
    .get('/assets/json/product.json')
    .then((res) => {
      const products = res.data;
      dates.forEach((date, i) => {
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
        const condition =
          firstDateIndex <= i && i <= lastDateIndex ? 'this' : 'other';
        const saleText = saleDate
          ? `${Math.round(saleDate / Math.pow(10, 4 - 1)) / 10}만원`
          : ' - ';
        dates[i] = `
          <div class="day ${condition}">
            <div class="day-number">${date}</div>
            <div class="day-sale day-sale-detail">${
              dateBase.getMonth() + 1
            }월 ${dateBase.getDate()}일 매출 : ${saleDate.toLocaleString()}원</div>
            <div class="day-sale">${saleText}</div>
          </div>
        `;
        dateBase.setDate(dateBase.getDate() + 1);
      });
      document.querySelector('.days').innerHTML = dates.join('');
      if (today.getMonth() == viewMonth && today.getFullYear() == viewYear) {
        document.querySelectorAll('.this > .day-number').forEach((date) => {
          if (+date.innerText == today.getDate()) {
            date.classList.add('today');
          }
        });
      }
      let holiday2023 = [
        '01-01',
        '01-21',
        '01-22',
        '01-23',
        '01-24',
        '03-01',
        '05-05',
        '05-27',
        '06-06',
        '08-15',
        '09-28',
        '09-29',
        '09-30',
        '10-03',
        '10-09',
        '12-25',
      ];

      holiday2023.forEach((holiday) => {
        if (viewMonth + 1 == holiday[0] * 10 + holiday[1] * 1) {
          document.querySelectorAll('.this > .day-number').forEach((date) => {
            if (+date.innerText == holiday[3] * 10 + holiday[4] * 1) {
              date.classList.add('holiday');
            }
          });
        }
      });
    })
    .catch((error) => {
      console.error('error 발생 : ' + error);
    });
};

printCalender();
