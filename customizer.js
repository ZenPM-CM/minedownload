// Definiciones de configuración por plugin
const pluginConfigs = {
  essentials: {
    sections: [
      {
        name: "General",
        fields: [
          {
            type: "text",
            name: "serverName",
            label: "Nombre del Servidor",
            default: "Mi Servidor"
          },
          {
            type: "color",
            name: "primaryColor",
            label: "Color Principal",
            default: "#2563eb"
          },
          {
            type: "checkbox",
            name: "enableWelcome",
            label: "Activar Mensaje de Bienvenida",
            default: true
          }
        ]
      },
      {
        name: "Economía",
        fields: [
          {
            type: "text",
            name: "currencySymbol",
            label: "Símbolo de Moneda",
            default: "$"
          },
          {
            type: "number",
            name: "startingBalance",
            label: "Balance Inicial",
            default: 100
          }
        ]
      },
      {
        name: "Comandos",
        fields: [
          {
            type: "checkbox",
            name: "enableHomeCommand",
            label: "Activar Comando /home",
            default: true
          },
          {
            type: "number",
            name: "maxHomes",
            label: "Máximo de Homes",
            default: 3
          }
        ]
      }
    ]
  },
  worldguard: {
    sections: [
      {
        name: "Protecciones",
        fields: [
          {
            type: "checkbox",
            name: "pvp",
            label: "Permitir PvP",
            default: false
          },
          {
            type: "checkbox",
            name: "fireSpread",
            label: "Propagación del Fuego",
            default: false
          },
          {
            type: "checkbox",
            name: "mobSpawning",
            label: "Generación de Mobs",
            default: true
          }
        ]
      },
      {
        name: "Regiones",
        fields: [
          {
            type: "number",
            name: "maxRegionSize",
            label: "Tamaño Máximo de Región",
            default: 1000
          },
          {
            type: "number",
            name: "maxRegionCount",
            label: "Máximo de Regiones por Usuario",
            default: 10
          }
        ]
      }
    ]
  },
  luckperms: {
    sections: [
      {
        name: "Grupos",
        fields: [
          {
            type: "text",
            name: "defaultGroup",
            label: "Grupo por Defecto",
            default: "default"
          },
          {
            type: "text",
            name: "adminGroup",
            label: "Grupo de Administradores",
            default: "admin"
          }
        ]
      },
      {
        name: "Permisos",
        fields: [
          {
            type: "checkbox",
            name: "inheritPermissions",
            label: "Herencia de Permisos",
            default: true
          },
          {
            type: "number",
            name: "permissionExpiry",
            label: "Expiración de Permisos (días)",
            default: 30
          }
        ]
      }
    ]
  }
};

// Estado actual de la configuración
let currentConfig = {};

// Función para generar el panel de configuración
function generateConfigPanel(pluginId) {
  const config = pluginConfigs[pluginId];
  const panel = document.getElementById('configPanel');
  panel.innerHTML = '';

  config.sections.forEach(section => {
    const sectionEl = document.createElement('div');
    sectionEl.className = 'config-section';
    sectionEl.innerHTML = `<h3>${section.name}</h3>`;

    section.fields.forEach(field => {
      const fieldEl = document.createElement('div');
      fieldEl.className = 'config-field';
      
      switch(field.type) {
        case 'text':
          fieldEl.innerHTML = `
            <label for="${field.name}">${field.label}</label>
            <input type="text" id="${field.name}" value="${field.default}">
          `;
          break;
        case 'number':
          fieldEl.innerHTML = `
            <label for="${field.name}">${field.label}</label>
            <input type="number" id="${field.name}" value="${field.default}">
          `;
          break;
        case 'checkbox':
          fieldEl.innerHTML = `
            <label>
              <input type="checkbox" id="${field.name}" ${field.default ? 'checked' : ''}>
              ${field.label}
            </label>
          `;
          break;
        case 'color':
          fieldEl.innerHTML = `
            <label for="${field.name}">${field.label}</label>
            <div class="color-picker">
              <input type="color" id="${field.name}" value="${field.default}">
              <div class="color-preview" style="background-color: ${field.default}"></div>
            </div>
          `;
          break;
      }

      sectionEl.appendChild(fieldEl);

      // Agregar event listener para actualizar la vista previa
      const input = fieldEl.querySelector('input');
      input.addEventListener('change', () => {
        updatePreview(pluginId);
      });
    });

    panel.appendChild(sectionEl);
  });

  // Activar el botón de descarga
  document.getElementById('downloadConfig').disabled = false;
  
  // Generar vista previa inicial
  updatePreview(pluginId);
}

// Función para actualizar la vista previa
function updatePreview(pluginId) {
  const config = pluginConfigs[pluginId];
  const previewData = {};

  config.sections.forEach(section => {
    previewData[section.name.toLowerCase()] = {};
    section.fields.forEach(field => {
      const input = document.getElementById(field.name);
      let value;
      
      switch(field.type) {
        case 'checkbox':
          value = input.checked;
          break;
        case 'number':
          value = parseFloat(input.value);
          break;
        default:
          value = input.value;
      }
      
      previewData[section.name.toLowerCase()][field.name] = value;
    });
  });

  // Actualizar la vista previa
  document.getElementById('configPreview').innerHTML = 
    `# Configuración de ${pluginId}\n\n${YAML.stringify(previewData, 4)}`;
  
  currentConfig = previewData;
}

// Simple YAML stringifier
const YAML = {
  stringify: (obj, indent = 0) => {
    let result = '';
    const spaces = ' '.repeat(indent);
    
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        result += `${spaces}${key}:\n${YAML.stringify(value, indent + 2)}`;
      } else {
        result += `${spaces}${key}: ${value}\n`;
      }
    });
    
    return result;
  }
};

// Event listener para el selector de plugins
document.getElementById('pluginSelect').addEventListener('change', (e) => {
  const pluginId = e.target.value;
  if (pluginId) {
    generateConfigPanel(pluginId);
  } else {
    document.getElementById('configPanel').innerHTML = '';
    document.getElementById('configPreview').innerHTML = 'Selecciona un plugin para comenzar...';
    document.getElementById('downloadConfig').disabled = true;
  }
});

// Event listener para el botón de descarga
document.getElementById('downloadConfig').addEventListener('click', () => {
  const pluginId = document.getElementById('pluginSelect').value;
  const configYaml = YAML.stringify(currentConfig);
  
  // Crear archivo de configuración
  const blob = new Blob([configYaml], { type: 'text/yaml' });
  const url = URL.createObjectURL(blob);
  
  // Crear link de descarga
  const a = document.createElement('a');
  a.href = url;
  a.download = `${pluginId}-config.yml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});