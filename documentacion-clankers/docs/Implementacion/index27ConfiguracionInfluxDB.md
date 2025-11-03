---
slug: /configuracion-influxdb
title: Configuración InfluxDB
sidebar_label: Configuración InfluxDB
---

## Instalación de InfluxDB con Docker

### Introducción

InfluxDB es una base de datos de series temporales de código abierto, optimizada para el almacenamiento y consulta rápida de datos de monitoreo, métricas y eventos. Esta guía proporciona los pasos necesarios para desplegar InfluxDB usando Docker, incluyendo la configuración para recibir métricas de Proxmox y su integración con Grafana.

### Requisitos Previos

- Docker Engine instalado y en ejecución
- Acceso a la línea de comandos con permisos sudo
- Puerto 8086 disponible en el servidor
- Conexión a Internet para descargar la imagen de InfluxDB
- (Opcional) Cluster de Proxmox configurado para envío de métricas

### Diferencias entre InfluxDB 1.x y 2.x

| Característica | InfluxDB 1.x | InfluxDB 2.x |
|----------------|--------------|--------------|
| **Interfaz Web** | No incluida (solo CLI) | Interfaz web completa |
| **Autenticación** | Usuario/contraseña | Token de API |
| **Organización** | Databases | Organizations y Buckets |
| **Lenguaje de consulta** | InfluxQL | Flux (más potente) |
| **Configuración inicial** | Manual vía CLI | Asistente web interactivo |
| **Uso recomendado** | Sistemas legacy | Nuevas implementaciones |

:::info **Recomendación**
Para nuevas instalaciones se recomienda InfluxDB 2.x debido a su interfaz web, mejor seguridad y características avanzadas. Use InfluxDB 1.x solo si necesita compatibilidad con sistemas existentes.
:::

### Proceso de Instalación

#### Crear un volumen para persistencia

Crear un volumen de Docker para garantizar que los datos de InfluxDB persistan entre reinicios del contenedor:

```bash
docker volume create influxdb-storage
```

**Beneficios de usar volúmenes:**
- Preserva las métricas almacenadas entre reinicios
- Mantiene la configuración de la base de datos
- Permite backups y migraciones sencillas
- Protege contra pérdida de datos accidental

**Verificar el volumen creado:**

```bash
docker volume ls | grep influxdb
```

**Inspeccionar el volumen:**

```bash
docker volume inspect influxdb-storage
```

#### Descargar e iniciar el contenedor de InfluxDB

Dependiendo de la versión que se necesite usar, se debe ejecutar uno de los siguientes comandos:

#### InfluxDB 1.x (Versión 1.8 - Legacy)

```bash
docker run -d \
  -p 8086:8086 \
  --name=influxdb \
  -v influxdb-storage:/var/lib/influxdb \
  influxdb:1.8
```

#### InfluxDB 2.x (Versión 2.7 - Recomendada)

```bash
docker run -d \
  -p 8086:8086 \
  --name=influxdb \
  -v influxdb-storage:/var/lib/influxdb2 \
  influxdb:2.7
```

#### Explicación de los parámetros

| Parámetro | Descripción |
|-----------|-------------|
| `-d` | Ejecuta el contenedor en segundo plano (detached mode) |
| `-p 8086:8086` | Expone el puerto 8086 para las conexiones HTTP a InfluxDB |
| `--name=influxdb` | Asigna el nombre "influxdb" al contenedor |
| `-v influxdb-storage:/var/lib/influxdb` | Monta el volumen en la ruta de datos de InfluxDB 1.x |
| `-v influxdb-storage:/var/lib/influxdb2` | Monta el volumen en la ruta de datos de InfluxDB 2.x |
| `influxdb:1.8` o `influxdb:2.7` | Especifica la versión de la imagen de InfluxDB |

:::info **Nota sobre Proxy**
Si el servidor usa un proxy configurado en el daemon de Docker, InfluxDB descargará la imagen automáticamente sin necesidad de configuración adicional. El proxy se aplica de manera transparente a todas las operaciones de Docker.
:::

#### Verificar que el contenedor esté en ejecución

Comprobar el estado del contenedor de InfluxDB:

```bash
docker ps
```

**Salida esperada:**

```
CONTAINER ID   IMAGE         COMMAND                  CREATED         STATUS         PORTS                    NAMES
abcd1234       influxdb:2.7  "/entrypoint.sh infl…"   2 minutes ago   Up 2 minutes   0.0.0.0:8086->8086/tcp   influxdb
```

