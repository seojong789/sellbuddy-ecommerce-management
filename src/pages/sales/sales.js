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
      weeklyChart.data.datasets[0].data = Object.values(salesData.weeklySales);
      weeklyChart.update();

      quarterlyChart.data.datasets[0].data = salesData.quarterlySales;
      quarterlyChart.update();

      yearlyChart.data.datasets[0].data = salesData.monthlySales;
      yearlyChart.update();

      document.getElementById('sales-info').innerHTML = `
      <p>${
        new Date(selectedDate).getMonth() + 1
      }월 매출: ${salesData.monthlySales[
        new Date(selectedDate).getMonth()
      ].toLocaleString()}원</p>
      <p>${selectedDate}일 매출: ${salesData.dailySales.toLocaleString()}원</p>
    `;
    });
}

function calculateSales(data, selectedDate = null, platform = 'total') {
  const weeklySales = {};
  const quarterlySales = [0, 0, 0, 0];
  const monthlySales = Array(12).fill(0);
  let yearlySales = 0;

  data.forEach((product) => {
    product.platforms.forEach((platformData) => {
      if (platform === 'total' || platformData.platform === platform) {
        platformData.sales.forEach((sale) => {
          const saleDate = new Date(sale.date);
          const saleAmount = sale.quantity * product.price;

          // 주간
          const weekNumber = Math.ceil(saleDate.getDate() / 7);
          const weekKey = `${saleDate.getFullYear()}-${
            saleDate.getMonth() + 1
          }-week${weekNumber}`;
          if (!weeklySales[weekKey]) {
            weeklySales[weekKey] = 0;
          }
          weeklySales[weekKey] += saleAmount;

          // 분기
          const quarter = Math.floor(saleDate.getMonth() / 3);
          quarterlySales[quarter] += saleAmount;

          // 월간
          monthlySales[saleDate.getMonth()] += saleAmount;

          // 연간
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

// initializeCharts();

// document.addEventListener('DOMContentLoaded', (event) => {
//   const weeklyChart = new Chart(
//     document.getElementById('week').getContext('2d'),
//     {
//       type: 'line',
//       data: {
//         labels: ['2/4', '2/5', '2/6', '2/7', '2/8', '2/9', '2/10'],
//         datasets: [
//           {
//             label: '매출',
//             data: [15000, 12000, 5800, 9000, 7600, 7000, 5800],
//             borderWidth: 1,
//           },
//         ],
//       },
//       options: chartOptions,
//     }
//   );

//   const quarterlyChart = new Chart(
//     document.getElementById('quarter').getContext('2d'),
//     {
//       type: 'line',
//       data: {
//         labels: ['1분기', '2분기', '3분기', '4분기'],
//         datasets: [
//           {
//             label: '매출',
//             data: [1538000, 2838000, 1230000, 873000],
//             backgroundColor: [
//               'rgba(255, 206, 86, 0.2)',
//               'rgba(54, 162, 235, 0.2)',
//               'rgba(255, 99, 132, 0.2)',
//               'rgba(255, 99, 132, 0.2)',
//             ],
//             borderColor: [
//               'rgba(255, 206, 86, 1)',
//               'rgba(54, 162, 235, 1)',
//               'rgba(255, 99, 132, 1)',
//               'rgba(255, 99, 132, 1)',
//             ],
//             borderWidth: 1,
//           },
//         ],
//       },
//       options: chartOptions,
//     }
//   );

//   const yearlyChart = new Chart(
//     document.getElementById('years').getContext('2d'),
//     {
//       type: 'line',
//       data: {
//         labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
//         datasets: [
//           {
//             label: '매출',
//             data: [
//               1538000, 2838000, 1230000, 873000, 1500000, 2000000, 1800000,
//               2200000, 2200000, 2200000, 2200000, 2200000,
//             ],
//             backgroundColor: [
//               'rgba(255, 206, 86, 0.2)',
//               'rgba(54, 162, 235, 0.2)',
//               'rgba(255, 99, 132, 0.2)',
//               'rgba(255, 99, 132, 0.2)',
//               'rgba(75, 192, 192, 0.2)',
//               'rgba(153, 102, 255, 0.2)',
//               'rgba(255, 159, 64, 0.2)',
//               'rgba(201, 203, 207, 0.2)',
//             ],
//             borderColor: [
//               'rgba(255, 206, 86, 1)',
//               'rgba(54, 162, 235, 1)',
//               'rgba(255, 99, 132, 1)',
//               'rgba(255, 99, 132, 1)',
//               'rgba(75, 192, 192, 1)',
//               'rgba(153, 102, 255, 1)',
//               'rgba(255, 159, 64, 1)',
//               'rgba(201, 203, 207, 1)',
//             ],
//             borderWidth: 1,
//           },
//         ],
//       },
//       options: chartOptions,
//     }
//   );
// });
