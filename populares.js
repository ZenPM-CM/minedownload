// Configuraciones populares (simuladas)
const popularConfigs = [
  {
    id: 1,
    name: "EssentialsX",
    version: "2.19.0",
    description: "Configuración optimizada de EssentialsX con comandos personalizados y mensajes en español.",
    category: "admin",
    mcVersion: "1.20",
    downloadUrl: "https://example.com/downloads/essentialsx-config.zip",
    downloads: 1500,
    rating: 4.8,
    date: new Date('2023-08-15'),
    reviews: JSON.parse(localStorage.getItem('reviews-1') || '[]')
  },
  {
    id: 2,
    name: "WorldGuard",
    version: "7.0.7",
    description: "Configuración de regiones predefinidas con protecciones específicas para survival y minijuegos.",
    category: "world",
    mcVersion: "1.20",
    downloadUrl: "https://example.com/downloads/worldguard-config.zip",
    downloads: 1200,
    rating: 4.7,
    date: new Date('2023-09-01'),
    reviews: JSON.parse(localStorage.getItem('reviews-2') || '[]')
  },
  {
    id: 3,
    name: "LuckPerms",
    version: "5.4.0",
    description: "Sistema de permisos completo con grupos predefinidos y jerarquías optimizadas.",
    category: "admin",
    mcVersion: "1.19",
    downloadUrl: "https://example.com/downloads/luckperms-config.zip",
    downloads: 980,
    rating: 4.9,
    date: new Date('2023-09-15'),
    reviews: JSON.parse(localStorage.getItem('reviews-3') || '[]')
  },
  {
    id: 4,
    name: "Vault",
    version: "1.7.1",
    description: "Configuración optimizada para economía y permisos.",
    category: "economy",
    mcVersion: "1.20",
    downloadUrl: "https://example.com/downloads/vault-config.zip",
    downloads: 850,
    rating: 4.6,
    date: new Date('2023-09-30'),
    reviews: JSON.parse(localStorage.getItem('reviews-4') || '[]')
  }
];

// Función para filtrar y ordenar configuraciones
function filterAndSortConfigs() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const versionFilter = document.getElementById('versionFilter').value;
  const categoryFilter = document.getElementById('categoryFilter').value;
  const sortBy = document.getElementById('sortBy').value;

  let filteredConfigs = popularConfigs.filter(config => {
    const matchesSearch = 
      config.name.toLowerCase().includes(searchTerm) ||
      config.description.toLowerCase().includes(searchTerm) ||
      config.category.toLowerCase().includes(searchTerm) ||
      config.version.toLowerCase().includes(searchTerm);
    
    const matchesVersion = !versionFilter || config.mcVersion === versionFilter;
    const matchesCategory = !categoryFilter || config.category === categoryFilter;

    return matchesSearch && matchesVersion && matchesCategory;
  });

  // Ordenar configuraciones
  switch(sortBy) {
    case 'downloads':
      filteredConfigs.sort((a, b) => b.downloads - a.downloads);
      break;
    case 'rating':
      filteredConfigs.sort((a, b) => b.rating - a.rating);
      break;
    case 'recent':
      filteredConfigs.sort((a, b) => b.date - a.date);
      break;
  }

  return filteredConfigs;
}

// Función para renderizar configuraciones
function renderPopularConfigs() {
  const configs = filterAndSortConfigs();
  const container = document.getElementById('popularConfigsContainer');
  container.innerHTML = '';

  if (configs.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <h3>No se encontraron resultados</h3>
        <p>Intenta con otros términos de búsqueda o filtros</p>
      </div>
    `;
    return;
  }

  configs.forEach(config => {
    const card = document.createElement('div');
    card.className = 'config-card';
    card.dataset.configId = config.id;
    
    const averageRating = config.reviews.length > 0 
      ? config.reviews.reduce((acc, rev) => acc + rev.rating, 0) / config.reviews.length 
      : config.rating;

    card.innerHTML = `
      <h3>${config.name}</h3>
      <span class="version-badge">v${config.version}</span>
      <div class="category-badge">${config.category}</div>
      <p>${config.description}</p>
      <div class="stats">
        <div class="downloads">
          <i class="fas fa-download"></i>
          <span>${config.downloads}</span>
        </div>
        <div class="rating">
          <i class="fas fa-star"></i>
          <span>${averageRating.toFixed(1)}</span>
        </div>
        <div class="mc-version">
          <i class="fas fa-cube"></i>
          <span>${config.mcVersion}</span>
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
    
    container.appendChild(card);
  });
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', renderPopularConfigs);
document.getElementById('versionFilter').addEventListener('change', renderPopularConfigs);
document.getElementById('categoryFilter').addEventListener('change', renderPopularConfigs);
document.getElementById('sortBy').addEventListener('change', renderPopularConfigs);

// Inicialización
document.addEventListener('DOMContentLoaded', renderPopularConfigs);