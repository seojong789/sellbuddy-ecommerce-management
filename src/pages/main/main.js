axios
  .get("http://localhost:5500/v4.json")
  .then((res) => {
    let products = res.data;
    // 주문현황
    let orderToday = 0; // 신규 주문
    let saleToday = 0; // 금일 매출
    for (let i = 0; i < products.length; i++) {
      for (let j = 0; j < products[i].platforms.length; j++) {
        for (let k = 0; k < products[i].platforms[j].sales.length; k++) {
          if (products[i].platforms[j].sales[k].date == "2023-12-31") {
            orderToday += products[i].platforms[j].sales[k].quantity;
            saleToday +=
              products[i].platforms[j].sales[k].quantity * products[i].price;
          }
        }
      }
    }
    let orderUnknown = Math.round(orderToday / 5); // 미확인 주문 (임시)
    let orderKnown = Math.round(orderToday / 3); // 주문 확정 (임시)
    let productsHTML = `
      <h1 class="title">주문 현황<span>(당일 0시 기준)</span></h1>
      <p>
        <span>미확인 주문 ${orderUnknown.toLocaleString()}건</span>
        <span>신규 주문 ${orderToday.toLocaleString()}건</span>
        <span>주문 확정 ${orderKnown.toLocaleString()}건</span>
        <span>금일 매출 ${saleToday.toLocaleString()}원</span>
      </p>`;
    document.querySelector("#main-order").innerHTML = productsHTML;
  })
  .catch((error) => {
    console.log("error 발생 : " + error);
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

document.addEventListener("DOMContentLoaded", (event) => {
  const weeklyCountChart = new Chart(
    document.getElementById("week-count").getContext("2d"),
    {
      type: "bar",
      data: {
        labels: ["12/25", "12/26", "12/27", "12/28", "12/29", "12/30", "12/31"],
        datasets: [
          {
            label: "주문",
            data: [150, 120, 58, 90, 76, 70, 58],
            borderWidth: 1,
          },
        ],
      },
      options: chartOptions,
    }
  );
});
