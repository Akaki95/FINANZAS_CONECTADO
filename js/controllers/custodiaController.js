// Controlador de Custodia - Gestión de dinero de terceros
const CustodiaController = {
  personaSeleccionada: null,
  
  render() {
    const mainContent = document.getElementById('main-content');
    const resumenPersonas = CustodiaModel.getResumenPersonas();
    const totalCustodia = CustodiaModel.getTotalCustodia();
    
    mainContent.innerHTML = `
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">🏦 Dinero en Custodia</h2>
          <button class="btn btn-primary" onclick="CustodiaController.mostrarFormulario()">➕ Nuevo Movimiento</button>
        </div>
        
        <div class="info-banner">
          <div class="info-banner-icon">ℹ️</div>
          <div class="info-banner-text">
            Esta sección gestiona <strong>dinero de terceros</strong> que guardas como custodia. Es independiente de tus finanzas personales.
            <ul>
              <li><strong>Depósito:</strong> Cuando alguien te da dinero para guardar</li>
              <li><strong>Retiro:</strong> Cuando devuelves dinero a esa persona</li>
            </ul>
          </div>
        </div>
        
        <div class="card">
          <div class="summary-card balance">
            <div class="summary-card-label">Total en Custodia</div>
            <div class="summary-card-value">${Calculations.formatearMoneda(totalCustodia)}</div>
            <div class="summary-card-change">${resumenPersonas.length} persona(s)</div>
          </div>
        </div>
        
        <!-- Modal de Formulario -->
        <div id="modal-custodia" class="modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title" id="form-custodia-title">Nuevo Movimiento</h3>
              <button class="modal-close" onclick="CustodiaController.cancelar()">&times;</button>
            </div>
            <div class="modal-body">
              <form id="custodia-form" onsubmit="CustodiaController.guardar(event)">
                <input type="hidden" id="custodia-id">
                <div class="form-group">
                  <label class="form-label">Persona *</label>
                  <input type="text" id="custodia-persona" class="form-input" list="personas-list" required>
                  <datalist id="personas-list">
                    ${resumenPersonas.map(p => `<option value="${p.persona}">`).join('')}
                  </datalist>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Tipo *</label>
                    <select id="custodia-tipo" class="form-select" required onchange="CustodiaController.actualizarSaldoDisponible()">
                      <option value="deposito">💰 Depósito (Recibo dinero)</option>
                      <option value="retiro">💸 Retiro (Devuelvo dinero)</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Monto (€) *</label>
                    <input type="number" id="custodia-monto" class="form-input" step="0.01" min="0.01" required>
                  </div>
                </div>
                <div id="saldo-disponible" class="saldo-info" style="display: none;">
                  <span class="saldo-label">Saldo disponible:</span>
                  <span class="saldo-valor" id="saldo-valor"></span>
                </div>
                <div class="form-group">
                  <label class="form-label">Fecha *</label>
                  <input type="date" id="custodia-fecha" class="form-input" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Descripción</label>
                  <textarea id="custodia-descripcion" class="form-textarea" rows="3" placeholder="Motivo del movimiento..."></textarea>
                </div>
                <div class="form-error" id="custodia-errors"></div>
                <div class="form-actions">
                  <button type="button" class="btn btn-secondary" onclick="CustodiaController.cancelar()">Cancelar</button>
                  <button type="submit" class="btn btn-primary">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <!-- Tabs -->
        <div class="tabs">
          <button class="tab active" onclick="CustodiaController.cambiarTab('resumen')">Resumen por Persona</button>
          <button class="tab" onclick="CustodiaController.cambiarTab('movimientos')">Todos los Movimientos</button>
        </div>
        
        <!-- Tab Resumen -->
        <div id="tab-resumen" class="tab-content active">
          ${resumenPersonas.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">🏦</div>
              <div class="empty-state-title">No hay dinero en custodia</div>
              <div class="empty-state-description">
                Comienza registrando cuando alguien te dé dinero para guardar
              </div>
            </div>
          ` : `
            <div class="card">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Persona</th>
                      <th class="text-right">Total Depósitos</th>
                      <th class="text-right">Total Retiros</th>
                      <th class="text-right">Saldo Actual</th>
                      <th class="text-center">Movimientos</th>
                      <th class="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${resumenPersonas.map(p => `
                      <tr>
                        <td><strong>${p.persona}</strong></td>
                        <td class="text-right text-success">+${Calculations.formatearMoneda(p.depositos)}</td>
                        <td class="text-right text-danger">-${Calculations.formatearMoneda(p.retiros)}</td>
                        <td class="text-right"><strong>${Calculations.formatearMoneda(p.saldo)}</strong></td>
                        <td class="text-center"><span class="badge">${p.movimientos}</span></td>
                        <td class="text-center">
                          <button class="btn btn-small" onclick="CustodiaController.verDetalle('${p.persona}')">Ver Detalle</button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `}
        </div>
        
        <!-- Tab Movimientos -->
        <div id="tab-movimientos" class="tab-content">
          ${this.renderTodosMovimientos()}
        </div>
      </div>
    `;
    
    // Establecer fecha actual por defecto
    const fechaInput = document.getElementById('custodia-fecha');
    if (fechaInput) {
      fechaInput.value = new Date().toISOString().split('T')[0];
    }
    
    // Listener para actualizar saldo disponible
    const personaInput = document.getElementById('custodia-persona');
    if (personaInput) {
      personaInput.addEventListener('input', () => this.actualizarSaldoDisponible());
    }
  },
  
  renderTodosMovimientos() {
    const custodias = CustodiaModel.getAll().sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    if (custodias.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <div class="empty-state-title">No hay movimientos registrados</div>
        </div>
      `;
    }
    
    return `
      <div class="card">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Persona</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th class="text-right">Monto</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${custodias.map(c => `
                <tr>
                  <td>${Calculations.formatearFecha(c.fecha)}</td>
                  <td><strong>${c.persona}</strong></td>
                  <td>
                    <span class="badge ${c.tipo === 'deposito' ? 'badge-success' : 'badge-danger'}">
                      ${c.tipo === 'deposito' ? '💰 Depósito' : '💸 Retiro'}
                    </span>
                  </td>
                  <td>${c.descripcion || '-'}</td>
                  <td class="text-right ${c.tipo === 'deposito' ? 'text-success' : 'text-danger'}">
                    <strong>${c.tipo === 'deposito' ? '+' : '-'}${Calculations.formatearMoneda(c.monto)}</strong>
                  </td>
                  <td class="text-center">
                    <button class="item-action-btn" onclick="CustodiaController.editar('${c.id}')">✏️</button>
                    <button class="item-action-btn delete" onclick="CustodiaController.eliminar('${c.id}')">🗑️</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },
  
  cambiarTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`tab-${tab}`).classList.add('active');
  },
  
  verDetalle(persona) {
    const movimientos = CustodiaModel.getMovimientosByPersona(persona);
    const saldo = CustodiaModel.getSaldoByPersona(persona);
    
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
      <h3>Movimientos de ${persona}</h3>
      <div class="card" style="margin: 20px 0;">
        <div class="summary-card balance">
          <div class="summary-card-label">Saldo Actual</div>
          <div class="summary-card-value">${Calculations.formatearMoneda(saldo)}</div>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th class="text-right">Monto</th>
            </tr>
          </thead>
          <tbody>
            ${movimientos.map(m => `
              <tr>
                <td>${Calculations.formatearFecha(m.fecha)}</td>
                <td>
                  <span class="badge ${m.tipo === 'deposito' ? 'badge-success' : 'badge-danger'}">
                    ${m.tipo === 'deposito' ? '💰 Depósito' : '💸 Retiro'}
                  </span>
                </td>
                <td>${m.descripcion || '-'}</td>
                <td class="text-right ${m.tipo === 'deposito' ? 'text-success' : 'text-danger'}">
                  <strong>${m.tipo === 'deposito' ? '+' : '-'}${Calculations.formatearMoneda(m.monto)}</strong>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    
    modal.classList.add('show');
  },
  
  actualizarSaldoDisponible() {
    const persona = document.getElementById('custodia-persona').value;
    const tipo = document.getElementById('custodia-tipo').value;
    const saldoDiv = document.getElementById('saldo-disponible');
    const saldoValor = document.getElementById('saldo-valor');
    
    if (tipo === 'retiro' && persona) {
      const saldo = CustodiaModel.getSaldoByPersona(persona);
      saldoDiv.style.display = 'block';
      saldoValor.textContent = Calculations.formatearMoneda(saldo);
      saldoValor.className = saldo > 0 ? 'saldo-valor text-success' : 'saldo-valor text-danger';
    } else {
      saldoDiv.style.display = 'none';
    }
  },
  
  mostrarFormulario() {
    document.getElementById('form-custodia-title').textContent = 'Nuevo Movimiento';
    document.getElementById('custodia-form').reset();
    document.getElementById('custodia-id').value = '';
    document.getElementById('custodia-fecha').value = new Date().toISOString().split('T')[0];
    document.getElementById('custodia-errors').textContent = '';
    document.getElementById('custodia-errors').classList.remove('show');
    document.getElementById('saldo-disponible').style.display = 'none';
    document.getElementById('modal-custodia').classList.add('show');
  },
  
  cancelar() {
    document.getElementById('modal-custodia').classList.remove('show');
  },
  
  guardar(event) {
    event.preventDefault();
    
    const id = document.getElementById('custodia-id').value;
    const custodiaData = {
      persona: document.getElementById('custodia-persona').value,
      tipo: document.getElementById('custodia-tipo').value,
      monto: parseFloat(document.getElementById('custodia-monto').value),
      fecha: document.getElementById('custodia-fecha').value,
      descripcion: document.getElementById('custodia-descripcion').value
    };
    
    try {
      if (id) {
        CustodiaModel.update(id, custodiaData);
      } else {
        CustodiaModel.create(custodiaData);
      }
      
      this.cancelar();
      this.render();
    } catch (error) {
      const errorEl = document.getElementById('custodia-errors');
      errorEl.textContent = error.message;
      errorEl.classList.add('show');
    }
  },
  
  editar(id) {
    const custodia = CustodiaModel.getById(id);
    if (!custodia) return;
    
    document.getElementById('form-custodia-title').textContent = 'Editar Movimiento';
    document.getElementById('custodia-id').value = custodia.id;
    document.getElementById('custodia-persona').value = custodia.persona;
    document.getElementById('custodia-tipo').value = custodia.tipo;
    document.getElementById('custodia-monto').value = custodia.monto;
    document.getElementById('custodia-fecha').value = custodia.fecha;
    document.getElementById('custodia-descripcion').value = custodia.descripcion || '';
    document.getElementById('custodia-errors').textContent = '';
    document.getElementById('custodia-errors').classList.remove('show');
    
    this.actualizarSaldoDisponible();
    document.getElementById('modal-custodia').classList.add('show');
  },
  
  eliminar(id) {
    const custodia = CustodiaModel.getById(id);
    if (!custodia) return;
    
    showConfirmModal(
      `¿Eliminar este movimiento de ${custodia.persona} (${Calculations.formatearMoneda(custodia.monto)})?`,
      () => {
        CustodiaModel.delete(id);
        this.render();
      }
    );
  }
};
