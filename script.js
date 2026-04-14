const videos = window.CGT_VIDEOS || [];

let openVideoId = null;
let currentSearch = '';
let currentTagFilter = 'tutti';

const listEl = document.getElementById('video-list');
const searchInput = document.getElementById('search-input');
const tagFilter = document.getElementById('tag-filter');

function getThumb(youtubeId) {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

function normalizeText(value) {
  return (value || '').toString().trim().toLowerCase();
}

function getFilteredVideos() {
  return videos.filter((video) => {
    const title = normalizeText(video.title);
    const description = normalizeText(video.description);
    const theme = normalizeText(video.theme);
    const tag = normalizeText(video.tag);

    const matchesSearch =
      !currentSearch ||
      title.includes(currentSearch) ||
      description.includes(currentSearch) ||
      theme.includes(currentSearch) ||
      tag.includes(currentSearch);

    const selectedFilter = normalizeText(currentTagFilter);

    const matchesFilter =
      selectedFilter === 'tutti' ||
      theme === selectedFilter ||
      tag === selectedFilter;

    return matchesSearch && matchesFilter;
  });
}

function renderList() {
  const filtered = getFilteredVideos();

  if (!filtered.length) {
    listEl.innerHTML = `
      <div class="empty-state">
        Nessun contenuto trovato con i filtri selezionati.
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered
    .map((video) => {
      const isOpen = video.id === openVideoId;

      return `
        <div class="video-card ${isOpen ? 'selected' : ''}" data-video-id="${video.id}">
          ${
            isOpen
              ? `
                <div class="player-wrapper">
                  <iframe
                    src="https://www.youtube.com/embed/${video.youtubeId}?autoplay=1"
                    title="${video.title}"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
              `
              : `
                <img
                  src="${getThumb(video.youtubeId)}"
                  alt="${video.title}"
                  class="video-thumb"
                />
              `
          }

          <div class="video-card-body">
            <div class="video-meta-row">
              <span class="video-theme">${video.theme}</span>
              <span class="video-tag">${video.tag}</span>
            </div>
            <h3>${video.title}</h3>
            <p>${video.description}</p>
          </div>
        </div>
      `;
    })
    .join('');

  const cards = listEl.querySelectorAll('[data-video-id]');

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-video-id');
      openVideoId = openVideoId === id ? null : id;
      renderList();
    });
  });
}

function bindFilters() {
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      currentSearch = normalizeText(event.target.value);
      openVideoId = null;
      renderList();
    });
  }

  if (tagFilter) {
    tagFilter.addEventListener('change', (event) => {
      currentTagFilter = event.target.value;
      openVideoId = null;
      renderList();
    });
  }
}

bindFilters();
renderList();