**Comandos adicionales de verificación:**

```bash
# Ver logs del contenedor
docker logs influxdb

# Ver logs en tiempo real
docker logs -f influxdb

# Verificar el estado detallado
docker inspect influxdb

# Verificar uso de recursos
docker stats influxdb
```

#### Acceder a InfluxDB

#### Para InfluxDB 2.x (Interfaz Web)

Abrir un navegador web y acceder a:

```
http://<IP_DE_TU_SERVIDOR>:8086
```

**Ejemplos de URLs:**
- Servidor local: `http://localhost:8086`
- Servidor en red local: `http://192.168.1.100:8086`
- Servidor público: `http://tu-dominio.com:8086`

Se mostrará la pantalla de configuración inicial de InfluxDB 2.x.

#### Para InfluxDB 1.x (CLI)

InfluxDB 1.x no tiene interfaz web. Se accede mediante CLI o directamente desde Grafana:

```bash
# Acceder al CLI de InfluxDB
docker exec -it influxdb influx

# Verificar que está funcionando
docker exec -it influxdb influx -execute "SHOW DATABASES"
```

**Probar con curl:**

```bash
curl -i http://localhost:8086/ping
```

**Respuesta esperada:**
```
HTTP/1.1 204 No Content
```

#### Configurar reinicio automático

Para que el contenedor se inicie automáticamente cuando el servidor se reinicie:

```bash
docker update --restart=always influxdb
```

**Verificar la configuración:**

```bash
docker inspect influxdb | grep RestartPolicy -A 3
```

### Configuración Inicial de InfluxDB 2.x

#### Acceder al asistente de configuración

1. Abrir el navegador y acceder a `http://<IP_SERVIDOR>:8086`
2. Se mostrará la pantalla de bienvenida "Welcome to InfluxDB 2.0"
3. Hacer clic en **"Get Started"**

### Configurar usuario y organización

Completar el formulario con la siguiente información:

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **Username** | Nombre de usuario administrador | `admin` |
| **Password** | Contraseña segura (mínimo 8 caracteres) | `Admin123!` |
| **Confirm Password** | Confirmar la contraseña | `Admin123!` |
| **Organization Name** | Nombre de la organización | `mi-organizacion` |
| **Bucket Name** | Nombre del bucket inicial | `proxmox` o `telegraf` |

**Hacer clic en "Continue"**

#### Seleccionar método de configuración

InfluxDB 2.x ofrece dos opciones:

1. **Quick Start**: Configuración rápida con valores predeterminados
2. **Advanced**: Configuración manual detallada

**Para este caso, seleccionar "Advanced"** para tener control completo sobre la configuración.

#### Configurar el bucket para Proxmox

| Campo | Valor Recomendado | Descripción |
|-------|-------------------|-------------|
| **Bucket Name** | `proxmox` | Nombre descriptivo del bucket |
| **Retention Period** | `30 days` o `90 days` | Tiempo de retención de datos |

**Hacer clic en "Create"**

#### Obtener y guardar el Token de API

:::warning **Importante: Guardar el Token**
El token de API se muestra **solo una vez** durante la configuración inicial. Es fundamental copiarlo y guardarlo en un lugar seguro, ya que será necesario para:
- Configurar Proxmox Metric Server
- Configurar Grafana como fuente de datos
- Cualquier aplicación que necesite escribir datos en InfluxDB
:::

**Pasos para obtener el token:**

1. Después de crear el bucket, InfluxDB mostrará el token de API
2. Hacer clic en **"Copy to Clipboard"** para copiar el token
3. Guardar el token en un archivo seguro o gestor de contraseñas

**El token tendrá un formato similar a:**
```
j8xK_qL9mN3pR5tV7wX2yZ4aB6cD8eF0gH2iJ4kL6mN8oP0qR2sT4uV6wX8yZ0==
```

**Si olvidaste copiar el token, puedes recuperarlo:**

1. Hacer clic en el icono de usuario en la esquina superior derecha
2. Seleccionar **"Tokens"** o **"API Tokens"**
3. Localizar el token principal (generalmente llamado "Admin's Token")
4. Hacer clic en el nombre del token para ver sus detalles
5. Copiar el token desde ahí

**Alternativamente, crear un nuevo token:**

```bash
# Desde el CLI del contenedor
docker exec -it influxdb influx auth list
```

