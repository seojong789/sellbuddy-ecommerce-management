window.onload = () => {
  const params = new URLSearchParams(location.search);
  let id = params.get("value");
  console.log(id);

  axios.get("http://127.0.0.1:5500/v4.json").then((res) => {
    let productName = res.data;
    console.log(productName[id].name);

    // 'productName' 클래스를 가진 첫 번째 요소를 선택
    let productNameElement = document.querySelector(".productName");

    productNameElement.innerText = productName[id].name;
    console.log(productNameElement);

    let todayCount = 0;
    let todaySale = 0;
  });
};
