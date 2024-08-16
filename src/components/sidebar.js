document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');

  if (isLoggedIn !== 'true') {
    alert('로그인하지 않았습니다. 로그인 페이지로 이동합니다.');
    window.location.href = '/login';
    return;
  }

  const sidebarHTML = `
  <nav class="sidebar-navigation">
    <h1 id="none">사이드바</h1>
    <ul class="menu-items">
      <h2 id="none">Main</h2>
      <a href="./main.html">
        <li>
          <i class="fa-sharp-duotone fa-solid fa-house"></i>
          <span class="tooltip">Main</span>
        </li>
      </a>
      <a href="./sales.html">
        <h2 id="none">Sales</h2>
        <li>
          <i class="fa-sharp-duotone fa-solid fa-comments-dollar"></i>
          <span class="tooltip">Sales</span>
        </li>
      </a>
      <a href="./analysis-main.html">
        <h2 id="none">Analysis</h2>
        <li>
          <i class="fa-solid fa-magnifying-glass-chart"></i>
          <span class="tooltip">Analysis</span>
        </li>
      </a>
    </ul>
    <ul class="logout-section">
      <li id="logout">
        <i class="bi bi-box-arrow-right"></i>
        <span class="tooltip">Logout</span>
      </li>
    </ul>
  </nav>`;

  document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

  const logoutButton = document.getElementById('logout');
  logoutButton.addEventListener('click', () => {
    sessionStorage.clear();
    alert('정상적으로 로그아웃 되었습니다.');
    window.location.href = './login.html';
  });
});