#### Finalizar configuración

1. Hacer clic en **"Configure Later"** o **"Finish"**
2. Se mostrará el dashboard principal de InfluxDB 2.x
3. La instalación está completa

### Configuración de Proxmox Metric Server

#### Requisitos previos

- Cluster de Proxmox configurado y funcionando
- InfluxDB 2.x instalado y configurado
- Token de API de InfluxDB guardado
- Conectividad de red entre Proxmox e InfluxDB

#### Acceder a la configuración de Metric Server en Proxmox

1. Iniciar sesión en la interfaz web de Proxmox
2. En el panel izquierdo, seleccionar **"Datacenter"** (nivel superior del cluster)
3. Expandir el menú **"Datacenter"**
4. Hacer clic en **"Metric Server"**

#### Agregar nuevo Metric Server

1. En la parte superior de la ventana de Metric Server, hacer clic en el botón **"Add"**
2. En el menú desplegable, seleccionar **"InfluxDB"**

#### Configurar la conexión a InfluxDB

Se mostrará un formulario con los siguientes campos:

#### Configuración Básica

| Campo | Valor | Descripción |
|-------|-------|-------------|
| **ID** | `influxdb` | Identificador único del metric server |
| **Server** | `<IP_SERVIDOR>` | Dirección IP o hostname del servidor InfluxDB |
| **Port** | `8086` | Puerto de InfluxDB (predeterminado) |
| **Protocol** | `http` | Protocolo de conexión (usar HTTP sin SSL) |

:::info **Protocolo HTTP vs HTTPS**
Para configuraciones básicas y redes locales, usar **HTTP** es suficiente. Para ambientes de producción con conexiones a través de Internet, se recomienda configurar HTTPS con certificados SSL/TLS.
:::

#### Configuración de InfluxDB 2.x

| Campo | Valor | Descripción |
|-------|-------|-------------|
| **Organization** | `mi-organizacion` | Nombre de la organización configurada en InfluxDB |
| **Bucket** | `proxmox` | Nombre del bucket donde se almacenarán las métricas |
| **Token** | `tu-token-de-api` | Token de API copiado durante la configuración de InfluxDB |

**Ejemplo de configuración completa:**

```
ID: influxdb
Server: 192.168.1.100
Port: 8086
Protocol: http
Organization: mi-organizacion
Bucket: proxmox
Token: j8xK_qL9mN3pR5tV7wX2yZ4aB6cD8eF0gH2iJ4kL6mN8oP0qR2sT4uV6wX8yZ0==
```

### Paso 4: Configuraciones adicionales (Opcionales)

#### Opciones Avanzadas

| Campo | Valor Predeterminado | Descripción |
|-------|----------------------|-------------|
| **Enable** | ✓ | Habilitar el envío de métricas inmediatamente |
| **Timeout** | `1` | Tiempo de espera en segundos |
| **Verify Certificate** | ❌ | Verificar certificado SSL (solo si usa HTTPS) |
| **MTU** | `1500` | Tamaño máximo de unidad de transmisión |

:::info **Timeout y rendimiento**
Un timeout de 1 segundo es adecuado para redes locales. Si InfluxDB está en un servidor remoto o hay latencia de red, considerar aumentar este valor a 3-5 segundos.
:::

#### Probar y guardar la configuración

1. Hacer clic en el botón **"Test"** para verificar la conectividad
2. Proxmox intentará conectarse a InfluxDB y enviar datos de prueba
3. Si la prueba es exitosa, aparecerá un mensaje: **"Connection successful"** ✅
4. Hacer clic en **"Add"** o **"OK"** para guardar la configuración

**Mensajes de error comunes:**

| Error | Causa | Solución |
|-------|-------|----------|
| `Connection timeout` | No puede conectar con InfluxDB | Verificar IP, puerto y firewall |
| `Unauthorized` | Token inválido o sin permisos | Verificar el token y sus permisos |
| `Bucket not found` | El bucket no existe en InfluxDB | Crear el bucket en InfluxDB |
| `Organization not found` | Nombre de organización incorrecto | Verificar el nombre exacto en InfluxDB |

#### Verificar el envío de métricas

Una vez configurado, Proxmox comenzará a enviar métricas automáticamente a InfluxDB cada 10-30 segundos (configurable).

**Verificar en InfluxDB:**

