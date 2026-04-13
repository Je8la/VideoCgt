const videos = window.CGT_VIDEOS || [];
let activeFilter = 'tutti';
let selectedVideoId = videos[0]?.id || null;

const listEl = document.getElementById('video-list');
const playerFrame = document.getElementById('player-frame');
const playerTitle = document.getElementById('player-title');
const playerDescription = document.getElementById('player-description');
const playerType = document.getElementById('player-type');
const playerCategory = document.getElementById('player-category');
const filterButtons = document.querySelectorAll('.filter-btn');

function getThumb(youtubeId) {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

function getFilteredVideos() {
  if (activeFilter === 'tutti') return videos;
  return videos.filter((video) => video.type === activeFilter);
}

function getSelectedVideo() {
  const filtered = getFilteredVideos();
  return (
    filtered.find((video) => video.id === selectedVideoId) ||
    filtered[0] ||
    videos[0] ||
    null
  );
}

function updatePlayer(video) {
  if (!video) return;

  playerFrame.src = `https://www.youtube.com/embed/${video.youtubeId}`;
  playerFrame.title = video.title;
  playerTitle.textContent = video.title;
  playerDescription.textContent = video.description;
  playerType.textContent = video.type.toUpperCase();
  playerCategory.textContent = video.category;
}

function renderList() {
  const filtered = getFilteredVideos();

  if (!filtered.length) {
    listEl.innerHTML = '<div class="intro-card"><p>Nessun contenuto disponibile.</p></div>';
    return;
  }

  if (!filtered.some((video) => video.id === selectedVideoId)) {
    selectedVideoId = filtered[0].id;
  }

  listEl.innerHTML = filtered
    .map((video) => {
      const selectedClass = video.id === selectedVideoId ? 'selected' : '';
      return `
        <button class="video-card ${selectedClass}" data-video-id="${video.id}">
          <img
            src="${getThumb(video.youtubeId)}"
            alt="${video.title}"
            class="video-thumb"
          />
          <div class="video-card-body">
            <div class="video-meta-row">
              <span class="video-type">${video.type.toUpperCase()}</span>
              <span class="video-category">${video.category}</span>
            </div>
            <h3>${video.title}</h3>
            <p>${video.description}</p>
          </div>
        </button>
      `;
    })
    .join('');

  listEl.querySelectorAll('[data-video-id]').forEach((button) => {
    button.addEventListener('click', () => {
      selectedVideoId = button.getAttribute('data-video-id');
      render();
    });
  });
}

function renderFilters() {
  filterButtons.forEach((btn) => {
    const value = btn.getAttribute('data-filter');
    btn.classList.toggle('active', value === activeFilter);
    btn.onclick = () => {
      activeFilter = value;
      render();
    };
  });
}

function render() {
  renderFilters();
  renderList();
  updatePlayer(getSelectedVideo());
}

render();
