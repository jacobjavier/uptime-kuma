const Database = require("../server/database");
const { R } = require("redbean-node");
const { log } = require("../src/util");

/**
 * Script de migración para cambiar referencias de Uptime Kuma a iCentral
 */
async function migrateToICentral() {
    try {
        log.info("migrate", "Iniciando migración a iCentral...");
        
        // Inicializar base de datos
        Database.initDataDir({});
        await Database.connect();
        
        // Actualizar páginas de estado con título por defecto
        log.info("migrate", "Actualizando páginas de estado...");
        await R.exec(`
            UPDATE status_page 
            SET title = REPLACE(title, 'Uptime Kuma', 'iCentral')
            WHERE title LIKE '%Uptime Kuma%'
        `);
        
        // Actualizar descripciones
        await R.exec(`
            UPDATE status_page 
            SET description = REPLACE(description, 'Uptime Kuma', 'iCentral')
            WHERE description LIKE '%Uptime Kuma%'
        `);
        
        // Actualizar configuraciones
        log.info("migrate", "Actualizando configuraciones...");
        const settings = await R.getAll("SELECT * FROM setting WHERE value LIKE '%Uptime Kuma%'");
        
        for (const setting of settings) {
            const newValue = setting.value.replace(/Uptime Kuma/g, 'iCentral');
            await R.exec("UPDATE setting SET value = ? WHERE id = ?", [newValue, setting.id]);
        }
        
        log.info("migrate", "Migración completada exitosamente");
        
        await Database.close();
        process.exit(0);
    } catch (error) {
        log.error("migrate", "Error durante la migración: " + error.message);
        process.exit(1);
    }
}

// Ejecutar migración
migrateToICentral();
