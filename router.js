function navigateTo(url) {
  window.history.pushState({}, '', url);
  handleRouting();
}

function handleRouting() {
  const path = window.location.pathname;

  switch (path) {
    case '/':
      loadPage('home.html');
      break;
    case '/login':
      loadPage('pages/login/login.html');
      break;
    case '/main':
      loadPage('pages/main/main.html');
      break;
    case '/sales':
      loadPage('pages/sales/sales.html');
      break;
    case '/analysis':
      loadPage('pages/analysis/main/analysis.html');
      break;
    case '/analysis-detail':
      loadPage('pages/analysis/detail/analysis-detail.html');
      break;
    default:
      loadPage('404.html');
      break;
  }
}

function loadPage(page) {
  fetch(page)
    .then((response) => response.text())
    .then((html) => {
      document.querySelector('#app').innerHTML = html;
    })
    .catch((error) => {
      console.error('Error loading page:', error);
    });
}

window.addEventListener('popstate', handleRouting);

document.addEventListener('DOMContentLoaded', handleRouting);
