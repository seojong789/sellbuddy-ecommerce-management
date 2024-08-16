window.onload = () => {
  axios
    .all([
      axios.get('/assets/json/product.json'),
      axios.get('/assets/json/platform1.json'),
    ])
    .then((res) => {
      let products = res[0].data;
      let platforms = res[1].data;
      let filteredProducts = products;

      const calculateTotal = (product) => {
        const totalQuantity = product.sales.reduce(
          (sum, sale) => sum + sale.quantity,
          0,
        );
        const totalSales = totalQuantity * product.price;
        return { totalQuantity, totalSales };
      };

      const renderProducts = (productsToRender) => {
        const productsHTML = productsToRender
          .map((product) => {
            const { totalQuantity, totalSales } = calculateTotal(product);
            return `
            <li class="product-info">
              <a href="./analysis-detail.html?value=${
                product.id
              }" class="product-name">
                <span>
                  <img src="./assets/images/${
                    product.name
                  }.jpg" alt="상품 대표 이미지" />
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
          .join('');
        document.querySelector('.registered-product-list').innerHTML =
          productsHTML;
      };

      const filterProductsByDate = (date, period) => {
        const selectedDate = new Date(date);
        filteredProducts = products
          .map((product) => {
            let filteredSales = [];

            switch (period) {
              case 'total':
                filteredSales = product.sales.filter(
                  (sale) => new Date(sale.date) <= selectedDate,
                );
                break;
              case 'day':
                filteredSales = product.sales.filter(
                  (sale) =>
                    new Date(sale.date).toDateString() ===
                    selectedDate.toDateString(),
                );
                break;
              case 'week':
                const weekAgo = new Date(selectedDate);
                weekAgo.setDate(weekAgo.getDate() - 7);
                filteredSales = product.sales.filter(
                  (sale) =>
                    new Date(sale.date) >= weekAgo &&
                    new Date(sale.date) <= selectedDate,
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
          .filter((product) => product.sales.length > 0);

        renderProducts(filteredProducts.slice(0, itemsPerPage));
        updatePagination();
      };

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
          renderProducts(filteredProducts.slice(0, itemsPerPage));
          updatePagination();
        });

      document
        .querySelector('.custom-btn.btn-13')
        .addEventListener('click', () => {
          const selectedDate = document.getElementById('date-picker').value;
          const selectedPeriod = document.getElementById('period').value;
          filterProductsByDate(selectedDate, selectedPeriod);
        });

      const itemsPerPage = 8;
      let currentPage = 1;

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
            }">${i + 1}</span>`,
        ).join('')}
        <span class="page-control next ${
          currentPage === totalPages ? 'disabled' : ''
        }">&gt;</span>
      `;
        document.querySelector('.pages').innerHTML = paginationHTML;
      };

      const changePage = (page) => {
        currentPage = page;
        renderProducts(
          filteredProducts.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage,
          ),
        );
        renderPagination();
      };

      const updatePagination = () => {
        renderPagination();
        changePage(1);
      };

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

      changePage(currentPage);

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

      const getHashtagRanking = (data, categoryFilter = 'all') => {
        const hashtags = {};

        data.forEach((platform) => {
          platform.category.forEach((category) => {
            if (categoryFilter === 'all' || category.name === categoryFilter) {
              category.인기해시태그.forEach((tag) => {
                hashtags[tag] = (hashtags[tag] || 0) + 1;
              });
            }
          });
        });

        return Object.entries(hashtags)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 9);
      };

      const renderHashtagRankings = () => {
        const selectedPlatform = document.getElementById('platform-rank').value;
        const selectedCategory = document.getElementById('category-rank').value;

        let filteredData = platforms;
        if (selectedPlatform !== 'all') {
          filteredData = platforms.filter(
            (platform) => platform.name === selectedPlatform,
          );
        }

        const rankings = getHashtagRanking(filteredData, selectedCategory);

        const hashtagRankList = document.querySelector('.hashtag-rank-list');
        hashtagRankList.innerHTML = '';

        for (let i = 0; i < rankings.length; i++) {
          const li = document.createElement('li');
          li.className = 'hashtag-rank';
          li.innerHTML = `<div class="rank">${
            i + 1
          }</div><div class="hashtag-name">#${rankings[i][0]}</div>`;
          hashtagRankList.appendChild(li);
          if (i > 5) {
            break;
          }
        }
      };

      document
        .getElementById('platform-rank')
        .addEventListener('change', renderHashtagRankings);
      document
        .getElementById('category-rank')
        .addEventListener('change', renderHashtagRankings);

      renderHashtagRankings();
    });
};
