window.onload = () => {
  // 오늘 날짜를 기본값으로 설정
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date-picker').value = today;

  axios
    .all([
      axios.get('http://127.0.0.1:5500/product.json'),
      axios.get('http://127.0.0.1:5500/platform1.json'),
    ])
    .then((res) => {
      let products = res[0].data;
      let platforms = res[1].data;
      let filteredProducts = products; // 필터링된 데이터를 저장할 변수

      // 총 판매량 및 매출 계산 함수
      const calculateTotal = (product) => {
        const totalQuantity = product.sales.reduce(
          (sum, sale) => sum + sale.quantity,
          0
        );
        const totalSales = totalQuantity * product.price;
        return { totalQuantity, totalSales };
      };

      // 제품 리스트를 렌더링하는 함수
      const renderProducts = (productsToRender) => {
        const productsHTML = productsToRender
          .map((product) => {
            const { totalQuantity, totalSales } = calculateTotal(product);
            return `
            <li class="product-info">
              <a href="/src/pages/analysis/detail/analysis-detail.html?value=${
                product.id
              }" class="product-name">
                <span>
                  <img src="/src/assets/images/목걸이1.jpg" alt="상품 대표 이미지" />
                </span>
                <span class="registered-product-name">${product.name}</span>
              </a>
              <div class="registered-product-platform">${product.platform}</div>
              <div class="registered-product-price">${product.price.toLocaleString()}원</div>
              <div class="registered-product-sales">${totalQuantity.toLocaleString()}개</div>
              <div class="registered-product-total-sales">${totalSales.toLocaleString()}원</div>
            </li>
          `;
          })
          .join(''); // 배열을 문자열로 변환하여 HTML에 삽입
        document.querySelector('.registered-product-list').innerHTML =
          productsHTML;
      };

      // 날짜와 기간에 따라 제품을 필터링하는 함수
      const filterProductsByDate = (date, period) => {
        const selectedDate = new Date(date);
        filteredProducts = products
          .map((product) => {
            let filteredSales = [];

            // 기간에 따라 판매 데이터를 필터링
            switch (period) {
              case 'total':
                filteredSales = product.sales.filter(
                  (sale) => new Date(sale.date) <= selectedDate
                );
                break;
              case 'day':
                filteredSales = product.sales.filter(
                  (sale) =>
                    new Date(sale.date).toDateString() ===
                    selectedDate.toDateString()
                );
                break;
              case 'week':
                const weekAgo = new Date(selectedDate);
                weekAgo.setDate(weekAgo.getDate() - 7);
                filteredSales = product.sales.filter(
                  (sale) =>
                    new Date(sale.date) >= weekAgo &&
                    new Date(sale.date) <= selectedDate
                );
                break;
              case 'month':
                filteredSales = product.sales.filter((sale) => {
                  const saleDate = new Date(sale.date);
                  return (
                    saleDate.getMonth() === selectedDate.getMonth() &&
                    saleDate.getFullYear() === selectedDate.getFullYear() &&
                    saleDate <= selectedDate
                  );
                });
                break;
            }

            return { ...product, sales: filteredSales };
          })
          .filter((product) => product.sales.length > 0); // 판매 데이터가 있는 제품만 필터링

        renderProducts(filteredProducts.slice(0, itemsPerPage)); // 필터링된 제품을 렌더링
        updatePagination(); // 페이지네이션 업데이트
      };

      // 정렬 기능
      document
        .getElementById('classification')
        .addEventListener('change', (event) => {
          const sortBy = event.target.value;
          const sortFunctions = {
            'sales-quantity-desc': (a, b) =>
              calculateTotal(b).totalQuantity - calculateTotal(a).totalQuantity,
            'sales-quantity-asc': (a, b) =>
              calculateTotal(a).totalQuantity - calculateTotal(b).totalQuantity,
            'sales-desc': (a, b) =>
              calculateTotal(b).totalSales - calculateTotal(a).totalSales,
            'sales-asc': (a, b) =>
              calculateTotal(a).totalSales - calculateTotal(b).totalSales,
          };
          filteredProducts.sort(sortFunctions[sortBy]);
          renderProducts(filteredProducts.slice(0, itemsPerPage)); // 정렬된 제품을 렌더링
          updatePagination(); // 페이지네이션 업데이트
        });

      // 날짜 선택 및 필터링 적용
      document
        .querySelector('.custom-btn.btn-13')
        .addEventListener('click', () => {
          const selectedDate = document.getElementById('date-picker').value;
          const selectedPeriod = document.getElementById('period').value;
          filterProductsByDate(selectedDate, selectedPeriod); // 날짜 및 기간 선택에 따라 제품 필터링
        });

      // 페이지네이션 기능
      const itemsPerPage = 8;
      let currentPage = 1;

      // 페이지네이션 렌더링 함수
      const renderPagination = () => {
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
        const paginationHTML = `
        <span class="page-control prev ${
          currentPage === 1 ? 'disabled' : ''
        }">&lt;</span>
        ${Array.from(
          { length: totalPages },
          (_, i) =>
            `<span class="page-number ${
              i + 1 === currentPage ? 'active' : ''
            }">${i + 1}</span>`
        ).join('')}
        <span class="page-control next ${
          currentPage === totalPages ? 'disabled' : ''
        }">&gt;</span>
      `;
        document.querySelector('.pages').innerHTML = paginationHTML;
      };

      // 페이지 변경 함수
      const changePage = (page) => {
        currentPage = page;
        renderProducts(
          filteredProducts.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          )
        ); // 선택된 페이지의 제품만 렌더링
        renderPagination(); // 페이지네이션 업데이트
      };

      // 페이지네이션 업데이트 함수
      const updatePagination = () => {
        renderPagination(); // 필터링 후에 페이지네이션을 업데이트
        changePage(1); // 첫 페이지로 이동하여 렌더링
      };

      // 페이지 클릭 이벤트 리스너
      document.querySelector('.pages').addEventListener('click', (event) => {
        if (event.target.classList.contains('page-number')) {
          changePage(parseInt(event.target.textContent));
        } else if (event.target.classList.contains('prev') && currentPage > 1) {
          changePage(currentPage - 1);
        } else if (
          event.target.classList.contains('next') &&
          currentPage < totalPages
        ) {
          changePage(currentPage + 1);
        }
      });

      // 초기 렌더링
      changePage(currentPage);

      // 플랫폼별 매출 계산 및 렌더링
      const platformSales = products.reduce((acc, product) => {
        const platformTotalSales = calculateTotal(product).totalSales;
        acc[product.platform] =
          (acc[product.platform] || 0) + platformTotalSales;
        return acc;
      }, {});

      const sortedPlatformSales = Object.entries(platformSales)
        .map(([platform, totalSales]) => ({ platform, totalSales }))
        .sort((a, b) => b.totalSales - a.totalSales);

      const platformSalesHTML = sortedPlatformSales
        .map((platformSales, index) => {
          const platformNameInKorean =
            platformSales.platform === 'zigzag' ? '지그재그' : '에이블리';
          return `
          <li class="sales-rank">
            <div class="rank">${index + 1}</div>
            <div class="platform">${platformNameInKorean}</div>
            <div class="total-sales">${platformSales.totalSales.toLocaleString()} 원</div>
          </li>
        `;
        })
        .join('');

      document.querySelector('.platform-sales-rank').innerHTML =
        platformSalesHTML;

      // 해시태그 순위 계산 함수
      const getHashtagRanking = (data, categoryFilter = 'all') => {
        const hashtags = {};

        // 각 플랫폼과 카테고리에서 해시태그를 집계
        data.forEach((platform) => {
          platform.category.forEach((category) => {
            if (categoryFilter === 'all' || category.name === categoryFilter) {
              category.인기해시태그.forEach((tag) => {
                hashtags[tag] = (hashtags[tag] || 0) + 1;
              });
            }
          });
        });

        // 가장 많이 사용된 해시태그 순으로 정렬하고 상위 8개만 반환
        return Object.entries(hashtags)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 9);
      };

      // 해시태그 순위를 렌더링하는 함수
      const renderHashtagRankings = () => {
        const selectedPlatform = document.getElementById('platform-rank').value;
        const selectedCategory = document.getElementById('category-rank').value;

        let filteredData = platforms;
        if (selectedPlatform !== 'all') {
          filteredData = platforms.filter(
            (platform) => platform.name === selectedPlatform
          );
        }

        const rankings = getHashtagRanking(filteredData, selectedCategory);

        const hashtagRankList = document.querySelector('.hashtag-rank-list');
        hashtagRankList.innerHTML = '';

        // 해시태그 순위를 HTML로 렌더링
        rankings.forEach(([tag, count], index) => {
          const li = document.createElement('li');
          li.className = 'hashtag-rank';
          li.innerHTML = `<div class="rank">${
            index + 1
          }</div><div class="hashtag-name">#${tag}</div>`;
          hashtagRankList.appendChild(li);
        });
      };

      // 플랫폼 및 카테고리 선택 변경 시 해시태그 순위 렌더링
      document
        .getElementById('platform-rank')
        .addEventListener('change', renderHashtagRankings);
      document
        .getElementById('category-rank')
        .addEventListener('change', renderHashtagRankings);

      // 초기 해시태그 순위 렌더링
      renderHashtagRankings();
    });
};
