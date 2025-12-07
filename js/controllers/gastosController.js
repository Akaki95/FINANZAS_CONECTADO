// Controlador de Gastos
const GastosController = {
  
  // Renderizar vista de gastos
  render() {
    const mainContent = document.getElementById('main-content');
    const gastos = GastoModel.getAll();
    const categorias = GastoModel.getCategorias();
    
    mainContent.innerHTML = `
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Gestión de Gastos</h2>
          <button class="btn btn-primary" onclick="GastosController.mostrarFormulario()">
            ➕ Nuevo Gasto
          </button>
        </div>
        
        <!-- Formulario (oculto inicialmente) -->
        <div id="form-gasto" class="form-container hidden">
          <div class="form-card">
            <div class="form-header">
              <h3 class="form-title" id="form-gasto-title">Nuevo Gasto</h3>
            </div>
            <form id="gasto-form" onsubmit="GastosController.guardar(event)">
              <input type="hidden" id="gasto-id">
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="gasto-fecha">Fecha *</label>
                  <input type="date" id="gasto-fecha" class="form-input" required 
                         value="${new Date().toISOString().split('T')[0]}">
                </div>
                
                <div class="form-group">
                  <label class="form-label" for="gasto-monto">Monto (€) *</label>
                  <input type="number" id="gasto-monto" class="form-input" 
                         step="0.01" min="0.01" required placeholder="0.00">
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label" for="gasto-categoria">Categoría *</label>
                <select id="gasto-categoria" class="form-select" required>
                  <option value="">Selecciona una categoría</option>
                  <option value="Comida">🍽️ Comida</option>
                  <option value="Transporte">🚗 Transporte</option>
                  <option value="Ocio">🎮 Ocio</option>
                  <option value="Salud">💊 Salud</option>
                  <option value="Educación">📚 Educación</option>
                  <option value="Vivienda">🏠 Vivienda</option>
                  <option value="Servicios">💡 Servicios</option>
                  <option value="Otros">📦 Otros</option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label" for="gasto-descripcion">Descripción</label>
                <textarea id="gasto-descripcion" class="form-textarea" 
                          rows="3" placeholder="Opcional..."></textarea>
              </div>
              
              <div class="form-error" id="gasto-errors"></div>
              
              <div class="form-actions">
                <button type="button" class="btn btn-secondary" 
                        onclick="GastosController.cancelar()">Cancelar</button>
                <button type="submit" class="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Lista de gastos -->
        <div class="card">
          <div class="card-title">Listado de Gastos</div>
          <div class="table-container">
            ${gastos.length === 0 ? `
              <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <div class="empty-state-title">No hay gastos registrados</div>
                <div class="empty-state-text">Comienza agregando tu primer gasto</div>
              </div>
            ` : `
              <table class="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th>Monto</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  ${gastos.map(gasto => `
                    <tr>
                      <td>${new Date(gasto.fecha).toLocaleDateString('es-ES')}</td>
                      <td>${gasto.descripcion || '-'}</td>
                      <td><span class="category-chip category-${gasto.categoria.toLowerCase()}">${gasto.categoria}</span></td>
                      <td class="text-danger">${Calculations.formatearMoneda(gasto.monto)}</td>
                      <td>
                        <button class="btn btn-small btn-secondary" 
                                onclick="GastosController.editar('${gasto.id}')">Editar</button>
                        <button class="btn btn-small btn-danger" 
                                onclick="GastosController.eliminar('${gasto.id}')">Eliminar</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `}
          </div>
        </div>
      </div>
    `;
  },
  
  // Mostrar formulario
  mostrarFormulario() {
    document.getElementById('form-gasto').classList.remove('hidden');
    document.getElementById('gasto-id').value = '';
    document.getElementById('form-gasto-title').textContent = 'Nuevo Gasto';
    document.getElementById('gasto-form').reset();
    document.getElementById('gasto-fecha').value = new Date().toISOString().split('T')[0];
    ValidationService.limpiarErrores('gasto-errors');
  },
  
  // Cancelar formulario
  cancelar() {
    document.getElementById('form-gasto').classList.add('hidden');
    document.getElementById('gasto-form').reset();
    ValidationService.limpiarErrores('gasto-errors');
  },
  
  // Guardar gasto (crear o actualizar)
  guardar(event) {
    event.preventDefault();
    
    const id = document.getElementById('gasto-id').value;
    const gastoData = {
      fecha: document.getElementById('gasto-fecha').value,
      monto: document.getElementById('gasto-monto').value,
      categoria: document.getElementById('gasto-categoria').value,
      descripcion: document.getElementById('gasto-descripcion').value
    };
    
    try {
      if (id) {
        GastoModel.update(id, gastoData);
      } else {
        GastoModel.create(gastoData);
      }
      
      this.cancelar();
      this.render();
      this.mostrarMensaje('Gasto guardado exitosamente', 'success');
    } catch (error) {
      Logger.error('Error guardando gasto', error);
      ValidationService.mostrarErrores([error.message], 'gasto-errors');
    }
  },
  
  // Editar gasto
  editar(id) {
    const gasto = GastoModel.getById(id);
    if (!gasto) {
      this.mostrarMensaje('Gasto no encontrado', 'danger');
      return;
    }
    
    document.getElementById('form-gasto').classList.remove('hidden');
    document.getElementById('form-gasto-title').textContent = 'Editar Gasto';
    document.getElementById('gasto-id').value = gasto.id;
    document.getElementById('gasto-fecha').value = gasto.fecha;
    document.getElementById('gasto-monto').value = gasto.monto;
    document.getElementById('gasto-categoria').value = gasto.categoria;
    document.getElementById('gasto-descripcion').value = gasto.descripcion || '';
    ValidationService.limpiarErrores('gasto-errors');
    
    // Scroll al formulario
    document.getElementById('form-gasto').scrollIntoView({ behavior: 'smooth' });
  },
  
  // Eliminar gasto
  eliminar(id) {
    showConfirmModal(
      '¿Estás seguro de eliminar este gasto? Esta acción no se puede deshacer.',
      () => {
        try {
          GastoModel.delete(id);
          this.render();
        } catch (error) {
          Logger.error('Error eliminando gasto', error);
        }
      }
    );
  },
  
  // Mostrar mensaje
  mostrarMensaje(texto, tipo = 'info') {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `<div class="alert alert-${tipo}">${texto}</div>`;
    modal.classList.add('show');
    
    setTimeout(() => modal.classList.remove('show'), 3000);
  }
};

window.GastosController = GastosController;
Logger.log('GastosController inicializado');
