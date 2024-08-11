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
    let productRegistrationDate = productId.platforms.registrationDate; //상품등록일
    let productHashtags = productId.platforms.hashtags; //상품해시태그
    // let productDescription = productId.description; //상품키워드

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
      for (let i = 0; i < productId.platforms.sales.length; i++) {
        productsalesVolume += productId.platforms.sales[i].quantity;
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

    const productSales = products.filter(
      (item) => item.category === productCategory
    );
    // console.log("총매출", productTotalSales);
    // console.log("총매출", productsalesVolume);

    let categoryAveragePriceElement = document.querySelector(
      ".category-average-price"
    );
    categoryAveragePriceElement.innerText = `${avgCategoryPrice}원`;

    let highestPriceElement = document.querySelector(".category-highest-price");
    highestPriceElement.innerText = `${highestPrice}원`;
    let lowestPriceElement = document.querySelector(".category-lowest-price");
    lowestPriceElement.innerText = `${lowestPrice}원`;

    // 키워드 ---------------------------------------------
    let productDescription = productId.description; //상품키워드
    let productDescriptionElement = document.querySelector(
      ".product-description"
    );
    productDescriptionElement.innerText = productDescription;

    // 날짜 형식 변환 00.00.00 --------------------------------------
    let [year, month, day] = productRegistrationDate.split("-");
    let formattedDate = `${year}.${month}.${day}`;

    //-----------------------------
    // 오늘 날짜와 상품 등록일 계산
    let today = new Date();
    let registrationDate = new Date(productRegistrationDate);

    // 시간을 00:00:00으로 설정하여 시간 부분 무시
    today.setHours(0, 0, 0, 0);
    registrationDate.setHours(0, 0, 0, 0);

    // 날짜 차이를 밀리초로 계산
    let timeDiff = today - registrationDate;

    // 밀리초를 일(day) 단위로 변환
    let daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    let productRegistrationDateElement = document.querySelector(
      //상품등록일
      ".product-registration-date"
    );

    productRegistrationDateElement.innerText = `${formattedDate} (${daysDiff}일 전)`;

    // ★★★★★★★★★★★★★★★★★★★★★★해시태그★★★★★★★★★★★★★★★★★★★★★★★★★★★★
    let myHashtags = productHashtags;
    console.log(myHashtags);
    //비교할 해시태그는 플랫폼의 당일 인기상품 5개의 해시태그를 뽑아서 공통 해시태그 5개로 선정한다
    // 모든 해시태그 배열 결합
    const platformHashtags = samePlatform.flatMap(
      (item) => item.platforms.hashtags
    );
    // console.log(platformHashtags);

    // 해시태그 빈도 계산
    const hashtagFrequency = platformHashtags.reduce((acc, hashtag) => {
      acc[hashtag] = (acc[hashtag] || 0) + 1;
      return acc;
    }, {});

    // 빈도가 높은순으로 해시태그 5개 top5Hashtags배열에 담기
    const top5Hashtags = Object.entries(hashtagFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([hashtag]) => hashtag);

    console.log("Top 5 Hashtags:", top5Hashtags);

    let hashtagsComparisonElement = document.querySelector(
      ".hashtags-comparison"
    );
    hashtagsComparisonElement.innerHTML = `<tr>
                <th>MY</th>
                <th>인기</th>
              </tr>
              <tr>
                <td>${myHashtags[0]}</td>
                <td>${top5Hashtags[0]}</td>
              </tr>
              <tr>
                <td>${myHashtags[1]}</td>
               <td>${top5Hashtags[1]}</td>
              </tr>
              <tr>
                <td>${myHashtags[2]}</td>
                <td>${top5Hashtags[2]}</td>
              </tr>
              <tr>
                <td>${myHashtags[3]}</td>
                <td>${top5Hashtags[3]}</td>
              </tr>
              <tr>
                <td>${myHashtags[4]}</td>
                <td>${top5Hashtags[4]}</td>
              </tr>`;

    let hashtagsComparisonCount = myHashtags.filter((hashtag) =>
      top5Hashtags.includes(hashtag)
    ).length;
    console.log(hashtagsComparisonCount);

    // 해시태그 비교 상태[좋음]
    let hashtagComparisonStatusElement = document.querySelector(
      ".hashtag-comparison-status"
    );

    if (hashtagsComparisonCount > 3) {
      hashtagComparisonStatusElement.innerText = "좋음";
      hashtagComparisonStatusElement.classList.add("hashtag-comparison-good");
    } else if (hashtagsComparisonCount === 3) {
      hashtagComparisonStatusElement.innerText = "보통";
      hashtagComparisonStatusElement.classList.add("hashtag-comparison-normal");
    } else {
      hashtagComparisonStatusElement.innerText = "나쁨";
      hashtagComparisonStatusElement.classList.add("hashtag-comparison-bad");
    }

    // 해시태그 비교 막대그래프

    let hashtagComparisonBarElement = document.querySelectorAll(
      ".hashtag-comparison-bar"
    );
    console.log(hashtagComparisonBarElement);
    console.log(hashtagsComparisonCount);

    for (let cnt = 0; cnt < hashtagsComparisonCount; cnt++) {
      if (hashtagsComparisonCount > 3) {
        hashtagComparisonBarElement[cnt].classList.add("good");
      } else if (hashtagsComparisonCount === 3) {
        hashtagComparisonBarElement[cnt].classList.add("normal");
      } else {
        hashtagComparisonBarElement[cnt].classList.add("bad");
      }
      // hashtagComparisonBarElement[cnt].classList.add("fill");
    }
  }); // 마지막1
}; //마지막2
