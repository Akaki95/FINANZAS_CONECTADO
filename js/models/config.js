// Modelo de Configuración - Gestiona la configuración de formularios
const ConfigModel = {
  STORAGE_KEY: 'finanzas_config',
  API_BASE: 'http://localhost:3000/api',

  // Configuración por defecto para cada módulo
  DEFAULT_CONFIG: {
    gastos: {
      campos: [
        { id: 'fecha', nombre: 'Fecha', tipo: 'date', obligatorio: true, sistema: true, orden: 1 },
        { id: 'monto', nombre: 'Monto (€)', tipo: 'number', obligatorio: true, sistema: true, orden: 2, step: '0.01', min: '0.01' },
        { 
          id: 'categoria', 
          nombre: 'Categoría', 
          tipo: 'select', 
          obligatorio: true, 
          sistema: false, 
          orden: 3,
          opciones: [
            { valor: 'Comida', etiqueta: '🍽️ Comida', icono: '🍽️' },
            { valor: 'Transporte', etiqueta: '🚗 Transporte', icono: '🚗' },
            { valor: 'Ocio', etiqueta: '🎮 Ocio', icono: '🎮' },
            { valor: 'Salud', etiqueta: '💊 Salud', icono: '💊' },
            { valor: 'Educación', etiqueta: '📚 Educación', icono: '📚' },
            { valor: 'Vivienda', etiqueta: '🏠 Vivienda', icono: '🏠' },
            { valor: 'Servicios', etiqueta: '💡 Servicios', icono: '💡' },
            { valor: 'Pago Deuda', etiqueta: '💳 Pago Deuda', icono: '💳' },
            { valor: 'Préstamo', etiqueta: '💸 Préstamo', icono: '💸' },
            { valor: 'Otros', etiqueta: '📦 Otros', icono: '📦' }
          ]
        },
        { id: 'descripcion', nombre: 'Descripción', tipo: 'textarea', obligatorio: false, sistema: false, orden: 4, rows: 3 }
      ]
    },
    ingresos: {
      campos: [
        { id: 'fecha', nombre: 'Fecha', tipo: 'date', obligatorio: true, sistema: true, orden: 1 },
        { id: 'monto', nombre: 'Monto (€)', tipo: 'number', obligatorio: true, sistema: true, orden: 2, step: '0.01', min: '0.01' },
        { 
          id: 'tipo', 
          nombre: 'Tipo', 
          tipo: 'select', 
          obligatorio: true, 
          sistema: false, 
          orden: 3,
          opciones: [
            { valor: 'Salario', etiqueta: '💼 Salario', icono: '💼' },
            { valor: 'Freelance', etiqueta: '💻 Freelance', icono: '💻' },
            { valor: 'Venta', etiqueta: '🏷️ Venta', icono: '🏷️' },
            { valor: 'Regalo', etiqueta: '🎁 Regalo', icono: '🎁' },
            { valor: 'Inversión', etiqueta: '📈 Inversión', icono: '📈' },
            { valor: 'Deuda', etiqueta: '💳 Deuda', icono: '💳' },
            { valor: 'Cobro Préstamo', etiqueta: '💸 Cobro Préstamo', icono: '💸' },
            { valor: 'Otros', etiqueta: '📦 Otros', icono: '📦' }
          ]
        },
        { id: 'descripcion', nombre: 'Descripción', tipo: 'textarea', obligatorio: false, sistema: false, orden: 4, rows: 3 }
      ]
    },
    deudas: {
      campos: [
        { id: 'acreedor', nombre: 'Acreedor', tipo: 'text', obligatorio: true, sistema: true, orden: 1 },
        { id: 'montoInicial', nombre: 'Monto Inicial (€)', tipo: 'number', obligatorio: true, sistema: true, orden: 2, step: '0.01', min: '0.01' },
        { id: 'montoPendiente', nombre: 'Monto Pendiente (€)', tipo: 'number', obligatorio: true, sistema: true, orden: 3, step: '0.01', min: '0' },
        { id: 'fechaInicio', nombre: 'Fecha Inicio', tipo: 'date', obligatorio: true, sistema: true, orden: 4 },
        { id: 'fechaVencimiento', nombre: 'Fecha Vencimiento', tipo: 'date', obligatorio: false, sistema: false, orden: 5 },
        { id: 'descripcion', nombre: 'Descripción', tipo: 'textarea', obligatorio: false, sistema: false, orden: 6, rows: 3 }
      ]
    },
    prestamos: {
      campos: [
        { id: 'persona', nombre: 'Persona', tipo: 'text', obligatorio: true, sistema: true, orden: 1 },
        { id: 'montoInicial', nombre: 'Monto Inicial (€)', tipo: 'number', obligatorio: true, sistema: true, orden: 2, step: '0.01', min: '0.01' },
        { id: 'montoPendiente', nombre: 'Monto Pendiente (€)', tipo: 'number', obligatorio: true, sistema: true, orden: 3, step: '0.01', min: '0' },
        { id: 'fechaPrestamo', nombre: 'Fecha Préstamo', tipo: 'date', obligatorio: true, sistema: true, orden: 4 },
        { id: 'fechaDevolucion', nombre: 'Fecha Devolución', tipo: 'date', obligatorio: false, sistema: false, orden: 5 },
        { id: 'descripcion', nombre: 'Descripción', tipo: 'textarea', obligatorio: false, sistema: false, orden: 6, rows: 3 }
      ]
    },
    patrimonio_activos: {
      campos: [
        { id: 'nombre', nombre: 'Nombre', tipo: 'text', obligatorio: true, sistema: true, orden: 1 },
        { id: 'valor', nombre: 'Valor (€)', tipo: 'number', obligatorio: true, sistema: true, orden: 2, step: '0.01', min: '0.01' },
        { id: 'descripcion', nombre: 'Descripción', tipo: 'textarea', obligatorio: false, sistema: false, orden: 3, rows: 2 }
      ]
    },
    patrimonio_pasivos: {
      campos: [
        { id: 'nombre', nombre: 'Nombre', tipo: 'text', obligatorio: true, sistema: true, orden: 1 },
        { id: 'valor', nombre: 'Valor (€)', tipo: 'number', obligatorio: true, sistema: true, orden: 2, step: '0.01', min: '0.01' },
        { id: 'descripcion', nombre: 'Descripción', tipo: 'textarea', obligatorio: false, sistema: false, orden: 3, rows: 2 }
      ]
    }
  },

  // Biblioteca de iconos disponibles
  ICONOS: {
    finanzas: ['💰', '💵', '💴', '💶', '💷', '💳', '💸', '🏦', '📊', '📈', '📉', '💹'],
    comida: ['🍽️', '🍕', '🍔', '🍟', '🌮', '🌯', '🥗', '🍱', '🍜', '🍝', '🍞', '🥐', '🍰', '☕', '🍺'],
    transporte: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛵', '🚲', '🚂', '✈️', '🚁', '⛵'],
    vivienda: ['🏠', '🏡', '🏢', '🏬', '🏭', '🏗️', '🏘️', '🏚️', '🔑', '🚪', '🛋️', '🛏️'],
    trabajo: ['💼', '💻', '⌨️', '🖥️', '📱', '📞', '📠', '📊', '📈', '📉', '🖨️', '🗂️'],
    ocio: ['🎮', '🎯', '🎲', '🎰', '🎪', '🎨', '🎬', '🎭', '🎤', '🎧', '🎵', '🎸', '🎹', '🎺', '🎻'],
    salud: ['💊', '💉', '🩺', '🩹', '🩼', '⚕️', '🏥', '🚑', '😷', '🧘'],
    educacion: ['📚', '📖', '📝', '✏️', '🖊️', '📓', '📔', '📕', '📗', '📘', '📙', '🎓', '🏫'],
    otros: [
      // ...iconos anteriores...
      '📦', '🎁', '🛍️', '🛒', '📌', '📍', '🔖', '🏷️', '💡', '🔧', '🔨', '⚙️', '🧰',
      // ...otros iconos...
      // Animales
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊',
      '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴',
      '🐿️', '🦔', '🐾', '🐉', '🐲', '🌵', '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🍀', '🎋', '🎍', '🪴',
      // Ropa y calzado
      '👕', '👔', '👚', '👗', '👙', '👘', '🥻', '🩱', '🩲', '🩳', '👖', '👠', '👡', '👢', '👞', '👟', '🥾', '🥿', '🧦', '🧤', '🧣', '🧥', '🧢',
      // ...puedes seguir agregando más si lo deseas...
    ]
  },

  // Inicializar configuración
  async init() {
    let config = this.getLocalConfig();
    if (!config) {
      // Intentar cargar desde MongoDB
      Logger.log('No hay configuración local, cargando desde MongoDB...');
      try {
        await this.loadFromAtlas();
        config = this.getLocalConfig();
      } catch (error) {
        Logger.warn('No se pudo cargar desde MongoDB, usando configuración por defecto');
      }
      
      // Si aún no hay config, usar la por defecto
      if (!config) {
        this.saveLocalConfig(this.DEFAULT_CONFIG);
        Logger.log('Usando configuración por defecto');
      }
    }
    Logger.log('ConfigModel inicializado');
  },

  // Obtener configuración local completa
  getLocalConfig() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      Logger.error('Error obteniendo configuración local', error);
      return null;
    }
  },

  // Guardar configuración local completa
  saveLocalConfig(config) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(config));
      Logger.log('Configuración guardada localmente');
    } catch (error) {
      Logger.error('Error guardando configuración local', error);
    }
  },

  // Obtener configuración de un módulo específico
  getModuleConfig(modulo) {
    const config = this.getLocalConfig() || this.DEFAULT_CONFIG;
    return config[modulo] || this.DEFAULT_CONFIG[modulo];
  },

  // Guardar configuración de un módulo específico
  saveModuleConfig(modulo, moduleConfig) {
    const config = this.getLocalConfig() || this.DEFAULT_CONFIG;
    config[modulo] = moduleConfig;
    this.saveLocalConfig(config);
    
    // Sincronizar con Atlas
    this.syncToAtlas(modulo, moduleConfig);
  },

  // Sincronizar configuración con Atlas
  async syncToAtlas(modulo, moduleConfig) {
    try {
      const response = await fetch(`${this.API_BASE}/configuracion/${modulo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          modulo: modulo,
          campos: moduleConfig.campos,
          fechaModificacion: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Error sincronizando con Atlas');
      }

      Logger.success(`Configuración de ${modulo} sincronizada con Atlas`);
    } catch (error) {
      Logger.error(`Error sincronizando ${modulo} con Atlas`, error);
    }
  },

  // Cargar configuración desde Atlas
  async loadFromAtlas(modulo = null) {
    try {
      const url = modulo 
        ? `${this.API_BASE}/configuracion/${modulo}`
        : `${this.API_BASE}/configuracion`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Error cargando configuración desde Atlas');
      }

      const data = await response.json();
      
      if (modulo) {
        // Cargar un módulo específico
        const config = this.getLocalConfig() || this.DEFAULT_CONFIG;
        config[modulo] = { campos: data.campos };
        this.saveLocalConfig(config);
        Logger.success(`Configuración de ${modulo} cargada desde Atlas`);
      } else {
        // Cargar todas las configuraciones
        const config = {};
        data.forEach(item => {
          config[item.modulo] = { campos: item.campos };
        });
        this.saveLocalConfig(config);
        Logger.success('Configuraciones cargadas desde Atlas');
      }

      return data;
    } catch (error) {
      Logger.error('Error cargando desde Atlas', error);
      // Si falla, usar configuración local o por defecto
      return modulo ? this.getModuleConfig(modulo) : this.getLocalConfig();
    }
  },

  // Añadir campo personalizado a un módulo
  addCustomField(modulo, campo) {
    const config = this.getModuleConfig(modulo);
    
    // Generar ID único para el campo
    campo.id = campo.id || `custom_${Date.now()}`;
    campo.sistema = false;
    campo.orden = config.campos.length + 1;
    
    config.campos.push(campo);
    this.saveModuleConfig(modulo, config);
    
    return campo;
  },

  // Actualizar campo existente
  updateField(modulo, campoId, campoData) {
    const config = this.getModuleConfig(modulo);
    const index = config.campos.findIndex(c => c.id === campoId);
    
    if (index !== -1) {
      // No permitir modificar campos del sistema
      if (config.campos[index].sistema) {
        throw new Error('No se puede modificar un campo del sistema');
      }
      
      config.campos[index] = { ...config.campos[index], ...campoData };
      this.saveModuleConfig(modulo, config);
      return config.campos[index];
    }
    
    throw new Error('Campo no encontrado');
  },

  // Eliminar campo personalizado
  deleteField(modulo, campoId) {
    const config = this.getModuleConfig(modulo);
    const campo = config.campos.find(c => c.id === campoId);
    
    if (!campo) {
      throw new Error('Campo no encontrado');
    }
    
    if (campo.sistema) {
      throw new Error('No se puede eliminar un campo del sistema');
    }
    
    config.campos = config.campos.filter(c => c.id !== campoId);
    this.saveModuleConfig(modulo, config);
  },

  // Reordenar campos
  reorderFields(modulo, camposOrdenados) {
    const config = this.getModuleConfig(modulo);
    config.campos = camposOrdenados.map((campo, index) => ({
      ...campo,
      orden: index + 1
    }));
    this.saveModuleConfig(modulo, config);
  },

  // Añadir opción a un campo select
  addSelectOption(modulo, campoId, opcion) {
    const config = this.getModuleConfig(modulo);
    const campo = config.campos.find(c => c.id === campoId);
    
    if (!campo || campo.tipo !== 'select') {
      throw new Error('Campo no encontrado o no es de tipo select');
    }
    
    if (!campo.opciones) {
      campo.opciones = [];
    }
    
    campo.opciones.push(opcion);
    this.saveModuleConfig(modulo, config);
  },

  // Eliminar opción de un campo select
  deleteSelectOption(modulo, campoId, valorOpcion) {
    const config = this.getModuleConfig(modulo);
    const campo = config.campos.find(c => c.id === campoId);
    
    if (!campo || campo.tipo !== 'select') {
      throw new Error('Campo no encontrado o no es de tipo select');
    }
    
    campo.opciones = campo.opciones.filter(o => o.valor !== valorOpcion);
    this.saveModuleConfig(modulo, config);
  },

  // Restablecer configuración por defecto
  resetToDefault(modulo = null) {
    if (modulo) {
      this.saveModuleConfig(modulo, this.DEFAULT_CONFIG[modulo]);
    } else {
      this.saveLocalConfig(this.DEFAULT_CONFIG);
      // Sincronizar todos con Atlas
      Object.keys(this.DEFAULT_CONFIG).forEach(mod => {
        this.syncToAtlas(mod, this.DEFAULT_CONFIG[mod]);
      });
    }
  }
};

window.ConfigModel = ConfigModel;
Logger.log('ConfigModel cargado');
