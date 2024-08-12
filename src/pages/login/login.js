const  = document.getElementById('create-account-link');


  .addEventListener('click', function (e) {
    e.preventDefault(); // 링크의 기본 동작을 막음

    if ()

    // 로그인 폼 숨기고, 회원가입 폼 표시
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
  });
