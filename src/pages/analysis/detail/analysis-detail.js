window.onload = () => {
  // 분석 메인의 a태그 상품 id값 가져옴
  const urlParams = new URLSearchParams(location.search);
  let id = urlParams.get("value");
  console.log(id);
  //================================================================================
  // json파일 가져오기
  axios.get("http://127.0.0.1:5500/v4copy.json").then((res) => {
    let products = res.data;
    let productId = products[id - 1]; //상품번호
    let productImage; //상품이미지
    let productName = productId.name; //상품명
    let productPrice = productId.price; //상품가격
    let productPlatform = productId.platforms.platform; //상품등록된 플랫폼
    let productCategory = productId.category; //상품의 카테고리
    let productTotalSales = 0; //상품 총매출
    let productReview = productId.platforms.review; //상품리뷰수
    let productStarReview = productId.platforms.starReview; //상품별점
    let categoryAveragePrice = 0; //평균가
    let highestPrice = 0; // 최고가
    let lowestPrice = 0; // 최저가
    // 상품명 ------------------------------------------------------------
    // console.log("상품명 : " + productId.name);
    productName = document.querySelector(".product-name");
    productName.innerText = productId.name;
    // 가격-----------------------------------------------------
    // console.log("가격 : " + productId.price);
    productPrice = document.querySelector(".product-price");
    productPrice.innerText = productId.price;
    // 플랫폼------------------------------------------------------
    // console.log("플랫폼 : " + productId.platforms.platform);
    productPlatform = document.querySelector(".product-platform");
    if (productId.platforms.platform === "ably") {
      productPlatform.innerText = "에이블리";
    } else if (productId.platforms.platform === "zigzag") {
      productPlatform.innerText = "지그재그";
    } else {
      productPlatform.innerText = "ablyy";
    }

    // 판매량----------------------------------------------------------
    if (productId.platforms.sales != 0) {
      for (let i = 0; i < products[id].platforms.sales.length; i++) {
        productTotalSales += products[id].platforms.sales[i].quantity;
      }
      productSales = document.querySelector(".product-sales");
      productSales.innerText = productTotalSales;
    }
    // console.log("판매량 : " + productTotalSales);
    // 리뷰별점---------------------------------------------------------
    // console.log("리뷰별점 : " + productId.platforms.starReview);
    productStarReview = document.querySelector(".star-review");
    productStarReview.innerText = productId.platforms.starReview;
    // 리뷰 개수---------------------------------------------------------
    // console.log("리뷰별점 : " + productId.platforms.review);
    productReview = document.querySelector(".product-review");
    productReview.innerText = productId.platforms.review;

    // 평균가==========================================================================================
    let matchingProductsCount = 0; //현재 상품과 플랫폼,카테고리가 같은 상품들 개수
    let sumCategoryPrice = 0; //동일 카테고리 상품들 가격의 합

    const sameCategory = products.filter(
      (item) => item.category === productCategory
    );
    console.log("같은 카테고리 제품", sameCategory);
    const samePlatform = sameCategory.filter(
      (item) => item.platforms.platform === productPlatform
    );
    // function filterByPlatform(item) {
    //   if (item.platforms.platform === productPlatform) {
    //     return true;
    //   }
    //   return false;
    // }

    // const samePlatform = sameCategory.filter(filterByPlatform);
    // console.log(item.platforms.platform);
    console.log("같은 플랫폼 제품", samePlatform);

    // 필터링된 배열
    // [{ id: 15 }, { id: -1 }, { id: 3 }, { id: 12.2 }]

    // ---------------------
    // function findSameCategory(sameCategory) {
    //   return (sameCategory = productCategory);
    // }

    // const SameCategoryProducts = products.category.filter(findSameCategory);
    // console.log(SameCategoryProducts);
    // -------------

    // function findSamePlatform(samePlatform) {
    //   return (samePlatform = productPlatform);
    // }

    // const SamePlatformProducts = products.filter(findSamePlatform);
    // console.log(SamePlatformProducts);
    // 필터링된 값은 [12, 130, 44]

    // // 플랫폼과 카테고리가 일치하는 모든 상품 필터링
    // let matchingProducts = products.filter(
    //   (product) =>
    //     product.platforms.platform === productPlatform &&
    //     product.category === productCategory
    // );

    // if (matchingProducts != 0) {
    //   for (i = 0; i < matchingProducts.length; i++) {
    //     sumCategoryPrice += matchingProducts.price;
    //     matchingProductsCount++;
    //   }
    // } else {
    //   sumCategoryPrice = productPrice;
    //   matchingProductsCount = 1;
    // }

    // categoryAveragePrice = sumCategoryPrice / matchingProductsCount;

    // console.log("카테고리 총 가격 : " + sumCategoryPrice);
    // console.log("카테고리 평균 가격 : " + categoryAveragePrice);

    // // 필요한 HTML 요소에 값 삽입 (필요에 따라 수정)
    // let categoryAveragePriceElement = document.querySelector(
    //   ".category-average-price"
    // );
    // categoryAveragePriceElement.innerText = categoryAveragePrice;

    // 최고가---------------------------------------------------------
    // 최저가---------------------------------------------------------
    //
  });
};