1. Acceder a la interfaz web de InfluxDB: `http://<IP_SERVIDOR>:8086`
2. Hacer clic en **"Data Explorer"** (icono de gráfico en el menú lateral)
3. Seleccionar el bucket **"proxmox"**
4. Hacer clic en **"Submit"** para ejecutar la consulta
5. Deberían aparecer métricas de Proxmox (CPU, memoria, red, etc.)

**Verificar con una consulta Flux:**

```flux
from(bucket: "proxmox")
  |> range(start: -5m)
  |> filter(fn: (r) => r["_measurement"] == "cpustat")
  |> limit(n: 10)
```

**Verificar desde CLI:**

```bash
# Acceder al contenedor
docker exec -it influxdb bash

# Ejecutar consulta
influx query 'from(bucket:"proxmox") |> range(start: -5m) |> limit(n:10)'
```

#### Métricas que Proxmox envía a InfluxDB

Proxmox recopila y envía las siguientes métricas:

| Categoría | Métricas | Descripción |
|-----------|----------|-------------|
| **CPU** | `cpustat`, `cpu`, `iowait` | Uso de CPU, tiempo de espera I/O |
| **Memoria** | `memused`, `memtotal`, `swapused` | Uso de memoria RAM y swap |
| **Disco** | `diskread`, `diskwrite`, `diskused` | Lectura/escritura y uso de disco |
| **Red** | `netin`, `netout` | Tráfico de red entrante/saliente |
| **VM/CT** | `vmid`, `vmstatus`, `vmcpu`, `vmmem` | Estado y recursos de VMs y contenedores |

### Configuración de InfluxDB como Fuente de Datos en Grafana

:::info **Prerequisito**
Esta configuración debe realizarse después de haber completado:
1. La instalación de InfluxDB
2. La configuración del Metric Server en Proxmox
3. La obtención y guardado del Token de API
:::

#### Acceder a Grafana

1. Abrir navegador y acceder a `http://<IP_SERVIDOR>:3000`
2. Iniciar sesión con credenciales de administrador

#### Agregar fuente de datos

1. En el menú lateral izquierdo, hacer clic en el icono de engranaje ⚙️ (Configuration)
2. Seleccionar **"Data Sources"**
3. Hacer clic en **"Add data source"**
4. Buscar y seleccionar **"InfluxDB"**

### Configurar la conexión

#### Configuración Básica

| Campo | Valor | Descripción |
|-------|-------|-------------|
| **Name** | `InfluxDB-Proxmox` | Nombre descriptivo de la fuente de datos |
| **Default** | ✓ | Marcar como fuente de datos predeterminada |

#### Configuración de Query

| Campo | Valor | Descripción |
|-------|-------|-------------|
| **Query Language** | `Flux` | Seleccionar Flux como lenguaje de consulta |

#### Configuración HTTP

| Campo | Valor | Descripción |
|-------|-------|-------------|
| **URL** | `http://<IP_SERVIDOR>:8086` | URL del servidor InfluxDB |
| **Access** | `Server (default)` | Método de acceso |

**Ejemplos de URL:**
- Mismo servidor que Grafana: `http://localhost:8086`
- Servidor diferente: `http://192.168.1.100:8086`
- Contenedores en misma red Docker: `http://influxdb:8086`

#### Configuración de Autenticación (InfluxDB 2.x)

:::warning **Usar el Token de Proxmox**
**IMPORTANTE**: Usar el mismo token que se configuró en el Metric Server de Proxmox. Este token permite a Grafana leer las métricas que Proxmox está escribiendo en InfluxDB.
:::

| Campo | Valor | Descripción |
|-------|-------|-------------|
| **Organization** | `mi-organizacion` | Nombre de la organización en InfluxDB |
| **Token** | `tu-token-de-api` | **El mismo token usado en Proxmox** |
| **Default Bucket** | `proxmox` | Bucket donde Proxmox escribe las métricas |

**Ejemplo de configuración:**

```
Query Language: Flux
URL: http://192.168.1.100:8086
Organization: mi-organizacion
Token: j8xK_qL9mN3pR5tV7wX2yZ4aB6cD8eF0gH2iJ4kL6mN8oP0qR2sT4uV6wX8yZ0==
Default Bucket: proxmox
```

#### Probar la conexión

1. Hacer scroll hacia abajo en el formulario
2. Hacer clic en el botón **"Save & Test"**
3. Grafana intentará conectarse a InfluxDB
4. Si la configuración es correcta, aparecerá: **"datasource is working. 1 buckets found"** ✅

