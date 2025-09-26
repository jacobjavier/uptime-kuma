#!/bin/bash
set -e

echo "🚂 Iniciando iCentral en Railway..."

# Mostrar información del entorno
echo "Node.js version: $(node --version)"
echo "Environment: $NODE_ENV"
echo "Data directory: $DATA_DIR"

# Verificar variables de entorno críticas
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️ WARNING: DATABASE_URL no está configurada"
    echo "La aplicación usará SQLite como fallback"
else
    echo "✅ DATABASE_URL configurada"
fi

# Crear directorio de datos si no existe
mkdir -p "$DATA_DIR"
echo "✅ Directorio de datos preparado: $DATA_DIR"

# Configurar la base de datos
echo "🗄️ Configurando base de datos..."
if [ -n "$DATABASE_URL" ]; then
    echo "Configurando PostgreSQL..."
    node -e "
    const Database = require('./server/database');
    const { log } = require('./src/util');
    
    try {
        Database.initDataDir({});
        const dbConfig = { type: 'postgres' };
        Database.writeDBConfig(dbConfig);
        log.info('railway-start', '✅ PostgreSQL configurado');
    } catch (error) {
        log.error('railway-start', 'Error configurando PostgreSQL: ' + error.message);
        process.exit(1);
    }
    "
else
    echo "Configurando SQLite como fallback..."
    node -e "
    const Database = require('./server/database');
    const { log } = require('./src/util');
    
    try {
        Database.initDataDir({});
        const dbConfig = { type: 'sqlite' };
        Database.writeDBConfig(dbConfig);
        log.info('railway-start', '✅ SQLite configurado');
    } catch (error) {
        log.error('railway-start', 'Error configurando SQLite: ' + error.message);
        process.exit(1);
    }
    "
fi

echo "🚀 Iniciando servidor..."
exec node server/server.js
