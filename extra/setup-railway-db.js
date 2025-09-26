const Database = require("../server/database");
const { log } = require("../src/util");

/**
 * Script de configuración para PostgreSQL en Railway
 * Este script configurará automáticamente la base de datos usando DATABASE_URL de Railway
 */
async function setupRailwayDatabase() {
    try {
        log.info("setup-railway", "🚂 Iniciando configuración de base de datos para Railway");
        
        // Verificar DATABASE_URL
        if (!process.env.DATABASE_URL) {
            log.warn("setup-railway", "⚠️ DATABASE_URL no está configurada");
            log.info("setup-railway", "Railway configurará esto automáticamente cuando agregues PostgreSQL");
            log.info("setup-railway", "Por ahora, usando SQLite como fallback");
            
            // Configurar SQLite como fallback
            const dbConfig = {
                type: "sqlite"
            };
            
            Database.writeDBConfig(dbConfig);
            log.info("setup-railway", "✅ Configurado con SQLite (temporal)");
        } else {
            log.info("setup-railway", "✅ DATABASE_URL detectada");
            
            // Configurar para PostgreSQL
            const dbConfig = {
                type: "postgres"
            };
            
            // Inicializar directorio de datos
            Database.initDataDir({});
            
            // Escribir configuración
            Database.writeDBConfig(dbConfig);
            
            log.info("setup-railway", "✅ Base de datos PostgreSQL configurada");
            log.info("setup-railway", "🎉 Configuración completada exitosamente");
        }
        
        process.exit(0);
    } catch (error) {
        log.error("setup-railway", "❌ Error durante la configuración: " + error.message);
        log.error("setup-railway", error.stack);
        process.exit(1);
    }
}

// Ejecutar configuración
setupRailwayDatabase();
