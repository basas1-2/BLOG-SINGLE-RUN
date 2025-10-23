const API = '/api';
const token = localStorage.getItem('token');
if (!token) { window.location = '/login.html'; }
document.getElementById('logout').addEventListener('click', e=>{ e.preventDefault(); localStorage.removeItem('token'); localStorage.removeItem('user'); window.location = '/'; });

async function loadMine() {
  const res = await fetch(API + '/blogs/user/me', { headers: { Authorization: 'Bearer ' + token } });
  const posts = await res.json();
  const container = document.getElementById('my-posts');
  if (!Array.isArray(posts)) { container.innerHTML = '<p>Error loading</p>'; return; }
  container.innerHTML = posts.map(p=>`
    <article class="card">
      ${p.imageUrl ? `<img src="${p.imageUrl}" class="card-image">` : ''}
      <h3>${escapeHtml(p.title)}</h3>
      <p class="meta">${new Date(p.createdAt).toLocaleString()}</p>
      <p>${escapeHtml(p.body.substring(0,200))}...</p>
      <div class="actions">
        <button onclick="editPost('${p._id}')">Edit</button>
        <button onclick="deletePost('${p._id}')">Delete</button>
      </div>
    </article>
  `).join('');
}

document.getElementById('postForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const form = e.target;
  const data = new FormData();
  data.append('title', form.title.value);
  data.append('body', form.body.value);
  if (form.image.files[0]) data.append('image', form.image.files[0]);
  const res = await fetch(API + '/blogs', { method:'POST', headers: { Authorization: 'Bearer ' + token }, body: data });
  const json = await res.json();
  if (res.ok) {
    document.getElementById('msg').textContent = 'Posted!';
    form.reset();
    loadMine();
  } else {
    document.getElementById('msg').textContent = json.msg || 'Error';
  }
});

async function deletePost(id) {
  if (!confirm('Delete this post?')) return;
  const res = await fetch(API + '/blogs/' + id, { method:'DELETE', headers:{ Authorization: 'Bearer ' + token } });
  if (res.ok) loadMine(); else alert('Error deleting');
}
function editPost(id) {
  const title = prompt('New title (leave blank to keep)'), body = prompt('New body (leave blank to keep)');
  if (title===null && body===null) return;
  const data = new FormData();
  if (title) data.append('title', title);
  if (body) data.append('body', body);
  fetch(API + '/blogs/' + id, { method:'PUT', headers:{ Authorization: 'Bearer ' + token }, body: data })
    .then(r=>r.json()).then(j=>{ if (j._id) loadMine(); else alert('Could not update'); });
}

function escapeHtml(str){ return (str||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
loadMine();
