// Modelo de Patrimonio (Activos y Pasivos)
const PatrimonioModel = {
  activosCollection: 'activos',
  pasivosCollection: 'pasivos',
  
  // ===== ACTIVOS =====
  
  // Obtener todos los activos
  getAllActivos() {
    const activos = CacheService.get(this.activosCollection) || [];
    Logger.log(`${activos.length} activos cargados`);
    return activos;
  },
  
  // Obtener activo por ID
  getActivoById(id) {
    const activos = this.getAllActivos();
    return activos.find(a => a.id === id);
  },
  
  // Crear nuevo activo
  createActivo(activoData) {
    // Validar datos
    const validation = ValidationService.validarPatrimonio(activoData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    
    // Crear activo
    const activo = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      nombre: ValidationService.sanitizarTexto(activoData.nombre),
      valor: ValidationService.formatearMonto(activoData.valor),
      descripcion: ValidationService.sanitizarTexto(activoData.descripcion || ''),
      createdAt: new Date().toISOString()
    };
    
    // Guardar en caché
    const activos = this.getAllActivos();
    activos.push(activo);
    CacheService.set(this.activosCollection, activos);
    
    // Agregar a cola de sincronización
    SyncService.addToQueue({
      collection: this.activosCollection,
      action: 'create',
      data: activo
    });
    
    Logger.success('Activo creado', activo);
    return activo;
  },
  
  // Actualizar activo
  updateActivo(id, activoData) {
    // Validar datos
    const validation = ValidationService.validarPatrimonio(activoData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    
    const activos = this.getAllActivos();
    const index = activos.findIndex(a => a.id === id);
    
    if (index === -1) {
      throw new Error('Activo no encontrado');
    }
    
    // Actualizar activo
    activos[index] = {
      ...activos[index],
      nombre: ValidationService.sanitizarTexto(activoData.nombre),
      valor: ValidationService.formatearMonto(activoData.valor),
      descripcion: ValidationService.sanitizarTexto(activoData.descripcion || ''),
      updatedAt: new Date().toISOString()
    };
    
    CacheService.set(this.activosCollection, activos);
    
    // Agregar a cola de sincronización
    SyncService.addToQueue({
      collection: this.activosCollection,
      action: 'update',
      id: id,
      data: activos[index]
    });
    
    Logger.success('Activo actualizado', activos[index]);
    return activos[index];
  },
  
  // Eliminar activo
  deleteActivo(id) {
    const activos = this.getAllActivos();
    const index = activos.findIndex(a => a.id === id);
    
    if (index === -1) {
      throw new Error('Activo no encontrado');
    }
    
    const deleted = activos.splice(index, 1)[0];
    CacheService.set(this.activosCollection, activos);
    
    // Agregar a cola de sincronización
    SyncService.addToQueue({
      collection: this.activosCollection,
      action: 'delete',
      id: id
    });
    
    Logger.success('Activo eliminado', deleted);
    return deleted;
  },
  
  // ===== PASIVOS =====
  
  // Obtener todos los pasivos
  getAllPasivos() {
    const pasivos = CacheService.get(this.pasivosCollection) || [];
    Logger.log(`${pasivos.length} pasivos cargados`);
    return pasivos;
  },
  
  // Obtener pasivo por ID
  getPasivoById(id) {
    const pasivos = this.getAllPasivos();
    return pasivos.find(p => p.id === id);
  },
  
  // Crear nuevo pasivo
  createPasivo(pasivoData) {
    // Validar datos
    const validation = ValidationService.validarPatrimonio(pasivoData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    
    // Crear pasivo
    const pasivo = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      nombre: ValidationService.sanitizarTexto(pasivoData.nombre),
      valor: ValidationService.formatearMonto(pasivoData.valor),
      descripcion: ValidationService.sanitizarTexto(pasivoData.descripcion || ''),
      createdAt: new Date().toISOString()
    };
    
    // Guardar en caché
    const pasivos = this.getAllPasivos();
    pasivos.push(pasivo);
    CacheService.set(this.pasivosCollection, pasivos);
    
    // Agregar a cola de sincronización
    SyncService.addToQueue({
      collection: this.pasivosCollection,
      action: 'create',
      data: pasivo
    });
    
    Logger.success('Pasivo creado', pasivo);
    return pasivo;
  },
  
  // Actualizar pasivo
  updatePasivo(id, pasivoData) {
    // Validar datos
    const validation = ValidationService.validarPatrimonio(pasivoData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    
    const pasivos = this.getAllPasivos();
    const index = pasivos.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Pasivo no encontrado');
    }
    
    // Actualizar pasivo
    pasivos[index] = {
      ...pasivos[index],
      nombre: ValidationService.sanitizarTexto(pasivoData.nombre),
      valor: ValidationService.formatearMonto(pasivoData.valor),
      descripcion: ValidationService.sanitizarTexto(pasivoData.descripcion || ''),
      updatedAt: new Date().toISOString()
    };
    
    CacheService.set(this.pasivosCollection, pasivos);
    
    // Agregar a cola de sincronización
    SyncService.addToQueue({
      collection: this.pasivosCollection,
      action: 'update',
      id: id,
      data: pasivos[index]
    });
    
    Logger.success('Pasivo actualizado', pasivos[index]);
    return pasivos[index];
  },
  
  // Eliminar pasivo
  deletePasivo(id) {
    const pasivos = this.getAllPasivos();
    const index = pasivos.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Pasivo no encontrado');
    }
    
    const deleted = pasivos.splice(index, 1)[0];
    CacheService.set(this.pasivosCollection, pasivos);
    
    // Agregar a cola de sincronización
    SyncService.addToQueue({
      collection: this.pasivosCollection,
      action: 'delete',
      id: id
    });
    
    Logger.success('Pasivo eliminado', deleted);
    return deleted;
  },
  
  // ===== CÁLCULOS =====
  
  // Calcular total de activos
  getTotalActivos() {
    const activos = this.getAllActivos();
    return activos.reduce((sum, a) => sum + a.valor, 0);
  },
  
  // Calcular total de pasivos (incluyendo deudas)
  getTotalPasivos() {
    const pasivos = this.getAllPasivos();
    const totalPasivos = pasivos.reduce((sum, p) => sum + p.valor, 0);
    
    // Agregar deudas pendientes
    const totalDeudas = DeudaModel.getTotalPendiente();
    
    return totalPasivos + totalDeudas;
  },
  
  // Calcular patrimonio neto
  getPatrimonioNeto() {
    const totalActivos = this.getTotalActivos();
    const totalPasivos = this.getTotalPasivos();
    return totalActivos - totalPasivos;
  },
  
  // Obtener resumen completo
  getResumen() {
    return {
      activos: this.getTotalActivos(),
      pasivos: this.getTotalPasivos(),
      patrimonioNeto: this.getPatrimonioNeto()
    };
  }
};

window.PatrimonioModel = PatrimonioModel;
Logger.log('PatrimonioModel inicializado');
