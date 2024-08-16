const signInUp = document.getElementById('create-account-link');

signInUp.addEventListener('click', function (e) {
  e.preventDefault();
  if (signInUp.innerText === 'Create new account') {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
    signInUp.innerText = 'Go back to login';
  } else {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    signInUp.innerText = 'Create new account';
  }
});

const signupForm = document.getElementById('signup-form');

document
  .getElementById('firstname')
  .addEventListener('input', validateFullName);
document
  .getElementById('signup-email')
  .addEventListener('input', validateEmailInput);
document
  .getElementById('signup-password')
  .addEventListener('input', validatePassword);
document
  .getElementById('confirm-password')
  .addEventListener('input', validateConfirmPassword);

signupForm.addEventListener('submit', function (e) {
  e.preventDefault();

  if (
    validateFullName() &&
    validateEmailInput() &&
    validatePassword() &&
    validateConfirmPassword()
  ) {
    const fullName = document.getElementById('firstname').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    const userData = {
      fullName: fullName,
      email: email,
      password: password,
    };

    sessionStorage.setItem('userData', JSON.stringify(userData));

    alert('계정이 성공적으로 생성되었습니다!');

    signupForm.reset();
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    signInUp.innerText = 'Create new account';
  } else {
    alert('제출하기 전에 폼의 오류를 수정해주세요.');
  }
});

const loginForm = document.getElementById('login-form');

document
  .getElementById('email')
  .addEventListener('input', validateLoginEmailInput);
document
  .getElementById('password')
  .addEventListener('input', validateLoginPassword);

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();

  if (validateLoginEmailInput() && validateLoginPassword()) {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const storedUserData = JSON.parse(sessionStorage.getItem('userData'));

    if (
      storedUserData &&
      storedUserData.email === email &&
      storedUserData.password === password
    ) {
      sessionStorage.setItem('isLoggedIn', 'true');
      alert('로그인 성공!');
      window.location.href = '/main.html';
    } else {
      alert('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  } else {
    alert('로그인 정보를 확인해주세요.');
  }
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateFullName() {
  const fullName = document.getElementById('firstname').value.trim();
  if (fullName === '') {
    setError('firstname', '이름을 입력해야 합니다.');
    return false;
  } else {
    clearError('firstname');
    return true;
  }
}

function validateEmailInput() {
  const email = document.getElementById('signup-email').value.trim();
  if (email === '') {
    setError('signup-email', '이메일을 입력해야 합니다.');
    return false;
  } else if (!validateEmail(email)) {
    setError('signup-email', '유효한 이메일 주소를 입력해주세요.');
    return false;
  } else {
    clearError('signup-email');
    return true;
  }
}

function validatePassword() {
  const password = document.getElementById('signup-password').value.trim();
  if (password === '') {
    setError('signup-password', '비밀번호를 입력해야 합니다.');
    return false;
  } else {
    clearError('signup-password');
    return true;
  }
}

function validateConfirmPassword() {
  const password = document.getElementById('signup-password').value.trim();
  const confirmPassword = document
    .getElementById('confirm-password')
    .value.trim();
  if (confirmPassword === '') {
    setError('confirm-password', '비밀번호 확인을 입력해야 합니다.');
    return false;
  } else if (confirmPassword !== password) {
    setError('confirm-password', '비밀번호가 일치하지 않습니다.');
    return false;
  } else {
    clearError('confirm-password');
    return true;
  }
}

function validateLoginEmailInput() {
  const email = document.getElementById('email').value.trim();
  if (email === '') {
    setError('email', '이메일을 입력해야 합니다.');
    return false;
  } else if (!validateEmail(email)) {
    setError('email', '유효한 이메일 주소를 입력해주세요.');
    return false;
  } else {
    clearError('email');
    return true;
  }
}

function validateLoginPassword() {
  const password = document.getElementById('password').value.trim();
  if (password === '') {
    setError('password', '비밀번호를 입력해야 합니다.');
    return false;
  } else {
    clearError('password');
    return true;
  }
}

function setError(elementId, message) {
  const element = document.getElementById(elementId);
  element.classList.add('is-invalid');
  element.nextElementSibling.innerText = message;
}

function clearError(elementId) {
  const element = document.getElementById(elementId);
  element.classList.remove('is-invalid');
  element.nextElementSibling.innerText = '';
}