#### Crear un dashboard de Proxmox

Una vez configurada la fuente de datos, crear visualizaciones:

1. Hacer clic en **"+"** en el menú lateral
2. Seleccionar **"Dashboard"**
3. Hacer clic en **"Add new panel"**
4. En el query editor, escribir una consulta Flux:

**Ejemplo - Uso de CPU del host:**

```flux
from(bucket: "proxmox")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "cpustat")
  |> filter(fn: (r) => r["_field"] == "cpu")
  |> aggregateWindow(every: 30s, fn: mean, createEmpty: false)
```

**Ejemplo - Uso de memoria:**

```flux
from(bucket: "proxmox")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "memory")
  |> filter(fn: (r) => r["_field"] == "memused")
```

#### Dashboards preconfigurados para Proxmox

Grafana Labs ofrece dashboards comunitarios listos para usar con Proxmox:

1. Ir a **"Dashboards"** → **"Browse"**
2. Hacer clic en **"Import"**
3. Ingresar el ID del dashboard: **`18427`** (Proxmox via InfluxDB)
4. Hacer clic en **"Load"**
5. Seleccionar la fuente de datos InfluxDB configurada
6. Hacer clic en **"Import"**

**Otros dashboards populares:**
- **18127**:  Proxmox Flux Cluster
- **10048**:  Proxmox
- **15356**:  Proxmox Cluster

### Gestión del Contenedor de InfluxDB

#### Comandos básicos

```bash
# Ver logs del contenedor
docker logs influxdb

# Ver logs en tiempo real
docker logs -f influxdb

# Detener el contenedor
docker stop influxdb

# Iniciar el contenedor
docker start influxdb

# Reiniciar el contenedor
docker restart influxdb

# Eliminar el contenedor (datos persisten en el volumen)
docker rm influxdb

# Ver estadísticas de recursos
docker stats influxdb

# Acceder al shell del contenedor
docker exec -it influxdb bash

# Ejecutar CLI de InfluxDB
docker exec -it influxdb influx
```

#### Backup y restauración

#### Backup del volumen

```bash
# Detener el contenedor temporalmente
docker stop influxdb

# Crear backup del volumen
docker run --rm \
  -v influxdb-storage:/data \
  -v $(pwd):/backup \
  ubuntu tar czf /backup/influxdb-backup-$(date +%Y%m%d).tar.gz -C /data .

# Reiniciar el contenedor
docker start influxdb
```

#### Restaurar desde backup

```bash
# Detener el contenedor
docker stop influxdb

# Restaurar datos
docker run --rm \
  -v influxdb-storage:/data \
  -v $(pwd):/backup \
  ubuntu tar xzf /backup/influxdb-backup-20240101.tar.gz -C /data

# Reiniciar el contenedor
docker start influxdb
```

#### Backup nativo de InfluxDB 2.x

```bash
# Crear backup completo
docker exec influxdb influx backup /tmp/backup

# Copiar backup al host
docker cp influxdb:/tmp/backup ./influxdb-backup-$(date +%Y%m%d)

# Restaurar backup
docker exec influxdb influx restore /tmp/backup
```

### Configuración Avanzada

#### Variables de entorno para InfluxDB 2.x

```bash
docker run -d \
  -p 8086:8086 \
  --name=influxdb \
  -e DOCKER_INFLUXDB_INIT_MODE=setup \
  -e DOCKER_INFLUXDB_INIT_USERNAME=admin \
  -e DOCKER_INFLUXDB_INIT_PASSWORD=adminpassword \
  -e DOCKER_INFLUXDB_INIT_ORG=mi-organizacion \
  -e DOCKER_INFLUXDB_INIT_BUCKET=proxmox \
  -e DOCKER_INFLUXDB_INIT_RETENTION=30d \
  -e DOCKER_INFLUXDB_INIT_ADMIN_TOKEN=mi-token-personalizado \
  -v influxdb-storage:/var/lib/influxdb2 \
  influxdb:2.7
```

#### Docker Compose (Recomendado)

