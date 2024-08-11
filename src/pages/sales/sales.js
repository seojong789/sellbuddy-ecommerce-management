import { animateValue } from '../../components/util.js';

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
      display: true,
      position: 'top',
    },
  },
};

async function initializeCharts() {
  let jsonData = [];

  try {
    const response = await fetch('/v4.json');
    jsonData = await response.json();
  } catch (error) {
    console.error('Error loading JSON data:', error);
    return;
  }

  const weeklyChart = new Chart(
    document.getElementById('week').getContext('2d'),
    {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: '매출',
            data: [],
            borderWidth: 1,
          },
        ],
      },
      options: chartOptions,
    }
  );

  const quarterlyChart = new Chart(
    document.getElementById('quarter').getContext('2d'),
    {
      type: 'line',
      data: {
        labels: ['1분기', '2분기', '3분기', '4분기'],
        datasets: [
          {
            label: '매출',
            data: [],
            borderWidth: 1,
          },
        ],
      },
      options: chartOptions,
    }
  );

  const yearlyChart = new Chart(
    document.getElementById('years').getContext('2d'),
    {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        datasets: [
          {
            label: '매출',
            data: [],
            borderWidth: 1,
          },
        ],
      },
      options: chartOptions,
    }
  );

  document
    .querySelector('button[type="submit"]')
    .addEventListener('click', () => {
      const selectedPlatform = document.querySelector(
        'select[name="flatform"]'
      ).value;
      const selectedDate = document.querySelector('input[type="date"]').value;

      const salesData = calculateSales(
        jsonData,
        selectedDate,
        selectedPlatform
      );

      weeklyChart.data.labels = Object.keys(salesData.weeklySales);
      console.log(salesData);
      console.log(salesData.weeklySales);
      weeklyChart.data.datasets[0].data = Object.values(salesData.weeklySales);
      weeklyChart.update();

      quarterlyChart.data.datasets[0].data = salesData.quarterlySales;
      quarterlyChart.update();

      yearlyChart.data.datasets[0].data = salesData.monthlySales;
      yearlyChart.update();

      // 일(월) 매출
      //   document.getElementById('sales-info').innerHTML = `
      //   <p>${
      //     new Date(selectedDate).getMonth() + 1
      //   }월 매출: ${salesData.monthlySales[
      //     new Date(selectedDate).getMonth()
      //   ].toLocaleString()}원</p>
      //   <p>${selectedDate}일 매출: ${salesData.dailySales.toLocaleString()}원</p>
      // `;

      const monthlySalesEmt = document.getElementById('monthly-sales');
      const dailySalesEmt = document.getElementById('daily-sales');

      const currentMonthlySales =
        parseInt(monthlySalesEmt.innerText.replace(/,/g, '')) || 0;
      const currentDailySales =
        parseInt(dailySalesEmt.innerText.replace(/,/g, '')) || 0;
      console.log('일', currentDailySales);

      const newMonthlySales =
        salesData.monthlySales[new Date(selectedDate).getMonth()];
      const newDailySales = salesData.dailySales;
      console.log('일2', newDailySales);

      animateValue('monthly-sales', currentMonthlySales, newMonthlySales, 1000);
      animateValue('daily-sales', currentDailySales, newDailySales, 1000);
    });
}

function calculateSales(data, selectedDate = null, platform = 'total') {
  const weeklySales = {};
  const quarterlySales = [0, 0, 0, 0];
  const monthlySales = Array(12).fill(0);
  let yearlySales = 0;

  const selectedDateObj = new Date(selectedDate);
  const startDate = new Date(selectedDateObj);
  startDate.setDate(selectedDateObj.getDate() - 6); // 7일 전 날짜 계산

  // 7일간의 날짜 키 생성
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateKey = currentDate.toISOString().split('T')[0];
    weeklySales[dateKey] = 0;
  }

  data.forEach((product) => {
    product.platforms.forEach((platformData) => {
      if (platform === 'total' || platformData.platform === platform) {
        platformData.sales.forEach((sale) => {
          const saleDate = new Date(sale.date);
          const saleAmount = sale.quantity * product.price;

          // 주간 매출 (선택한 날짜 기준 마지막 7일 동안의 매출만 계산)
          if (saleDate >= startDate && saleDate <= selectedDateObj) {
            const dateKey = saleDate.toISOString().split('T')[0];
            if (weeklySales[dateKey] !== undefined) {
              weeklySales[dateKey] += saleAmount;
            }
          }

          // 분기 매출
          const quarter = Math.floor(saleDate.getMonth() / 3);
          quarterlySales[quarter] += saleAmount;

          // 월간 매출
          monthlySales[saleDate.getMonth()] += saleAmount;

          // 연간 매출
          yearlySales += saleAmount;
        });
      }
    });
  });

  let dailySales = 0;
  if (selectedDate) {
    data.forEach((product) => {
      product.platforms.forEach((platformData) => {
        if (platform === 'total' || platformData.platform === platform) {
          platformData.sales.forEach((sale) => {
            if (sale.date === selectedDate) {
              dailySales += sale.quantity * product.price;
            }
          });
        }
      });
    });
  }

  return { weeklySales, quarterlySales, monthlySales, yearlySales, dailySales };
}

document.addEventListener('DOMContentLoaded', () => {
  initializeCharts();
});
