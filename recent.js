// Configuraciones recientes (simuladas)
const recentConfigs = [
  {
    id: 5,
    name: "AuthMe",
    version: "5.6.0",
    description: "Nueva configuración optimizada de AuthMe con sistema de registro personalizado.",
    downloadUrl: "https://example.com/downloads/authme-config.zip",
    downloads: 45,
    date: new Date('2023-10-15'),
    reviews: []
  },
  {
    id: 6,
    name: "PlotSquared",
    version: "6.1.4",
    description: "Configuración actualizada para sistemas de plots con nuevas características.",
    downloadUrl: "https://example.com/downloads/plotsquared-config.zip",
    downloads: 78,
    date: new Date('2023-10-10'),
    reviews: []
  },
  {
    id: 7,
    name: "VaultAPI",
    version: "1.7.1",
    description: "Configuración optimizada para economía y permisos con Vault.",
    downloadUrl: "https://example.com/downloads/vault-config.zip",
    downloads: 120,
    date: new Date('2023-09-28'),
    reviews: []
  }
];

// Función para filtrar configuraciones
function filterConfigs(filter) {
  const today = new Date();
  const oneWeekAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
  const oneMonthAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

  return recentConfigs.filter(config => {
    switch(filter) {
      case 'week':
        return config.date >= oneWeekAgo;
      case 'month':
        return config.date >= oneMonthAgo;
      default:
        return true;
    }
  });
}

// Función para renderizar configuraciones
function renderConfigs(configs) {
  const container = document.getElementById('recentConfigsContainer');
  container.innerHTML = '';

  configs.forEach(config => {
    const card = document.createElement('div');
    card.className = 'config-card';
    card.dataset.configId = config.id;
    
    const dateStr = config.date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    card.innerHTML = `
      <h3>${config.name}</h3>
      <span class="version-badge">v${config.version}</span>
      <p>${config.description}</p>
      <div class="stats">
        <div class="downloads">
          <i class="fas fa-download"></i>
          <span>${config.downloads}</span>
        </div>
        <div class="date">
          <i class="fas fa-calendar"></i>
          <span>${dateStr}</span>
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

// Event listeners para los filtros
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    
    const filter = e.target.dataset.filter;
    const filteredConfigs = filterConfigs(filter);
    renderConfigs(filteredConfigs);
  });
});

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  renderConfigs(recentConfigs);
});