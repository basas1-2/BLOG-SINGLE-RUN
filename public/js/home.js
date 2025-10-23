const API = '/api';
async function loadPosts() {
  try {
    const res = await fetch(API + '/blogs');
    const posts = await res.json();
    const container = document.getElementById('posts');
    if (!Array.isArray(posts)) { container.innerHTML = '<p>Error loading posts</p>'; return; }
    container.innerHTML = posts.map(p => `
      <article class="card">
        ${p.imageUrl ? `<img src="${p.imageUrl}" alt="" class="card-image">` : ''}
        <h2>${escapeHtml(p.title)}</h2>
        <p class="meta">By ${p.author ? p.author.name : 'Unknown'} — ${new Date(p.createdAt).toLocaleString()}</p>
        <p>${escapeHtml(p.body.substring(0, 200))}...</p>
      </article>
    `).join('');
  } catch (err) {
    document.getElementById('posts').innerHTML = '<p>Unable to load posts</p>';
  }
}
function escapeHtml(str){ return (str||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
loadPosts();
