const signInUp = document.getElementById('create-account-link');
signInUp.addEventListener('click', (e) => {
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

signupForm.addEventListener('submit', (e) => {
  const fullName = document.getElementById('firstname').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();

  if (fullName === '' || email === '' || password === '') {
    alert('All fields are required.');
    return;
  }

  if (!validateEmail(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  const userData = {
    fullName: fullName,
    email: email,
    password: password,
  };

  localStorage.setItem('userData', JSON.stringify(userData));

  alert('Account created successfully!');

  signupForm.reset();
  document.getElementById('signup-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'block';
  signInUp.innerText = 'Create new account';
});

// 로그인

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
