document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');

  // 로그인 상태가 아닌 경우 로그인 페이지로 리다이렉트
  if (isLoggedIn !== 'true') {
    alert('로그인하지 않았습니다. 로그인 페이지로 이동합니다.');
    window.location.href = '/src/pages/login/login.html';
    return; // 리다이렉트 후 나머지 코드 실행 방지
  }

  const sidebarHTML = `
  <nav class="sidebar-navigation">
    <h1 id="none">사이드바</h1>
    <ul class="menu-items">
      <h2 id="none">Main</h2>
      <a href="/src/pages/main/main.html">
        <li>
          <i class="fa-sharp-duotone fa-solid fa-house"></i>
          <span class="tooltip">Main</span>
        </li>
      </a>
      <a href="/src/pages/sales/sales.html">
        <h2 id="none">Sales</h2>
        <li>
          <i class="fa-sharp-duotone fa-solid fa-comments-dollar"></i>
          <span class="tooltip">Sales</span>
        </li>
      </a>
      <a href="/src/pages/analysis/main/analysis.html">
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

  // 사이드바 삽입
  document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

  // 로그아웃 기능 추가
  const logoutButton = document.getElementById('logout');
  logoutButton.addEventListener('click', () => {
    // 세션 스토리지의 사용자 정보 삭제
    sessionStorage.clear();
    alert('정상적으로 로그아웃 되었습니다.');
    // 로그아웃 후 로그인 페이지로 리다이렉트
    window.location.href = '/src/pages/login/login.html';
  });
});
