// App Principal - Punto de entrada de la aplicación
(function() {
  'use strict';
  
  // Inicializar la aplicación
  function init() {
    Logger.log('Iniciando aplicación de Finanzas Personales...');
    
    // Inicializar servicios
    SyncService.init();
    
    // Registrar rutas
    Router.register('dashboard', () => {
      DashboardView.render();
    });
    
    Router.register('gastos', () => {
      GastosController.render();
    });
    
    Router.register('ingresos', () => {
      IngresosController.render();
    });
    
    Router.register('deudas', () => {
      DeudasController.render();
    });
    
    Router.register('prestamos', () => {
      PrestamosController.render();
    });
    
    Router.register('patrimonio', () => {
      PatrimonioController.render();
    });
    
    // Inicializar router
    Router.init();
    
    // Configurar modal
    setupModal();
    
    // Si quieres cargar datos de ejemplo, descomenta la siguiente línea:
    // cargarDatosDeEjemplo();
    
    Logger.success('Aplicación iniciada correctamente');
  }
  
  // Configurar modal
  function setupModal() {
    const modal = document.getElementById('modal');
    const closeBtn = modal.querySelector('.modal-close');
    
    // Cerrar modal al hacer clic en X
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
    });
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });
    
    // Cerrar modal con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        modal.classList.remove('show');
      }
    });
  }
  
  // Cargar datos de ejemplo si la aplicación está vacía
  function cargarDatosDeEjemplo() {
    // Solo cargar si no hay datos
    if (GastoModel.getAll().length > 0) {
      Logger.log('Ya existen datos, omitiendo datos de ejemplo');
      return;
    }
    
    Logger.log('Cargando datos de ejemplo...');
    
    try {
      // Datos de ejemplo para gastos
      const gastosEjemplo = [
        { fecha: '2025-12-01', monto: 45.50, categoria: 'Comida', descripcion: 'Supermercado semanal' },
        { fecha: '2025-12-03', monto: 30.00, categoria: 'Transporte', descripcion: 'Recarga transporte público' },
        { fecha: '2025-12-05', monto: 60.00, categoria: 'Ocio', descripcion: 'Cena con amigos' },
        { fecha: '2025-11-28', monto: 120.00, categoria: 'Servicios', descripcion: 'Factura de luz' },
        { fecha: '2025-11-25', monto: 25.00, categoria: 'Salud', descripcion: 'Farmacia' }
      ];
      
      gastosEjemplo.forEach(g => {
        try {
          GastoModel.create(g);
        } catch (error) {
          Logger.error('Error creando gasto de ejemplo', error);
        }
      });
      
      // Datos de ejemplo para ingresos
      const ingresosEjemplo = [
        { fecha: '2025-12-01', monto: 2000.00, tipo: 'Salario', descripcion: 'Salario mensual' },
        { fecha: '2025-11-01', monto: 2000.00, tipo: 'Salario', descripcion: 'Salario mensual' },
        { fecha: '2025-12-03', monto: 150.00, tipo: 'Freelance', descripcion: 'Proyecto web' }
      ];
      
      ingresosEjemplo.forEach(i => {
        try {
          IngresoModel.create(i);
        } catch (error) {
          Logger.error('Error creando ingreso de ejemplo', error);
        }
      });
      
      // Datos de ejemplo para deudas
      const deudasEjemplo = [
        { 
          acreedor: 'Banco Santander', 
          montoInicial: 5000.00, 
          montoPendiente: 3500.00, 
          fechaInicio: '2025-01-15',
          fechaVencimiento: '2026-01-15',
          descripcion: 'Préstamo personal'
        }
      ];
      
      deudasEjemplo.forEach(d => {
        try {
          DeudaModel.create(d);
        } catch (error) {
          Logger.error('Error creando deuda de ejemplo', error);
        }
      });
      
      // Datos de ejemplo para préstamos
      const prestamosEjemplo = [
        { 
          persona: 'Juan Pérez', 
          montoInicial: 200.00, 
          montoPendiente: 100.00, 
          fechaPrestamo: '2025-11-01',
          fechaDevolucion: '2025-12-31',
          descripcion: 'Préstamo personal'
        }
      ];
      
      prestamosEjemplo.forEach(p => {
        try {
          PrestamoModel.create(p);
        } catch (error) {
          Logger.error('Error creando préstamo de ejemplo', error);
        }
      });
      
      // Datos de ejemplo para activos
      const activosEjemplo = [
        { nombre: 'Coche', valor: 12000.00, descripcion: 'Vehículo personal' },
        { nombre: 'Ahorros', valor: 5000.00, descripcion: 'Cuenta de ahorros' }
      ];
      
      activosEjemplo.forEach(a => {
        try {
          PatrimonioModel.createActivo(a);
        } catch (error) {
          Logger.error('Error creando activo de ejemplo', error);
        }
      });
      
      // Datos de ejemplo para pasivos
      const pasivosEjemplo = [
        { nombre: 'Hipoteca', valor: 50000.00, descripcion: 'Préstamo hipotecario' }
      ];
      
      pasivosEjemplo.forEach(p => {
        try {
          PatrimonioModel.createPasivo(p);
        } catch (error) {
          Logger.error('Error creando pasivo de ejemplo', error);
        }
      });
      
      Logger.success('Datos de ejemplo cargados exitosamente');
    } catch (error) {
      Logger.error('Error cargando datos de ejemplo', error);
    }
  }
  
  // Iniciar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();
