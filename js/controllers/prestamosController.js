// Controlador de Préstamos
const PrestamosController = {
  render() {
    const mainContent = document.getElementById('main-content');
    const prestamos = PrestamoModel.getAll();
    const totalPendiente = PrestamoModel.getTotalPendiente();
    
    mainContent.innerHTML = `
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Gestión de Préstamos</h2>
          <button class="btn btn-primary" onclick="PrestamosController.mostrarFormulario()">➕ Nuevo Préstamo</button>
        </div>
        
        <div class="card">
          <div class="summary-card balance">
            <div class="summary-card-label">Total Pendiente de Cobro</div>
            <div class="summary-card-value">${Calculations.formatearMoneda(totalPendiente)}</div>
          </div>
        </div>
        
        <div id="form-prestamo" class="form-container hidden">
          <div class="form-card">
            <div class="form-header"><h3 class="form-title">Nuevo Préstamo</h3></div>
            <form id="prestamo-form" onsubmit="PrestamosController.guardar(event)">
              <input type="hidden" id="prestamo-id">
              <div class="form-group">
                <label class="form-label">Persona *</label>
                <input type="text" id="prestamo-persona" class="form-input" required>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Monto Inicial (€) *</label>
                  <input type="number" id="prestamo-monto-inicial" class="form-input" step="0.01" min="0.01" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Monto Pendiente (€) *</label>
                  <input type="number" id="prestamo-monto-pendiente" class="form-input" step="0.01" min="0" required>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Fecha Préstamo *</label>
                  <input type="date" id="prestamo-fecha-prestamo" class="form-input" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Fecha Devolución</label>
                  <input type="date" id="prestamo-fecha-devolucion" class="form-input">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Descripción</label>
                <textarea id="prestamo-descripcion" class="form-textarea" rows="3"></textarea>
              </div>
              <div class="form-error" id="prestamo-errors"></div>
              <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="PrestamosController.cancelar()">Cancelar</button>
                <button type="submit" class="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
        
        <div class="card">
          <div class="card-title">Listado de Préstamos</div>
          ${prestamos.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">💸</div>
              <div class="empty-state-title">No hay préstamos registrados</div>
            </div>
          ` : `
            <ul class="items-list">
              ${prestamos.map(p => `
                <li class="item">
                  <div class="item-content">
                    <div class="item-title">${p.persona}</div>
                    <div class="item-subtitle">
                      Inicial: ${Calculations.formatearMoneda(p.montoInicial)} | 
                      Prestado: ${new Date(p.fechaPrestamo).toLocaleDateString('es-ES')}
                      ${p.fechaDevolucion ? ' | Devolución: ' + new Date(p.fechaDevolucion).toLocaleDateString('es-ES') : ''}
                    </div>
                  </div>
                  <div class="item-amount text-success">${Calculations.formatearMoneda(p.montoPendiente)}</div>
                  <div class="item-actions">
                    <button class="item-action-btn" onclick="PrestamosController.registrarPago('${p.id}')">💰 Cobro</button>
                    <button class="item-action-btn" onclick="PrestamosController.editar('${p.id}')">✏️</button>
                    <button class="item-action-btn delete" onclick="PrestamosController.eliminar('${p.id}')">🗑️</button>
                  </div>
                </li>
              `).join('')}
            </ul>
          `}
        </div>
      </div>
    `;
  },
  
  mostrarFormulario() {
    document.getElementById('form-prestamo').classList.remove('hidden');
    document.getElementById('prestamo-form').reset();
    document.getElementById('prestamo-fecha-prestamo').value = new Date().toISOString().split('T')[0];
  },
  
  cancelar() {
    document.getElementById('form-prestamo').classList.add('hidden');
  },
  
  guardar(event) {
    event.preventDefault();
    const id = document.getElementById('prestamo-id').value;
    const data = {
      persona: document.getElementById('prestamo-persona').value,
      montoInicial: document.getElementById('prestamo-monto-inicial').value,
      montoPendiente: document.getElementById('prestamo-monto-pendiente').value,
      fechaPrestamo: document.getElementById('prestamo-fecha-prestamo').value,
      fechaDevolucion: document.getElementById('prestamo-fecha-devolucion').value,
      descripcion: document.getElementById('prestamo-descripcion').value
    };
    
    try {
      id ? PrestamoModel.update(id, data) : PrestamoModel.create(data);
      this.cancelar();
      this.render();
    } catch (error) {
      ValidationService.mostrarErrores([error.message], 'prestamo-errors');
    }
  },
  
  editar(id) {
    const prestamo = PrestamoModel.getById(id);
    if (!prestamo) return;
    document.getElementById('form-prestamo').classList.remove('hidden');
    document.getElementById('prestamo-id').value = prestamo.id;
    document.getElementById('prestamo-persona').value = prestamo.persona;
    document.getElementById('prestamo-monto-inicial').value = prestamo.montoInicial;
    document.getElementById('prestamo-monto-pendiente').value = prestamo.montoPendiente;
    document.getElementById('prestamo-fecha-prestamo').value = prestamo.fechaPrestamo;
    document.getElementById('prestamo-fecha-devolucion').value = prestamo.fechaDevolucion || '';
    document.getElementById('prestamo-descripcion').value = prestamo.descripcion || '';
  },
  
  eliminar(id) {
    showConfirmModal(
      '¿Estás seguro de eliminar este préstamo? Esta acción no se puede deshacer.',
      () => {
        PrestamoModel.delete(id);
        this.render();
      }
    );
  },
  
  registrarPago(id) {
    const monto = prompt('¿Cuánto te devolvieron?');
    if (!monto) return;
    try {
      PrestamoModel.registrarPago(id, parseFloat(monto));
      this.render();
    } catch (error) {
      alert(error.message);
    }
  }
};

window.PrestamosController = PrestamosController;