Crear archivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  influxdb:
    image: influxdb:2.7
    container_name: influxdb
    restart: always
    ports:
      - "8086:8086"
    volumes:
      - influxdb-storage:/var/lib/influxdb2
    environment:
      - DOCKER_INFLUXDB_INIT_MODE=setup
      - DOCKER_INFLUXDB_INIT_USERNAME=admin
      - DOCKER_INFLUXDB_INIT_PASSWORD=adminpassword
      - DOCKER_INFLUXDB_INIT_ORG=mi-organizacion
      - DOCKER_INFLUXDB_INIT_BUCKET=proxmox
      - DOCKER_INFLUXDB_INIT_RETENTION=30d
    networks:
      - monitoring

  grafana:
    image: grafana/grafana-oss:latest
    container_name: grafana
    restart: always
    ports:
      - "3000:3000"
    volumes:
      - grafana-storage:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    depends_on:
      - influxdb
    networks:
      - monitoring

volumes:
  influxdb-storage:
  grafana-storage:

networks:
  monitoring:
    driver: bridge
```

**Iniciar el stack:**

```bash
docker-compose up -d
```

### Configuración del Firewall

#### Abrir puerto 8086

#### UFW (Ubuntu/Debian)

```bash
sudo ufw allow 8086/tcp
sudo ufw reload
sudo ufw status
```

### Solución de Problemas

#### Problema: No se puede acceder a la interfaz web

**Verificar que el contenedor está corriendo:**

```bash
docker ps | grep influxdb
```

**Verificar logs:**

```bash
docker logs influxdb | tail -20
```

**Verificar puerto:**

```bash
sudo netstat -tulpn | grep 8086
```

#### Problema: Proxmox no puede conectarse a InfluxDB

**Verificar conectividad desde Proxmox:**

```bash
# En el nodo de Proxmox
curl -i http://<IP_INFLUXDB>:8086/ping

# Debería responder:
# HTTP/1.1 204 No Content
```

**Verificar firewall:**

```bash
# Verificar reglas
sudo ufw status
sudo firewall-cmd --list-all

# Verificar conectividad
telnet <IP_INFLUXDB> 8086
```

#### Problema: Token inválido o sin permisos

**Verificar tokens existentes:**

```bash
docker exec -it influxdb influx auth list
```

**Crear nuevo token con permisos completos:**

1. Acceder a InfluxDB web UI
2. Ir a **"Data"** → **"Tokens"**
3. Hacer clic en **"Generate Token"** → **"All Access Token"**
4. Guardar el nuevo token
5. Actualizar configuración en Proxmox y Grafana

#### Problema: No aparecen métricas en Grafana

**Verificar que Proxmox está enviando datos:**

```bash
# Consulta desde CLI
docker exec -it influxdb influx query '
from(bucket:"proxmox")
  |> range(start: -5m)
  |> limit(n: 10)
'
```

**Verificar en Data Explorer:**

1. Acceder a InfluxDB UI
2. Ir a **"Data Explorer"**
3. Seleccionar bucket "proxmox"
4. Verificar que hay datos recientes

### Monitoreo y Mantenimiento

#### Ver estadísticas de la base de datos

```bash
# Tamaño del volumen
docker system df -v | grep influxdb

# Espacio usado en disco
du -sh /var/lib/docker/volumes/influxdb-storage

# Estadísticas de buckets
docker exec -it influxdb influx bucket list
```

#### Limpiar datos antiguos

InfluxDB 2.x elimina automáticamente datos según la política de retención configurada en cada bucket. Para modificarla:

1. Acceder a InfluxDB UI
2. Ir a **"Data"** → **"Buckets"**
3. Hacer clic en el bucket "proxmox"
4. Modificar **"Retention Period"** (ej: 30d, 90d, infinite)
5. Guardar cambios

#### Optimización de rendimiento

```bash
# Aumentar recursos del contenedor
docker update --memory="4g" --cpus="2" influxdb

