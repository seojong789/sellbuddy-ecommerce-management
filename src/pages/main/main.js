const today = new Date("2023-12-31");

axios
  .get("http://localhost:5500/v4.json")
  .then((res) => {
    const products = res.data;
    // 주문현황
    let orderToday = 0; // 신규 주문
    let saleToday = 0; // 금일 매출
    products.forEach((products) => {
      products.platforms.forEach((platforms) => {
        platforms.sales.forEach((sales) => {
          if (today - new Date(sales.date) == 0) {
            orderToday += sales.quantity;
            saleToday += sales.quantity * products.price;
          }
        });
      });
    });
    const orderUnknown = Math.round(orderToday / 5); // 미확인 주문 (임시)
    const orderKnown = Math.round(orderToday / 3); // 주문 확정 (임시)
    const orderHTML = `
      <h1 class="title">주문 현황<span> (당일 0시 기준)</span></h1>
      <p>
        <span>미확인 주문 ${orderUnknown.toLocaleString()}건</span>
        <span>신규 주문 ${orderToday.toLocaleString()}건</span>
        <span>주문 확정 ${orderKnown.toLocaleString()}건</span>
        <span>금일 매출 ${saleToday.toLocaleString()}원</span>
      </p>`;
    document.querySelector("#main-order").innerHTML = orderHTML;

    // 나의 인기 상품
    const platformSelect = document.getElementById("product-platform");

    const printPopluarProduct = () => {
      let poppularProduct = [];
      products.forEach((products) => {
        products.platforms.forEach((platforms) => {
          platforms.sales.forEach((sales) => {
            if (platforms.platform == platformSelect.value) {
              if (today - new Date(sales.date) == 0) {
                poppularProduct.push([products.name, sales.quantity]);
              }
            }
          });
        });
      });
      poppularProduct.sort((a, b) => b[1] - a[1]);

      document.querySelector("#main-popular-product-list").innerHTML = `
        <p class="list-title">
          <span class="list-side">순위</span>
          <span class="list-center">상품</span>
          <span class="list-side">판매량</span>
        </p>
        `;
      for (let i = 0; i < 5; i++) {
        let popularProductHTML;
        if (i > 0 && poppularProduct[i][1] == poppularProduct[i - 1][1]) {
          popularProductHTML = `
            <li>
              <span class="list-side">${i}위</span>
              <span class="list-center">${poppularProduct[i][0]}</span>
              <span class="list-side">${poppularProduct[i][1]}건</span>
            </li>
            `;
        } else {
          popularProductHTML = `
          <li>
            <span class="list-side">${i + 1}위</span>
            <span class="list-center">${poppularProduct[i][0]}</span>
            <span class="list-side">${poppularProduct[i][1]}건</span>
          </li>
          `;
        }
        document.querySelector("#main-popular-product-list").innerHTML +=
          popularProductHTML;
      }
    };
    printPopluarProduct();
    platformSelect.addEventListener("change", printPopluarProduct);

    // 인기 해시태그
    let printPopluarHashtag = () => {
      let popularHashtagHTML = [];
      document.querySelector("#main-hashtag-list").innerHTML = `
         <p class="list-title">
           <span class="list-side">순위</span>
           <span class="list-center">상품</span>
           <span class="list-side">판매량</span>
         </p>
         `;
      document.querySelector("#main-hashtag-list").innerHTML +=
        popularHashtagHTML;
    };
    printPopluarHashtag();
    platformSelect.addEventListener("change", printPopluarHashtag);
  })
  .catch((error) => {
    console.log("error 발생 : " + error);
  });
