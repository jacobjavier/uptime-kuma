const Database = require("../server/database");
const { log } = require("../src/util");
const fs = require("fs");
const path = require("path");

/**
 * Setup script for PostgreSQL on Fly.io
 * This script will automatically configure the database connection using DATABASE_URL
 */
async function setupPostgres() {
    try {
        log.info("setup-postgres", "Starting PostgreSQL setup for Fly.io");
        
        // Initialize data directory
        Database.initDataDir({});
        
        // Check if DATABASE_URL is provided
        if (!process.env.DATABASE_URL) {
            log.error("setup-postgres", "DATABASE_URL environment variable is not set");
            process.exit(1);
        }
        
        // Create db-config.json for PostgreSQL
        const dbConfig = {
            type: "postgres",
            // The actual connection will use DATABASE_URL in database.js
        };
        
        log.info("setup-postgres", "Writing database configuration");
        Database.writeDBConfig(dbConfig);
        
        log.info("setup-postgres", "PostgreSQL setup completed successfully");
        process.exit(0);
    } catch (error) {
        log.error("setup-postgres", "Setup failed: " + error.message);
        process.exit(1);
    }
}

// Run setup
setupPostgres();
