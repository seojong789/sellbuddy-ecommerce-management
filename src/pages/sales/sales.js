import { animateValue } from '../../components/util.js';

function createGradient(ctx, area) {
  const gradient = ctx.createLinearGradient(0, 0, 0, area.bottom);
  gradient.addColorStop(0, 'rgba(31, 64, 120, 0.3)');
  gradient.addColorStop(1, 'rgba(31, 64, 120, 0)');
  return gradient;
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 3,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(200, 200, 200, 0.4)',
        borderDash: [8, 4],
      },
      ticks: {
        color: '#1F4078',
        font: {
          size: 12,
          weight: 'bold',
        },
        padding: 10,
      },
    },
    x: {
      grid: {
        color: 'rgba(200, 200, 200, 0.2)',
        borderDash: [8, 4],
      },
      ticks: {
        color: '#1F4078',
        font: {
          size: 12,
          weight: 'bold',
        },
        padding: 10,
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: '#1F4078',
        font: {
          size: 14,
          weight: 'bold',
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      titleColor: '#fff',
      bodyColor: '#fff',
      cornerRadius: 6,
      titleFont: {
        size: 14,
        weight: 'bold',
        family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      },
      bodyFont: {
        size: 12,
      },
      padding: 12,
      callbacks: {
        label: function (context) {
          return (
            '💰 ' +
            context.dataset.label +
            ': ' +
            context.raw.toLocaleString() +
            ' 원'
          );
        },
      },
    },
  },
  elements: {
    line: {
      tension: 0.4,
      borderWidth: 3,
      borderColor: '#3F7AB5',
      backgroundColor: function (context) {
        const chart = context.chart;
        const { ctx, chartArea } = chart;

        if (!chartArea) {
          return null;
        }
        return createGradient(ctx, chartArea);
      },
    },
    point: {
      radius: 6,
      backgroundColor: '#142b42', // 포인트 색상
      borderColor: 'white', // 포인트 테두리 색상을 흰색으로 설정하여 대비를 줌
      borderWidth: 1,
      hoverRadius: 7,
      hoverBorderWidth: 4,
      hoverBackgroundColor: '#2ECC71', // 호버 시 녹색으로 변경
      hoverBorderColor: '#27AE60',
      pointStyle: 'triangle', // 데이터 포인트 모양을 둥근 사각형으로 설정
    },
  },
  animation: {
    duration: 2000,
    easing: 'easeInOutQuart',
  },
};

async function initializeCharts() {
  let jsonData = [];

  try {
    const response = await fetch('./product.json');
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
      options: {
        ...chartOptions,
        aspectRatio: 6,
      },
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

      const monthlySalesEmt = document.getElementById('monthly-sales');
      const dailySalesEmt = document.getElementById('daily-sales');

      const currentMonthlySales =
        parseInt(monthlySalesEmt.innerText.replace(/,/g, '')) || 0;
      const currentDailySales =
        parseInt(dailySalesEmt.innerText.replace(/,/g, '')) || 0;

      const newMonthlySales =
        salesData.monthlySales[new Date(selectedDate).getMonth()];
      const newDailySales = salesData.dailySales;

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
  startDate.setDate(selectedDateObj.getDate() - 6);

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateKey = currentDate.toISOString().split('T')[0];
    weeklySales[dateKey] = 0;
  }

  data.forEach((product) => {
    if (platform === 'total' || product.platform === platform) {
      product.sales.forEach((sale) => {
        const saleDate = new Date(sale.date);
        const saleAmount = sale.quantity * product.price;

        if (saleDate >= startDate && saleDate <= selectedDateObj) {
          const dateKey = saleDate.toISOString().split('T')[0];
          if (weeklySales[dateKey] !== undefined) {
            weeklySales[dateKey] += saleAmount;
          }
        }

        const quarter = Math.floor(saleDate.getMonth() / 3);
        quarterlySales[quarter] += saleAmount;

        monthlySales[saleDate.getMonth()] += saleAmount;

        yearlySales += saleAmount;
      });
    }
  });

  let dailySales = 0;
  if (selectedDate) {
    data.forEach((product) => {
      if (platform === 'total' || product.platform === platform) {
        product.sales.forEach((sale) => {
          if (sale.date === selectedDate) {
            dailySales += sale.quantity * product.price;
          }
        });
      }
    });
  }

  return { weeklySales, quarterlySales, monthlySales, yearlySales, dailySales };
}

document.addEventListener('DOMContentLoaded', () => {
  initializeCharts();
});
