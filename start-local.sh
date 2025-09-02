#!/bin/bash

echo "🚀 Iniciando iCentral en modo desarrollo..."

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker no está instalado${NC}"
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}Error: Docker Compose no está instalado${NC}"
    exit 1
fi

# Función para ejecutar docker-compose
run_compose() {
    if command -v docker-compose &> /dev/null; then
        docker-compose "$@"
    else
        docker compose "$@"
    fi
}

# Limpiar contenedores antiguos si existen
echo -e "${YELLOW}Limpiando contenedores antiguos...${NC}"
run_compose -f docker-compose.dev.yml down

# Iniciar PostgreSQL primero
echo -e "${GREEN}Iniciando PostgreSQL...${NC}"
run_compose -f docker-compose.dev.yml up -d postgres

# Esperar a que PostgreSQL esté listo
echo -e "${YELLOW}Esperando a que PostgreSQL esté listo...${NC}"
sleep 5

# Verificar si necesitamos instalar dependencias
if [ ! -d "node_modules" ]; then
    echo -e "${GREEN}Instalando dependencias...${NC}"
    npm install
fi

# Cargar variables de entorno
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Ejecutar setup de PostgreSQL
echo -e "${GREEN}Configurando base de datos...${NC}"
npm run setup-postgres

# Iniciar la aplicación en modo desarrollo
echo -e "${GREEN}Iniciando iCentral...${NC}"
npm run dev
