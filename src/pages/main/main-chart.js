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

const today = new Date("2023-12-31");
const dataSelect = document.getElementById("chart-data");
let weeklyChart;

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
    .get("http://localhost:5500/v4.json")
    .then((res) => {
      const products = res.data;
      for (let n = 0; n < 7; n++) {
        let date = new Date(today);
        date.setDate(today.getDate() - n);
        charLabel.unshift(date.getMonth() + 1 + "/" + date.getDate());

        let orderDate = 0;
        let saleDate = 0;
        products.forEach((product) => {
          product.platforms.forEach((platform) => {
            platform.sales.forEach((sale) => {
              if (date.getTime() === new Date(sale.date).getTime()) {
                orderDate += sale.quantity;
                saleDate += sale.quantity * product.price;
              }
            });
          });
        });

        if (dataSelect.value == "product-count") {
          chartData.unshift(orderDate);
        } else {
          chartData.unshift(saleDate);
        }
      }

      if (dataSelect.value == "product-count") {
        dataLabel = "주문";
      } else {
        dataLabel = "매출";
      }
      updateChart(charLabel, chartData, dataLabel);
    })
    .catch((error) => {
      console.log("error 발생 : " + error);
    });
};
printChart();
dataSelect.addEventListener("change", printChart);
