// 8.11수정
window.onload = () => {
  // 분석 메인의 a태그 상품 id값 가져옴
  const urlParams = new URLSearchParams(location.search);
  let id = urlParams.get("value");
  console.log(id);
  // 날짜 설정
  const fixedDate = new Date("2023-12-31");
  //================================================================================
  // json파일 가져오기
  axios.get("http://127.0.0.1:5500/v4copy.json").then((res) => {
    let products = res.data;
    let productId = products[id - 1]; //상품번호
    // let productName = productId.name; //상품명
    let productPrice = productId.price; //상품가격
    let avgCategoryPrice = 0; //평균가
    let productPlatform = productId.platforms.platform; //상품등록된 플랫폼
    let productCategory = productId.category; //상품의 카테고리
    // let productsalesVolume = 0; // 상품 판매량
    let productsalesVolume = 0; // 상품 판매량
    let productTotalSales = 0; // 상품 총매출
    let productReview = productId.platforms.review; //상품리뷰수
    let productStarReview = productId.platforms.starReview; //상품별점
    let productRegistrationDate = productId.platforms.registrationDate; //상품등록일
    let productHashtags = productId.platforms.hashtags; //상품해시태그
    let productVisitLastweek = productId.platforms.visitLastweek; //지난주 방문자수
    let productVisitThisweek = productId.platforms.visitThisweek; //이번주 방문자수
    let PurchaseConversionRate = 0; //구매전환율
    let targetAge = 20; //내 쇼핑몰 타겟연령층
    let targetGender = "여성"; //내 쇼핑몰 타겟연령층
    // let productDescription = productId.description; //상품키워드

    // 상품이미지-------------------------------------------------
    // 실제 product 객체의 img 값을 src로 설정
    let productImageElement = document.querySelector(".product-img");
    productImageElement.src = productId.img;
    // //  productImage; //상품이미지
    console.log(productId.img);
    // let productImageElement = document.querySelector(".product-img");
    // productImageElement.src = "productId.img";

    // 상품명 ------------------------------------------------------------
    // console.log("상품명 : " + productId.name);
    let productNameElement = document.querySelector(".product-name");
    productNameElement.innerText = productId.name;
    // 가격-----------------------------------------------------
    // console.log("가격 : " + productId.price);
    let productPriceElement = document.querySelector(".product-price");
    productPriceElement.innerText = `${productId.price}원`;
    // 플랫폼------------------------------------------------------
    // console.log("플랫폼 : " + productId.platforms.platform);
    const productPlatformText = productPlatform.toLowerCase();
    let productPlatformElement = document.querySelector(".product-platform");
    if (productId.platforms.platform === "ably") {
      productPlatformElement.innerText = "에이블리";
    } else if (productId.platforms.platform === "zigzag") {
      productPlatformElement.innerText = "지그재그";
    } else {
      productPlatformElement.innerText = "ablyy";
    }

    // 판매량----------------------------------------------------------
    if (productId.platforms.sales != 0) {
      for (let i = 0; i < productId.platforms.sales.length; i++) {
        productsalesVolume += productId.platforms.sales[i].quantity;
      }
      let productsalesVolumeElement = document.querySelector(
        ".product-sales-volume"
      );
      productsalesVolumeElement.innerText = `${productsalesVolume}개`;
    }
    // console.log("판매량 : " + productsalesVolume);
    // 총매출----------------------------------------------------------
    productTotalSales = Number(productId.price) * productsalesVolume;
    let productTotalSalesElement = document.querySelector(
      ".product-total-sales"
    );
    productTotalSalesElement.innerText = `${productTotalSales}원`;
    // 리뷰별점---------------------------------------------------------
    // console.log("리뷰별점 : " + productId.platforms.starReview);
    let productReviewElement = document.querySelector(".product-review");
    productReviewElement.innerText = `★${productStarReview} (${productReview}개)`;

    // 평균가 최고가 최저가--------------------------------------------------
    let matchingProductsCount = 0; //현재 상품과 플랫폼,카테고리가 같은 상품들 개수
    let sumCategoryPrice = 0; //동일 카테고리 상품들 가격의 합

    const sameCategory = products.filter(
      (item) => item.category === productCategory
    );
    // console.log("같은 카테고리 제품", sameCategory);

    const samePlatform = sameCategory.filter(
      (item) => item.platforms.platform === productPlatformText
    );

    // console.log("같은 플랫폼 제품", samePlatform);

    // 동일 카테고리, 플랫폼 상품들의 가격 배열 생성
    const prices = samePlatform.map((item) => Number(item.price));
    const highestPrice = Math.max(...prices); //최고가
    const lowestPrice = Math.min(...prices); //최저가

    // console.log("가장 높은 가격:", highestPrice);
    // console.log("가장 낮은 가격:", lowestPrice);

    for (let e = 0; e < samePlatform.length; e++) {
      sumCategoryPrice += Number(samePlatform[e].price);
      matchingProductsCount++;
    }
    //평균가
    avgCategoryPrice = Math.round(
      Number(sumCategoryPrice / matchingProductsCount)
    );
    // console.log("매칭카운트 : " + matchingProductsCount);
    // console.log("같은 카테고리 합 : " + sumCategoryPrice);
    // console.log("같은 카테고리 평균가", avgCategoryPrice);

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
    // let today = new Date();
    // 오늘 날짜와 상품 등록일 계산
    let registrationDate = new Date(productRegistrationDate);

    // 시간을 00:00:00으로 설정하여 시간 부분 무시
    fixedDate.setHours(0, 0, 0, 0);
    registrationDate.setHours(0, 0, 0, 0);

    // 날짜 차이를 밀리초로 계산
    let timeDiff = fixedDate - registrationDate;

    // 밀리초를 일(day) 단위로 변환
    let daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    let productRegistrationDateElement = document.querySelector(
      //상품등록일
      ".product-registration-date"
    );

    productRegistrationDateElement.innerText = `${formattedDate} (${daysDiff}일 전)`;

    // 해시태그 비교 -------------------------------------------------------------------
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
    }
    // ★★★★★★★★★★★★★★★★★★★★★★종합분석★★★★★★★★★★★★★★★★★★★★★★★★★★★★
    // 리뷰분석
    // 리뷰 상태 요소 선택
    let reviewStatusElement = document.querySelector(
      ".total-analysis-review-status"
    );
    // 리뷰 코멘트 요소 선택
    let reviewCommentElement = document.querySelector(
      ".total-analysis-review-coment"
    );

    // productReview가 10 미만인지 확인
    if (productReview < 10) {
      // 클래스 변경
      reviewStatusElement.classList.replace(
        "total-analysis-review-status",
        "total-analysis-status-null"
      );
      // 텍스트 변경
      reviewStatusElement.innerText = "없음";
      // total-analysis-review-coment 요소 업데이트
      reviewCommentElement.innerHTML = `
    <p>리뷰 수가 10개 미만으로 분석이 어렵습니다</p>
    <p>리뷰 이벤트를 진행해 리뷰 수를 늘려보세요</p>
  `;
    } else {
      //별점(5점 만점) 기준으로 3점미만[나쁨] / 3점이상[보통] / 3.5점이상[좋음]
      if (productStarReview >= 3.5) {
        // 클래스 변경
        reviewStatusElement.classList.replace(
          "total-analysis-review-status",
          "total-analysis-status-good"
        );
        // 텍스트 변경
        reviewStatusElement.innerText = "좋음";
        // total-analysis-review-coment 요소 업데이트
        reviewCommentElement.innerHTML = `
    <p>리뷰별점이 ${productStarReview}점으로 높은 수준입니다</p>
    <p>지금처럼 상품과 고객 만족도를 꾸준히 관리해주세요</p>
  `;
      } else if (productStarReview >= 3 && productStarReview < 3.5) {
        // 클래스 변경
        reviewStatusElement.classList.replace(
          "total-analysis-review-status",
          "total-analysis-status-normal"
        );
        // 텍스트 변경
        reviewStatusElement.innerText = "보통";
        // total-analysis-review-coment 요소 업데이트
        reviewCommentElement.innerHTML = `
    <p>리뷰별점이 ${productStarReview}점으로 보통 수준입니다</p>
    <p>상품 및 배송 관리에 집중해 고객 만족도를 더 높여보세요</p>
  `;
      } else {
        // 클래스 변경
        reviewStatusElement.classList.replace(
          "total-analysis-review-status",
          "total-analysis-status-bad"
        );
        // 텍스트 변경
        reviewStatusElement.innerText = "나쁨";
        // total-analysis-review-coment 요소 업데이트
        reviewCommentElement.innerHTML = `

    <p>리뷰별점이 ${productStarReview}점으로 낮은 수준입니다</p>
    <p>고객들의 불만사항을 체크하고 철저한 상품 관리가 필요합니다</p>
  `;
      }
    }
    // 구매전환율 --------------------------------------------------------
    // 총 방문수(클릭수)
    let productVisitTotal = Number(productId.platforms.visitTotal);
    // 구매전환율 = (구매 완료 수 / 이번주, 지난주 방문자수) * 100
    PurchaseConversionRate = Number(
      ((productsalesVolume / productVisitTotal) * 100).toFixed(2)
    );

    // 구매 전환율 비교값 계산 및 소수점 한자리까지 표현
    let PurchaseConversionRateComparison = Number(
      (PurchaseConversionRate - 2).toFixed(2)
    );
    // console.log("방문자수 " + productVisitTotal);
    // console.log("판매량 " + productsalesVolume);
    // console.log("구매전환율 : " + PurchaseConversionRate);
    // console.log("구매전환율대비 : " + PurchaseConversionRateComparison);
    // 구매전환율 상태 요소 선택
    let PurchaseConversionRateStatusElement = document.querySelector(
      ".total-analysis-Purchase-conversion-rate-status"
    );
    // 구매전환율 코멘트 요소 선택
    let PurchaseConversionRateComentElement = document.querySelector(
      ".total-analysis-Purchase-conversion-rate-coment"
    );
    //  1% 미만[나쁨] / 3% 미만[보통] / 3% 이상[좋음]
    if (PurchaseConversionRate >= 3) {
      // 클래스 변경
      PurchaseConversionRateStatusElement.classList.remove(
        "total-analysis-Purchase-conversion-rate-status"
      );
      PurchaseConversionRateStatusElement.classList.add(
        "total-analysis-status-good"
      );
      // 텍스트 변경
      PurchaseConversionRateStatusElement.innerText = "좋음";
      // 구매전환율 요소 업데이트
      PurchaseConversionRateComentElement.innerHTML = `
    <p>구매전환율이 ${PurchaseConversionRate}%으로 이커머스 평균 대비 ${PurchaseConversionRateComparison}% 높아요</p>
    <p>상품 대표 이미지와 상품이 니즈를 적중했어요</p>
    `;
    } else if (PurchaseConversionRate < 3 && PurchaseConversionRate >= 1) {
      // 클래스 변경
      PurchaseConversionRateStatusElement.classList.remove(
        "total-analysis-Purchase-conversion-rate-status"
      );
      PurchaseConversionRateStatusElement.classList.add(
        "total-analysis-status-normal"
      );
      // 텍스트 변경
      PurchaseConversionRateStatusElement.innerText = "보통";
      // 구매전환율 요소 업데이트
      PurchaseConversionRateComentElement.innerHTML = `
    <p>구매전환율이 ${PurchaseConversionRate}%으로 이커머스 평균 대비 ${PurchaseConversionRateComparison}% 차이가 있어요</p>
    <p>상품 대표 이미지는 적절하나 상품 상세 설명을 보충하여 구매전환율을 높여보세요</p>
    `;
    } else {
      // 클래스 변경
      PurchaseConversionRateStatusElement.classList.remove(
        "total-analysis-Purchase-conversion-rate-status"
      );
      PurchaseConversionRateStatusElement.classList.add(
        "total-analysis-status-bad"
      );
      // 텍스트 변경
      PurchaseConversionRateStatusElement.innerText = "나쁨";
      // 구매전환율 요소 업데이트
      PurchaseConversionRateComentElement.innerHTML = `
    <p>구매전환율이 ${PurchaseConversionRate}%으로 이커머스 평균 대비 ${PurchaseConversionRateComparison}% 낮아요</p>
    <p>상품 상세 설명을 상품 대표 이미지와 일치시켜 구매전환율을 높여보세요</p>
    `;
    }
    // 가격분석 ----------------------------------------------------------
    let categoryAveragePricePercent = 0;
    // 가격차이 % =((상품가격-평균가)/평균가)*100
    categoryAveragePricePercent = Number(
      (((productPrice - avgCategoryPrice) / avgCategoryPrice) * 100).toFixed(1)
    );

    console.log("퍼센트:" + categoryAveragePricePercent);
    console.log("평균가:" + avgCategoryPrice);
    console.log("가격:" + productPrice);
    // 가격 상태 요소 선택
    let priceStatusElement = document.querySelector(
      ".total-analysis-price-status"
    );
    // 가격 코멘트 요소 선택
    let priceComentElement = document.querySelector(
      ".total-analysis-price-coment"
    );
    // 평균가보다 -5%미만[나쁨] /평균가 ± 5%[보통] / 평균가+5%이상[좋음]
    if (categoryAveragePricePercent > 5) {
      // 클래스 변경
      priceStatusElement.classList.remove("total-analysis-price-status");
      priceStatusElement.classList.add("total-analysis-status-good");
      // 텍스트 변경
      priceStatusElement.innerText = "좋음";
      // 가격 코멘트 요소 업데이트
      priceComentElement.innerHTML = `
    <p>${productCategory}카테고리 평균가보다 ${categoryAveragePricePercent}% 높아요</p>
    <p>박리다매보다 질 좋은 상품을 원하는 고객들의 니즈에 적합해요</p>
    `;
    } else if (
      categoryAveragePricePercent <= 5 &&
      categoryAveragePricePercent >= -5
    ) {
      // 클래스 변경
      priceStatusElement.classList.remove("total-analysis-price-status");
      priceStatusElement.classList.add("total-analysis-status-normal");
      // 텍스트 변경
      priceStatusElement.innerText = "보통";
      // 가격 코멘트 요소 업데이트
      priceComentElement.innerHTML = `
    <p>${productCategory}카테고리 평균가와 ${categoryAveragePricePercent}% 차이가 있어요</p>
    <p>가격 설정이 적절하나 박리다매 상품이라면 가격을 낮춰보세요</p>
    `;
    } else {
      // 클래스 변경
      priceStatusElement.classList.remove("total-analysis-price-status");
      priceStatusElement.classList.add("total-analysis-status-bad");
      // 텍스트 변경
      priceStatusElement.innerText = "나쁨";
      // 가격 코멘트 요소 업데이트
      priceComentElement.innerHTML = `
<p>${productCategory}카테고리 평균가보다 ${categoryAveragePricePercent}% 낮아요</p>
<p>박리다매 상품이 아니라면 가격을 더 높일 필요가 있어요</p>
`;
    }
    // 판매율 추이 ----------------------------------------------------------------
    // 날짜를 yyyy-mm-dd 형식으로 변환하는 함수
    function formatDate(date) {
      let year = date.getFullYear();
      let month = String(date.getMonth() + 1).padStart(2, "0");
      let day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    // 오늘 날짜와 7일 전, 14일 전 날짜 계산
    // let today = new Date();
    let sevenDaysAgo = new Date(fixedDate);
    let fourteenDaysAgo = new Date(fixedDate);
    // 7일 전과 14일 전 날짜 설정
    sevenDaysAgo.setDate(fixedDate.getDate() - 7);
    fourteenDaysAgo.setDate(fixedDate.getDate() - 14);
    // 날짜를 문자열로 변환
    let todayStr = formatDate(fixedDate);
    let sevenDaysAgoStr = formatDate(sevenDaysAgo);
    let fourteenDaysAgoStr = formatDate(fourteenDaysAgo);

    // // 판매량 계산 함수
    function getSalesForPeriod(startDate, endDate) {
      let totalSales = 0;
      for (let sale of productId.platforms.sales) {
        let saleDate = new Date(sale.date);
        let saleDateStr = formatDate(saleDate);
        if (saleDateStr >= startDate && saleDateStr < endDate) {
          totalSales += sale.quantity;
        }
      }
      return totalSales;
    }
    // 오늘부터 7일 전까지와 7일 전부터 14일 전까지의 판매량 계산
    let salesLast7Days = getSalesForPeriod(sevenDaysAgoStr, todayStr);
    let salesPrevious7Days = getSalesForPeriod(
      fourteenDaysAgoStr,
      sevenDaysAgoStr
    );
    // 판매량 비교
    let salesComparisonPercent =
      ((salesLast7Days - salesPrevious7Days) / salesPrevious7Days) * 100;
    // 결과를 소수점 한 자리로 반올림
    salesComparisonPercent = Number(salesComparisonPercent.toFixed(1));
    console.log("판매량 비교:", salesComparisonPercent + "%");
    console.log("7일전:", salesLast7Days);
    console.log("14일전:", salesPrevious7Days);

    // 판매율 추이 HTML-------------------------------------------------------
    // 판매율 상태 요소 선택
    let salesComparisonStatusElement = document.querySelector(
      ".total-analysis-sales-comparison-status"
    );
    // 판매율 코멘트 요소 선택
    let salesComparisonComentElement = document.querySelector(
      ".total-analysis-sales-comparison-coment"
    );

    // 판매량 상태에 따라 클래스 변경 및 텍스트 업데이트
    if (salesComparisonPercent > 5) {
      // 클래스 변경
      salesComparisonStatusElement.classList.remove(
        "total-analysis-sales-comparison-status"
      );
      salesComparisonStatusElement.classList.add("total-analysis-status-good");
      // 텍스트 변경
      salesComparisonStatusElement.innerText = "좋음";
      // 판매율추이 코멘트 요소 업데이트
      salesComparisonComentElement.innerHTML = `
            <p>지난 주 판매량보다 ${salesComparisonPercent}% 증가했어요</p>
            <p>해당 상품의 디자인이 유행하고 있으니 유사한 상품을 추가해보세요</p>
          `;
    } else if (salesComparisonPercent <= 5 && salesComparisonPercent >= -5) {
      // 클래스 변경
      salesComparisonStatusElement.classList.remove(
        "total-analysis-sales-comparison-status"
      );
      salesComparisonStatusElement.classList.add(
        "total-analysis-status-normal"
      );
      salesComparisonStatusElement.innerText = "보통";
      if (salesComparisonPercent === 0) {
        salesComparisonComentElement.innerHTML = `
              <p>지난 주 판매량과 동일해요</p>
              <p>인기 해시태그를 적용해 클릭률을 늘려보세요</p>
            `;
      } else {
        salesComparisonComentElement.innerHTML = `
              <p>지난 주 판매량과 ${salesComparisonPercent}% 차이가 있어요</p>
              <p>인기 해시태그를 적용해 클릭률을 늘려보세요</p>
            `;
      }
    } else if (salesComparisonPercent < -5) {
      // 클래스 변경
      salesComparisonStatusElement.classList.remove(
        "total-analysis-sales-comparison-status"
      );
      salesComparisonStatusElement.classList.add("total-analysis-status-bad");
      // 텍스트 변경
      salesComparisonStatusElement.innerText = "나쁨";
      // 판매율추이 코멘트 요소 업데이트
      salesComparisonComentElement.innerHTML = `
            <p>지난 주 판매량보다 ${salesComparisonPercent}% 감소했어요</p>
            <p>인기 해시태그를 적용해 클릭률을 높이고 디자인 트렌드를 확인해보세요</p>
          `;
    } else {
      // 클래스 변경
      salesComparisonStatusElement.classList.remove(
        "total-analysis-sales-comparison-status"
      );
      salesComparisonStatusElement.classList.add("total-analysis-status-null");
      // 텍스트 변경
      salesComparisonStatusElement.innerText = "없음";
      // 판매율추이 코멘트 요소 업데이트
      salesComparisonComentElement.innerHTML = `
            <p>총 판매량이 0개입니다</p>
            <p>판매량이 1개 이상일 때 분석이 가능해요</p>
          `;
    }
    //플랫폼 분석--------------------------------------------------------------------------
    //동일상품찾기
    let sameProducts = products.filter(
      (product) => product.name === productId.name
    );
    console.log("Same Products:", sameProducts);

    // 동일상품들의 age 값이 같은지 확인
    let sameProductsAgeCheck = sameProducts.every(
      (product) => product.age === sameProducts[0].age
    );
    //동일상품들의 평균연령층
    let sameProductsAge;

    if (sameProductsAgeCheck) {
      // 동일상품들의 age 값이 같으면 첫 번째 age 값을 sameProductsAge에 담기
      sameProductsAge = sameProducts[0].age;
    } else {
      // age 값이 서로 다르면 quantity가 더 많은 요소의 age 값을 sameProductsAge에 담기
      sameProductsAge = sameProducts.reduce((prev, current) => {
        // 모든 sales의 quantity 합계를 계산
        let prevTotalQuantity = prev.platforms.sales.reduce(
          (sum, sale) => sum + sale.quantity,
          0
        );
        let currentTotalQuantity = current.platforms.sales.reduce(
          (sum, sale) => sum + sale.quantity,
          0
        );

        return prevTotalQuantity > currentTotalQuantity ? prev : current;
      }).age;
    }
    // 상품구매연령 s빼고 int형
    sameProductsAge = parseInt(productId.age.replace("s", ""));
    console.log("동일상품들의 평균 연령층:", sameProductsAge);

    //상품구매성별
    let purchaseGender =
      productId.gender === "M"
        ? "남성"
        : productId.gender === "F"
        ? "여성"
        : "알 수 없음";
    console.log(purchaseGender);

    // 동일상품들의 gender 값이 같은지 확인
    let sameProductsGenderCheck = sameProducts.every(
      (product) => product.gender === sameProducts[0].gender
    );
    //동일상품들의 평균성별
    let sameProductsGender;

    if (sameProductsGenderCheck) {
      // 모든 gender 값이 같으면 첫 번째 gender 값을 sameProductsGender에 담기
      sameProductsGender = sameProducts[0].gender;
    } else {
      // gender 값이 서로 다르면 quantity가 더 많은 요소의 gender 값을 sameProductsGender에 담기
      sameProductsGender = sameProducts.reduce((prev, current) => {
        // 모든 sales의 quantity 합계를 계산
        let prevTotalQuantity = prev.platforms.sales.reduce(
          (sum, sale) => sum + sale.quantity,
          0
        );
        let currentTotalQuantity = current.platforms.sales.reduce(
          (sum, sale) => sum + sale.quantity,
          0
        );

        return prevTotalQuantity > currentTotalQuantity ? prev : current;
      }).gender;
    }

    sameProductsGender =
      sameProductsGender === "M"
        ? "남성"
        : productId.gender === "F"
        ? "여성"
        : "알 수 없음";

    console.log("동일상품들의 평균성별:", sameProductsGender);

    // 플랫폼분석-종합분석 코멘트 요소 선택
    let platformAnalysisComentElement = document.querySelector(
      ".platform-analysis-coment"
    );
    // if (sameProductsAge === targetAge && purchaseGender === targetGender) {
    if (sameProductsAge < targetAge) {
      platformAnalysisComentElement.innerHTML = `
            <p>우리 쇼핑몰 타겟층은 ${targetAge}대 ${targetGender}예요</p>
            <p>해당 상품은 ${sameProductsAge}대 ${sameProductsGender} 구매율이 높아요</p>
            <p>조금 더 성숙한 디자인의 상품기획이 필요해보여요</p>
          `;
    } else if (sameProductsAge === targetAge) {
      platformAnalysisComentElement.innerHTML = `
             <p>해당 상품의 타겟층이 우리 쇼핑몰 타겟층인 ${targetAge}대 ${targetGender}과 일치해요</p>
             <p>비슷한 디자인의 상품기획을 추천드려요</p>
          `;
    } else if (sameProductsAge > targetAge) {
      platformAnalysisComentElement.innerHTML = `
           <p>우리 쇼핑몰 타겟층은 ${targetAge}대 ${targetGender}예요</p>
           <p>해당 상품은 ${sameProductsAge}대 ${sameProductsGender} 구매율이 높아요</p>
            <p>조금 더 젊어보이는 디자인의 상품기획이 필요해보여요</p>
          `;
    } else {
      platformAnalysisComentElement.innerHTML = `
      <p>총 판매량이 0개입니다</p>
      <p>판매량이 1개 이상일 때 분석이 가능해요</p>
     `;
    }

    let ablyAge = 0;
    let zigzagAge = 0;

    // sameProducts 배열을 순회하며 조건에 맞는 age 값을 변수에 할당
    sameProducts.forEach((product) => {
      if (product.platforms.platform === "ably") {
        ablyAge = parseInt(product.age.replace("s", ""));
      } else if (product.platforms.platform === "zigzag") {
        zigzagAge = parseInt(product.age.replace("s", ""));
      }
    });

    console.log("Ably Age:", ablyAge);
    console.log("Zigzag Age:", zigzagAge);

    // 플랫폼 분석 - 에이블리 분석 코멘트 요소 선택
    let ablyAnalysisComentElement = document.querySelector(
      ".ably-analysis-coment"
    );
    // if (sameProductsAge === targetAge && purchaseGender === targetGender) {
    if (ablyAge === 0) {
      ablyAnalysisComentElement.innerHTML = `
      <p>총 판매량이 0개입니다</p>
      <p>판매량이 1개 이상일 때 분석이 가능해요</p>
     `;
    } else if (ablyAge < targetAge) {
      ablyAnalysisComentElement.innerHTML = `
          <p>${sameProductsAge}대 ${sameProductsGender} 구매율이 높아요</p>
          <p>조금 더 성숙한 디자인의 상품기획이 필요해보여요</p>
        `;
    } else if (ablyAge === targetAge) {
      ablyAnalysisComentElement.innerHTML = `
           <p>우리 쇼핑몰 타겟층인 ${targetAge}대 ${targetGender}과 일치해요</p>
           <p>비슷한 디자인의 상품기획을 추천드려요</p>
        `;
    } else if (ablyAge > targetAge) {
      ablyAnalysisComentElement.innerHTML = `
         <p>${sameProductsAge}대 ${sameProductsGender} 구매율이 높아요</p>
        <p>조금 더 젊어보이는 디자인의 상품기획이 필요해보여요</p>
        `;
    }

    // 플랫폼 분석 - 에이블리 분석 코멘트 요소 선택
    let zigzagAnalysisComentElement = document.querySelector(
      ".zigzag-analysis-coment"
    );
    // if (sameProductsAge === targetAge && purchaseGender === targetGender) {
    if (zigzagAge === 0) {
      zigzagAnalysisComentElement.innerHTML = `
      <p>총 판매량이 0개입니다</p>
      <p>판매량이 1개 이상일 때 분석이 가능해요</p>
     `;
    } else if (zigzagAge < targetAge) {
      zigzagAnalysisComentElement.innerHTML = `
          <p>${sameProductsAge}대 ${sameProductsGender} 구매율이 높아요</p>
          <p>조금 더 성숙한 디자인의 상품기획이 필요해보여요</p>
        `;
    } else if (zigzagAge === targetAge) {
      zigzagAnalysisComentElement.innerHTML = `
           <p>우리 쇼핑몰 타겟층인 ${targetAge}대 ${targetGender}과 일치해요</p>
           <p>비슷한 디자인의 상품기획을 추천드려요</p>
        `;
    } else if (zigzagAge > targetAge) {
      zigzagAnalysisComentElement.innerHTML = `
         <p>${sameProductsAge}대 ${sameProductsGender} 구매율이 높아요</p>
         <p>조금 더 젊어보이는 디자인의 상품기획이 필요해보여요</p>
        `;
    }
  }); // 마지막1
}; //마지막2
