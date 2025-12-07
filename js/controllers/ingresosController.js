// Controlador de Ingresos - Similar a Gastos
const IngresosController = {
  render() {
    const mainContent = document.getElementById('main-content');
    const ingresos = IngresoModel.getAll().sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    mainContent.innerHTML = `
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Gestión de Ingresos</h2>
          <button class="btn btn-primary" onclick="IngresosController.mostrarFormulario()">➕ Nuevo Ingreso</button>
        </div>
        
        <div id="modal-ingreso" class="modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title" id="form-ingreso-title">Nuevo Ingreso</h3>
              <button class="modal-close" onclick="IngresosController.cancelar()">&times;</button>
            </div>
            <div class="modal-body">
              <form id="ingreso-form" onsubmit="IngresosController.guardar(event)">
                <input type="hidden" id="ingreso-id">
                ${FormBuilder.renderInRows('ingresos', 'ingreso-form')}
                <div class="form-error" id="ingreso-errors"></div>
                <div class="form-actions">
                  <button type="button" class="btn btn-secondary" onclick="IngresosController.cancelar()">Cancelar</button>
                  <button type="submit" class="btn btn-primary">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-title">Listado de Ingresos</div>
          <div class="table-container">
            ${ingresos.length === 0 ? `
              <div class="empty-state">
                <div class="empty-state-icon">💰</div>
                <div class="empty-state-title">No hay ingresos registrados</div>
              </div>
            ` : `
              <table class="table">
                <thead><tr><th>Fecha</th><th>Descripción</th><th>Tipo</th><th>Monto</th><th>Acciones</th></tr></thead>
                <tbody>
                  ${ingresos.map(i => `
                    <tr>
                      <td>${new Date(i.fecha).toLocaleDateString('es-ES')}</td>
                      <td>${i.descripcion || '-'}</td>
                      <td><span class="badge badge-success">${i.tipo}</span></td>
                      <td class="text-success">${Calculations.formatearMoneda(i.monto)}</td>
                      <td>
                        <button class="btn btn-small btn-secondary" onclick="IngresosController.editar('${i.id}')">Editar</button>
                        <button class="btn btn-small btn-danger" onclick="IngresosController.eliminar('${i.id}')">Eliminar</button>
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
  
  mostrarFormulario() {
    document.getElementById('modal-ingreso').classList.add('show');
    document.getElementById('ingreso-id').value = '';
    document.getElementById('form-ingreso-title').textContent = 'Nuevo Ingreso';
    FormBuilder.clearForm('ingresos');
    ValidationService.limpiarErrores('ingreso-errors');
  },
  
  cancelar() {
    document.getElementById('modal-ingreso').classList.remove('show');
    FormBuilder.clearForm('ingresos');
    ValidationService.limpiarErrores('ingreso-errors');
  },
  
  guardar(event) {
    event.preventDefault();
    
    // Validar formulario dinámico
    const validation = FormBuilder.validateForm('ingresos');
    if (!validation.valid) {
      ValidationService.mostrarErrores(validation.errors, 'ingreso-errors');
      return;
    }
    
    const id = document.getElementById('ingreso-id').value;
    const ingresoData = FormBuilder.extractFormData('ingresos');
    
    try {
      if (id) {
        IngresoModel.update(id, ingresoData);
      } else {
        IngresoModel.create(ingresoData);
      }
      
      this.cancelar();
      this.render();
    } catch (error) {
      Logger.error('Error guardando ingreso', error);
      ValidationService.mostrarErrores([error.message], 'ingreso-errors');
    }
  },
  
  editar(id) {
    const ingreso = IngresoModel.getById(id);
    if (!ingreso) {
      return;
    }
    
    document.getElementById('modal-ingreso').classList.add('show');
    document.getElementById('form-ingreso-title').textContent = 'Editar Ingreso';
    document.getElementById('ingreso-id').value = ingreso.id;
    FormBuilder.fillForm('ingresos', ingreso);
    ValidationService.limpiarErrores('ingreso-errors');
  },
  
  eliminar(id) {
    showConfirmModal(
      '¿Estás seguro de eliminar este ingreso? Esta acción no se puede deshacer.',
      () => {
        try {
          IngresoModel.delete(id);
          this.render();
        } catch (error) {
          Logger.error('Error eliminando ingreso', error);
        }
      }
    );
  },
  
  mostrarMensaje(texto, tipo = 'info') {
    const modal = document.getElementById('modal');
    document.getElementById('modal-body').innerHTML = `<div class="alert alert-${tipo}">${texto}</div>`;
    modal.classList.add('show');
    setTimeout(() => modal.classList.remove('show'), 3000);
  }
};

window.IngresosController = IngresosController;
