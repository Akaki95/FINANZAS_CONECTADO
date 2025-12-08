// Controlador de Patrimonio - Rediseñado para ser intuitivo
const PatrimonioController = {
  // Categorías predefinidas
  CATEGORIAS_ACTIVOS: [
    { id: 'cuentas', nombre: 'Dinero en Cuentas', icono: '🏦', ayuda: 'Saldo de tus cuentas corrientes y de ahorro' },
    { id: 'inversiones', nombre: 'Inversiones', icono: '📈', ayuda: 'Acciones, fondos, criptomonedas, bonos, etc.' },
    { id: 'inmuebles', nombre: 'Inmuebles', icono: '🏠', ayuda: 'Casas, pisos, locales, terrenos' },
    { id: 'vehiculos', nombre: 'Vehículos', icono: '🚗', ayuda: 'Coches, motos, bicicletas' },
    { id: 'negocios', nombre: 'Negocios', icono: '💼', ayuda: 'Participaciones en empresas, negocios propios' },
    { id: 'bienes', nombre: 'Bienes Físicos', icono: '📦', ayuda: 'Joyas, arte, electrodomésticos de valor' },
    { id: 'digitales', nombre: 'Activos Digitales', icono: '💻', ayuda: 'Dominios, webs, NFTs, cuentas digitales' },
    { id: 'pensiones', nombre: 'Planes de Pensiones', icono: '🏛️', ayuda: 'Fondos de pensiones, seguros de jubilación' },
    { id: 'otros_activos', nombre: 'Otros Activos', icono: '💰', ayuda: 'Cualquier otro activo de valor' }
  ],
  
  CATEGORIAS_PASIVOS: [
    { id: 'hipotecas', nombre: 'Hipotecas', icono: '🏠', ayuda: 'Préstamo para vivienda' },
    { id: 'prestamos_personales', nombre: 'Préstamos Personales', icono: '💳', ayuda: 'Préstamos de consumo, personales' },
    { id: 'coche', nombre: 'Préstamos de Coche', icono: '🚗', ayuda: 'Financiación de vehículos' },
    { id: 'tarjetas', nombre: 'Tarjetas de Crédito', icono: '💳', ayuda: 'Deudas en tarjetas de crédito' },
    { id: 'estudiantiles', nombre: 'Préstamos Estudiantiles', icono: '🎓', ayuda: 'Deudas de estudios, formación' },
    { id: 'fiscales', nombre: 'Pasivos Fiscales', icono: '📋', ayuda: 'Deudas con Hacienda, impuestos pendientes' },
    { id: 'empresariales', nombre: 'Pasivos Empresariales', icono: '💼', ayuda: 'Deudas de tu negocio, proveedores' },
    { id: 'otros_pasivos', nombre: 'Otros Pasivos', icono: '💸', ayuda: 'Cualquier otra deuda' }
  ],
  
  render() {
    const mainContent = document.getElementById('main-content');
    const activos = PatrimonioModel.getAllActivos();
    const pasivos = PatrimonioModel.getAllPasivos();
    const resumen = PatrimonioModel.getResumen();
    
    // Agrupar por categoría
    const activosPorCategoria = this.agruparPorCategoria(activos, this.CATEGORIAS_ACTIVOS);
    const pasivosPorCategoria = this.agruparPorCategoria(pasivos, this.CATEGORIAS_PASIVOS);
    
    mainContent.innerHTML = `
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">💰 Tu Patrimonio Personal</h2>
            <p class="section-subtitle">Visualiza todo lo que tienes y lo que debes de forma sencilla</p>
          </div>
        </div>
        
        <!-- Banner informativo -->
        <div class="info-banner">
          <div class="info-banner-icon">ℹ️</div>
          <div class="info-banner-text">
            <strong>¿Qué es el patrimonio?</strong> Es la diferencia entre lo que tienes (activos) y lo que debes (pasivos).
            Un patrimonio positivo significa que tienes más de lo que debes.
          </div>
        </div>
        
        <!-- Resumen principal -->
        <div class="patrimonio-resumen-principal">
          <div class="patrimonio-columna">
            <div class="patrimonio-total activos">
              <div class="patrimonio-total-label">Lo que TIENES</div>
              <div class="patrimonio-total-valor">${Calculations.formatearMoneda(resumen.activos)}</div>
              <div class="patrimonio-total-subtitulo">Total Activos</div>
            </div>
          </div>
          
          <div class="patrimonio-separador">
            <div class="patrimonio-operacion">−</div>
          </div>
          
          <div class="patrimonio-columna">
            <div class="patrimonio-total pasivos">
              <div class="patrimonio-total-label">Lo que DEBES</div>
              <div class="patrimonio-total-valor">${Calculations.formatearMoneda(resumen.pasivos)}</div>
              <div class="patrimonio-total-subtitulo">Total Pasivos</div>
            </div>
          </div>
          
          <div class="patrimonio-separador">
            <div class="patrimonio-operacion">=</div>
          </div>
          
          <div class="patrimonio-columna">
            <div class="patrimonio-total neto ${resumen.patrimonioNeto >= 0 ? 'positivo' : 'negativo'}">
              <div class="patrimonio-total-label">Tu PATRIMONIO</div>
              <div class="patrimonio-total-valor">${Calculations.formatearMoneda(resumen.patrimonioNeto)}</div>
              <div class="patrimonio-total-subtitulo">Patrimonio Neto</div>
            </div>
          </div>
        </div>
        
        <!-- Contenido lado a lado -->
        <div class="patrimonio-contenido-doble">
          <!-- ACTIVOS (Izquierda) -->
          <div class="patrimonio-lado activos-lado">
            <div class="patrimonio-lado-header">
              <h3 class="patrimonio-lado-titulo">
                <span class="patrimonio-lado-icono">💰</span>
                ACTIVOS - Lo que Tienes
              </h3>
              <button class="btn btn-primary btn-small" onclick="PatrimonioController.nuevoActivo()">
                ➕ Añadir Activo
              </button>
            </div>
            
            <div class="patrimonio-categorias">
              ${this.renderCategoriasActivos(activosPorCategoria)}
            </div>
            
            ${activos.length === 0 ? `
              <div class="empty-state">
                <div class="empty-state-icon">🏦</div>
                <div class="empty-state-title">Aún no tienes activos registrados</div>
                <div class="empty-state-description">Haz clic en "Añadir Activo" para comenzar</div>
              </div>
            ` : ''}
          </div>
          
          <!-- Línea divisoria -->
          <div class="patrimonio-divisor"></div>
          
          <!-- PASIVOS (Derecha) -->
          <div class="patrimonio-lado pasivos-lado">
            <div class="patrimonio-lado-header">
              <h3 class="patrimonio-lado-titulo">
                <span class="patrimonio-lado-icono">💸</span>
                PASIVOS - Lo que Debes
              </h3>
              <button class="btn btn-primary btn-small" onclick="PatrimonioController.nuevoPasivo()">
                ➕ Añadir Pasivo
              </button>
            </div>
            
            <div class="patrimonio-categorias">
              ${this.renderCategoriasPasivos(pasivosPorCategoria)}
            </div>
            
            ${pasivos.length === 0 ? `
              <div class="empty-state">
                <div class="empty-state-icon">💸</div>
                <div class="empty-state-title">No tienes pasivos registrados</div>
                <div class="empty-state-description">Si tienes deudas, añádelas aquí</div>
              </div>
            ` : ''}
          </div>
        </div>
        
        ${this.renderModales()}
      </div>
    `;
    
    // Event listener para cambio de categoría en formularios
    const activoCategoria = document.getElementById('activo-categoria');
    if (activoCategoria) {
      activoCategoria.addEventListener('change', (e) => {
        const cat = this.CATEGORIAS_ACTIVOS.find(c => c.id === e.target.value);
        const ayuda = document.getElementById('activo-categoria-ayuda');
        if (ayuda && cat) ayuda.textContent = cat.ayuda;
      });
    }
    
    const pasivoCategoria = document.getElementById('pasivo-categoria');
    if (pasivoCategoria) {
      pasivoCategoria.addEventListener('change', (e) => {
        const cat = this.CATEGORIAS_PASIVOS.find(c => c.id === e.target.value);
        const ayuda = document.getElementById('pasivo-categoria-ayuda');
        if (ayuda && cat) ayuda.textContent = cat.ayuda;
      });
    }
  },
  
  agruparPorCategoria(items, categorias) {
    const grupos = {};
    categorias.forEach(cat => {
      grupos[cat.id] = {
        categoria: cat,
        items: items.filter(item => item.categoria === cat.id),
        total: 0
      };
      grupos[cat.id].total = grupos[cat.id].items.reduce((sum, item) => sum + item.valor, 0);
    });
    return grupos;
  },
  
  renderCategoriasActivos(grupos) {
    return Object.values(grupos).map(grupo => {
      if (grupo.items.length === 0) return '';
      
      return `
        <div class="patrimonio-categoria">
          <div class="patrimonio-categoria-header" onclick="PatrimonioController.toggleCategoria(this)">
            <div class="patrimonio-categoria-info">
              <span class="patrimonio-categoria-icono">${grupo.categoria.icono}</span>
              <div>
                <div class="patrimonio-categoria-nombre">${grupo.categoria.nombre}</div>
                <div class="patrimonio-categoria-ayuda">${grupo.categoria.ayuda}</div>
              </div>
            </div>
            <div class="patrimonio-categoria-total">
              <div class="patrimonio-categoria-valor text-success">${Calculations.formatearMoneda(grupo.total)}</div>
              <div class="patrimonio-categoria-contador">${grupo.items.length} item(s)</div>
            </div>
            <span class="patrimonio-categoria-toggle">▼</span>
          </div>
          <div class="patrimonio-categoria-items">
            ${grupo.items.map(item => `
              <div class="patrimonio-item">
                <div class="patrimonio-item-info">
                  <div class="patrimonio-item-nombre">${item.nombre}</div>
                  ${item.descripcion ? `<div class="patrimonio-item-desc">${item.descripcion}</div>` : ''}
                </div>
                <div class="patrimonio-item-derecha">
                  <div class="patrimonio-item-valor text-success">${Calculations.formatearMoneda(item.valor)}</div>
                  <div class="patrimonio-item-acciones">
                    <button class="item-action-btn" onclick="PatrimonioController.editarActivo('${item.id}')" title="Editar">✏️</button>
                    <button class="item-action-btn delete" onclick="PatrimonioController.eliminarActivo('${item.id}')" title="Eliminar">🗑️</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  },
  
  renderCategoriasPasivos(grupos) {
    return Object.values(grupos).map(grupo => {
      if (grupo.items.length === 0) return '';
      
      return `
        <div class="patrimonio-categoria">
          <div class="patrimonio-categoria-header" onclick="PatrimonioController.toggleCategoria(this)">
            <div class="patrimonio-categoria-info">
              <span class="patrimonio-categoria-icono">${grupo.categoria.icono}</span>
              <div>
                <div class="patrimonio-categoria-nombre">${grupo.categoria.nombre}</div>
                <div class="patrimonio-categoria-ayuda">${grupo.categoria.ayuda}</div>
              </div>
            </div>
            <div class="patrimonio-categoria-total">
              <div class="patrimonio-categoria-valor text-danger">${Calculations.formatearMoneda(grupo.total)}</div>
              <div class="patrimonio-categoria-contador">${grupo.items.length} item(s)</div>
            </div>
            <span class="patrimonio-categoria-toggle">▼</span>
          </div>
          <div class="patrimonio-categoria-items">
            ${grupo.items.map(item => `
              <div class="patrimonio-item">
                <div class="patrimonio-item-info">
                  <div class="patrimonio-item-nombre">${item.nombre}</div>
                  ${item.descripcion ? `<div class="patrimonio-item-desc">${item.descripcion}</div>` : ''}
                </div>
                <div class="patrimonio-item-derecha">
                  <div class="patrimonio-item-valor text-danger">${Calculations.formatearMoneda(item.valor)}</div>
                  <div class="patrimonio-item-acciones">
                    <button class="item-action-btn" onclick="PatrimonioController.editarPasivo('${item.id}')" title="Editar">✏️</button>
                    <button class="item-action-btn delete" onclick="PatrimonioController.eliminarPasivo('${item.id}')" title="Eliminar">🗑️</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  },
  
  renderModales() {
    return `
      <!-- Modal Activo -->
      <div id="modal-activo" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title" id="form-activo-title">Nuevo Activo</h3>
            <button class="modal-close" onclick="PatrimonioController.cancelarActivo()">&times;</button>
          </div>
          <div class="modal-body">
            <form id="activo-form" onsubmit="PatrimonioController.guardarActivo(event)">
              <input type="hidden" id="activo-id">
              <div class="form-group">
                <label class="form-label">¿Qué tipo de activo es? *</label>
                <select id="activo-categoria" class="form-select" required>
                  <option value="">Selecciona una categoría...</option>
                  ${this.CATEGORIAS_ACTIVOS.map(cat => `
                    <option value="${cat.id}">${cat.icono} ${cat.nombre}</option>
                  `).join('')}
                </select>
                <small class="form-help" id="activo-categoria-ayuda"></small>
              </div>
              <div class="form-group">
                <label class="form-label">Nombre *</label>
                <input type="text" id="activo-nombre" class="form-input" placeholder="Ej: Cuenta del Santander" required>
              </div>
              <div class="form-group">
                <label class="form-label">Valor actual (€) *</label>
                <input type="number" id="activo-valor" class="form-input" step="0.01" min="0.01" placeholder="0.00" required>
                <small class="form-help">Introduce el valor actual que tiene este activo</small>
              </div>
              <div class="form-group">
                <label class="form-label">Notas / Descripción</label>
                <textarea id="activo-descripcion" class="form-textarea" rows="2" placeholder="Información adicional (opcional)"></textarea>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="PatrimonioController.cancelarActivo()">Cancelar</button>
                <button type="submit" class="btn btn-primary">Guardar Activo</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- Modal Pasivo -->
      <div id="modal-pasivo" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title" id="form-pasivo-title">Nuevo Pasivo</h3>
            <button class="modal-close" onclick="PatrimonioController.cancelarPasivo()">&times;</button>
          </div>
          <div class="modal-body">
            <form id="pasivo-form" onsubmit="PatrimonioController.guardarPasivo(event)">
              <input type="hidden" id="pasivo-id">
              <div class="form-group">
                <label class="form-label">¿Qué tipo de deuda es? *</label>
                <select id="pasivo-categoria" class="form-select" required>
                  <option value="">Selecciona una categoría...</option>
                  ${this.CATEGORIAS_PASIVOS.map(cat => `
                    <option value="${cat.id}">${cat.icono} ${cat.nombre}</option>
                  `).join('')}
                </select>
                <small class="form-help" id="pasivo-categoria-ayuda"></small>
              </div>
              <div class="form-group">
                <label class="form-label">Nombre *</label>
                <input type="text" id="pasivo-nombre" class="form-input" placeholder="Ej: Hipoteca BBVA" required>
              </div>
              <div class="form-group">
                <label class="form-label">Cantidad que debes (€) *</label>
                <input type="number" id="pasivo-valor" class="form-input" step="0.01" min="0.01" placeholder="0.00" required>
                <small class="form-help">Introduce la cantidad que aún te queda por pagar</small>
              </div>
              <div class="form-group">
                <label class="form-label">Notas / Descripción</label>
                <textarea id="pasivo-descripcion" class="form-textarea" rows="2" placeholder="Información adicional (opcional)"></textarea>
              </div>
              <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="PatrimonioController.cancelarPasivo()">Cancelar</button>
                <button type="submit" class="btn btn-primary">Guardar Pasivo</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },
  
  toggleCategoria(headerElement) {
    const categoria = headerElement.parentElement;
    categoria.classList.toggle('collapsed');
  },
  
  nuevoActivo() { 
    document.getElementById('modal-activo').classList.add('show');
    document.getElementById('activo-form').reset();
    document.getElementById('form-activo-title').textContent = 'Nuevo Activo';
    document.getElementById('activo-categoria-ayuda').textContent = '';
  },
  
  cancelarActivo() { 
    document.getElementById('modal-activo').classList.remove('show');
    document.getElementById('activo-form').reset();
  },
  
  guardarActivo(event) {
    event.preventDefault();
    const id = document.getElementById('activo-id').value;
    const data = {
      categoria: document.getElementById('activo-categoria').value,
      nombre: document.getElementById('activo-nombre').value,
      valor: parseFloat(document.getElementById('activo-valor').value),
      descripcion: document.getElementById('activo-descripcion').value
    };
    try {
      id ? PatrimonioModel.updateActivo(id, data) : PatrimonioModel.createActivo(data);
      this.cancelarActivo();
      this.render();
    } catch (error) {
      alert(error.message);
    }
  },
  
  editarActivo(id) {
    const activo = PatrimonioModel.getActivoById(id);
    if (!activo) return;
    document.getElementById('modal-activo').classList.add('show');
    document.getElementById('form-activo-title').textContent = 'Editar Activo';
    document.getElementById('activo-id').value = activo.id;
    document.getElementById('activo-categoria').value = activo.categoria || '';
    document.getElementById('activo-nombre').value = activo.nombre;
    document.getElementById('activo-valor').value = activo.valor;
    document.getElementById('activo-descripcion').value = activo.descripcion || '';
    
    // Mostrar ayuda de categoría
    const cat = this.CATEGORIAS_ACTIVOS.find(c => c.id === activo.categoria);
    if (cat) {
      document.getElementById('activo-categoria-ayuda').textContent = cat.ayuda;
    }
  },
  
  eliminarActivo(id) {
    showConfirmModal(
      '¿Estás seguro de eliminar este activo? Esta acción no se puede deshacer.',
      () => {
        PatrimonioModel.deleteActivo(id);
        this.render();
      }
    );
  },
  
  nuevoPasivo() { 
    document.getElementById('modal-pasivo').classList.add('show');
    document.getElementById('pasivo-form').reset();
    document.getElementById('form-pasivo-title').textContent = 'Nuevo Pasivo';
    document.getElementById('pasivo-categoria-ayuda').textContent = '';
  },
  
  cancelarPasivo() { 
    document.getElementById('modal-pasivo').classList.remove('show');
    document.getElementById('pasivo-form').reset();
  },
  
  guardarPasivo(event) {
    event.preventDefault();
    const id = document.getElementById('pasivo-id').value;
    const data = {
      categoria: document.getElementById('pasivo-categoria').value,
      nombre: document.getElementById('pasivo-nombre').value,
      valor: parseFloat(document.getElementById('pasivo-valor').value),
      descripcion: document.getElementById('pasivo-descripcion').value
    };
    try {
      id ? PatrimonioModel.updatePasivo(id, data) : PatrimonioModel.createPasivo(data);
      this.cancelarPasivo();
      this.render();
    } catch (error) {
      alert(error.message);
    }
  },
  
  editarPasivo(id) {
    const pasivo = PatrimonioModel.getPasivoById(id);
    if (!pasivo) return;
    document.getElementById('modal-pasivo').classList.add('show');
    document.getElementById('form-pasivo-title').textContent = 'Editar Pasivo';
    document.getElementById('pasivo-id').value = pasivo.id;
    document.getElementById('pasivo-categoria').value = pasivo.categoria || '';
    document.getElementById('pasivo-nombre').value = pasivo.nombre;
    document.getElementById('pasivo-valor').value = pasivo.valor;
    document.getElementById('pasivo-descripcion').value = pasivo.descripcion || '';
    
    // Mostrar ayuda de categoría
    const cat = this.CATEGORIAS_PASIVOS.find(c => c.id === pasivo.categoria);
    if (cat) {
      document.getElementById('pasivo-categoria-ayuda').textContent = cat.ayuda;
    }
  },
  
  eliminarPasivo(id) {
    showConfirmModal(
      '¿Estás seguro de eliminar este pasivo? Esta acción no se puede deshacer.',
      () => {
        PatrimonioModel.deletePasivo(id);
        this.render();
      }
    );
  }
};

window.PatrimonioController = PatrimonioController;
