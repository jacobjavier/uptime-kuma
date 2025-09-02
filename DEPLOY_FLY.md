# Despliegue de iCentral en Fly.io

## Prerrequisitos

1. Tener una cuenta en [Fly.io](https://fly.io)
2. Instalar el CLI de Fly: `curl -L https://fly.io/install.sh | sh`
3. Autenticarse: `flyctl auth login`

## Pasos para el despliegue

### 1. Crear la aplicación en Fly.io

```bash
# Crear la aplicación (no ejecutar launch)
flyctl apps create icentral

# Configurar la región principal
flyctl regions set mia
```

### 2. Crear la base de datos PostgreSQL

```bash
# Crear un cluster de PostgreSQL
flyctl postgres create --name icentral-db --region mia

# Adjuntar la base de datos a la aplicación
flyctl postgres attach icentral-db --app icentral
```

### 3. Crear el volumen para datos persistentes

```bash
flyctl volumes create icentral_data --region mia --size 2
```

### 4. Configurar secretos

```bash
# La conexión a PostgreSQL se configura automáticamente con DATABASE_URL
# pero puede agregar otras variables si es necesario:

flyctl secrets set NODE_ENV=production --app icentral
```

### 5. Desplegar la aplicación

```bash
# Desplegar usando el archivo fly.toml
flyctl deploy
```

### 6. Escalar la aplicación (opcional)

```bash
# Para alta disponibilidad, puede escalar a múltiples instancias
flyctl scale count 2 --app icentral
```

## Configuración posterior al despliegue

1. Acceder a la aplicación:
   ```bash
   flyctl open
   ```

2. Ver los logs:
   ```bash
   flyctl logs
   ```

3. SSH a la instancia (para debugging):
   ```bash
   flyctl ssh console
   ```

## Actualización

Para actualizar iCentral:

```bash
git pull origin main
flyctl deploy
```

## Backup de la base de datos

```bash
# Crear un snapshot manual
flyctl postgres backup create --app icentral-db

# Listar backups
flyctl postgres backup list --app icentral-db
```

## Monitoreo

- Los métricas están disponibles en: https://fly.io/apps/icentral/metrics
- Configure alertas en el dashboard de Fly.io

## Solución de problemas

1. Si la aplicación no inicia, revise los logs:
   ```bash
   flyctl logs --app icentral
   ```

2. Para reiniciar la aplicación:
   ```bash
   flyctl restart --app icentral
   ```

3. Para verificar el estado de la base de datos:
   ```bash
   flyctl postgres status --app icentral-db
   ```

## Notas importantes

- El volumen `icentral_data` persiste los datos de la aplicación
- La base de datos PostgreSQL tiene backups automáticos diarios
- SSL está habilitado por defecto en Fly.io
- El health check está configurado para reiniciar la aplicación si falla
