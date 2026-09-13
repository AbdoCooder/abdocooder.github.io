/* ============================================================
   ABDELKADER BENAJIBA — Portfolio Script
   ============================================================ */

(function () {
  'use strict';

  const GITHUB_USER = 'AbdoCooder';
  const GITHUB_API  = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated&type=public`;

  /* ── NAV SCROLL ── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ── MOBILE NAV ── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── ACTIVE NAV ── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = navLinks.querySelectorAll('a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
  }, { passive: true });

  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 68, behavior: 'smooth' });
    });
  });

  /* ── INTERNSHIP PILL ── */
  const pill      = document.getElementById('internshipPill');
  const pillClose = document.getElementById('pillClose');
  try { if (sessionStorage.getItem('pillDismissed')) pill.classList.add('hidden'); } catch (_) {}
  pillClose.addEventListener('click', () => {
    pill.classList.add('hidden');
    try { sessionStorage.setItem('pillDismissed', '1'); } catch (_) {}
  });

  /* ── REPOS ACCORDION & GITHUB API ── */
  const reposToggle = document.getElementById('reposToggle');
  const reposPanel  = document.getElementById('reposPanel');
  const reposList   = document.getElementById('reposList');
  const repoCount   = document.getElementById('repoCount');

  let reposLoaded = false;
  let allRepos    = [];

  // Featured repo slugs — excluded from the "all repos" accordion list
  const FEATURED = new Set(['webserv', 'Inception', 'Minishell', 'maven']);

  reposToggle.addEventListener('click', () => {
    const open = reposPanel.classList.toggle('open');
    reposToggle.setAttribute('aria-expanded', String(open));
    reposPanel.setAttribute('aria-hidden', String(!open));
    if (open && !reposLoaded) fetchRepos();
  });

  async function fetchRepos() {
    reposLoaded = true;
    try {
      const res = await fetch(GITHUB_API, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });

      // Respect rate-limiting
      if (res.status === 403 || res.status === 429) {
        const reset = res.headers.get('X-RateLimit-Reset');
        const resetTime = reset ? new Date(reset * 1000).toLocaleTimeString() : 'soon';
        showError(`GitHub API rate limit hit. Try again after ${resetTime}.`,
                  `https://github.com/${GITHUB_USER}?tab=repositories`);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      allRepos = await res.json();

      // Filter: public, non-fork, exclude featured and profile-readme repo
      const displayRepos = allRepos
        .filter(r => !r.fork && !FEATURED.has(r.name) && r.name !== GITHUB_USER)
        .sort((a, b) => (b.stargazers_count - a.stargazers_count) || new Date(b.updated_at) - new Date(a.updated_at));

      const total = allRepos.filter(r => !r.fork && r.name !== GITHUB_USER).length;
      repoCount.textContent = `${total} repos`;

      renderRepoList(displayRepos);
    } catch (err) {
      console.error(err);
      showError('Could not load repositories.', `https://github.com/${GITHUB_USER}?tab=repositories`);
    }
  }

  function renderRepoList(repos) {
    if (!repos.length) {
      reposList.innerHTML = `<div class="repos-loading">No additional repositories found.</div>`;
      return;
    }

    reposList.innerHTML = repos.map(r => `
      <div class="repo-item" role="button" tabindex="0"
           data-name="${escHtml(r.name)}"
           aria-label="View details for ${escHtml(r.name)}">
        <span class="repo-name">${escHtml(r.name.replace(/-/g,' ').replace(/_/g,' '))}</span>
        ${r.language ? `<span class="repo-lang">${escHtml(r.language)}</span>` : ''}
        ${r.stargazers_count > 0 ? `
          <span class="repo-stars">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ${r.stargazers_count}
          </span>` : ''}
        <svg class="repo-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    `).join('');

    // Click / keyboard to open modal
    reposList.querySelectorAll('.repo-item').forEach(item => {
      const openModal = () => {
        const name = item.dataset.name;
        const repo = allRepos.find(r => r.name === name);
        if (repo) openRepoModal(repo);
      };
      item.addEventListener('click', openModal);
      item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); } });
    });
  }

  function showError(msg, fallbackUrl) {
    reposList.innerHTML = `
      <div class="repos-error">
        <span>${escHtml(msg)}</span>
        <a href="${escHtml(fallbackUrl)}" target="_blank" rel="noopener">Browse on GitHub →</a>
      </div>`;
  }

  /* ── REPO MODAL ── */
  const backdrop    = document.getElementById('modalBackdrop');
  const modal       = document.getElementById('modal');
  const modalClose  = document.getElementById('modalClose');
  const modalContent= document.getElementById('modalContent');

  function openRepoModal(repo) {
    const updatedAt = new Date(repo.updated_at).toLocaleDateString('en-GB', { month:'short', year:'numeric' });
    const topics = (repo.topics || []).slice(0, 8);

    modalContent.innerHTML = `
      <p class="modal-repo-name">${escHtml(repo.name.replace(/-/g,' ').replace(/_/g,' '))}</p>
      <p class="modal-repo-desc">${escHtml(repo.description || 'No description provided.')}</p>
      <div class="modal-meta">
        ${repo.language ? `
          <span class="modal-meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
            ${escHtml(repo.language)}
          </span>` : ''}
        <span class="modal-meta-item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          ${repo.stargazers_count} stars
        </span>
        <span class="modal-meta-item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Updated ${updatedAt}
        </span>
        ${repo.forks_count > 0 ? `
          <span class="modal-meta-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M18 9a9 9 0 01-9 9"/></svg>
            ${repo.forks_count} forks
          </span>` : ''}
      </div>
      ${topics.length ? `
        <div class="modal-topics">
          ${topics.map(t => `<span class="modal-topic">${escHtml(t)}</span>`).join('')}
        </div>` : ''}
      <div class="modal-actions">
        <a href="${escHtml(repo.html_url)}" target="_blank" rel="noopener" class="btn btn-primary">
          Open on GitHub
        </a>
        ${repo.homepage ? `<a href="${escHtml(repo.homepage)}" target="_blank" rel="noopener" class="btn btn-glass">Live demo</a>` : ''}
      </div>
    `;

    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
    modalClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ── UTIL ── */
  function escHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

})();
