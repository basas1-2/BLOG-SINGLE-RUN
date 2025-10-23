const API = 'https://blog-single-run.onrender.com/api';
document.getElementById('registerForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const form = e.target;
  const data = { name: form.name.value, email: form.email.value, password: form.password.value };
  const res = await fetch(API + '/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
  const json = await res.json();
  if (res.ok && json.token) {
    localStorage.setItem('token', json.token);
    localStorage.setItem('user', JSON.stringify(json.user));
    window.location = '/dashboard.html';
  } else {
    document.getElementById('error').textContent = json.msg || (json.errors && json.errors.map(x=>x.msg).join(', ')) || 'Registration failed';
  }
});
