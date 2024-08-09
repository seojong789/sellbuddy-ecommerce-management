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

document.addEventListener('DOMContentLoaded', (event) => {
  const weeklyChart = new Chart(
    document.getElementById('week').getContext('2d'),
    {
      type: 'line',
      data: {
        labels: ['2/4', '2/5', '2/6', '2/7', '2/8', '2/9', '2/10'],
        datasets: [
          {
            label: '매출',
            data: [15000, 12000, 5800, 9000, 7600, 7000, 5800],
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
            data: [1538000, 2838000, 1230000, 873000],
            backgroundColor: [
              'rgba(255, 206, 86, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
              'rgba(255, 206, 86, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 99, 132, 1)',
            ],
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
            data: [
              1538000, 2838000, 1230000, 873000, 1500000, 2000000, 1800000,
              2200000, 2200000, 2200000, 2200000, 2200000,
            ],
            backgroundColor: [
              'rgba(255, 206, 86, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(201, 203, 207, 0.2)',
            ],
            borderColor: [
              'rgba(255, 206, 86, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(201, 203, 207, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: chartOptions,
    }
  );
});
