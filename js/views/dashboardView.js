// Dashboard View - Vista principal con gráficos
const DashboardView = {
  charts: {},
  
  render() {
    const mainContent = document.getElementById('main-content');
    const gastos = GastoModel.getAll();
    const ingresos = IngresoModel.getAll();
    const mesActual = Calculations.obtenerMesActual();
    const balance = Calculations.calcularBalanceMensual(ingresos, gastos, mesActual.mes, mesActual.anio);
    const patrimonio = PatrimonioModel.getResumen();
    
    // Calcular cambios del mes anterior
    const mesAnterior = new Date();
    mesAnterior.setMonth(mesAnterior.getMonth() - 1);
    const balanceAnterior = Calculations.calcularBalanceMensual(
      ingresos, gastos, mesAnterior.getMonth() + 1, mesAnterior.getFullYear()
    );
    
    mainContent.innerHTML = `
      <div class="container">
        <div class="dashboard-header">
          <h1 class="dashboard-title">Dashboard Financiero</h1>
          <p class="dashboard-subtitle">${mesActual.texto}</p>
        </div>
        
        <!-- Tarjetas de resumen -->
        <div class="summary-cards">
          <div class="summary-card ingresos">
            <div class="summary-card-icon">💰</div>
            <div class="summary-card-label">Ingresos del Mes</div>
            <div class="summary-card-value">${Calculations.formatearMoneda(balance.ingresos)}</div>
            <div class="summary-card-change">${ingresos.length} registros</div>
          </div>
          
          <div class="summary-card gastos">
            <div class="summary-card-icon">💸</div>
            <div class="summary-card-label">Gastos del Mes</div>
            <div class="summary-card-value">${Calculations.formatearMoneda(balance.gastos)}</div>
            <div class="summary-card-change">${gastos.length} registros</div>
          </div>
          
          <div class="summary-card balance">
            <div class="summary-card-icon">📊</div>
            <div class="summary-card-label">Balance del Mes</div>
            <div class="summary-card-value">${Calculations.formatearMoneda(balance.balance)}</div>
            <div class="summary-card-change">
              ${balance.balance >= 0 ? '✅ Positivo' : '⚠️ Negativo'}
            </div>
          </div>
          
          <div class="summary-card patrimonio">
            <div class="summary-card-icon">🏦</div>
            <div class="summary-card-label">Patrimonio Neto</div>
            <div class="summary-card-value">${Calculations.formatearMoneda(patrimonio.patrimonioNeto)}</div>
            <div class="summary-card-change">
              Activos: ${Calculations.formatearMoneda(patrimonio.activos)}
            </div>
          </div>
        </div>
        
        <!-- Gráficos -->
        <div class="charts-container">
          <div class="chart-card">
            <h3 class="chart-title">Flujo de Efectivo (6 meses)</h3>
            <canvas id="chart-cashflow" class="chart-canvas"></canvas>
          </div>
          
          <div class="chart-card">
            <h3 class="chart-title">Gastos por Categoría</h3>
            <canvas id="chart-categorias" class="chart-canvas"></canvas>
          </div>
        </div>
        
        <div class="charts-container">
          <div class="chart-card">
            <h3 class="chart-title">Ingresos vs Gastos</h3>
            <canvas id="chart-comparacion" class="chart-canvas"></canvas>
          </div>
          
          <div class="chart-card">
            <h3 class="chart-title">Patrimonio</h3>
            <canvas id="chart-patrimonio" class="chart-canvas"></canvas>
          </div>
        </div>
        
        <!-- Transacciones recientes -->
        <div class="card recent-transactions">
          <h3 class="card-title">Transacciones Recientes</h3>
          ${this.renderTransaccionesRecientes(gastos, ingresos)}
        </div>
      </div>
    `;
    
    // Renderizar gráficos
    this.renderCharts();
  },
  
  renderTransaccionesRecientes(gastos, ingresos) {
    // Combinar y ordenar por fecha
    const todas = [
      ...gastos.map(g => ({...g, tipo: 'gasto'})),
      ...ingresos.map(i => ({...i, tipo: 'ingreso'}))
    ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 10);
    
    if (todas.length === 0) {
      return '<div class="empty-state"><div class="empty-state-text">No hay transacciones recientes</div></div>';
    }
    
    return todas.map(t => `
      <div class="transaction-item">
        <div class="transaction-info">
          <div class="transaction-description">
            ${t.tipo === 'gasto' ? '💸' : '💰'} ${t.descripcion || (t.categoria || t.tipo)}
          </div>
          <div class="transaction-meta">
            ${new Date(t.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
        <div class="transaction-amount ${t.tipo}">
          ${t.tipo === 'gasto' ? '-' : '+'}${Calculations.formatearMoneda(t.monto)}
        </div>
      </div>
    `).join('');
  },
  
  renderCharts() {
    this.renderCashflowChart();
    this.renderCategoriasChart();
    this.renderComparacionChart();
    this.renderPatrimonioChart();
  },
  
  renderCashflowChart() {
    const ctx = document.getElementById('chart-cashflow');
    if (!ctx) return;
    
    const gastos = GastoModel.getAll();
    const ingresos = IngresoModel.getAll();
    const cashflow = Calculations.calcularCashflow(ingresos, gastos, 6);
    
    if (this.charts.cashflow) {
      this.charts.cashflow.destroy();
    }
    
    this.charts.cashflow = new Chart(ctx, {
      type: 'line',
      data: {
        labels: cashflow.map(c => c.mes),
        datasets: [
          {
            label: 'Ingresos',
            data: cashflow.map(c => c.ingresos),
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.4
          },
          {
            label: 'Gastos',
            data: cashflow.map(c => c.gastos),
            borderColor: '#f44336',
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            tension: 0.4
          },
          {
            label: 'Balance',
            data: cashflow.map(c => c.balance),
            borderColor: '#2196F3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  },
  
  renderCategoriasChart() {
    const ctx = document.getElementById('chart-categorias');
    if (!ctx) return;
    
    const gastos = GastoModel.getAll();
    const categorias = Calculations.calcularTotalPorCategoria(gastos);
    
    if (this.charts.categorias) {
      this.charts.categorias.destroy();
    }
    
    const colores = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
      '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
    ];
    
    this.charts.categorias = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(categorias),
        datasets: [{
          data: Object.values(categorias),
          backgroundColor: colores,
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });
  },
  
  renderComparacionChart() {
    const ctx = document.getElementById('chart-comparacion');
    if (!ctx) return;
    
    const gastos = GastoModel.getAll();
    const ingresos = IngresoModel.getAll();
    const cashflow = Calculations.calcularCashflow(ingresos, gastos, 6);
    
    if (this.charts.comparacion) {
      this.charts.comparacion.destroy();
    }
    
    this.charts.comparacion = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: cashflow.map(c => c.mes),
        datasets: [
          {
            label: 'Ingresos',
            data: cashflow.map(c => c.ingresos),
            backgroundColor: '#4CAF50'
          },
          {
            label: 'Gastos',
            data: cashflow.map(c => c.gastos),
            backgroundColor: '#f44336'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  },
  
  renderPatrimonioChart() {
    const ctx = document.getElementById('chart-patrimonio');
    if (!ctx) return;
    
    const resumen = PatrimonioModel.getResumen();
    
    if (this.charts.patrimonio) {
      this.charts.patrimonio.destroy();
    }
    
    this.charts.patrimonio = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Patrimonio'],
        datasets: [
          {
            label: 'Activos',
            data: [resumen.activos],
            backgroundColor: '#4CAF50'
          },
          {
            label: 'Pasivos',
            data: [resumen.pasivos],
            backgroundColor: '#f44336'
          },
          {
            label: 'Neto',
            data: [resumen.patrimonioNeto],
            backgroundColor: '#2196F3'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
};

window.DashboardView = DashboardView;
Logger.log('DashboardView inicializado');
