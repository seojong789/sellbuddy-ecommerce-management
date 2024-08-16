window.onload = () => {
  const urlParams = new URLSearchParams(location.search);
  let id = urlParams.get('value');
  const fixedDate = new Date('2023-12-31');

  axios
    .all([
      axios.get('/assets/json/product.json'),
      axios.get('/assets/json/platform1.json'),
    ])
    .then(
      axios.spread((productsRes, platformsRes) => {
        let products = productsRes.data;
        let platforms = platformsRes.data;
        let productId = products[id - 1];
        let platformId = platforms[id - 1];
        let productCategory = productId.category;
        let targetAge = 20;
        let targetGender = '여성';
        let productImage = document.querySelector('.product-img');
        productImage.src = './assets/images/' + productId.name + '.jpg';
        productImage.alt = productId.name + '.jpg';

        let productName = document.querySelector('.product-name');
        productName.innerText = productId.name;
        let productPrice = productId.price;
        let productPriceHTML = document.querySelector('.product-price');
        productPriceHTML.innerText = `${productPrice.toLocaleString()}원`;
        let productPlatform = document.querySelector('.product-platform');
        if (productId.platform === 'ably') {
          productPlatform.innerText = '에이블리';
        } else if (productId.platform === 'zigzag') {
          productPlatform.innerText = '지그재그';
        } else {
          productPlatform.innerText = '-';
        }
        let productsalesVolume = 0;
        if (productId.sales.length > 0) {
          for (let i = 0; i < productId.sales.length; i++) {
            productsalesVolume += productId.sales[i].quantity;
          }
          let productsalesVolumeHTML = document.querySelector(
            '.product-sales-volume',
          );
          productsalesVolumeHTML.innerText = `${productsalesVolume.toLocaleString()}개`;
        } else {
          let productsalesVolumeHTML = document.querySelector(
            '.product-sales-volume',
          );
          productsalesVolumeHTML.innerText = `0개`;
        }

        let productTotalSales = Number(productId.price) * productsalesVolume;
        let productTotalSalesHTML = document.querySelector(
          '.product-total-sales',
        );
        productTotalSalesHTML.innerText = `${productTotalSales.toLocaleString()}원`;
        let starReview = productId.starReview;
        let reviews = productId.reviews;
        let productReviewHTML = document.querySelector('.product-review');
        productReviewHTML.innerText = `★${starReview} (${reviews}개)`;

        let matchingPlatform = platforms.find(
          (platforms) =>
            platforms.name.toLowerCase() === productId.platform.toLowerCase(),
        );

        let categoryPriceAVG = null;
        let categoryHighestPrice = null;
        let categoryLowestPrice = null;
        let matchingCategory = matchingPlatform.category.find(
          (cat) =>
            cat.name.toLowerCase() === productCategory.toLowerCase().trim(),
        );

        if (matchingCategory) {
          categoryPriceAVG = matchingCategory.price.average;
          categoryHighestPrice = matchingCategory.price.highest;
          categoryLowestPrice = matchingCategory.price.lowest;
        } else {
          console.error(
            '해당 플랫폼에 상품 카테고리와 일치하는 카데고리 없습니다',
          );
        }
        let categoryPriceAVGHTML = document.querySelector(
          '.category-average-price',
        );
        categoryPriceAVGHTML.innerText = `${categoryPriceAVG.toLocaleString()}원`;
        let categoryHighestPriceHTML = document.querySelector(
          '.category-highest-price',
        );
        categoryHighestPriceHTML.innerText = `${categoryHighestPrice.toLocaleString()}원`;
        let categoryLowestPriceHTML = document.querySelector(
          '.category-lowest-price',
        );
        categoryLowestPriceHTML.innerText = `${categoryLowestPrice.toLocaleString()}원`;
        let keyword = productId.description;
        let keywordHTML = document.querySelector('.product-description');
        keywordHTML.innerText = keyword;
        let totalkeywords = keyword.split(', ');
        let keywords = totalkeywords.slice(0, 3);
        keywords = keywords.join(', ');

        let keywordsHTML = document.querySelector('.product-description');
        keywordsHTML.innerText = keywords;

        let [year, month, day] = productId.registrationDate.split('-');
        let formattedDate = `${year}.${month}.${day}`;
        let registrationDate = new Date(productId.registrationDate);

        fixedDate.setHours(0, 0, 0, 0);
        registrationDate.setHours(0, 0, 0, 0);

        let timeDiff = fixedDate - registrationDate;
        let daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        let registrationDateHTML = document.querySelector(
          '.product-registration-date',
        );

        registrationDateHTML.innerText = `${formattedDate} (${daysDiff}일 전)`;

        let myHashtags = productId.hashtags;
        let categoryHashtags = matchingCategory.인기해시태그;
        let hotHashtags = [];
        hotHashtags = categoryHashtags.filter((tag) =>
          myHashtags.includes(tag),
        );
        if (hotHashtags.length < 5) {
          const remainingHashtags = categoryHashtags.filter(
            (tag) => !hotHashtags.includes(tag),
          );
          hotHashtags = hotHashtags.concat(
            remainingHashtags.slice(0, 5 - hotHashtags.length),
          );
        }

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
          hotHashtags.includes(hashtag),
        ).length;

        let hashtagComparisonStatus = document.querySelector(
          '.hashtag-comparison-status',
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

        let hashtagComparisonBar = document.querySelectorAll(
          '.hashtag-comparison-bar',
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
        let reviewStatus = document.querySelector(
          '.total-analysis-review-status',
        );
        let reviewComment = document.querySelector(
          '.total-analysis-review-coment',
        );

        if (reviews < 10) {
          reviewStatus.classList.replace(
            'total-analysis-review-status',
            'total-analysis-status-null',
          );
          reviewStatus.innerText = '없음';
          reviewComment.innerHTML = `
          <p>리뷰 수가 10개 미만으로 분석이 어렵습니다</p>
          <p>리뷰 이벤트를 진행해 리뷰 수를 늘려보세요</p>
        `;
        } else {
          if (starReview >= 3.5) {
            reviewStatus.classList.replace(
              'total-analysis-review-status',
              'total-analysis-status-good',
            );
            reviewStatus.innerText = '좋음';
            reviewComment.innerHTML = `
          <p>리뷰별점이 ${starReview}점으로 높은 수준입니다</p>
          <p>지금처럼 상품과 고객 만족도를 꾸준히 관리해주세요</p>
        `;
          } else if (starReview >= 3 && starReview < 3.5) {
            reviewStatus.classList.replace(
              'total-analysis-review-status',
              'total-analysis-status-normal',
            );
            reviewStatus.innerText = '보통';
            reviewComment.innerHTML = `
          <p>리뷰별점이 ${starReview}점으로 보통 수준입니다</p>
          <p>상품 및 배송 관리에 집중해 고객 만족도를 더 높여보세요</p>
        `;
          } else {
            reviewStatus.classList.replace(
              'total-analysis-review-status',
              'total-analysis-status-bad',
            );
            reviewStatus.innerText = '나쁨';
            reviewComment.innerHTML = `
          <p>리뷰별점이 ${starReview}점으로 낮은 수준입니다</p>
          <p>고객들의 불만사항을 체크하고 철저한 상품 관리가 필요합니다</p>
        `;
          }
        }
        let productVisitTotal = Number(productId.visitTotal);
        let purchaseConversionRate = Number(
          ((productsalesVolume / productVisitTotal) * 100).toFixed(2),
        );

        let purchaseConversionRateComparison = Number(
          (purchaseConversionRate - 2).toFixed(2),
        );
        let purchaseConversionRateStatusHTML = document.querySelector(
          '.total-analysis-Purchase-conversion-rate-status',
        );
        let purchaseConversionRateComentHTML = document.querySelector(
          '.total-analysis-Purchase-conversion-rate-coment',
        );
        if (productsalesVolume === 0) {
          purchaseConversionRateStatusHTML.classList.remove(
            'total-analysis-Purchase-conversion-rate-status',
          );
          purchaseConversionRateStatusHTML.classList.add(
            'total-analysis-status-null',
          );
          purchaseConversionRateStatusHTML.innerText = '없음';
          purchaseConversionRateComentHTML.innerHTML = `
          <p>총 판매량이 0개입니다</p>
          <p>판매량이 1개 이상일 때 분석이 가능해요</p>
            `;
        } else {
          if (purchaseConversionRate >= 3) {
            purchaseConversionRateStatusHTML.classList.remove(
              'total-analysis-Purchase-conversion-rate-status',
            );
            purchaseConversionRateStatusHTML.classList.add(
              'total-analysis-status-good',
            );
            purchaseConversionRateStatusHTML.innerText = '좋음';
            purchaseConversionRateComentHTML.innerHTML = `
          <p>구매전환율이 ${purchaseConversionRate}%으로 이커머스 평균 대비 ${purchaseConversionRateComparison}% 높아요</p>
          <p>상품 대표 이미지와 상품이 니즈를 적중했어요</p>
          `;
          } else if (
            purchaseConversionRate < 3 &&
            purchaseConversionRate >= 1
          ) {
            purchaseConversionRateStatusHTML.classList.remove(
              'total-analysis-Purchase-conversion-rate-status',
            );
            purchaseConversionRateStatusHTML.classList.add(
              'total-analysis-status-normal',
            );
            purchaseConversionRateStatusHTML.innerText = '보통';
            purchaseConversionRateComentHTML.innerHTML = `
          <p>구매전환율이 ${purchaseConversionRate}%으로 이커머스 평균 대비 ${purchaseConversionRateComparison}% 차이가 있어요</p>
          <p>상품 대표 이미지는 적절하나 상품 상세 설명을 보충해보세요</p>
          `;
          } else {
            purchaseConversionRateStatusHTML.classList.remove(
              'total-analysis-Purchase-conversion-rate-status',
            );
            purchaseConversionRateStatusHTML.classList.add(
              'total-analysis-status-bad',
            );
            purchaseConversionRateStatusHTML.innerText = '나쁨';
            purchaseConversionRateComentHTML.innerHTML = `
          <p>구매전환율이 ${purchaseConversionRate}%으로 이커머스 평균 대비 ${purchaseConversionRateComparison}% 낮아요</p>
          <p>상품 상세 설명을 상품 대표 이미지와 일치시켜 보세요</p>
          `;
          }
        }
        let categoryPricePercent = Number(
          (
            ((productPrice - categoryPriceAVG) / categoryPriceAVG) *
            100
          ).toFixed(1),
        );

        let priceStatusHTML = document.querySelector(
          '.total-analysis-price-status',
        );
        let priceComentHTML = document.querySelector(
          '.total-analysis-price-coment',
        );
        if (categoryPricePercent > 5) {
          priceStatusHTML.classList.remove('total-analysis-price-status');
          priceStatusHTML.classList.add('total-analysis-status-good');
          priceStatusHTML.innerText = '좋음';
          priceComentHTML.innerHTML = `
          <p>${productCategory}카테고리 평균가보다 ${categoryPricePercent}% 높아요</p>
          <p>박리다매보다 질 좋은 상품을 원하는 고객들의 니즈에 적합해요</p>
          `;
        } else if (categoryPricePercent <= 5 && categoryPricePercent >= -5) {
          priceStatusHTML.classList.remove('total-analysis-price-status');
          priceStatusHTML.classList.add('total-analysis-status-normal');
          priceStatusHTML.innerText = '보통';
          priceComentHTML.innerHTML = `
          <p>${productCategory}카테고리 평균가와 ${categoryPricePercent}% 차이가 있어요</p>
          <p>가격 설정이 적절하나 박리다매 상품이라면 가격을 낮춰보세요</p>
          `;
        } else {
          priceStatusHTML.classList.remove('total-analysis-price-status');
          priceStatusHTML.classList.add('total-analysis-status-bad');
          priceStatusHTML.innerText = '나쁨';
          priceComentHTML.innerHTML = `
      <p>${productCategory}카테고리 평균가보다 ${categoryPricePercent}% 낮아요</p>
      <p>박리다매 상품이 아니라면 가격을 더 높일 필요가 있어요</p>
      `;
        }
        function formatDate(date) {
          let year = date.getFullYear();
          let month = String(date.getMonth() + 1).padStart(2, '0');
          let day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }
        let sevenDaysAgo = new Date(fixedDate);
        let fourteenDaysAgo = new Date(fixedDate);
        sevenDaysAgo.setDate(fixedDate.getDate() - 7);
        fourteenDaysAgo.setDate(fixedDate.getDate() - 14);
        let todayStr = formatDate(fixedDate);
        let sevenDaysAgoStr = formatDate(sevenDaysAgo);
        let fourteenDaysAgoStr = formatDate(fourteenDaysAgo);

        function getSalesForPeriod(startDate, endDate) {
          let totalSales = 0;
          for (let sale of productId.sales) {
            let saleDate = new Date(sale.date);
            let saleDateStr = formatDate(saleDate);
            if (saleDateStr >= startDate && saleDateStr <= endDate) {
              totalSales += sale.quantity;
            }
          }
          return totalSales;
        }

        let salesLast7Days = getSalesForPeriod(sevenDaysAgoStr, todayStr);
        let salesPrevious7Days = getSalesForPeriod(
          fourteenDaysAgoStr,
          sevenDaysAgoStr,
        );

        let salesRate = 0;
        if (salesPrevious7Days === 0) {
          salesRate = 0;
        } else {
          salesRate =
            ((salesLast7Days - salesPrevious7Days) / salesPrevious7Days) * 100;
        }

        let salesRateStatusHTML = document.querySelector(
          '.total-analysis-sales-comparison-status',
        );
        let salesRateComentHTML = document.querySelector(
          '.total-analysis-sales-comparison-coment',
        );

        if (productsalesVolume === 0) {
          salesRateStatusHTML.classList.remove(
            'total-analysis-sales-comparison-status',
          );
          salesRateStatusHTML.classList.add('total-analysis-status-null');
          salesRateStatusHTML.innerText = '없음';
          salesRateComentHTML.innerHTML = `
                <p>총 판매량이 0개입니다</p>
                <p>판매량이 1개 이상일 때 분석이 가능해요</p>
                `;
        } else {
          if (salesRate > 5) {
            salesRateStatusHTML.classList.remove(
              'total-analysis-sales-comparison-status',
            );
            salesRateStatusHTML.classList.add('total-analysis-status-good');
            salesRateStatusHTML.innerText = '좋음';
            salesRateComentHTML.innerHTML = `
                  <p>지난 주 판매량보다 ${salesRate}% 증가했어요</p>
                  <p>해당 상품의 디자인이 유행하고 있으니 유사한 상품을 추가해보세요</p>
                `;
          } else if (salesRate <= 5 && salesRate >= -5) {
            if (salesRate === 0 && salesLast7Days > 0) {
              salesRateStatusHTML.classList.remove(
                'total-analysis-sales-comparison-status',
              );
              salesRateStatusHTML.classList.add('total-analysis-status-normal');
              salesRateStatusHTML.innerText = '보통';
              salesRateComentHTML.innerHTML = `
                    <p>지난 주 판매량과 동일해요</p>
                    <p>인기 해시태그를 적용해 클릭률을 늘려보세요</p>
                  `;
            } else if (salesRate === 0 && salesLast7Days === 0) {
              salesRateStatusHTML.classList.remove(
                'total-analysis-sales-comparison-status',
              );
              salesRateStatusHTML.classList.add('total-analysis-status-bad');
              salesRateStatusHTML.innerText = '나쁨';
              salesRateComentHTML.innerHTML = `
                    <p>지난주부터 이번주까지 판매량이 0개예요</p>
                    <p>인기 해시태그를 적용해 클릭률을 늘려보세요</p>
                  `;
            }
          } else if (salesRate < -5) {
            salesRateStatusHTML.classList.remove(
              'total-analysis-sales-comparison-status',
            );
            salesRateStatusHTML.classList.add('total-analysis-status-bad');
            salesRateStatusHTML.innerText = '나쁨';
            salesRateComentHTML.innerHTML = `
                  <p>지난 주 판매량보다 ${salesRate}% 감소했어요</p>
                  <p>인기 해시태그를 적용해 클릭률을 높이고 디자인 트렌드를 확인해보세요</p>
                `;
          } else {
            salesRateStatusHTML.classList.remove(
              'total-analysis-sales-comparison-status',
            );
            salesRateStatusHTML.classList.add('total-analysis-status-null');
            salesRateStatusHTML.innerText = '없음';
            salesRateComentHTML.innerHTML = `
                  <p>총 판매량이 0개입니다</p>
                  <p>판매량이 1개 이상일 때 분석이 가능해요</p>
                `;
          }
        }
        let sameProducts = products.filter(
          (product) => product.name === productId.name,
        );

        let sameProductsAgeCheck = sameProducts.every(
          (product) => product.age === sameProducts[0].age,
        );

        let sameProductsAge;
        if (sameProducts.length === 1) {
          sameProductsAge = sameProducts[0].age;
        } else if (sameProducts.length > 1 && sameProductsAgeCheck === true) {
          sameProductsAge = sameProducts[0].age;
        } else {
          sameProductsAge = sameProducts.reduce((prev, current) => {
            let prevTotalQuantity =
              prev.platforms?.sales?.reduce(
                (sum, sale) => sum + sale.quantity,
                0,
              ) || 0;

            let currentTotalQuantity =
              current.platforms?.sales?.reduce(
                (sum, sale) => sum + sale.quantity,
                0,
              ) || 0;

            return prevTotalQuantity > currentTotalQuantity ? prev : current;
          }).age;
        }
        sameProductsAge = parseInt(productId.age.replace('s', ''));

        productId.gender === 'M'
          ? '남성'
          : productId.gender === 'F'
            ? '여성'
            : '알 수 없음';

        let sameProductsGenderCheck = sameProducts.every(
          (product) => product.gender === sameProducts[0].gender,
        );
        let sameProductsGender;

        if (sameProducts.length === 1) {
          sameProductsGender = sameProducts[0].age;
        } else if (
          sameProducts.length > 1 &&
          sameProductsGenderCheck === true
        ) {
          sameProductsGender = sameProducts[0].gender;
        } else if (
          sameProducts.length > 1 &&
          sameProductsGenderCheck === false
        ) {
          sameProductsGender = sameProducts.reduce((prev, current) => {
            let prevTotalQuantity = prev.platforms.sales.reduce(
              (sum, sale) => sum + sale.quantity,
              0,
            );
            let currentTotalQuantity = current.platforms.sales.reduce(
              (sum, sale) => sum + sale.quantity,
              0,
            );

            return prevTotalQuantity > currentTotalQuantity ? prev : current;
          }).gender;
        }
        sameProductsGender =
          sameProductsGender === 'M'
            ? '남성'
            : productId.gender === 'F'
              ? '여성'
              : '알 수 없음';

        let platformComentHTML = document.querySelector(
          '.platform-analysis-coment',
        );
        if (sameProducts.length >= 1) {
          if (sameProductsAge < targetAge) {
            platformComentHTML.innerHTML = `
          <p>우리 쇼핑몰 타겟층은 ${targetAge}대 ${targetGender}예요</p>
          <p>해당 상품은 ${sameProductsAge}대 ${sameProductsGender} 구매율이 높아요</p>
          <p>조금 더 성숙한 디자인의 상품기획이 필요해보여요</p>
          `;
          } else if (sameProductsAge == targetAge) {
            platformComentHTML.innerHTML = `
          <p>해당 상품의 타겟층이 우리 쇼핑몰 타겟층인 ${targetAge}대 ${targetGender}과 일치해요</p>
          <p>비슷한 디자인의 상품기획을 추천드려요</p>
          `;
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
          if (
            product.name === productId.name &&
            product.platform === 'zigzag'
          ) {
            zigzagAge = parseInt(platforms[1].age.replace('s', ''));
          }
        });

        let ablyComentHTML = document.querySelector('.ably-analysis-coment');
        if (ablyAge === null) {
          ablyComentHTML.innerHTML = `
        <p>해당 상품은 에이블리에 등록되어 있지 않아요.</p>
        `;
        } else if (ablyAge < targetAge) {
          ablyComentHTML.innerHTML = `
              <p>${ablyAge}대 ${sameProductsGender} 구매율이 높아요</p>
              <p>조금 더 성숙한 디자인의 상품기획이 필요해보여요</p>
              `;
        } else if (ablyAge === targetAge) {
          ablyComentHTML.innerHTML = `
              <p>우리 쇼핑몰 타겟층인 ${targetAge}대 ${targetGender}과 일치해요</p>
              <p>비슷한 디자인의 상품기획을 추천드려요</p>
              `;
        } else if (ablyAge > targetAge) {
          ablyComentHTML.innerHTML = `
              <p>${ablyAge}대 ${sameProductsGender} 구매율이 높아요</p>
              <p>조금 더 젊어보이는 디자인의 상품기획이 필요해보여요</p>
              `;
        }

        let zigzagComentHTML = document.querySelector(
          '.zigzag-analysis-coment',
        );
        if (zigzagAge === null) {
          zigzagComentHTML.innerHTML = `
              <p>해당 상품은 지그재그에 등록되어 있지 않아요.</p>
              `;
        } else if (zigzagAge < targetAge) {
          zigzagComentHTML.innerHTML = `
              <p>${zigzagAge}대 ${sameProductsGender} 구매율이 높아요</p>
              <p>조금 더 성숙한 디자인의 상품기획이 필요해보여요</p>
              `;
        } else if (zigzagAge === targetAge) {
          zigzagComentHTML.innerHTML = `
              <p>우리 쇼핑몰 타겟층인 ${targetAge}대 ${targetGender}과 일치해요</p>
              <p>비슷한 디자인의 상품기획을 추천드려요</p>
              `;
        } else if (zigzagAge > targetAge) {
          zigzagComentHTML.innerHTML = `
              <p>${zigzagAge}대 ${sameProductsGender} 구매율이 높아요</p>
              <p>조금 더 젊어보이는 디자인의 상품기획이 필요해보여요</p>
              `;
        }
      }),
    );
};