# Verificar uso actual
docker stats influxdb
```

### Seguridad

#### Recomendaciones

1. **Cambiar credenciales predeterminadas** inmediatamente
2. **Limitar acceso** al puerto 8086 mediante firewall
3. **Usar HTTPS** en producción con proxy inverso
4. **Rotar tokens** periódicamente
5. **Implementar backups** automáticos regulares
6. **Restringir permisos** de tokens a lo mínimo necesario
7. **Monitorear logs** de acceso regularmente

#### Configurar HTTPS con nginx

```nginx
server {
    listen 443 ssl;
    server_name influxdb.example.com;

    ssl_certificate /etc/ssl/certs/influxdb.crt;
    ssl_certificate_key /etc/ssl/private/influxdb.key;

    location / {
        proxy_pass http://localhost:8086;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Integración Completa: Proxmox → InfluxDB → Grafana

#### Flujo de Datos

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Proxmox    │ Métricas│   InfluxDB   │  Query  │   Grafana    │
│   Cluster    ├────────>│   (Storage)  │<────────┤ (Visualiza.) │
│              │  HTTP   │              │  HTTP   │              │
└──────────────┘         └──────────────┘         └──────────────┘
     Token               Bucket: proxmox           Token mismo
```

#### Checklist de Configuración Completa

- [ ] **InfluxDB instalado** y funcionando en puerto 8086
- [ ] **Organización creada** en InfluxDB 2.x
- [ ] **Bucket "proxmox" creado** con política de retención adecuada
- [ ] **Token de API generado** y guardado de forma segura
- [ ] **Firewall configurado** para permitir puerto 8086
- [ ] **Proxmox Metric Server configurado** con protocolo HTTP
- [ ] **Conexión probada** desde Proxmox a InfluxDB
- [ ] **Métricas verificadas** en Data Explorer de InfluxDB
- [ ] **Grafana configurado** con fuente de datos InfluxDB
- [ ] **Mismo token usado** en Proxmox y Grafana
- [ ] **Dashboard importado** y visualizando datos correctamente

#### Verificación End-to-End

**1. Verificar que Proxmox está enviando datos:**

Desde la interfaz web de InfluxDB:

```flux
from(bucket: "proxmox")
  |> range(start: -5m)
  |> filter(fn: (r) => r["_measurement"] == "cpustat")
  |> yield(name: "mean")
```

**2. Verificar que Grafana puede leer los datos:**

Desde Grafana, ir a **Explore** y ejecutar:

```flux
from(bucket: "proxmox")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "cpustat")
  |> aggregateWindow(every: 1m, fn: mean)
```

**3. Crear un panel simple de prueba:**

En Grafana, crear un nuevo panel con esta consulta:

```flux
from(bucket: "proxmox")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "cpustat")
  |> filter(fn: (r) => r["_field"] == "cpu")
  |> aggregateWindow(every: v.windowPeriod, fn: mean, createEmpty: false)
```

### Consultas Flux Útiles para Proxmox

#### Uso de CPU por nodo

```flux
from(bucket: "proxmox")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "cpustat")
  |> filter(fn: (r) => r["_field"] == "cpu")
  |> filter(fn: (r) => r["object"] == "nodes")
  |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
  |> yield(name: "cpu_usage")
```

#### Uso de memoria por nodo

```flux
from(bucket: "proxmox")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "memory")
  |> filter(fn: (r) => r["_field"] == "memused")
  |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
```

#### Tráfico de red (entrada)

```flux
from(bucket: "proxmox")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "nics")
  |> filter(fn: (r) => r["_field"] == "netin")
  |> derivative(unit: 1s, nonNegative: true)
  |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
```

#### Tráfico de red (salida)

```flux
from(bucket: "proxmox")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "nics")
  |> filter(fn: (r) => r["_field"] == "netout")
  |> derivative(unit: 1s, nonNegative: true)
  |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
```

#### Estado de VMs

```flux
from(bucket: "proxmox")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "qemu")
  |> filter(fn: (r) => r["_field"] == "cpu")
  |> group(columns: ["vmid", "name"])
  |> last()
```

#### I/O de disco

```flux
from(bucket: "proxmox")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "qemu")
  |> filter(fn: (r) => r["_field"] == "diskread" or r["_field"] == "diskwrite")
  |> derivative(unit: 1s, nonNegative: true)
  |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
```

### Actualización de InfluxDB

#### Actualizar a una versión más reciente

```bash
# Ver versión actual
docker exec influxdb influx version

# Detener el contenedor
docker stop influxdb

# Hacer backup (recomendado)
docker exec influxdb influx backup /tmp/backup
docker cp influxdb:/tmp/backup ./influxdb-backup-pre-upgrade

# Eliminar contenedor antiguo
docker rm influxdb

# Descargar nueva imagen
docker pull influxdb:2.7

# Crear nuevo contenedor con la misma configuración
docker run -d \
  -p 8086:8086 \
  --name=influxdb \
  --restart=always \
  -v influxdb-storage:/var/lib/influxdb2 \
  influxdb:2.7

