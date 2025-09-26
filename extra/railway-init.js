const Database = require("../server/database");
const { log } = require("../src/util");

/**
 * Inicialización automática para Railway
 * Se ejecuta al inicio del servidor para configurar la base de datos
 */
function initializeRailwayDatabase() {
    try {
        log.info("railway-init", "🚂 Inicializando base de datos para Railway");
        
        // Inicializar directorio de datos
        Database.initDataDir({});
        
        // Verificar si ya existe configuración
        const existingConfig = Database.readDBConfig();
        if (existingConfig && existingConfig.type) {
            log.info("railway-init", `✅ Configuración existente encontrada: ${existingConfig.type}`);
            return;
        }
        
        // Configurar base de datos según variables de entorno
        let dbConfig;
        
        // Forzar SQLite para evitar problemas de migración con PostgreSQL en Railway
        log.info("railway-init", "🔧 Forzando SQLite para evitar problemas de migración PostgreSQL");
        log.info("railway-init", "✅ Usando SQLite (más estable para Railway)");
        dbConfig = {
            type: "sqlite"
        };
        
        // Escribir configuración
        Database.writeDBConfig(dbConfig);
        log.info("railway-init", `✅ Base de datos configurada: ${dbConfig.type}`);
        
    } catch (error) {
        log.error("railway-init", "❌ Error durante inicialización: " + error.message);
        
        // Fallback a SQLite en caso de error
        try {
            const fallbackConfig = { type: "sqlite" };
            Database.writeDBConfig(fallbackConfig);
            log.info("railway-init", "✅ Configuración de emergencia aplicada (SQLite)");
        } catch (fallbackError) {
            log.error("railway-init", "❌ Error crítico en fallback: " + fallbackError.message);
        }
    }
}

module.exports = { initializeRailwayDatabase };
