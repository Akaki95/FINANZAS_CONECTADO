// Controlador de Gastos
const GastosController = {
  
  // Renderizar vista de gastos
  render() {
    const mainContent = document.getElementById('main-content');
    const gastos = GastoModel.getAll().sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    const categorias = GastoModel.getCategorias();
    
    mainContent.innerHTML = `
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Gestión de Gastos</h2>
          <button class="btn btn-primary" onclick="GastosController.mostrarFormulario()">
            ➕ Nuevo Gasto
          </button>
        </div>
        
        <!-- Modal de formulario -->
        <div id="modal-gasto" class="modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title" id="form-gasto-title">Nuevo Gasto</h3>
              <button class="modal-close" onclick="GastosController.cancelar()">&times;</button>
            </div>
            <div class="modal-body">
              <form id="gasto-form" onsubmit="GastosController.guardar(event)">
                <input type="hidden" id="gasto-id">
                ${FormBuilder.renderInRows('gastos', 'gasto-form')}
                <div class="form-error" id="gasto-errors"></div>
                <div class="form-actions">
                  <button type="button" class="btn btn-secondary" 
                          onclick="GastosController.cancelar()">Cancelar</button>
                  <button type="submit" class="btn btn-primary">Guardar</button>
                </div>
              </form>
            </div>
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
    document.getElementById('modal-gasto').classList.add('show');
    document.getElementById('gasto-id').value = '';
    document.getElementById('form-gasto-title').textContent = 'Nuevo Gasto';
    FormBuilder.clearForm('gastos');
    ValidationService.limpiarErrores('gasto-errors');
  },
  
  // Cancelar formulario
  cancelar() {
    document.getElementById('modal-gasto').classList.remove('show');
    FormBuilder.clearForm('gastos');
    ValidationService.limpiarErrores('gasto-errors');
  },
  
  // Guardar gasto (crear o actualizar)
  guardar(event) {
    event.preventDefault();
    
    // Validar formulario dinámico
    const validation = FormBuilder.validateForm('gastos');
    if (!validation.valid) {
      ValidationService.mostrarErrores(validation.errors, 'gasto-errors');
      return;
    }
    
    const id = document.getElementById('gasto-id').value;
    const gastoData = FormBuilder.extractFormData('gastos');
    
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
    
    document.getElementById('modal-gasto').classList.add('show');
    document.getElementById('form-gasto-title').textContent = 'Editar Gasto';
    document.getElementById('gasto-id').value = gasto.id;
    FormBuilder.fillForm('gastos', gasto);
    ValidationService.limpiarErrores('gasto-errors');
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
