// MongoDB Configuration
// IMPORTANTE: Reemplaza estos valores con tus credenciales de MongoDB Atlas
const MongoDBConfig = {
  // URL de conexión a MongoDB Atlas
  // Formato: mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<database>
  connectionString: 'TU_CONNECTION_STRING_AQUI',
  
  // Nombre de la base de datos
  database: 'finanzas_personales',
  
  // Nombres de las colecciones
  collections: {
    gastos: 'gastos',
    ingresos: 'ingresos',
    deudas: 'deudas',
    prestamos: 'prestamos',
    activos: 'activos',
    pasivos: 'pasivos'
  },
  
  // Opciones de configuración
  options: {
    retryWrites: true,
    w: 'majority'
  },
  
  // Estado de conexión
  isConnected: false,
  
  // Método para verificar si está configurado
  isConfigured() {
    return this.connectionString !== 'TU_CONNECTION_STRING_AQUI';
  },
  
  // Método para obtener la configuración
  getConfig() {
    return {
      connectionString: this.connectionString,
      database: this.database,
      collections: this.collections,
      options: this.options
    };
  }
};

// Exportar para uso global
window.MongoDBConfig = MongoDBConfig;

// Nota: Por simplicidad, usaremos localStorage para simular MongoDB Atlas
// En una implementación real con MongoDB Atlas, necesitarías:
// 1. MongoDB Realm SDK o MongoDB Data API
// 2. Autenticación con API Key
// 3. Endpoints HTTPS para las operaciones CRUD

Logger.log('MongoDB Config cargado');
if (!MongoDBConfig.isConfigured()) {
  Logger.warn('MongoDB no configurado - usando localStorage como fallback');
}
