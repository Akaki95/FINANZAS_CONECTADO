// Sync Service - Gestión de sincronización offline/online
const SyncService = {
  isOnline: navigator.onLine,
  syncQueue: [],
  syncInterval: null,
  statusElement: null,
  
  // Inicializar el servicio de sincronización
  init() {
    this.statusElement = document.getElementById('sync-status');
    this.updateStatus();
    
    // Escuchar eventos de conexión
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
    
    // Cargar cola de sincronización pendiente
    this.loadSyncQueue();
    
    // Iniciar sincronización automática cada 30 segundos
    this.startAutoSync();
    
    Logger.log('SyncService inicializado');
  },
  
  // Manejar estado online
  handleOnline() {
    this.isOnline = true;
    this.updateStatus();
    Logger.success('Conexión restaurada');
    
    // Intentar sincronizar cola pendiente
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
    // Simular latencia de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // En una implementación real, aquí se haría la llamada a MongoDB Atlas
    // Por ahora, solo registramos la operación
    Logger.log('Operación ejecutada (simulada)', operation);
    
    // TODO: Implementar llamadas reales a MongoDB Atlas API
    return true;
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
  }
};

// Exportar para uso global
window.SyncService = SyncService;
