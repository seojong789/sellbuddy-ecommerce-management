document.addEventListener('DOMContentLoaded', () => {
  // 사이드바 HTML 코드
  const sidebarHTML = `
  <nav class="sidebar-navigation">
    <ul>
      <li class="active">
        <i class="fa-sharp-duotone fa-solid fa-house"></i>
        <span class="tooltip">Main</span>
      </li>
      <li>
        <i class="fa-sharp-duotone fa-solid fa-comments-dollar"></i>
        <span class="tooltip">Sales</span>
      </li>
      <li>
        <i class="fa-solid fa-magnifying-glass-chart"></i>
        <span class="tooltip">Analysis</span>
      </li>
    </ul>
  </nav>`;

  // 사이드바 삽입
  document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

  // // CSS 파일 동적으로 로드
  // const link = document.createElement('link');
  // link.rel = 'stylesheet';
  // link.href = '../../dist/sidebar.css';
  // document.head.appendChild(link);
});
