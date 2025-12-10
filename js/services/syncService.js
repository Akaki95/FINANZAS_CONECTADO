// Sync Service - Gestión de sincronización con backend Node.js
const SyncService = {
  // Switch automático entre local y producción
  apiBaseUrl: (window.location.hostname === 'localhost')
    ? 'http://localhost:3000/api'
    : 'https://finanzas-conectado.onrender.com/api',
  isOnline: navigator.onLine,
  syncQueue: [],
  syncInterval: null,
  statusElement: null,
  
  // Inicializar el servicio de sincronización
  init() {
    this.statusElement = document.getElementById('sync-status');
    this.checkBackendConnection();
    
    // Escuchar eventos de conexión
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
    
    // Cargar cola de sincronización pendiente
    this.loadSyncQueue();
    
    // Iniciar sincronización automática cada 30 segundos
    this.startAutoSync();
    
    Logger.log('SyncService inicializado con backend Node.js');
  },
  
  // Verificar conexión con backend
  async checkBackendConnection() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 segundos timeout
      
      const response = await fetch(this.apiBaseUrl.replace('/api', ''), {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        this.isOnline = true;
        Logger.success('Backend conectado correctamente');
      } else {
        this.isOnline = false;
        Logger.warn('Backend no responde correctamente');
      }
    } catch (error) {
      this.isOnline = false;
      if (error.name === 'AbortError') {
        Logger.warn('Backend no disponible (timeout) - usando modo offline');
      } else {
        Logger.warn('Backend no disponible - usando modo offline');
      }
    }
    this.updateStatus();
  },
  
  // Manejar estado online
  handleOnline() {
    this.checkBackendConnection();
    Logger.success('Conexión restaurada');
    this.processSyncQueue();
  },
  
  // Manejar estado offline
  handleOffline() {
    this.isOnline = false;
    this.updateStatus();
    Logger.warn('Sin conexión a internet');
  },
  
  // Actualizar indicador visual de estado
  updateStatus() {
    if (!this.statusElement) return;
    
    const indicator = this.statusElement.querySelector('.sync-indicator');
    const text = this.statusElement.querySelector('.sync-text');
    
    if (this.isOnline) {
      indicator.className = 'sync-indicator';
      text.textContent = 'Sincronizado';
    } else {
      indicator.className = 'sync-indicator offline';
      text.textContent = 'Sin conexión';
    }
  },
  
  // Agregar operación a la cola de sincronización
  addToQueue(operation) {
    this.syncQueue.push({
      id: Date.now() + Math.random(),
      operation: operation,
      timestamp: Date.now(),
      retries: 0
    });
    this.saveSyncQueue();
    Logger.log('Operación agregada a cola de sincronización', operation);
    
    // Intentar sincronizar inmediatamente si hay conexión
    if (this.isOnline) {
      this.processSyncQueue();
    }
  },
  
  // Procesar cola de sincronización
  async processSyncQueue() {
    if (this.syncQueue.length === 0) return;
    if (!this.isOnline) return;
    
    Logger.log(`Procesando cola de sincronización (${this.syncQueue.length} operaciones)`);
    
    const indicator = this.statusElement?.querySelector('.sync-indicator');
    const text = this.statusElement?.querySelector('.sync-text');
    
    if (indicator) indicator.className = 'sync-indicator syncing';
    if (text) text.textContent = 'Sincronizando...';
    
    const queue = [...this.syncQueue];
    this.syncQueue = [];
    
    for (const item of queue) {
      try {
        await this.executeOperation(item.operation);
        Logger.success('Operación sincronizada', item.operation);
      } catch (error) {
        Logger.error('Error sincronizando operación', error);
        
        // Reintentar hasta 3 veces
        if (item.retries < 3) {
          item.retries++;
          this.syncQueue.push(item);
        } else {
          Logger.error('Operación descartada después de 3 intentos', item.operation);
        }
      }
    }
    
    this.saveSyncQueue();
    this.updateStatus();
  },
  
  // Ejecutar operación de sincronización
  async executeOperation(operation) {
    const { collection, action, data, id } = operation;
    
    try {
      switch (action) {
        case 'create':
          return await this.insertOne(collection, data);
        case 'update':
          return await this.updateOne(collection, id, data);
        case 'delete':
          return await this.deleteOne(collection, id);
        default:
          Logger.error('Acción desconocida', action);
          return false;
      }
    } catch (error) {
      Logger.error('Error ejecutando operación', error);
      throw error;
    }
  },
  
  // Insertar un documento
  async insertOne(collection, document) {
    let url = `${this.apiBaseUrl}/${collection}`;
    if (collection === 'activos' || collection === 'pasivos') {
      url = `${this.apiBaseUrl}/patrimonio/${collection}`;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(document)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error insertando documento: ${error.error || response.statusText}`);
    }

    const result = await response.json();
    Logger.success(`Documento insertado en ${collection}`);
    return result;
  },
  
  // Buscar documentos
  async find(collection) {
    const url = `${this.apiBaseUrl}/${collection}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error buscando documentos: ${error.error || response.statusText}`);
    }

    const result = await response.json();
    return result.data || [];
  },
  
  // Actualizar un documento
  async updateOne(collection, id, updateData) {
    let url = `${this.apiBaseUrl}/${collection}/${id}`;
    if (collection === 'activos' || collection === 'pasivos') {
      url = `${this.apiBaseUrl}/patrimonio/${collection}/${id}`;
    }
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error actualizando documento: ${error.error || response.statusText}`);
    }

    const result = await response.json();
    Logger.success(`Documento actualizado en ${collection}`);
    return result;
  },
  
  // Eliminar un documento
  async deleteOne(collection, id) {
    let url = `${this.apiBaseUrl}/${collection}/${id}`;
    if (collection === 'activos' || collection === 'pasivos') {
      url = `${this.apiBaseUrl}/patrimonio/${collection}/${id}`;
    }
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error eliminando documento: ${error.error || response.statusText}`);
    }

    const result = await response.json();
    Logger.success(`Documento eliminado de ${collection}`);
    return result;
  },
  
  // Cargar datos desde el backend
  async loadFromCloud(collection) {
    if (!this.isOnline) {
      Logger.warn('Backend no disponible, usando solo localStorage');
      return null;
    }

    try {
      // Manejar rutas especiales para patrimonio
      let url = `${this.apiBaseUrl}/${collection}`;
      if (collection === 'activos' || collection === 'pasivos') {
        url = `${this.apiBaseUrl}/patrimonio/${collection}`;
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error cargando ${collection}: ${response.status}`);
      }

      const result = await response.json();
      
      // Manejar ambos formatos: { data: [...] } o directamente [...]
      let documents;
      if (Array.isArray(result)) {
        documents = result;
      } else if (result.data && Array.isArray(result.data)) {
        documents = result.data;
      } else {
        documents = [];
      }
      
      Logger.success(`${documents.length} documentos cargados de ${collection} desde el backend`);
      return documents;
    } catch (error) {
      if (error.name === 'AbortError') {
        Logger.error(`Timeout cargando ${collection} desde el backend`);
      } else {
        Logger.error(`Error cargando ${collection} desde el backend: ${error.message}`);
      }
      return null;
    }
  },
  
  // Guardar cola en localStorage
  saveSyncQueue() {
    try {
      localStorage.setItem('sync_queue', JSON.stringify(this.syncQueue));
    } catch (error) {
      Logger.error('Error guardando cola de sincronización', error);
    }
  },
  
  // Cargar cola desde localStorage
  loadSyncQueue() {
    try {
      const saved = localStorage.getItem('sync_queue');
      if (saved) {
        this.syncQueue = JSON.parse(saved);
        Logger.log(`Cola de sincronización cargada (${this.syncQueue.length} operaciones)`);
      }
    } catch (error) {
      Logger.error('Error cargando cola de sincronización', error);
      this.syncQueue = [];
    }
  },
  
  // Iniciar sincronización automática
  startAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    this.syncInterval = setInterval(() => {
      if (this.isOnline && this.syncQueue.length > 0) {
        this.processSyncQueue();
      }
    }, 30000); // Cada 30 segundos
  },
  
  // Detener sincronización automática
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  },
  
  // Forzar sincronización inmediata
  forceSync() {
    if (this.isOnline) {
      this.processSyncQueue();
    } else {
      Logger.warn('No se puede sincronizar sin conexión');
    }
  },
  
  // Sincronizar colección completa al servidor (para configuraciones)
  async syncToServer(collection, data) {
    if (!this.isOnline) {
      Logger.warn('Backend no disponible, datos guardados solo localmente');
      return;
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/${collection}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Error sincronizando ${collection}`);
      }

      Logger.success(`${collection} sincronizado correctamente`);
    } catch (error) {
      Logger.error(`Error sincronizando ${collection}`, error);
    }
  }
};

// Exportar para uso global
window.SyncService = SyncService;
