// 8.11수정
// 8.13수정(양성규)
window.onload = () => {
  // 분석 메인의 a태그 상품 id값 가져옴
  const urlParams = new URLSearchParams(location.search);
  let id = urlParams.get('value');
  console.log(id);
  // 날짜 무조건 23년 12월 31일로 설정
  const fixedDate = new Date('2023-12-31');
  //================================================================================

  // json파일 가져오기
  axios.all([axios.get('/product.json'), axios.get('/platform1.json')]).then(
    axios.spread((productsRes, platformsRes) => {
      // 두 JSON 파일의 데이터를 각각 가져옴
      let products = productsRes.data;
      let platforms = platformsRes.data;

      // let products = res.data;
      let productId = products[id - 1]; //상품번호
      let platformId = platforms[id - 1]; //플랫폼번호
      let productCategory = productId.category; //상품카테고리
      // console.log(platforId);
      // console.log(platformId.name);
      // let avgCategoryPrice = 0; //평균가
      // let productPlatform = productId.platforms.platform; //상품등록된 플랫폼
      // let productCategory = productCategory; //상품의 카테고리
      // // let productsalesVolume = 0; // 상품 판매량
      // let productsalesVolume = 0; // 상품 판매량
      // let productTotalSales = 0; // 상품 총매출
      // let productReview = productId.platforms.review; //상품리뷰수
      // let productStarReview = productId.platforms.starReview; //상품별점
      // let productRegistrationDate = productId.platforms.registrationDate; //상품등록일
      // let productHashtags = productId.platforms.hashtags; //상품해시태그
      // let productVisitLastweek = productId.platforms.visitLastweek; //지난주 방문자수
      // let productVisitThisweek = productId.platforms.visitThisweek; //이번주 방문자수
      // let purchaseConversionRate = 0; //구매전환율
      let targetAge = 20; //내 쇼핑몰 타겟연령층
      let targetGender = '여성'; //내 쇼핑몰 타겟연령층
      // // let productDescription = productId.description; //상품키워드

      // 상품이미지-------------------------------------------------
      // 실제 product 객체의 img 값을 src로 설정
      // => (수정) product 객체의 name을 이용하여 src과 alt 입력
      // (name과 이미지 파일명을 동일하게 하고 파일형식은 .jpg로 할 것)
      let productImage = document.querySelector('.product-img');
      productImage.src = '/src/assets/images/' + productId.name + '.jpg';
      productImage.alt = productId.name + '.jpg';

      // 상품명 ------------------------------------------------------------
      let productName = document.querySelector('.product-name');
      productName.innerText = productId.name;
      // 가격-----------------------------------------------------
      let productPrice = productId.price;
      let productPriceHTML = document.querySelector('.product-price');
      productPriceHTML.innerText = `${productPrice.toLocaleString()}원`;
      // 플랫폼------------------------------------------------------
      let productPlatform = document.querySelector('.product-platform');
      if (productId.platform === 'ably') {
        productPlatform.innerText = '에이블리';
      } else if (productId.platform === 'zigzag') {
        productPlatform.innerText = '지그재그';
      } else {
        productPlatform.innerText = '-';
      }
      // 판매량----------------------------------------------------------
      let productsalesVolume = 0; //판매량
      console.log('판매배열' + productId.sales);
      console.log('판매배열개수' + productId.sales.length);
      if (productId.sales.length > 0) {
        for (let i = 0; i < productId.sales.length; i++) {
          productsalesVolume += productId.sales[i].quantity;
        }
        let productsalesVolumeHTML = document.querySelector(
          '.product-sales-volume'
        );
        productsalesVolumeHTML.innerText = `${productsalesVolume.toLocaleString()}개`;
      } else {
        let productsalesVolumeHTML = document.querySelector(
          '.product-sales-volume'
        );
        productsalesVolumeHTML.innerText = `0개`;
      }

      // 총매출----------------------------------------------------------
      let productTotalSales = Number(productId.price) * productsalesVolume;
      let productTotalSalesHTML = document.querySelector(
        '.product-total-sales'
      );
      productTotalSalesHTML.innerText = `${productTotalSales.toLocaleString()}원`;
      // 리뷰별점---------------------------------------------------------
      // console.log("리뷰별점 : " + productId.platforms.starReview);
      let starReview = productId.starReview;
      let reviews = productId.reviews;
      let productReviewHTML = document.querySelector('.product-review');
      productReviewHTML.innerText = `★${starReview} (${reviews}개)`;

      // 평균가 최고가 최저가--------------------------------------------------
      // 상품등록된 플랫폼과 같은 플랫폼이름을 찾음
      let matchingPlatform = platforms.find(
        (platforms) =>
          platforms.name.toLowerCase() === productId.platform.toLowerCase()
      );
      console.log('동일 플랫폼:', matchingPlatform);

      let categoryPriceAVG = null;
      let categoryHighestPrice = null;
      let categoryLowestPrice = null;
      // 상품카테고리와 같은 플랫폼의 카테고리 찾음
      let matchingCategory = matchingPlatform.category.find(
        (cat) => cat.name.toLowerCase() === productCategory.toLowerCase().trim()
      );

      if (matchingCategory) {
        // 평균가, 최고가, 최저가
        categoryPriceAVG = matchingCategory.price.average;
        categoryHighestPrice = matchingCategory.price.highest;
        categoryLowestPrice = matchingCategory.price.lowest;
      } else {
        console.log('해당 플랫폼에 상품 카테고리와 일치하는 카데고리 없습니다');
      }
      let categoryPriceAVGHTML = document.querySelector(
        '.category-average-price'
      );
      categoryPriceAVGHTML.innerText = `${categoryPriceAVG.toLocaleString()}원`;
      let categoryHighestPriceHTML = document.querySelector(
        '.category-highest-price'
      );
      categoryHighestPriceHTML.innerText = `${categoryHighestPrice.toLocaleString()}원`;
      let categoryLowestPriceHTML = document.querySelector(
        '.category-lowest-price'
      );
      categoryLowestPriceHTML.innerText = `${categoryLowestPrice.toLocaleString()}원`;
      // 키워드 ---------------------------------------------
      let keyword = productId.description; //상품키워드
      let keywordHTML = document.querySelector('.product-description');
      keywordHTML.innerText = keyword;
      // 키워드 5개를 ,기준으로 분리
      let totalkeywords = keyword.split(', ');
      // 첫 키워드 3개만 선택
      let keywords = totalkeywords.slice(0, 3);
      // 다시 문자열로
      keywords = keywords.join(', ');

      let keywordsHTML = document.querySelector('.product-description');
      keywordsHTML.innerText = keywords;

      // 상품등록일 --------------------------------------
      // 날짜 형식 변환 00.00.00
      let [year, month, day] = productId.registrationDate.split('-');
      let formattedDate = `${year}.${month}.${day}`;
      // 오늘 날짜와 상품 등록일 계산
      // let today = new Date();
      // 오늘 날짜와 상품 등록일 계산
      let registrationDate = new Date(productId.registrationDate);

      // 시간을 00:00:00으로 설정하여 시간 부분 무시
      fixedDate.setHours(0, 0, 0, 0);
      registrationDate.setHours(0, 0, 0, 0);

      // 날짜 차이를 밀리초로 계산
      let timeDiff = fixedDate - registrationDate;

      // 밀리초를 일(day) 단위로 변환
      let daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      let registrationDateHTML = document.querySelector(
        //상품등록일
        '.product-registration-date'
      );

      registrationDateHTML.innerText = `${formattedDate} (${daysDiff}일 전)`;

      // 해시태그 비교 -------------------------------------------------------------------
      let myHashtags = productId.hashtags;
      console.log(myHashtags);
      let categoryHashtags = matchingCategory.인기해시태그;
      //비교할 해시태그는 플랫폼의 당일 인기상품 5개의 해시태그를 뽑아서 공통 해시태그 5개로 선정한다
      // 카테고리 인기해시태그
      let hotHashtags = [];

      // 1. 교집합 찾기 및 추가
      hotHashtags = categoryHashtags.filter((tag) => myHashtags.includes(tag));

      // 2. 교집합으로만 5개를 채울 수 없는 경우, 나머지 카테고리 해시태그를 추가
      if (hotHashtags.length < 5) {
        // 이미 추가된 항목을 제외하고 추가
        const remainingHashtags = categoryHashtags.filter(
          (tag) => !hotHashtags.includes(tag)
        );
        hotHashtags = hotHashtags.concat(
          remainingHashtags.slice(0, 5 - hotHashtags.length)
        );
      }
      // 결과 출력
      console.log(hotHashtags);

      let hashtagsComparison = document.querySelector('.hashtags-comparison');
      hashtagsComparison.innerHTML = `<tr>
                      <th>MY</th>
                      <th>인기</th>
                    </tr>
                    <tr>
                      <td>${myHashtags[0]}</td>
                      <td>${hotHashtags[0]}</td>
                    </tr>
                    <tr>
                      <td>${myHashtags[1]}</td>
                     <td>${hotHashtags[1]}</td>
                    </tr>
                    <tr>
                      <td>${myHashtags[2]}</td>
                      <td>${hotHashtags[2]}</td>
                    </tr>
                    <tr>
                      <td>${myHashtags[3]}</td>
                      <td>${hotHashtags[3]}</td>
                    </tr>
                    <tr>
                      <td>${myHashtags[4]}</td>
                      <td>${hotHashtags[4]}</td>
                    </tr>`;

      let hashtagsComparisonCount = myHashtags.filter((hashtag) =>
        hotHashtags.includes(hashtag)
      ).length;
      console.log(hashtagsComparisonCount);

      // 해시태그 비교 상태[좋음]-----------------------
      let hashtagComparisonStatus = document.querySelector(
        '.hashtag-comparison-status'
      );

      if (hashtagsComparisonCount > 3) {
        hashtagComparisonStatus.innerText = '좋음';
        hashtagComparisonStatus.classList.add('hashtag-comparison-good');
      } else if (hashtagsComparisonCount === 3) {
        hashtagComparisonStatus.innerText = '보통';
        hashtagComparisonStatus.classList.add('hashtag-comparison-normal');
      } else {
        hashtagComparisonStatus.innerText = '나쁨';
        hashtagComparisonStatus.classList.add('hashtag-comparison-bad');
      }

      // 해시태그 비교 막대그래프 ----------------------
      let hashtagComparisonBar = document.querySelectorAll(
        '.hashtag-comparison-bar'
      );

      for (let cnt = 0; cnt < hashtagsComparisonCount; cnt++) {
        if (hashtagsComparisonCount > 3) {
          hashtagComparisonBar[cnt].classList.add('good');
        } else if (hashtagsComparisonCount === 3) {
          hashtagComparisonBar[cnt].classList.add('normal');
        } else {
          hashtagComparisonBar[cnt].classList.add('bad');
        }
      }
      // 리뷰 분석 - 리뷰 상태 ---------------------------------------------------------
      let reviewStatus = document.querySelector(
        '.total-analysis-review-status'
      );
      // 리뷰 분석 - 리뷰 코멘트
      let reviewComment = document.querySelector(
        '.total-analysis-review-coment'
      );

      // 리뷰수가 10 미만인지 확인
      if (reviews < 10) {
        // 클래스 변경
        reviewStatus.classList.replace(
          'total-analysis-review-status',
          'total-analysis-status-null'
        );
        // 텍스트 변경
        reviewStatus.innerText = '없음';
        // total-analysis-review-coment 요소 업데이트
        reviewComment.innerHTML = `
          <p>리뷰 수가 10개 미만으로 분석이 어렵습니다</p>
          <p>리뷰 이벤트를 진행해 리뷰 수를 늘려보세요</p>
        `;
      } else {
        //별점(5점 만점) 기준으로 3점미만[나쁨] / 3점이상[보통] / 3.5점이상[좋음]
        if (starReview >= 3.5) {
          // 클래스 변경
          reviewStatus.classList.replace(
            'total-analysis-review-status',
            'total-analysis-status-good'
          );
          // 텍스트 변경
          reviewStatus.innerText = '좋음';
          // total-analysis-review-coment 요소 업데이트
          reviewComment.innerHTML = `
          <p>리뷰별점이 ${starReview}점으로 높은 수준입니다</p>
          <p>지금처럼 상품과 고객 만족도를 꾸준히 관리해주세요</p>
        `;
        } else if (starReview >= 3 && starReview < 3.5) {
          // 클래스 변경
          reviewStatus.classList.replace(
            'total-analysis-review-status',
            'total-analysis-status-normal'
          );
          // 텍스트 변경
          reviewStatus.innerText = '보통';
          // total-analysis-review-coment 요소 업데이트
          reviewComment.innerHTML = `
          <p>리뷰별점이 ${starReview}점으로 보통 수준입니다</p>
          <p>상품 및 배송 관리에 집중해 고객 만족도를 더 높여보세요</p>
        `;
        } else {
          // 클래스 변경
          reviewStatus.classList.replace(
            'total-analysis-review-status',
            'total-analysis-status-bad'
          );
          // 텍스트 변경
          reviewStatus.innerText = '나쁨';
          // total-analysis-review-coment 요소 업데이트
          reviewComment.innerHTML = `
          <p>리뷰별점이 ${starReview}점으로 낮은 수준입니다</p>
          <p>고객들의 불만사항을 체크하고 철저한 상품 관리가 필요합니다</p>
        `;
        }
      }
      // 구매전환율 --------------------------------------------------------
      // 총 방문수(클릭수)
      let productVisitTotal = Number(productId.visitTotal);
      // 구매전환율 = (구매 완료 수 / 이번주, 지난주 방문자수) * 100
      purchaseConversionRate = Number(
        ((productsalesVolume / productVisitTotal) * 100).toFixed(2)
      );

      // 이커머스 구매 전환율 평균이 2%일 때 상품 구매전환율과 비교 & 소수점 한자리까지 표현
      let purchaseConversionRateComparison = Number(
        (purchaseConversionRate - 2).toFixed(2)
      );
      // 구매전환율 상태 요소 선택
      let purchaseConversionRateStatusHTML = document.querySelector(
        '.total-analysis-Purchase-conversion-rate-status'
      );
      // 구매전환율 코멘트 요소 선택
      let purchaseConversionRateComentHTML = document.querySelector(
        '.total-analysis-Purchase-conversion-rate-coment'
      );
      //  1% 미만[나쁨] / 3% 미만[보통] / 3% 이상[좋음]
      if (productsalesVolume === 0) {
        // 클래스 변경(기존 클래스 삭제 새로 추가)
        purchaseConversionRateStatusHTML.classList.remove(
          'total-analysis-Purchase-conversion-rate-status'
        );
        purchaseConversionRateStatusHTML.classList.add(
          'total-analysis-status-null'
        );
        purchaseConversionRateStatusHTML.innerText = '없음';
        purchaseConversionRateComentHTML.innerHTML = `
          <p>총 판매량이 0개입니다</p>
          <p>판매량이 1개 이상일 때 분석이 가능해요</p>
            `;
      } else {
        if (purchaseConversionRate >= 3) {
          // 클래스 변경(기존 클래스 삭제 새로 추가)
          purchaseConversionRateStatusHTML.classList.remove(
            'total-analysis-Purchase-conversion-rate-status'
          );
          purchaseConversionRateStatusHTML.classList.add(
            'total-analysis-status-good'
          );
          purchaseConversionRateStatusHTML.innerText = '좋음';
          purchaseConversionRateComentHTML.innerHTML = `
          <p>구매전환율이 ${purchaseConversionRate}%으로 이커머스 평균 대비 ${purchaseConversionRateComparison}% 높아요</p>
          <p>상품 대표 이미지와 상품이 니즈를 적중했어요</p>
          `;
        } else if (purchaseConversionRate < 3 && purchaseConversionRate >= 1) {
          purchaseConversionRateStatusHTML.classList.remove(
            'total-analysis-Purchase-conversion-rate-status'
          );
          purchaseConversionRateStatusHTML.classList.add(
            'total-analysis-status-normal'
          );
          purchaseConversionRateStatusHTML.innerText = '보통';
          purchaseConversionRateComentHTML.innerHTML = `
          <p>구매전환율이 ${purchaseConversionRate}%으로 이커머스 평균 대비 ${purchaseConversionRateComparison}% 차이가 있어요</p>
          <p>상품 대표 이미지는 적절하나 상품 상세 설명을 보충해보세요</p>
          `;
        } else {
          purchaseConversionRateStatusHTML.classList.remove(
            'total-analysis-Purchase-conversion-rate-status'
          );
          purchaseConversionRateStatusHTML.classList.add(
            'total-analysis-status-bad'
          );
          purchaseConversionRateStatusHTML.innerText = '나쁨';
          purchaseConversionRateComentHTML.innerHTML = `
          <p>구매전환율이 ${purchaseConversionRate}%으로 이커머스 평균 대비 ${purchaseConversionRateComparison}% 낮아요</p>
          <p>상품 상세 설명을 상품 대표 이미지와 일치시켜 보세요</p>
          `;
        }
      }
      // 가격분석 ----------------------------------------------------------
      // 가격차이 % =((상품가격-평균가)/평균가)*100
      let categoryPricePercent = Number(
        (((productPrice - categoryPriceAVG) / categoryPriceAVG) * 100).toFixed(
          1
        )
      );

      // 가격 상태 요소 선택
      let priceStatusHTML = document.querySelector(
        '.total-analysis-price-status'
      );
      // 가격 코멘트 요소 선택
      let priceComentHTML = document.querySelector(
        '.total-analysis-price-coment'
      );
      // 평균가보다 -5%미만[나쁨] /평균가 ± 5%[보통] / 평균가+5%이상[좋음]
      if (categoryPricePercent > 5) {
        // 클래스 변경
        priceStatusHTML.classList.remove('total-analysis-price-status');
        priceStatusHTML.classList.add('total-analysis-status-good');
        // 텍스트 변경
        priceStatusHTML.innerText = '좋음';
        // 가격 코멘트 요소 업데이트
        priceComentHTML.innerHTML = `
          <p>${productCategory}카테고리 평균가보다 ${categoryPricePercent}% 높아요</p>
          <p>박리다매보다 질 좋은 상품을 원하는 고객들의 니즈에 적합해요</p>
          `;
      } else if (categoryPricePercent <= 5 && categoryPricePercent >= -5) {
        // 클래스 변경
        priceStatusHTML.classList.remove('total-analysis-price-status');
        priceStatusHTML.classList.add('total-analysis-status-normal');
        // 텍스트 변경
        priceStatusHTML.innerText = '보통';
        // 가격 코멘트 요소 업데이트
        priceComentHTML.innerHTML = `
          <p>${productCategory}카테고리 평균가와 ${categoryPricePercent}% 차이가 있어요</p>
          <p>가격 설정이 적절하나 박리다매 상품이라면 가격을 낮춰보세요</p>
          `;
      } else {
        // 클래스 변경
        priceStatusHTML.classList.remove('total-analysis-price-status');
        priceStatusHTML.classList.add('total-analysis-status-bad');
        // 텍스트 변경
        priceStatusHTML.innerText = '나쁨';
        // 가격 코멘트 요소 업데이트
        priceComentHTML.innerHTML = `
      <p>${productCategory}카테고리 평균가보다 ${categoryPricePercent}% 낮아요</p>
      <p>박리다매 상품이 아니라면 가격을 더 높일 필요가 있어요</p>
      `;
      }
      // 판매율 추이 ----------------------------------------------------------------
      // 날짜를 yyyy-mm-dd 형식으로 변환하는 함수
      function formatDate(date) {
        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, '0');
        let day = String(date.getDate()).padStart(2, '0');
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

      // 판매량 계산 함수
      function getSalesForPeriod(startDate, endDate) {
        let totalSales = 0;
        for (let sale of productId.sales) {
          let saleDate = new Date(sale.date);
          let saleDateStr = formatDate(saleDate);
          // startDate <= saleDate <= endDate로 범위를 설정
          if (saleDateStr >= startDate && saleDateStr <= endDate) {
            totalSales += sale.quantity;
          }
        }
        return totalSales;
      }

      // 오늘 포함 7일 전까지의 판매량을 올바르게 계산하기 위해 todayStr를 endDate로 사용
      let salesLast7Days = getSalesForPeriod(sevenDaysAgoStr, todayStr);
      let salesPrevious7Days = getSalesForPeriod(
        fourteenDaysAgoStr,
        sevenDaysAgoStr
      );

      // 판매량 비교
      let salesRate = 0;
      if (salesPrevious7Days === 0) {
        salesRate = 0;
      } else {
        salesRate =
          ((salesLast7Days - salesPrevious7Days) / salesPrevious7Days) * 100;
      }

      // 결과 출력
      console.log('판매량 비교:', salesRate + '%');
      console.log('오늘 포함 7일간 판매량:', salesLast7Days);
      console.log('14일 전 ~ 7일 전까지 판매량:', salesPrevious7Days);

      // 판매율 추이 HTML-------------------------------------------------------
      // 판매율 상태 요소 선택
      let salesRateStatusHTML = document.querySelector(
        '.total-analysis-sales-comparison-status'
      );
      // 판매율 코멘트 요소 선택
      let salesRateComentHTML = document.querySelector(
        '.total-analysis-sales-comparison-coment'
      );
      console.log('지난 7일 판매량' + salesLast7Days);
      console.log('총판매량' + productsalesVolume);
      console.log('판매율추이' + salesRate);
      // 판매량 상태에 따라 클래스 변경 및 텍스트 업데이트
      if (productsalesVolume === 0) {
        // 클래스 변경
        salesRateStatusHTML.classList.remove(
          'total-analysis-sales-comparison-status'
        );
        salesRateStatusHTML.classList.add('total-analysis-status-null');
        // 텍스트 변경
        salesRateStatusHTML.innerText = '없음';
        // 판매율추이 코멘트 요소 업데이트
        salesRateComentHTML.innerHTML = `
                    <p>총 판매량이 0개입니다</p>
                  <p>판매량이 1개 이상일 때 분석이 가능해요</p>
                `;
      } else {
        if (salesRate > 5) {
          // 클래스 변경
          salesRateStatusHTML.classList.remove(
            'total-analysis-sales-comparison-status'
          );
          salesRateStatusHTML.classList.add('total-analysis-status-good');
          // 텍스트 변경
          salesRateStatusHTML.innerText = '좋음';
          // 판매율추이 코멘트 요소 업데이트
          salesRateComentHTML.innerHTML = `
                  <p>지난 주 판매량보다 ${salesRate}% 증가했어요</p>
                  <p>해당 상품의 디자인이 유행하고 있으니 유사한 상품을 추가해보세요</p>
                `;
        } else if (salesRate <= 5 && salesRate >= -5) {
          // 클래스 변경
          if (salesRate === 0 && salesLast7Days > 0) {
            salesRateStatusHTML.classList.remove(
              'total-analysis-sales-comparison-status'
            );
            salesRateStatusHTML.classList.add('total-analysis-status-normal');
            salesRateStatusHTML.innerText = '보통';
            salesRateComentHTML.innerHTML = `
                    <p>지난 주 판매량과 동일해요</p>
                    <p>인기 해시태그를 적용해 클릭률을 늘려보세요</p>
                  `;
          } else if (salesRate === 0 && salesLast7Days === 0) {
            salesRateStatusHTML.classList.remove(
              'total-analysis-sales-comparison-status'
            );
            salesRateStatusHTML.classList.add('total-analysis-status-bad');
            salesRateStatusHTML.innerText = '나쁨';
            salesRateComentHTML.innerHTML = `
                    <p>지난주부터 이번주까지 판매량이 0개예요</p>
                    <p>인기 해시태그를 적용해 클릭률을 늘려보세요</p>
                  `;
          }
        } else if (salesRate < -5) {
          // 클래스 변경
          salesRateStatusHTML.classList.remove(
            'total-analysis-sales-comparison-status'
          );
          salesRateStatusHTML.classList.add('total-analysis-status-bad');
          // 텍스트 변경
          salesRateStatusHTML.innerText = '나쁨';
          // 판매율추이 코멘트 요소 업데이트
          salesRateComentHTML.innerHTML = `
                  <p>지난 주 판매량보다 ${salesRate}% 감소했어요</p>
                  <p>인기 해시태그를 적용해 클릭률을 높이고 디자인 트렌드를 확인해보세요</p>
                `;
        } else {
          // 클래스 변경
          salesRateStatusHTML.classList.remove(
            'total-analysis-sales-comparison-status'
          );
          salesRateStatusHTML.classList.add('total-analysis-status-null');
          // 텍스트 변경
          salesRateStatusHTML.innerText = '없음';
          // 판매율추이 코멘트 요소 업데이트
          salesRateComentHTML.innerHTML = `
                  <p>총 판매량이 0개입니다</p>
                  <p>판매량이 1개 이상일 때 분석이 가능해요</p>
                `;
        }
      }
      //플랫폼 분석--------------------------------------------------------------------------
      // 동일 상품 찾기
      let sameProducts = products.filter(
        (product) => product.name === productId.name
      );
      console.log('Same Products:', sameProducts);

      // 동일상품들의 age 값이 서로 같은지 확인
      let sameProductsAgeCheck = sameProducts.every(
        (product) => product.age === sameProducts[0].age
      );

      console.log('나이같은지 체크' + sameProductsAgeCheck);
      //동일상품들의 평균연령층

      //동일상품평균연령대 구하기 -----------
      let sameProductsAge;
      // 동일상품이 없을때 1번째 연령대 =평균연령
      if (sameProducts.length === 1) {
        sameProductsAge = sameProducts[0].age;
      }
      // 동일상품이 있고, age 값이 서로 같으면 첫 번째 age 값을 sameProductsAge에 담기
      else if (sameProducts.length > 1 && sameProductsAgeCheck === true) {
        // 동일상품들의 age 값이 같으면 첫 번째 age 값을 sameProductsAge에 담기
        sameProductsAge = sameProducts[0].age;
      } else {
        // age 값이 서로 다르면 quantity가 더 많은 요소의 age 값을 sameProductsAge에 담기
        sameProductsAge = sameProducts.reduce((prev, current) => {
          // 모든 sales의 quantity 합계를 계산, platforms 또는 sales가 없는 경우 기본값 0
          let prevTotalQuantity =
            prev.platforms?.sales?.reduce(
              (sum, sale) => sum + sale.quantity,
              0
            ) || 0;

          let currentTotalQuantity =
            current.platforms?.sales?.reduce(
              (sum, sale) => sum + sale.quantity,
              0
            ) || 0;

          return prevTotalQuantity > currentTotalQuantity ? prev : current;
        }).age;
      }
      // 동일상품구매평균연령 s빼고 int형
      sameProductsAge = parseInt(productId.age.replace('s', ''));
      console.log('동일상품들의 평균 연령층:', sameProductsAge);

      // 상품구매성별
      productId.gender === 'M'
        ? '남성'
        : productId.gender === 'F'
        ? '여성'
        : '알 수 없음';

      // 동일상품들의 gender 값이 서로 같은지 확인
      let sameProductsGenderCheck = sameProducts.every(
        (product) => product.gender === sameProducts[0].gender
      );
      //동일상품들의 평균성별 구하기 --------------
      let sameProductsGender;

      // 동일상품이 없을때 1번째 성별 =평균성별
      if (sameProducts.length === 1) {
        sameProductsGender = sameProducts[0].age;
      }
      // 동일상품이 있고, 성별 값이 서로 같으면 첫 번째 성별 값을 sameProductsGender에 담기
      else if (sameProducts.length > 1 && sameProductsGenderCheck === true) {
        sameProductsGender = sameProducts[0].gender;
      } else if (sameProducts.length > 1 && sameProductsGenderCheck === false) {
        // 동일상품이 있고, gender 값이 서로 다르면 quantity가 더 많은 요소의 gender 값을 sameProductsGender에 담기
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
      // 평균성별 영어 -> 한글로
      sameProductsGender =
        sameProductsGender === 'M'
          ? '남성'
          : productId.gender === 'F'
          ? '여성'
          : '알 수 없음';

      console.log('동일상품들의 평균성별:', sameProductsGender);

      // 플랫폼분석-종합분석 코멘트 요소 선택
      let platformComentHTML = document.querySelector(
        '.platform-analysis-coment'
      );
      // 동일상품이 1개 이상일때
      if (sameProducts.length >= 1) {
        // 평균연령이 타겟연령보다 작을 때
        if (sameProductsAge < targetAge) {
          platformComentHTML.innerHTML = `
          <p>우리 쇼핑몰 타겟층은 ${targetAge}대 ${targetGender}예요</p>
          <p>해당 상품은 ${sameProductsAge}대 ${sameProductsGender} 구매율이 높아요</p>
          <p>조금 더 성숙한 디자인의 상품기획이 필요해보여요</p>
          `;
          // 평균연령이 타겟연령과 같을 때
        } else if ((sameProductsAge = targetAge)) {
          platformComentHTML.innerHTML = `
          <p>해당 상품의 타겟층이 우리 쇼핑몰 타겟층인 ${targetAge}대 ${targetGender}과 일치해요</p>
          <p>비슷한 디자인의 상품기획을 추천드려요</p>
          `;
          // 평균연령이 타겟연령보다 클 때
        } else if (sameProductsAge > targetAge) {
          platformComentHTML.innerHTML = `
                 <p>우리 쇼핑몰 타겟층은 ${targetAge}대 ${targetGender}예요</p>
                 <p>해당 상품은 ${sameProductsAge}대 ${sameProductsGender} 구매율이 높아요</p>
                  <p>조금 더 젊어보이는 디자인의 상품기획이 필요해보여요</p>
                `;
        } else {
          platformComentHTML.innerHTML = `
            <p>총 판매량이 0개입니다</p>
            <p>판매량이 1개 이상일 때 분석이 가능해요</p>
           `;
        }
      }

      let ablyAge = null;
      let zigzagAge = null;
      productsRes.data.forEach((product) => {
        if (product.name === productId.name && product.platform === 'ably') {
          ablyAge = parseInt(platforms[0].age.replace('s', ''));
        }
        if (product.name === productId.name && product.platform === 'zigzag') {
          zigzagAge = parseInt(platforms[1].age.replace('s', ''));
        }
      });

      // 플랫폼 분석 - 에이블리 분석 코멘트 요소 선택
      let ablyComentHTML = document.querySelector('.ably-analysis-coment');
      // 전체판매량이 0일때
      if (ablyProduct === undefined) {
        ablyComentHTML.innerHTML = `
          <p>총 판매량이 0개입니다</p>
            <p>판매량이 1개 이상일 때 분석이 가능해요</p>
           `;
      } else if (ablyAge === null) {
        ablyComentHTML.innerHTML = `
            <p>해당 상품은 에이블리에 등록되어 있지 않아요.</p>
           `;
      } else if (ablyAge < targetAge) {
        ablyComentHTML.innerHTML = `
                <p>${sameProductsAge}대 ${sameProductsGender} 구매율이 높아요</p>
                <p>조금 더 성숙한 디자인의 상품기획이 필요해보여요</p>
              `;
      } else if (ablyAge === targetAge) {
        ablyComentHTML.innerHTML = `
                 <p>우리 쇼핑몰 타겟층인 ${targetAge}대 ${targetGender}과 일치해요</p>
                 <p>비슷한 디자인의 상품기획을 추천드려요</p>
              `;
      } else if (ablyAge > targetAge) {
        ablyComentHTML.innerHTML = `
               <p>${sameProductsAge}대 ${sameProductsGender} 구매율이 높아요</p>
              <p>조금 더 젊어보이는 디자인의 상품기획이 필요해보여요</p>
              `;
      }

      // 플랫폼 분석 - 에이블리 분석 코멘트 요소 선택
      let zigzagComentHTML = document.querySelector('.zigzag-analysis-coment');
      // 전체판매량이 0일때
      if (zigzagProduct === undefined) {
        zigzagComentHTML.innerHTML = `
          <p>총 판매량이 0개입니다</p>
            <p>판매량이 1개 이상일 때 분석이 가능해요</p>
           `;
      } else if (zigzagAge === null) {
        zigzagAnalysisComentHTML.innerHTML = `
            <p>해당 상품은 지그재그에 등록되어 있지 않아요.</p>
           `;
      } else if (zigzagAge < targetAge) {
        zigzagAnalysisComentHTML.innerHTML = `
                <p>${sameProductsAge}대 ${sameProductsGender} 구매율이 높아요</p>
                <p>조금 더 성숙한 디자인의 상품기획이 필요해보여요</p>
              `;
      } else if (zigzagAge === targetAge) {
        zigzagAnalysisComentHTML.innerHTML = `
                 <p>우리 쇼핑몰 타겟층인 ${targetAge}대 ${targetGender}과 일치해요</p>
                 <p>비슷한 디자인의 상품기획을 추천드려요</p>
              `;
      } else if (zigzagAge > targetAge) {
        zigzagAnalysisComentHTML.innerHTML = `
               <p>${sameProductsAge}대 ${sameProductsGender} 구매율이 높아요</p>
               <p>조금 더 젊어보이는 디자인의 상품기획이 필요해보여요</p>
              `;
      }
    })
  ); // 마지막1
}; //마지막2
