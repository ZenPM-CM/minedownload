// Simulando una API endpoint para obtener estadísticas actualizadas
const API_ENDPOINT = 'https://api.mine-download.com/stats';

// Configuraciones base
const configurations = [
  {
    id: 1,
    name: "EssentialsX",
    version: "2.19.0",
    description: "Configuración optimizada de EssentialsX con comandos personalizados y mensajes en español.",
    downloadUrl: "https://example.com/downloads/essentialsx-config.zip",
    downloads: 150,
    reviews: JSON.parse(localStorage.getItem('reviews-1') || '[]')
  },
  {
    id: 2,
    name: "WorldGuard",
    version: "7.0.7",
    description: "Configuración de regiones predefinidas con protecciones específicas para survival y minijuegos.",
    downloadUrl: "https://example.com/downloads/worldguard-config.zip",
    downloads: 230,
    reviews: JSON.parse(localStorage.getItem('reviews-2') || '[]')
  },
  {
    id: 3,
    name: "LuckPerms",
    version: "5.4.0",
    description: "Sistema de permisos completo con grupos predefinidos y jerarquías optimizadas.",
    downloadUrl: "https://example.com/downloads/luckperms-config.zip",
    downloads: 320,
    reviews: JSON.parse(localStorage.getItem('reviews-3') || '[]')
  },
  {
    id: 4,
    name: "CoreProtect",
    version: "20.4",
    description: "Configuración para logging avanzado con retención de datos optimizada.",
    downloadUrl: "https://example.com/downloads/coreprotect-config.zip",
    downloads: 180,
    reviews: JSON.parse(localStorage.getItem('reviews-4') || '[]')
  }
];

// Función para actualizar descargas
async function updateDownloads() {
  configurations.forEach(config => {
    config.downloads += 5;
    const downloadEl = document.querySelector(`.config-card[data-config-id="${config.id}"] .downloads span`);
    if (downloadEl) {
      downloadEl.textContent = config.downloads;
      // Añadir efecto de actualización
      downloadEl.classList.add('updating');
      setTimeout(() => downloadEl.classList.remove('updating'), 500);
    }
  });
}

// Función para crear una tarjeta de configuración
function createConfigCard(config) {
  const card = document.createElement('div');
  card.className = 'config-card';
  card.dataset.configId = config.id;
  
  card.innerHTML = `
    <h3>${config.name}</h3>
    <span class="version-badge">v${config.version}</span>
    <p>${config.description}</p>
    <div class="stats">
      <div class="downloads">
        <i class="fas fa-download"></i>
        <span>${config.downloads}</span>
      </div>
    </div>
    <a href="${config.downloadUrl}" class="download-btn" onclick="handleDownload(${config.id}, event)">
      <i class="fas fa-download"></i>
      Descargar
    </a>
    <button class="review-btn" onclick="openReviewModal(${config.id})">
      Ver Reviews
    </button>
  `;
  
  return card;
}

// Nombres aleatorios para reviews
const randomNames = [
  "MineCrafter123", "RedstoneWizard", "DiamondMiner", "CraftMaster", 
  "BlockBuilder", "PixelWarrior", "EnderDragon", "NetherKnight"
];

function getRandomName() {
  return randomNames[Math.floor(Math.random() * randomNames.length)];
}

// Función para guardar reviews
function saveReviews(configId, reviews) {
  localStorage.setItem(`reviews-${configId}`, JSON.stringify(reviews));
}

// Modal de reviews
const modal = document.getElementById('reviewModal');
const closeBtn = document.querySelector('.close');
let currentConfigId = null;

function openReviewModal(configId) {
  currentConfigId = configId;
  const config = configurations.find(c => c.id === configId);
  document.getElementById('configName').textContent = config.name;
  renderReviews(config.reviews);
  modal.style.display = 'block';
}

closeBtn.onclick = () => {
  modal.style.display = 'none';
}

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
}

function renderReviews(reviews) {
  const container = document.getElementById('reviewsContainer');
  container.innerHTML = reviews.map(review => `
    <div class="review">
      <div class="review-header">
        <strong>${review.username}</strong>
        <div class="rating">
          ${'⭐'.repeat(review.rating)}
        </div>
      </div>
      <p>${review.text}</p>
    </div>
  `).join('');
}

// Manejar el envío de reviews
document.getElementById('submitReview').onclick = () => {
  const text = document.getElementById('reviewText').value;
  const ratingStars = document.querySelectorAll('.rating .fas').length;
  
  if (text.trim()) {
    const config = configurations.find(c => c.id === currentConfigId);
    const newReview = {
      username: getRandomName(),
      rating: ratingStars || 5,
      text: text
    };
    
    config.reviews.push(newReview);
    saveReviews(currentConfigId, config.reviews);
    renderReviews(config.reviews);
    document.getElementById('reviewText').value = '';
  }
};

// Rating system
document.querySelectorAll('.rating i').forEach((star, index) => {
  star.onclick = () => {
    document.querySelectorAll('.rating i').forEach((s, i) => {
      if (i <= index) {
        s.classList.remove('far');
        s.classList.add('fas');
      } else {
        s.classList.remove('fas');
        s.classList.add('far');
      }
    });
  };
});

// Hamburger menu
document.querySelector('.hamburger').addEventListener('click', () => {
  document.querySelector('.nav-menu').classList.toggle('active');
});

// Manejar descargas
function handleDownload(configId, event) {
  event.preventDefault();
  const config = configurations.find(c => c.id === configId);
  config.downloads++;
  const downloadEl = document.querySelector(`.config-card[data-config-id="${configId}"] .downloads span`);
  if (downloadEl) {
    downloadEl.textContent = config.downloads;
  }
  window.location.href = config.downloadUrl;
}

// Contador de estadísticas animado
function animateStats() {
  const stats = document.querySelectorAll('.stat-number');
  stats.forEach(stat => {
    const finalValue = parseInt(stat.textContent);
    let currentValue = 0;
    const duration = 2000; // 2 segundos
    const increment = finalValue / (duration / 16); // 60fps

    const animate = () => {
      currentValue += increment;
      if (currentValue < finalValue) {
        stat.textContent = Math.floor(currentValue).toString() + (stat.textContent.includes('.') ? '.0' : '');
        requestAnimationFrame(animate);
      } else {
        stat.textContent = finalValue.toString() + (stat.textContent.includes('.') ? '.0' : '');
      }
    };

    animate();
  });
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  // Renderizar configuraciones iniciales
  const container = document.getElementById('configsContainer');
  configurations.forEach(config => {
    container.appendChild(createConfigCard(config));
  });

  // Actualizar descargas cada minuto
  setInterval(updateDownloads, 60000);

  // Animar estadísticas cuando la página carga
  animateStats();
});

// Búsqueda
document.getElementById('searchInput').addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredConfigs = configurations.filter(config => 
    config.name.toLowerCase().includes(searchTerm) ||
    config.description.toLowerCase().includes(searchTerm)
  );
  
  const container = document.getElementById('configsContainer');
  container.innerHTML = '';
  filteredConfigs.forEach(config => {
    container.appendChild(createConfigCard(config));
  });
});

// Theme toggling functionality
const themeToggle = document.querySelector('.theme-toggle');
const htmlElement = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  htmlElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  if (theme === 'dark') {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  } else {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  }
}