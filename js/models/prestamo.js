// Modelo de Préstamo
const PrestamoModel = {
  collectionName: 'prestamos',
  
  // Obtener todos los préstamos
  getAll() {
    const prestamos = CacheService.get(this.collectionName) || [];
    Logger.log(`${prestamos.length} préstamos cargados`);
    return prestamos;
  },
  
  // Obtener préstamo por ID
  getById(id) {
    const prestamos = this.getAll();
    return prestamos.find(p => p.id === id);
  },
  
  // Crear nuevo préstamo
  create(prestamoData) {
    // Validar datos
    const validation = ValidationService.validarPrestamo(prestamoData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    
    const montoInicial = ValidationService.formatearMonto(prestamoData.montoInicial);
    
    // Crear préstamo
    const prestamo = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      persona: ValidationService.sanitizarTexto(prestamoData.persona),
      montoInicial: montoInicial,
      montoPendiente: prestamoData.montoPendiente !== undefined ? 
        ValidationService.formatearMonto(prestamoData.montoPendiente) : montoInicial,
      fechaPrestamo: prestamoData.fechaPrestamo,
      fechaDevolucion: prestamoData.fechaDevolucion || null,
      descripcion: ValidationService.sanitizarTexto(prestamoData.descripcion || ''),
      createdAt: new Date().toISOString()
    };
    
    // Guardar en caché
    const prestamos = this.getAll();
    prestamos.push(prestamo);
    CacheService.set(this.collectionName, prestamos);
    
    // Agregar a cola de sincronización
    SyncService.addToQueue({
      collection: this.collectionName,
      action: 'create',
      data: prestamo
    });
    
    // Crear gasto automático por el préstamo
    try {
      const gastoPrestamo = {
        fecha: prestamo.fechaPrestamo,
        monto: prestamo.montoInicial,
        categoria: 'Préstamo',
        descripcion: `Préstamo otorgado a ${prestamo.persona}${prestamo.descripcion ? ' - ' + prestamo.descripcion : ''}`
      };
      GastoModel.create(gastoPrestamo);
      Logger.success('Gasto automático creado por préstamo');
    } catch (error) {
      Logger.error('Error creando gasto automático por préstamo', error);
    }
    
    Logger.success('Préstamo creado', prestamo);
    return prestamo;
  },
  
  // Actualizar préstamo
  update(id, prestamoData) {
    // Validar datos
    const validation = ValidationService.validarPrestamo(prestamoData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    
    const prestamos = this.getAll();
    const index = prestamos.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Préstamo no encontrado');
    }
    
    // Actualizar préstamo
    prestamos[index] = {
      ...prestamos[index],
      persona: ValidationService.sanitizarTexto(prestamoData.persona),
      montoInicial: ValidationService.formatearMonto(prestamoData.montoInicial),
      montoPendiente: ValidationService.formatearMonto(prestamoData.montoPendiente),
      fechaPrestamo: prestamoData.fechaPrestamo,
      fechaDevolucion: prestamoData.fechaDevolucion || null,
      descripcion: ValidationService.sanitizarTexto(prestamoData.descripcion || ''),
      updatedAt: new Date().toISOString()
    };
    
    CacheService.set(this.collectionName, prestamos);
    
    // Agregar a cola de sincronización
    SyncService.addToQueue({
      collection: this.collectionName,
      action: 'update',
      id: id,
      data: prestamos[index]
    });
    
    Logger.success('Préstamo actualizado', prestamos[index]);
    return prestamos[index];
  },
  
  // Registrar pago recibido
  registrarPago(id, montoPago) {
    const prestamo = this.getById(id);
    if (!prestamo) {
      throw new Error('Préstamo no encontrado');
    }
    
    const nuevoPendiente = prestamo.montoPendiente - montoPago;
    if (nuevoPendiente < 0) {
      throw new Error('El pago no puede ser mayor que el monto pendiente');
    }
    
    const resultado = this.update(id, {
      ...prestamo,
      montoPendiente: nuevoPendiente
    });
    
    // Crear ingreso automático por el cobro del préstamo
    try {
      const ingresoCobro = {
        fecha: new Date().toISOString().split('T')[0],
        monto: montoPago,
        tipo: 'Cobro Préstamo',
        descripcion: `Cobro de préstamo a ${prestamo.persona}${prestamo.descripcion ? ' - ' + prestamo.descripcion : ''}`
      };
      IngresoModel.create(ingresoCobro);
      Logger.success('Ingreso automático creado por cobro de préstamo');
    } catch (error) {
      Logger.error('Error creando ingreso automático por cobro de préstamo', error);
    }
    
    return resultado;
  },
  
  // Eliminar préstamo
  delete(id) {
    const prestamos = this.getAll();
    const index = prestamos.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Préstamo no encontrado');
    }
    
    const deleted = prestamos.splice(index, 1)[0];
    CacheService.set(this.collectionName, prestamos);
    
    // Agregar a cola de sincronización
    SyncService.addToQueue({
      collection: this.collectionName,
      action: 'delete',
      id: id
    });
    
    Logger.success('Préstamo eliminado', deleted);
    return deleted;
  },
  
  // Obtener préstamos activos (con monto pendiente > 0)
  getActivos() {
    return this.getAll().filter(p => p.montoPendiente > 0);
  },
  
  // Obtener préstamos vencidos
  getVencidos() {
    const hoy = new Date();
    return this.getActivos().filter(p => {
      if (!p.fechaDevolucion) return false;
      return new Date(p.fechaDevolucion) < hoy;
    });
  },
  
  // Calcular total pendiente de cobro
  getTotalPendiente() {
    return this.getActivos().reduce((sum, p) => sum + p.montoPendiente, 0);
  },
  
  // Obtener historial de cobros de un préstamo
  getCobros(prestamoId) {
    const prestamo = this.getById(prestamoId);
    if (!prestamo) return [];
    
    // Buscar ingresos con tipo 'Cobro Préstamo' que mencionen la persona
    const ingresos = IngresoModel.getAll();
    return ingresos.filter(i => 
      i.tipo === 'Cobro Préstamo' && 
      i.descripcion && 
      i.descripcion.toLowerCase().includes(prestamo.persona.toLowerCase())
    ).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }
};

window.PrestamoModel = PrestamoModel;
Logger.log('PrestamoModel inicializado');