# Verificar que funcionó
docker logs influxdb
```

### Troubleshooting Avanzado

#### InfluxDB no inicia después de actualización

**Verificar logs detallados:**

```bash
docker logs influxdb --tail 100
```

**Verificar permisos del volumen:**

```bash
docker run --rm -v influxdb-storage:/data ubuntu ls -la /data
```

**Resetear permisos si es necesario:**

```bash
docker run --rm -v influxdb-storage:/data ubuntu chown -R 1000:1000 /data
```

#### Proxmox reporta "Connection timeout"

**Verificar desde el nodo de Proxmox:**

```bash
# Test de conectividad básica
ping <IP_INFLUXDB>

# Test de puerto
nc -zv <IP_INFLUXDB> 8086

# Test HTTP completo
curl -v http://<IP_INFLUXDB>:8086/ping

# Test con token
curl -v -H "Authorization: Token <TU_TOKEN>" \
  "http://<IP_INFLUXDB>:8086/api/v2/buckets?org=mi-organizacion"
```

**Verificar logs de Proxmox:**

```bash
# En el nodo de Proxmox
journalctl -u pvestatd -f
```

#### Grafana no puede consultar datos

**Verificar permisos del token:**

1. Ir a InfluxDB UI → Data → Tokens
2. Hacer clic en el token usado
3. Verificar que tiene permisos de lectura en el bucket "proxmox"
4. Si no, crear un nuevo token con permisos adecuados

**Probar consulta manualmente:**

```bash
curl -G "http://<IP_INFLUXDB>:8086/api/v2/query?org=mi-organizacion" \
  --data-urlencode 'query=from(bucket:"proxmox") |> range(start: -5m)' \
  -H "Authorization: Token <TU_TOKEN>"
```

### Optimización de Rendimiento

#### Ajustar caché y compactación

Crear archivo de configuración personalizada:

```bash
# Crear directorio de configuración
mkdir -p ./influxdb-config

# Crear archivo de configuración
cat > ./influxdb-config/config.yml << EOF
storage-cache-max-memory-size: 1073741824  # 1GB
storage-cache-snapshot-memory-size: 26214400  # 25MB
storage-cache-snapshot-write-cold-duration: 10m
storage-compact-full-write-cold-duration: 4h
storage-compact-throughput-burst: 50331648  # 48MB
EOF

# Recrear contenedor con configuración personalizada
docker run -d \
  -p 8086:8086 \
  --name=influxdb \
  --restart=always \
  -v influxdb-storage:/var/lib/influxdb2 \
  -v ./influxdb-config:/etc/influxdb2 \
  influxdb:2.7
```

#### Ajustar política de retención

Para ambientes con alto volumen de métricas:

```bash
# Reducir retención a 7 días para ahorrar espacio
docker exec -it influxdb influx bucket update \
  --id <BUCKET_ID> \
  --retention 168h \
  --org mi-organizacion
```

### Recursos Adicionales

#### Documentación Oficial

- **InfluxDB 2.x Docs**: [Documentación Influx](https://docs.influxdata.com/influxdb/v2.7/)
- **Flux Language**: [Documentación Flux](https://docs.influxdata.com/flux/v0.x/)
- **InfluxDB API**: [InfluxDB API](https://docs.influxdata.com/influxdb/v2.7/api/)
- **Proxmox Metric Server**: [Proxmox Metric Server](https://pve.proxmox.com/wiki/Metric_Server)

#### Comunidad y Soporte

- **InfluxDB Community**: [Influx Community](https://community.influxdata.com/)
- **Proxmox Forum**:  [Promox Forum](https://forum.proxmox.com/)
- **Grafana Community**:  [Grafana Community](https://community.grafana.com/)
- **Docker Hub InfluxDB**:  [Docker Hub Influx](https://hub.docker.com/_/influxdb)

#### Herramientas Complementarias

- **Telegraf**: Agente de recolección de métricas (puede complementar Proxmox)
- **Chronograf**: Interfaz web alternativa para InfluxDB 1.x
- **Kapacitor**: Motor de procesamiento y alertas en tiempo real


Con esta configuración, se obtiene un sistema completo de monitoreo que permite:
- Visualización en tiempo real del estado del cluster
- Análisis histórico de rendimiento
- Alertas proactivas sobre problemas
- Capacidad de planificación basada en tendencias
Siempre tomar en cuenta que esta es solo una guia, cada arquitectura debe ser adaptarla a sus necesidades.