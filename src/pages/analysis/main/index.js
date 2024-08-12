window.onload = () => {
    axios.get("http://127.0.0.1:5500/v4.json").then((res) => {
        let products = res.data;

        // -------------------------------------마이 상품 순위------------------------------------------------

        // 상품 등록
        const renderProducts = (products) => {
            let productsHTML = "";
            for (let i = 0; i < 4; i++) {
                let product = products[i];
                let totalQuantityA = product.platforms[0].sales.reduce(
                    (sum, sale) => sum + sale.quantity,
                    0
                );
                let totalQuantityZ = product.platforms[1].sales.reduce(
                    (sum, sale) => sum + sale.quantity,
                    0
                );
                let totalSalesA = totalQuantityA * product.price;
                let totalSalesZ = totalQuantityZ * product.price;
                productsHTML += `
          <li class="product-info">
                <a href="/src/pages/analysis/detail/analysis-detail.html?value=1" class="product-name">
                <span>
                    <img
                      src="/src/assets/images/목걸이1.jpg"
                      alt="상품 대표 이미지"
                    />
                  </span>
                  <span class="registered-product-name">${product.name}</span>
                </a>
                <div class="registered-product-platform">${
                    product.platforms[0].platform
                }</div>
                <div class="registered-product-price">${product.price.toLocaleString()}원</div>
                <div class="registered-product-sales"> ${totalQuantityA.toLocaleString()}개</div>
                <div class="registered-product-total-sales">${totalSalesA.toLocaleString()}원</div>
              </li>
              <li class="product-info">
                <a href="/src/pages/analysis/detail/analysis-detail.html?value=1" class="product-name">
                <span>
                    <img
                      src="/src/assets/images/목걸이1.jpg"
                      alt="상품 대표 이미지"
                    />
                  </span>
                  <span class="registered-product-name">${product.name}</span>
                </a>
                <div class="registered-product-platform">${
                    product.platforms[1].platform
                }</div>
                <div class="registered-product-price">${product.price.toLocaleString()}원</div>
                <div class="registered-product-sales"> ${totalQuantityZ.toLocaleString()}개</div>
                <div class="registered-product-total-sales">${totalSalesZ.toLocaleString()}원</div>
              </li>
          `;
            }

            document.querySelector(".registered-product-list").innerHTML =
                productsHTML;
        };
        renderProducts(products);

        // 정렬 기능
        document
            .getElementById("classification")
            .addEventListener("change", (event) => {
                switch (event.target.value) {
                    case "sales-quantity-desc":
                        // 상품 판매량 내림차순
                        products.sort((a, b) => {
                            let totalQuantityA = a.platforms[0].sales.reduce(
                                (sum, sale) => sum + sale.quantity,
                                0
                            );
                            let totalQuantityB = b.platforms[0].sales.reduce(
                                (sum, sale) => sum + sale.quantity,
                                0
                            );
                            return totalQuantityB - totalQuantityA;
                        });
                        break;

                    case "sales-quantity-asc":
                        // 상품 판매량 오름차순
                        products.sort((a, b) => {
                            let totalQuantityA = a.platforms[0].sales.reduce(
                                (sum, sale) => sum + sale.quantity,
                                0
                            );
                            let totalQuantityB = b.platforms[0].sales.reduce(
                                (sum, sale) => sum + sale.quantity,
                                0
                            );
                            return totalQuantityA - totalQuantityB;
                        });
                        break;

                    case "sales-desc":
                        // 총 매출 내림차순
                        products.sort((a, b) => {
                            let totalSalesA =
                                a.platforms[0].sales.reduce(
                                    (sum, sale) => sum + sale.quantity,
                                    0
                                ) * a.price;
                            let totalSalesB =
                                b.platforms[0].sales.reduce(
                                    (sum, sale) => sum + sale.quantity,
                                    0
                                ) * b.price;
                            return totalSalesB - totalSalesA;
                        });
                        break;

                    case "sales-asc":
                        // 총 매출 오름차순
                        products.sort((a, b) => {
                            let totalSalesA =
                                a.platforms[0].sales.reduce(
                                    (sum, sale) => sum + sale.quantity,
                                    0
                                ) * a.price;
                            let totalSalesB =
                                b.platforms[0].sales.reduce(
                                    (sum, sale) => sum + sale.quantity,
                                    0
                                ) * b.price;
                            return totalSalesA - totalSalesB;
                        });
                        break;
                }

                // Re-render the sorted products
                renderProducts(products);
            });

        // 페이지네이션 기능
        let currentPage = 1;
        const itemsPerPage = 4;
        const totalPages = Math.ceil(products.length / itemsPerPage);

        const renderProduct = (page) => {
            let start = (page - 1) * itemsPerPage;
            let end = start + itemsPerPage;
            let paginatedProducts = products.slice(start, end);
            let productsHTML = "";

            paginatedProducts.forEach((product) => {
                let totalQuantityA = product.platforms[0].sales.reduce(
                    (sum, sale) => sum + sale.quantity,
                    0
                );
                let totalQuantityZ = product.platforms[1].sales.reduce(
                    (sum, sale) => sum + sale.quantity,
                    0
                );
                let totalSalesA = totalQuantityA * product.price;
                let totalSalesZ = totalQuantityZ * product.price;
                productsHTML += `
          <li class="product-info">
                <a href="/src/pages/analysis/detail/analysis-detail.html?value=1" class="product-name">
                <span>
                    <img
                      src="/src/assets/images/목걸이1.jpg"
                      alt="상품 대표 이미지"
                    />
                  </span>
                  <span class="registered-product-name">${product.name}</span>
                </a>
                <div class="registered-product-platform">${
                    product.platforms[0].platform
                }</div>
                <div class="registered-product-price">${product.price.toLocaleString()}원</div>
                <div class="registered-product-sales"> ${totalQuantityA.toLocaleString()}개</div>
                <div class="registered-product-total-sales">${totalSalesA.toLocaleString()}원</div>
              </li>
              <li class="product-info">
                <a href="/src/pages/analysis/detail/analysis-detail.html?value=1" class="product-name">
                <span>
                    <img
                      src="/src/assets/images/목걸이1.jpg"
                      alt="상품 대표 이미지"
                    />
                  </span>
                  <span class="registered-product-name">${product.name}</span>
                </a>
                <div class="registered-product-platform">${
                    product.platforms[1].platform
                }</div>
                <div class="registered-product-price">${product.price.toLocaleString()}원</div>
                <div class="registered-product-sales"> ${totalQuantityZ.toLocaleString()}개</div>
                <div class="registered-product-total-sales">${totalSalesZ.toLocaleString()}원</div>
              </li>
          `;
            });
            document.querySelector(".registered-product-list").innerHTML =
                productsHTML;
        };

        const renderPagination = () => {
            let paginationHTML = "";

            if (currentPage > 1) {
                paginationHTML += `<span class="page-control prev">&lt;</span>`;
            } else {
                paginationHTML += `<span class="page-control prev disabled">&lt;</span>`;
            }

            for (let i = 1; i <= totalPages; i++) {
                paginationHTML += `<span class="page-number ${
                    i === currentPage ? "active" : ""
                }">${i}</span>`;
            }

            if (currentPage < totalPages) {
                paginationHTML += `<span class="page-control next">&gt;</span>`;
            } else {
                paginationHTML += `<span class="page-control next disabled">&gt;</span>`;
            }

            document.querySelector(".pages").innerHTML = paginationHTML;
        };

        renderProduct(currentPage);
        renderPagination();

        document.querySelector(".pages").addEventListener("click", (event) => {
            if (event.target.classList.contains("page-number")) {
                currentPage = parseInt(event.target.textContent);
                renderProduct(currentPage);
                renderPagination();
            } else if (
                event.target.classList.contains("prev") &&
                currentPage > 1
            ) {
                currentPage--;
                renderProduct(currentPage);
                renderPagination();
            } else if (
                event.target.classList.contains("next") &&
                currentPage < totalPages
            ) {
                currentPage++;
                renderProduct(currentPage);
                renderPagination();
            }
        });

        // ------------------------------------플랫폼 매출 순위--------------------------------------------

        // 플랫폼별 매출 합산을 위한 객체
        const platformSales = {};

        // 각 플랫폼별 매출 합산
        products.forEach((product) => {
            product.platforms.forEach((platform) => {
                const platformName = platform.platform;
                const platformTotalSales =
                    platform.sales.reduce(
                        (sum, sale) => sum + sale.quantity,
                        0
                    ) * product.price;

                if (platformSales[platformName]) {
                    platformSales[platformName] += platformTotalSales;
                } else {
                    platformSales[platformName] = platformTotalSales;
                }
            });
        });

        // 플랫폼별 매출 데이터를 배열로 변환 후 정렬
        const sortedPlatformSales = Object.entries(platformSales)
            .map(([platform, totalSales]) => ({
                platform,
                totalSales,
            }))
            .sort((a, b) => b.totalSales - a.totalSales);

        // HTML에 매출 순위 표시
        const platformSalesRankElement = document.querySelector(
            ".paltform-sales-rank"
        );
        let platformSalesHTML = "";

        sortedPlatformSales.forEach((platformSales, index) => {
            let platformNameInKorean = "";
            if (platformSales.platform === "zigzag") {
                platformNameInKorean = "지그재그";
            } else if (platformSales.platform === "ably") {
                platformNameInKorean = "에이블리";
            } else {
                platformNameInKorean = platformSales.platform; // 다른 경우는 원래 이름 그대로
            }
            platformSalesHTML += `
          <li class="sales-rank">
            <div class="rank">${index + 1}</div>
            <div class="platform">${platformNameInKorean}</div>
            <div class="total-sales">${platformSales.totalSales.toLocaleString()} 원</div>
          </li>
        `;
        });

        platformSalesRankElement.innerHTML = platformSalesHTML;

        // --------------------------------------인기 해쉬태그 순위---------------------------------------

// 오늘의 날짜를 변수로 설정 (YYYY-MM-DD 형식으로 설정)
const todayDate = "2023-01-02"; // 현재 날짜로 설정: new Date().toISOString().split('T')[0]

// 오늘의 인기 상품을 저장하기 위한 배열
let todayPopularProducts = [];

// 플랫폼 선택 기능
document.getElementById("platform-rank").addEventListener("change", (event) => {
    const selectedPlatform = event.target.value; // 선택된 플랫폼
    calculateAndRenderPopularProducts(selectedPlatform);
});

// 상품과 해시태그 계산 및 렌더링 함수
function calculateAndRenderPopularProducts(platformFilter) {
    todayPopularProducts = [];

    products.forEach((product) => {
        let totalQuantityForDate = 0;

        product.platforms.forEach((platform) => {
            // 플랫폼 필터링 적용
            if (platformFilter === "all" || platform.platform === platformFilter) {
                platform.sales.forEach((sale) => {
                    if (sale.date === todayDate) {
                        totalQuantityForDate += sale.quantity;
                    }
                });
            }
        });

        if (totalQuantityForDate > 0) {
            todayPopularProducts.push({
                product: product,
                totalQuantity: totalQuantityForDate,
            });
        }
    });

    // 오늘의 인기 상품을 판매량 기준으로 내림차순 정렬하고 상위 5개 상품을 선정
    todayPopularProducts.sort((a, b) => b.totalQuantity - a.totalQuantity);
    todayPopularProducts = todayPopularProducts.slice(0, 5);

    // 인기 상품들의 해시태그를 카운트하기 위한 객체 생성
    const hashtagCounts = {};

    // 상위 5개 상품의 해시태그를 카운트
    todayPopularProducts.forEach((item) => {
        item.product.platforms.forEach((platform) => {
            // 플랫폼 필터링 적용
            if (platformFilter === "all" || platform.platform === platformFilter) {
                if (Array.isArray(platform.hashtags)) {  // hashtags가 배열인지 확인
                    platform.hashtags.forEach((hashtag) => {
                        if (hashtagCounts[hashtag]) {
                            hashtagCounts[hashtag]++;
                        } else {
                            hashtagCounts[hashtag] = 1;
                        }
                    });
                }
            }
        });
    });

    // 해시태그 카운트를 기반으로 정렬
    const sortedHashtags = Object.entries(hashtagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

    // 정렬된 해시태그를 HTML에 출력
    const hashtagRankListElement = document.querySelector(".hashtag-rank-list");
    let hashtagRankHTML = "";

    sortedHashtags.forEach(([hashtag, count], index) => {
        hashtagRankHTML += `
            <li class="hashtag-rank">
                <div class="rank">${index + 1}위</div>
                <div class="hashtag-name">#${hashtag}</div>
                <div class="count">${count}회</div>
            </li>
        `;
    });

    document.querySelector(".hashtag-rank-list").innerHTML = hashtagRankHTML;
}

// 초기 실행 - 전체 데이터를 바탕으로 인기 상품과 해시태그 계산
calculateAndRenderPopularProducts("all");

    });
};
