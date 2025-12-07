// Controlador de Configuración
const ConfigController = {
  currentModule: 'gastos',
  currentField: null,

  render() {
    const mainContent = document.getElementById('main-content');
    
    mainContent.innerHTML = `
      <div class="config-container">
        <div class="config-header">
          <h2 class="section-title">⚙️ Configuración de Formularios</h2>
          <button class="btn btn-secondary" onclick="Router.navigate('dashboard')">← Volver</button>
        </div>

        <!-- Tabs de módulos -->
        <div class="config-tabs">
          <button class="config-tab ${this.currentModule === 'gastos' ? 'active' : ''}" 
                  onclick="ConfigController.switchModule('gastos')">Gastos</button>
          <button class="config-tab ${this.currentModule === 'ingresos' ? 'active' : ''}" 
                  onclick="ConfigController.switchModule('ingresos')">Ingresos</button>
          <button class="config-tab ${this.currentModule === 'deudas' ? 'active' : ''}" 
                  onclick="ConfigController.switchModule('deudas')">Deudas</button>
          <button class="config-tab ${this.currentModule === 'prestamos' ? 'active' : ''}" 
                  onclick="ConfigController.switchModule('prestamos')">Préstamos</button>
          <button class="config-tab ${this.currentModule === 'patrimonio_activos' ? 'active' : ''}" 
                  onclick="ConfigController.switchModule('patrimonio_activos')">Activos</button>
          <button class="config-tab ${this.currentModule === 'patrimonio_pasivos' ? 'active' : ''}" 
                  onclick="ConfigController.switchModule('patrimonio_pasivos')">Pasivos</button>
        </div>

        <!-- Contenido del módulo -->
        <div class="config-content">
          <div class="config-actions">
            <button class="btn btn-primary" onclick="ConfigController.showAddFieldModal()">
              ➕ Añadir Campo
            </button>
            <button class="btn btn-danger" onclick="ConfigController.resetModule()">
              🔄 Restablecer por Defecto
            </button>
          </div>

          <div id="config-fields-list" class="config-fields">
            ${this.renderFieldsList()}
          </div>
        </div>

        <!-- Modal: Añadir/Editar Campo -->
        <div id="modal-field" class="modal-overlay">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title" id="field-modal-title">Añadir Campo</h3>
              <button class="modal-close" onclick="ConfigController.closeFieldModal()">&times;</button>
            </div>
            <div class="modal-body">
              <form id="field-form" onsubmit="ConfigController.saveField(event)">
                <input type="hidden" id="field-id">
                
                <div class="form-group">
                  <label class="form-label">Nombre del Campo *</label>
                  <input type="text" id="field-nombre" class="form-input" required 
                         placeholder="Ej: Subcategoría">
                </div>

                <div class="form-group">
                  <label class="form-label">Tipo de Campo *</label>
                  <select id="field-tipo" class="form-select" required onchange="ConfigController.onFieldTypeChange()">
                    <option value="">Selecciona un tipo</option>
                    <option value="text">Texto</option>
                    <option value="number">Número</option>
                    <option value="date">Fecha</option>
                    <option value="select">Lista Desplegable</option>
                    <option value="textarea">Área de Texto</option>
                    <option value="checkbox">Casilla de Verificación</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label checkbox-label">
                    <input type="checkbox" id="field-obligatorio">
                    ¿Es obligatorio?
                  </label>
                </div>

                <div class="form-group">
                  <label class="form-label">Placeholder/Ayuda</label>
                  <input type="text" id="field-placeholder" class="form-input" 
                         placeholder="Texto de ayuda para el usuario">
                </div>

                <!-- Opciones para tipo select -->
                <div id="select-options-container" class="form-group hidden">
                  <label class="form-label">Opciones de la Lista</label>
                  <div id="select-options-list"></div>
                  <button type="button" class="btn btn-small btn-secondary" 
                          onclick="ConfigController.showAddOptionModal()">
                    ➕ Añadir Opción
                  </button>
                </div>

                <!-- Opciones para tipo number -->
                <div id="number-options-container" class="form-group hidden">
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">Valor Mínimo</label>
                      <input type="number" id="field-min" class="form-input" step="0.01">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Valor Máximo</label>
                      <input type="number" id="field-max" class="form-input" step="0.01">
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Incremento</label>
                    <input type="number" id="field-step" class="form-input" 
                           value="0.01" step="0.01">
                  </div>
                </div>

                <!-- Opciones para tipo textarea -->
                <div id="textarea-options-container" class="form-group hidden">
                  <label class="form-label">Número de Filas</label>
                  <input type="number" id="field-rows" class="form-input" 
                         value="3" min="1" max="10">
                </div>

                <div class="form-actions">
                  <button type="button" class="btn btn-secondary" 
                          onclick="ConfigController.closeFieldModal()">Cancelar</button>
                  <button type="submit" class="btn btn-primary">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Modal: Añadir Opción (para select) -->
        <div id="modal-option" class="modal-overlay">
          <div class="modal-content modal-small">
            <div class="modal-header">
              <h3 class="modal-title">Añadir Opción</h3>
              <button class="modal-close" onclick="ConfigController.closeOptionModal()">&times;</button>
            </div>
            <div class="modal-body">
              <form id="option-form" onsubmit="ConfigController.saveOption(event)">
                <div class="form-group">
                  <label class="form-label">Valor *</label>
                  <input type="text" id="option-valor" class="form-input" required 
                         placeholder="Ej: Entretenimiento">
                </div>

                <div class="form-group">
                  <label class="form-label">Icono</label>
                  <input type="text" id="option-icono-preview" class="form-input icon-preview" 
                         readonly placeholder="Haz clic para seleccionar">
                  <input type="hidden" id="option-icono">
                  <button type="button" class="btn btn-small btn-secondary" 
                          onclick="ConfigController.showIconPicker()">
                    🎨 Seleccionar Icono
                  </button>
                </div>

                <div class="form-actions">
                  <button type="button" class="btn btn-secondary" 
                          onclick="ConfigController.closeOptionModal()">Cancelar</button>
                  <button type="submit" class="btn btn-primary">Añadir</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Modal: Selector de Iconos -->
        <div id="modal-icons" class="modal-overlay">
          <div class="modal-content modal-large">
            <div class="modal-header">
              <h3 class="modal-title">Seleccionar Icono</h3>
              <button class="modal-close" onclick="ConfigController.closeIconPicker()">&times;</button>
            </div>
            <div class="modal-body">
              ${this.renderIconPicker()}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderFieldsList() {
    const config = ConfigModel.getModuleConfig(this.currentModule);
    if (!config || !config.campos || config.campos.length === 0) {
      return '<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-title">No hay campos configurados</div></div>';
    }

    const camposOrdenados = [...config.campos].sort((a, b) => (a.orden || 0) - (b.orden || 0));

    return `
      <div class="fields-list">
        ${camposOrdenados.map(campo => `
          <div class="field-item ${campo.sistema ? 'system-field' : ''}">
            <div class="field-info">
              <div class="field-name">${campo.nombre}</div>
              <div class="field-meta">
                <span class="field-type">${this.getFieldTypeLabel(campo.tipo)}</span>
                ${campo.obligatorio ? '<span class="field-required">Obligatorio</span>' : ''}
                ${campo.sistema ? '<span class="field-system">Sistema</span>' : ''}
              </div>
              ${campo.tipo === 'select' && campo.opciones ? `
                <div class="field-options">
                  ${campo.opciones.slice(0, 3).map(o => `<span class="option-chip">${o.icono || ''} ${o.valor}</span>`).join('')}
                  ${campo.opciones.length > 3 ? `<span class="option-chip">+${campo.opciones.length - 3} más</span>` : ''}
                </div>
              ` : ''}
            </div>
            <div class="field-actions">
              ${!campo.sistema ? `
                <button class="btn btn-small btn-secondary" 
                        onclick="ConfigController.editField('${campo.id}')">✏️</button>
                <button class="btn btn-small btn-danger" 
                        onclick="ConfigController.deleteField('${campo.id}')">🗑️</button>
              ` : '<span class="field-locked">🔒</span>'}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderIconPicker() {
    const iconos = ConfigModel.ICONOS;
    return `
      <div class="icon-picker">
        ${Object.entries(iconos).map(([categoria, icons]) => `
          <div class="icon-category">
            <h4 class="icon-category-title">${this.capitalize(categoria)}</h4>
            <div class="icon-grid">
              ${icons.map(icon => `
                <button type="button" class="icon-btn" 
                        onclick="ConfigController.selectIcon('${icon}')">
                  ${icon}
                </button>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  switchModule(modulo) {
    this.currentModule = modulo;
    this.render();
  },

  showAddFieldModal() {
    document.getElementById('field-modal-title').textContent = 'Añadir Campo';
    document.getElementById('field-id').value = '';
    document.getElementById('field-form').reset();
    document.getElementById('select-options-container').classList.add('hidden');
    document.getElementById('number-options-container').classList.add('hidden');
    document.getElementById('textarea-options-container').classList.add('hidden');
    this.currentField = { opciones: [] };
    document.getElementById('modal-field').classList.add('show');
  },

  editField(campoId) {
    const config = ConfigModel.getModuleConfig(this.currentModule);
    const campo = config.campos.find(c => c.id === campoId);
    
    if (!campo) return;
    if (campo.sistema) {
      alert('No se pueden editar campos del sistema');
      return;
    }

    this.currentField = { ...campo };
    
    document.getElementById('field-modal-title').textContent = 'Editar Campo';
    document.getElementById('field-id').value = campo.id;
    document.getElementById('field-nombre').value = campo.nombre;
    document.getElementById('field-tipo').value = campo.tipo;
    document.getElementById('field-obligatorio').checked = campo.obligatorio;
    document.getElementById('field-placeholder').value = campo.placeholder || '';
    
    if (campo.tipo === 'number') {
      document.getElementById('field-min').value = campo.min || '';
      document.getElementById('field-max').value = campo.max || '';
      document.getElementById('field-step').value = campo.step || '0.01';
    }
    
    if (campo.tipo === 'textarea') {
      document.getElementById('field-rows').value = campo.rows || 3;
    }

    this.onFieldTypeChange();
    document.getElementById('modal-field').classList.add('show');
  },

  deleteField(campoId) {
    showConfirmModal(
      '¿Estás seguro de eliminar este campo? Los datos asociados no se perderán pero no aparecerán en el formulario.',
      () => {
        try {
          ConfigModel.deleteField(this.currentModule, campoId);
          this.render();
        } catch (error) {
          alert(error.message);
        }
      }
    );
  },

  onFieldTypeChange() {
    const tipo = document.getElementById('field-tipo').value;
    
    document.getElementById('select-options-container').classList.toggle('hidden', tipo !== 'select');
    document.getElementById('number-options-container').classList.toggle('hidden', tipo !== 'number');
    document.getElementById('textarea-options-container').classList.toggle('hidden', tipo !== 'textarea');

    if (tipo === 'select') {
      this.renderSelectOptions();
    }
  },

  renderSelectOptions() {
    const container = document.getElementById('select-options-list');
    const opciones = this.currentField?.opciones || [];
    if (opciones.length === 0) {
      container.innerHTML = '<p class="text-muted">No hay opciones. Añade al menos una.</p>';
      return;
    }
    container.innerHTML = '';
    opciones.forEach((opcion, index) => {
      const div = document.createElement('div');
      div.className = 'option-item draggable';
      div.draggable = true;
      div.dataset.index = index;
      div.innerHTML = `
        <span>${opcion.icono || ''} ${opcion.valor}</span>
        <button type="button" class="btn btn-small btn-danger" onclick="ConfigController.removeOption(${index})">🗑️</button>
      `;
      // Drag events
      div.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index);
        div.classList.add('dragging');
      });
      div.addEventListener('dragend', () => {
        div.classList.remove('dragging');
      });
      div.addEventListener('dragover', (e) => {
        e.preventDefault();
        div.classList.add('drag-over');
      });
      div.addEventListener('dragleave', () => {
        div.classList.remove('drag-over');
      });
      div.addEventListener('drop', (e) => {
        e.preventDefault();
        div.classList.remove('drag-over');
        const from = parseInt(e.dataTransfer.getData('text/plain'));
        const to = index;
        if (from !== to) {
          const moved = opciones.splice(from, 1)[0];
          opciones.splice(to, 0, moved);
          this.renderSelectOptions();
        }
      });
      container.appendChild(div);
    });
  },

  saveField(event) {
    event.preventDefault();
    
    const campoId = document.getElementById('field-id').value;
    const campoData = {
      nombre: document.getElementById('field-nombre').value,
      tipo: document.getElementById('field-tipo').value,
      obligatorio: document.getElementById('field-obligatorio').checked,
      placeholder: document.getElementById('field-placeholder').value
    };

    if (campoData.tipo === 'number') {
      campoData.step = document.getElementById('field-step').value;
      campoData.min = document.getElementById('field-min').value;
      campoData.max = document.getElementById('field-max').value;
    }

    if (campoData.tipo === 'textarea') {
      campoData.rows = parseInt(document.getElementById('field-rows').value);
    }

    if (campoData.tipo === 'select') {
      if (!this.currentField?.opciones || this.currentField.opciones.length === 0) {
        alert('Debes añadir al menos una opción para un campo de lista');
        return;
      }
      campoData.opciones = this.currentField.opciones;
    }

    try {
      if (campoId) {
        ConfigModel.updateField(this.currentModule, campoId, campoData);
      } else {
        ConfigModel.addCustomField(this.currentModule, campoData);
      }
      
      this.closeFieldModal();
      this.render();
    } catch (error) {
      alert(error.message);
    }
  },

  closeFieldModal() {
    document.getElementById('modal-field').classList.remove('show');
    this.currentField = null;
  },

  showAddOptionModal() {
    document.getElementById('option-form').reset();
    document.getElementById('modal-option').classList.add('show');
  },

  saveOption(event) {
    event.preventDefault();
    
    const valor = document.getElementById('option-valor').value;
    const icono = document.getElementById('option-icono').value;
    
    if (!this.currentField) {
      this.currentField = { opciones: [] };
    }
    if (!this.currentField.opciones) {
      this.currentField.opciones = [];
    }

    this.currentField.opciones.push({
      valor: valor,
      etiqueta: `${icono} ${valor}`,
      icono: icono
    });

    this.renderSelectOptions();
    this.closeOptionModal();
  },

  removeOption(index) {
    if (this.currentField?.opciones) {
      this.currentField.opciones.splice(index, 1);
      this.renderSelectOptions();
    }
  },

  closeOptionModal() {
    document.getElementById('modal-option').classList.remove('show');
  },

  showIconPicker() {
    document.getElementById('modal-icons').classList.add('show');
  },

  selectIcon(icon) {
    document.getElementById('option-icono').value = icon;
    document.getElementById('option-icono-preview').value = icon;
    this.closeIconPicker();
  },

  closeIconPicker() {
    document.getElementById('modal-icons').classList.remove('show');
  },

  resetModule() {
    showConfirmModal(
      `¿Estás seguro de restablecer la configuración de ${this.currentModule} a los valores por defecto? Se perderán todos los campos personalizados.`,
      () => {
        ConfigModel.resetToDefault(this.currentModule);
        this.render();
      }
    );
  },

  getFieldTypeLabel(tipo) {
    const labels = {
      text: 'Texto',
      number: 'Número',
      date: 'Fecha',
      select: 'Lista',
      textarea: 'Área de Texto',
      checkbox: 'Casilla'
    };
    return labels[tipo] || tipo;
  },

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};

window.ConfigController = ConfigController;
Logger.log('ConfigController cargado');
