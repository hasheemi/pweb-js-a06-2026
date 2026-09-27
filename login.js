const loginForm = document.querySelector('.login-form');
const submitBtn = document.querySelector('.btn-login'); 

const errorMessageElement = document.createElement('p');
errorMessageElement.classList.add('error-message');
loginForm.appendChild(errorMessageElement);

document.addEventListener('DOMContentLoaded', () => {
    const savedUsername = localStorage.getItem('saved_username');
    if (savedUsername) {
        document.getElementById('username').value = savedUsername;
        document.querySelector('input[name="remember"]').checked = true;
        document.getElementById('password').focus(); 
    }
});

loginForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  errorMessageElement.textContent = '';

  const usernameInput = document.getElementById('username').value;
  const passwordInput = document.getElementById('password').value;
  const rememberCheckbox = document.querySelector('input[name="remember"]');
  const API_URL = 'https://dummyjson.com/users';

  submitBtn.textContent = 'Memverifikasi...';
  submitBtn.disabled = true;
  submitBtn.classList.add('btn-loading');

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Gagal mengambil data user');
    }

    const matchedUser = data.users.find(
      (user) =>
        user.username === usernameInput &&
        user.password === passwordInput
    );

    if (matchedUser) {
      localStorage.setItem('firstName', matchedUser.firstName);

      if (rememberCheckbox.checked) {
          localStorage.setItem('saved_username', matchedUser.username);
      } else {
          localStorage.removeItem('saved_username');
      }

      alert(`Login Berhasil! Selamat datang, ${matchedUser.firstName}`);
      window.location.href = 'index.html';

    } else {
      errorMessageElement.textContent = 'Username atau password yang Anda masukkan salah.';
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    errorMessageElement.textContent = 'Gagal terhubung ke server. Silakan coba lagi nanti.';
  } finally {
    submitBtn.textContent = 'Masuk';
    submitBtn.disabled = false;
    submitBtn.classList.remove('btn-loading');
  }
});