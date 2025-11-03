---
slug: /configuracion-graylog
title: Configuración Graylog
sidebar_label: Configuración SIEM-Graylog
---

### Introducción a Graylog

**Graylog** es una plataforma SIEM (Security Information and Event Management) de código abierto que permite la recolección, almacenamiento, análisis y monitoreo de datos de logs en tiempo real. Es una solución escalable, flexible y económica para organizaciones que necesitan visibilidad completa de su infraestructura de seguridad.

### Características Principales

- **Código Abierto y Gratuito**: Versión open-source disponible sin costos de licenciamiento
- **Escalabilidad**: Soporta desde pequeñas instalaciones hasta grandes clusters distribuidos
- **Búsqueda Avanzada**: Motor de búsqueda potente basado en OpenSearch/Elasticsearch
- **Alertas y Correlación**: Sistema de alertas personalizables con reglas Sigma y MITRE ATT&CK
- **Dashboards Personalizables**: Visualización intuitiva de datos con gráficos interactivos
- **API Completa**: Integración con otras herramientas mediante REST API
- **Compatibilidad**: Soporta múltiples fuentes de logs (Windows, Linux, dispositivos de red, aplicaciones)

---

### ¿Qué es un SIEM?

Un **SIEM** (Security Information and Event Management) es una solución de seguridad que combina dos aspectos fundamentales:

### Security Event Management (SEM)
- Monitoreo en tiempo real de eventos de seguridad
- Correlación de eventos
- Notificaciones y alertas
- Vistas de consola para análisis

### Security Information Management (SIM)
- Almacenamiento a largo plazo de registros
- Manipulación y análisis de datos históricos
- Generación de reportes
- Gestión de cumplimiento normativo

### ¿Por qué usar un SIEM?

Un SIEM no es un mecanismo de detección por sí solo, sino una **caja de herramientas** que hace más efectivas todas las tecnologías de seguridad que utilizas. Proporciona:

- Visibilidad completa del estado de seguridad de la red
- Correlación de eventos de seguridad basados en atributos comunes
- Detección de patrones de ataques mediante intentos repetitivos
- Análisis de tendencias históricas
- Cumplimiento de normativas (PCI-DSS, HIPAA, GDPR, etc.)

---

### Arquitectura de Graylog

#### Infraestructura Básica

Graylog nunca opera solo. Una implementación típica incluye:

```
┌────────────────────────────────────────────────────────┐
│                    Fuentes de Datos                    │
├─────────────┬──────────────┬──────────────┬────────────┤
│  Clientes   │  Servidores  │  Dispositivos│  Aplicacio-│
│  (Windows,  │  (Linux,     │  de Red      │  nes       │
│  Linux)     │  UNIX)       │  (Firewalls, │  Web       │
│             │              │  Switches)   │            │
└─────────────┴──────────────┴──────────────┴────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│                    Graylog Server                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Inputs (Puertos de escucha)                    │   │
│  │  - Syslog UDP/TCP                               │   │
│  │  - GELF                                         │   │
│  │  - Beats                                        │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                             │
│                          ▼                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Processing (Extractores, Streams)              │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
                          │
                          ▼
┌────────────────────┬───────────────────┬───────────────┐
│    MongoDB         │   OpenSearch/     │ Graylog Web   │
│  (Metadatos y      │   Data Node       │ Interface     │
│   Configuración)   │  (Almacenamiento  │ (Puerto 9000) │
│                    │   de logs)        │               │
└────────────────────┴───────────────────┴───────────────┘
```

### Componentes Core

1. **Graylog Server**: Procesa los logs entrantes
2. **MongoDB**: Almacena metadatos y configuraciones
3. **OpenSearch/Data Node**: Motor de búsqueda y almacenamiento de logs
4. **Web Interface**: Interfaz de usuario para gestión y análisis

---

### Requisitos del Sistema

#### Requisitos de Software

#### Para Graylog 6.x (Última versión)

| Componente | Versión Requerida |
|------------|-------------------|
| **Sistema Operativo** | Ubuntu 22.04/24.04, RHEL 7-9, SUSE 12/15 |
| **MongoDB** | 5.x - 8.x |
| **OpenSearch** | 2.x (Excepto 2.16+, 3.0+) |
| **OpenJDK** | 17 (incluido en Graylog) |

#### Para Graylog 5.2

| Componente | Versión Requerida |
|------------|-------------------|
| **Sistema Operativo** | Ubuntu 20.04/22.04 |
| **MongoDB** | 5.x - 6.x |
| **OpenSearch** | 1.x - 2.x (Excepto 2.14+) |
| **Elasticsearch** | 7.10.2 (alternativa a OpenSearch) |
| **OpenJDK** | 17 (incluido en Graylog) |

### Requisitos de Hardware

#### Instalación Pequeña (Single Node)
- **CPU**: 4 cores mínimo
- **RAM**: 8 GB mínimo (16 GB recomendado)
- **Disco**: 50 GB mínimo (SSD recomendado)
- **Red**: 1 Gbps

#### Instalación Mediana (Multi-Node)
- **CPU**: 8 cores por nodo
- **RAM**: 16-32 GB por nodo
- **Disco**: 500 GB - 2 TB (RAID, SSD recomendado)
- **Red**: 10 Gbps

#### Instalación Grande (Enterprise)
- **CPU**: 16+ cores por nodo
- **RAM**: 32-64 GB por nodo
- **Disco**: 2+ TB (Sistema de archivos XFS recomendado)
- **Red**: 10 Gbps o superior

### Puertos Requeridos

| Puerto | Protocolo | Servicio | Descripción |
|--------|-----------|----------|-------------|
| 9000 | TCP | Graylog Web | Interfaz web |
| 9200 | TCP | OpenSearch | API REST |
| 9300 | TCP | OpenSearch | Comunicación entre nodos |
| 27017 | TCP | MongoDB | Base de datos |
| 514 | UDP/TCP | Syslog | Entrada de logs tradicional |
| 12201 | UDP/TCP | GELF | Graylog Extended Log Format |
| 5044 | TCP | Beats | Elastic Beats |

---


### Métodos de Instalación

Graylog ofrece dos métodos principales de despliegue:

#### Despliegue Directo (Recomendado para Producción)
Instalación nativa en servidores Linux mediante paquetes del sistema operativo (DEB o RPM).

**Ventajas**:
- Mejor rendimiento
- Control total del sistema
- Ideal para producción

**Sistemas soportados**:
- Ubuntu 20.04, 22.04, 24.04
- Red Hat Enterprise Linux 7-9
- Rocky Linux, AlmaLinux
- SUSE Linux Enterprise Server 12, 15

#### Despliegue Containerizado (Docker)
Instalación mediante Docker Compose para entornos de desarrollo o pruebas.

**Ventajas**:
- Instalación rápida
- Aislamiento del sistema
- Fácil para laboratorios y pruebas

**Desventajas**:
- Menor rendimiento en producción
- Complejidad adicional en troubleshooting

---

### Instalación en Ubuntu

Esta guía cubre la instalación de Graylog en Ubuntu 22.04/24.04 con OpenSearch.

#### Prerrequisitos

```bash
# Actualizar el sistema
sudo apt-get update && sudo apt-get upgrade -y

# Verificar que el firewall esté deshabilitado o configurado correctamente
sudo ufw status

# Configurar zona horaria del servidor (opcional pero recomendado)
sudo timedatectl set-timezone America/Mexico_City
```

#### Instalar MongoDB

MongoDB almacena los metadatos y configuraciones de Graylog.

```bash
# 1. Instalar gnupg
sudo apt-get install gnupg curl -y

# 2. Importar la clave pública de MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor

# 3. Crear archivo de lista para MongoDB
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# 4. Actualizar e instalar MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# 5. Habilitar e iniciar MongoDB
sudo systemctl daemon-reload
sudo systemctl enable mongod.service
sudo systemctl start mongod.service

# 6. Verificar que MongoDB esté funcionando
sudo systemctl status mongod.service
sudo systemctl --type=service --state=active | grep mongod

# 7. Bloquear la versión de MongoDB (evitar actualizaciones automáticas)
sudo apt-mark hold mongodb-org
```

#### Configurar MongoDB (Opcional)

Para clusters multi-nodo, editar `/etc/mongod.conf`:

```yaml
# /etc/mongod.conf
net:
  port: 27017
  bindIp: 0.0.0.0  # Cambiar de 127.0.0.1 para acceso remoto 
```

Reiniciar después de cambios:
```bash
sudo systemctl restart mongod.service
```

#### Instalar OpenSearch

OpenSearch es el motor de búsqueda y almacenamiento de logs.

```bash
# 1. Importar la clave GPG de OpenSearch
curl -o- https://artifacts.opensearch.org/publickeys/opensearch.pgp | \
  sudo gpg --dearmor --batch --yes -o /usr/share/keyrings/opensearch-keyring

# 2. Crear archivo de repositorio
echo "deb [signed-by=/usr/share/keyrings/opensearch-keyring] https://artifacts.opensearch.org/releases/bundle/opensearch/2.x/apt stable main" | \
  sudo tee /etc/apt/sources.list.d/opensearch-2.x.list

# 3. Verificar que el repositorio se creó correctamente
cat /etc/apt/sources.list.d/opensearch-2.x.list

# 4. Actualizar repositorios
sudo apt-get update

# 5. Instalar OpenSearch (versión 2.12 o superior requiere contraseña)
# IMPORTANTE: Para versiones 2.12+, establecer contraseña de administrador
sudo OPENSEARCH_INITIAL_ADMIN_PASSWORD=$(tr -dc A-Z-a-z-0-9_@#%^-_=+ < /dev/urandom | head -c${1:-32}) apt-get install -y opensearch

# Para instalar una versión específica:
# sudo OPENSEARCH_INITIAL_ADMIN_PASSWORD=MyStrongPass123! apt-get install -y opensearch=2.15.0

# 6. Configurar OpenSearch
sudo nano /etc/opensearch/opensearch.yml
```

#### Configuración de OpenSearch

Editar `/etc/opensearch/opensearch.yml`:

```yaml
cluster.name: graylog
node.name: ${HOSTNAME}
path.data: /var/lib/opensearch
path.logs: /var/log/opensearch
discovery.type: single-node
network.host: 0.0.0.0
action.auto_create_index: false
plugins.security.disabled: true
indices.query.bool.max_clause_count: 32768
```

**ADVERTENCIA**: `plugins.security.disabled: true` desactiva la seguridad de OpenSearch. En producción, configura correctamente los plugins de seguridad.

```bash
# 7. Aumentar el límite de mapas de memoria virtual
sudo sysctl -w vm.max_map_count=262144
echo 'vm.max_map_count=262144' | sudo tee -a /etc/sysctl.conf

# 8. Habilitar e iniciar OpenSearch
sudo systemctl daemon-reload
sudo systemctl enable opensearch.service
sudo systemctl start opensearch.service

# 9. Verificar estado
sudo systemctl status opensearch.service

# 10. Probar conectividad
curl -X GET http://localhost:9200

# 11. Bloquear la versión de OpenSearch
sudo apt-mark hold opensearch
```

#### Instalar Graylog Server

```bash
# 1. Descargar el paquete del repositorio de Graylog
cd /tmp
wget https://packages.graylog2.org/repo/packages/graylog-6.3-repository_latest.deb

# 2. Instalar el repositorio
sudo dpkg -i graylog-6.3-repository_latest.deb

# 3. Actualizar e instalar Graylog
sudo apt-get update
sudo apt-get install graylog-server -y

# 4. Bloquear versión
sudo apt-mark hold graylog-server
```

#### Configurar Graylog

Antes de iniciar Graylog, se deben configurar dos valores obligatorios:

```bash
# 1. Generar password_secret (debe ser al menos 16 caracteres)
pwgen -N 1 -s 96

# Ejemplo de salida:
# xQ8tR9bN2mK5pL4wZ7vF3dG6hJ8nM1sA9cX0vB5nM4lK3jH2gF7dS8aQ1wE6rT5yU4iO3pA2sD1fG0hJ9kL8zX7cV6bN5mM4q

# 2. Generar root_password_sha2 (hash SHA256 de tu contraseña)
echo -n "tuContraseñaSegura" | sha256sum | cut -d" " -f1

# Ejemplo de salida:
# e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855

# 3. Editar el archivo de configuración
sudo nano /etc/graylog/server/server.conf
```

#### Configuración Mínima Requerida

Editar `/etc/graylog/server/server.conf`:

```conf
# OBLIGATORIO: Secret para cifrado (usar el generado con pwgen)
password_secret = xQ8tR9bN2mK5pL4wZ7vF3dG6hJ8nM1sA9cX0vB5nM4lK3jH2gF7dS8aQ1wE6rT5yU4iO3pA2sD1fG0hJ9kL8zX7cV6bN5mM4q

# OBLIGATORIO: Hash SHA256 de la contraseña del usuario root
root_password_sha2 = e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855

# Zona horaria
root_timezone = America/Mexico_City

# URL HTTP de Graylog (cambiar la IP por la de tu servidor)
http_bind_address = 0.0.0.0:9000

# URI externa para acceder a Graylog
http_external_uri = http://192.168.1.100:9000/

# MongoDB
mongodb_uri = mongodb://localhost/graylog

# OpenSearch
elasticsearch_hosts = http://localhost:9200
```

#### Iniciar Graylog

```bash
# 1. Recargar systemd
sudo systemctl daemon-reload

# 2. Habilitar Graylog para inicio automático
sudo systemctl enable graylog-server.service

# 3. Iniciar Graylog
sudo systemctl start graylog-server.service

# 4. Verificar estado
sudo systemctl status graylog-server.service

# 5. Monitorear logs en tiempo real
sudo tail -f /var/log/graylog-server/server.log

# Esperar a ver este mensaje:
# "Graylog server up and running."
```

### Verificación de la Instalación

```bash
# Verificar que todos los servicios estén activos
sudo systemctl status mongod.service
sudo systemctl status opensearch.service
sudo systemctl status graylog-server.service

# Verificar puertos en escucha
sudo ss -tlnp | grep -E '9000|9200|27017'

# Verificar logs de Graylog
sudo journalctl -u graylog-server -f
```

---

### Configuración Inicial

#### Ajustes de Memoria (Heap)

Para entornos de producción, ajustar el heap de Graylog:

```bash
# Editar el archivo de servicio
sudo nano /etc/default/graylog-server

# Agregar o modificar (ajustar según RAM disponible):
GRAYLOG_SERVER_JAVA_OPTS="-Xms4g -Xmx4g -XX:+UseG1GC"
```

**Recomendaciones de Heap**:
- Sistema con 8 GB RAM: `-Xms2g -Xmx2g`
- Sistema con 16 GB RAM: `-Xms4g -Xmx4g`
- Sistema con 32 GB RAM: `-Xms8g -Xmx8g`

Reiniciar después de cambios:
```bash
sudo systemctl restart graylog-server.service
```

#### Configuración de OpenSearch para Producción

```bash
# Editar configuración de JVM
sudo nano /etc/opensearch/jvm.options

# Configurar heap (50% de RAM, máximo 32GB)
-Xms8g
-Xmx8g
```

---

### Acceso a la Interfaz Web

#### Primera Conexión

1. Abrir navegador web
2. Navegar a: `http://IP_SERVIDOR:9000`
3. Usar credenciales:
   - **Usuario**: `admin`
   - **Contraseña**: La que configuraste (antes del hash SHA256)

#### Configuración Inicial del Setup Wizard

Al primer acceso, Graylog mostrará un asistente de configuración:

1. **Bienvenida**: Revisar información general
2. **Configuración de Data Node**: 
   - Si usas OpenSearch auto-gestionado: Saltar este paso
   - Si usas Data Node de Graylog: Seguir instrucciones
3. **Configuración de Inputs**: Crear tus primeros inputs
4. **Finalización**: Acceder al dashboard principal

---

### Componentes Principales

#### (Entradas)

Los **Inputs** son puntos de entrada donde Graylog recibe logs.

#### Tipos de Inputs Comunes:

| Input Type | Puerto | Protocolo | Uso |
|------------|--------|-----------|-----|
| **Syslog UDP** | 514 | UDP | Logs de dispositivos de red, servidores Linux |
| **Syslog TCP** | 514 | TCP | Syslog confiable |
| **GELF UDP** | 12201 | UDP | Graylog Extended Log Format |
| **GELF TCP** | 12201 | TCP | GELF confiable |
| **Beats** | 5044 | TCP | Filebeat, Winlogbeat, etc. |
| **Raw/Plaintext TCP** | Custom | TCP | Logs de aplicaciones |

#### Crear un Input

1. Navegar a: **System** → **Inputs**
2. Seleccionar tipo de input del menú desplegable
3. Click en **Launch new input**
4. Configurar:
   - **Title**: Nombre descriptivo
   - **Bind address**: `0.0.0.0` (todas las interfaces)
   - **Port**: Puerto de escucha
   - **Node**: Seleccionar nodo o "Global"
5. Click en **Save**

### Extractors (Extractores)

Los **Extractors** procesan y estructuran los datos de logs entrantes.

#### Tipos de Extractors:

- **Grok Pattern**: Parsing con patrones Grok
- **JSON**: Extrae campos de mensajes JSON
- **Regular Expression**: Expresiones regulares personalizadas
- **Split & Index**: Divide strings en campos
- **Key-Value**: Extrae pares clave-valor
- **CSV**: Procesa logs en formato CSV

#### Ejemplo: Crear un Extractor Grok

1. Ir a **System** → **Inputs**
2. Click en **Manage extractors** del input
3. Click en **Get started**
4. Pegar un mensaje de ejemplo
5. Click en **Load message**
6. Seleccionar **Grok pattern**
7. Introducir patrón, ejemplo:
   ```
   %{TIMESTAMP_ISO8601:timestamp} %{LOGLEVEL:level} %{GREEDYDATA:message}
   ```
8. Click en **Try** y luego **Create extractor**

#### Streams (Flujos)

Los **Streams** categorizan y enrutan logs basándose en reglas.

#### Ventajas de los Streams:

- Organización de datos por tipo/fuente
- Aplicar reglas de retención específicas
- Configurar alertas por stream
- Control de acceso granular

#### Crear un Stream

1. Navegar a: **Streams**
2. Click en **Create Stream**
3. Configurar:
   - **Title**: "Windows Security Logs"
   - **Description**: Descripción del stream
   - **Index Set**: Default o personalizado
4. Click en **Save**
5. Agregar **Rules** (reglas de filtrado):
   - Ejemplo: `source_type` must match exactly `windows`
6. Click en **Start stream**

### Dashboards

Los **Dashboards** proporcionan visualización de datos en tiempo real.

#### Widgets Disponibles:

- **Quick Values**: Top valores de un campo
- **Line Chart**: Gráfico de líneas temporal
- **Bar Chart**: Gráfico de barras
- **Pie Chart**: Gráfico circular
- **Area Chart**: Gráfico de área
- **Number**: Métrica individual
- **Statistics**: Estadísticas de campo
- **World Map**: Mapa geográfico
- **Correlation**: Correlación de eventos

#### Crear un Dashboard

1. Ir a: **Dashboards**
2. Click en **Create dashboard**
3. Nombrar dashboard
4. Agregar widgets:
   - Click en **Add widget**
   - Configurar búsqueda y visualización
   - Personalizar colores y opciones
5. Guardar

### Alerts (Alertas)

Las **Alertas** notifican sobre eventos importantes.

#### Tipos de Condiciones:

- **Message Count**: Número de mensajes
- **Field Value**: Valor de campo específico
- **Field Aggregation**: Agregación estadística
- **Correlation**: Correlación de eventos

#### Configurar una Alerta

1. Navegar a: **Alerts** → **Event Definitions**
2. Click en **Create Event Definition**
3. Configurar:
   - **Title**: Nombre de la alerta
   - **Priority**: Normal, Low, High
   - **Condition**: Definir condición
   - **Query**: Búsqueda de logs
4. Configurar **Notifications**:
   - Email
   - Slack
   - HTTP/Webhook
   - PagerDuty
5. Click en **Done** y activar

### Pipelines

Los **Pipelines** son flujos de procesamiento avanzados.

#### Casos de Uso:

- Enriquecimiento de datos (GeoIP, DNS)
- Normalización de campos
- Filtrado y routing avanzado
- Integración con threat intelligence

---

### Gestión de Logs

#### Configurar Clientes

#### Cliente Windows (Sidecar + Winlogbeat)

1. Descargar **Graylog Sidecar** desde GitHub
2. Instalar en cliente Windows:
   ```powershell
   graylog_sidecar_installer_1.5.0-1.exe /S -SERVERURL="http://graylog-server:9000/api" -APITOKEN="tu_token_api"
   ```
3. Configurar Collector en Graylog:
   - **System** → **Sidecars** → **Configuration**
   - Crear configuración Winlogbeat
4. Asignar configuración al cliente

#### Cliente Linux (Syslog)

Editar `/etc/rsyslog.d/90-graylog.conf`:

```conf
*.* @192.168.1.100:514;RSYSLOG_SyslogProtocol23Format
```

Reiniciar rsyslog:
```bash
sudo systemctl restart rsyslog
```

#### Dispositivos de Red (Cisco, Palo Alto, etc.)

Configurar en el dispositivo:
```
logging host 192.168.1.100
logging trap informational
```

### Búsquedas Avanzadas

#### Sintaxis de Búsqueda

```
# Búsqueda simple
failed

# Campo específico
source:firewall

# Rangos
response_time:[200 TO 500]

# Booleanos
error AND (database OR connection)
NOT success

# Wildcards
user:admin*

# Regex
message:/error|warning|critical/

# Tiempo relativo
timestamp:[now-1h TO now]
```

#### Ejemplos Prácticos

```
# Login fallidos SSH
source:sshd AND message:Failed

# Errores HTTP 5xx
http_status:[500 TO 599]

# Top IPs con tráfico sospechoso
source_ip:* AND bytes_sent:>10000000

# Correlación de eventos
(EventID:4625 AND LogonType:3) OR EventID:4740
```

### Índices y Retención

#### Configurar Index Sets

1. **System** → **Indices** → **Index Sets**
2. Click en **Create index set**
3. Configurar:
   - **Index prefix**: logs_production
   - **Rotation strategy**: Time-based (daily, weekly)
   - **Retention strategy**: Delete (after 30 days)
   - **Shards**: 4
   - **Replicas**: 1
4. Asignar streams al index set

---

### Mejores Prácticas

#### Seguridad

1. **Cambiar contraseñas por defecto**
   ```bash
   # Desde interfaz web o CLI
   graylog-ctl set-admin-password nueva_contraseña
   ```

2. **Usar HTTPS**
   - Configurar certificados SSL/TLS
   - Editar `http_enable_tls = true` en server.conf
   - Especificar rutas de certificados

3. **Implementar autenticación**
   - LDAP/Active Directory
   - SSO (SAML, OAuth)
   - Autenticación de dos factores

4. **Control de acceso**
   - Crear roles específicos
   - Asignar permisos granulares
   - Auditar accesos

5. **Seguridad de red**
   - Firewall restringiendo IPs
   - VPN para acceso remoto
   - Segmentar red SIEM

#### Rendimiento

1. **Dimensionamiento adecuado**
   - Calcular tasa de logs (EPS - Events Per Second)
   - Provisionar recursos según carga

2. **Optimizar búsquedas**
   - Usar campos indexados
   - Limitar rango temporal
   - Evitar wildcards al inicio

3. **Gestión de índices**
   - Rotación diaria o semanal
   - Retención según necesidades
   - Archivado de logs antiguos

4. **Monitoreo del sistema**
   - CPU, RAM, Disco
   - Latencia de búsquedas
   - Throughput de mensajes
   - Salud de OpenSearch cluster

5. **Tuning de OpenSearch**
   ```yaml
   # /etc/opensearch/opensearch.yml
   indices.memory.index_buffer_size: 30%
   indices.fielddata.cache.size: 40%
   thread_pool.write.queue_size: 1000
   ```

### Mantenimiento

1. **Backups regulares**
   ```bash
   # MongoDB
   mongodump --out /backup/mongodb/$(date +%Y%m%d)
   
   # Configuración de Graylog
   tar -czf /backup/graylog-config-$(date +%Y%m%d).tar.gz /etc/graylog
   
   # OpenSearch snapshots (configurar en Graylog)
   ```

2. **Actualizaciones**
   - Revisar changelog antes de actualizar
   - Probar en entorno de desarrollo
   - Hacer backup completo
   - Actualizar en orden: MongoDB → OpenSearch → Graylog

3. **Limpieza de logs**
   ```bash
   # Limpiar logs antiguos de Graylog
   find /var/log/graylog-server/ -name "*.log.*" -mtime +30 -delete
   
   # Limpiar logs de OpenSearch
   find /var/log/opensearch/ -name "*.log.*" -mtime +7 -delete
   ```

4. **Monitoreo proactivo**
   - Configurar alertas sobre métricas del sistema
   - Dashboard de salud de Graylog
   - Revisar logs de errores semanalmente

### Organización

1. **Nomenclatura consistente**
   - Inputs: `[TIPO]-[FUENTE]-[AMBIENTE]` (ej: `syslog-firewall-prod`)
   - Streams: `[CATEGORÍA] [DESCRIPCIÓN]` (ej: `Security - Failed Logins`)
   - Dashboards: `[ÁREA] - [PROPÓSITO]` (ej: `Network - Traffic Overview`)

2. **Documentación**
   - Documentar extractores personalizados
   - Mantener inventario de inputs
   - Documentar reglas de alertas

3. **Estandarización**
   - Usar pipelines para normalización
   - Campos estándar: `source`, `level`, `application`
   - Time zones consistentes

---

### Resolución de Problemas

#### Problema: Graylog no inicia

**Síntomas**: El servicio falla al iniciar

**Solución**:
```bash
# 1. Revisar logs
sudo journalctl -u graylog-server -n 100 --no-pager

# 2. Verificar configuración
sudo graylog-server debug

# 3. Verificar dependencias
sudo systemctl status mongod
sudo systemctl status opensearch

# 4. Verificar permisos
sudo chown -R graylog:graylog /var/log/graylog-server
sudo chown -R graylog:graylog /var/lib/graylog-server

# 5. Verificar puertos
sudo ss -tlnp | grep -E '9000|9200|27017'
```

### Problema: No se reciben logs

**Síntomas**: Input configurado pero sin mensajes

**Solución**:
```bash
# 1. Verificar que el input esté activo
# Interfaz web: System → Inputs

# 2. Verificar firewall
sudo ufw status
sudo ufw allow 514/udp
sudo ufw allow 12201/tcp

# 3. Probar conectividad desde cliente
# UDP
echo "test message" | nc -u graylog-server 514

# TCP
echo "test message" | nc graylog-server 514

# 4. Verificar que el puerto esté en escucha
sudo ss -tulnp | grep 514

# 5. Revisar logs de Graylog
sudo tail -f /var/log/graylog-server/server.log
```

### Problema: OpenSearch en estado "Red" o "Yellow"

**Síntomas**: Cluster health no es "green"

**Solución**:
```bash
# 1. Verificar estado del cluster
curl -X GET "http://localhost:9200/_cluster/health?pretty"

# 2. Verificar índices
curl -X GET "http://localhost:9200/_cat/indices?v"

# 3. Verificar shards no asignados
curl -X GET "http://localhost:9200/_cat/shards?v" | grep UNASSIGNED

# 4. Reasignar shards (solo si es necesario)
curl -X POST "http://localhost:9200/_cluster/reroute?retry_failed=true"

# 5. Aumentar límite de memoria
sudo sysctl -w vm.max_map_count=262144

# 6. Verificar espacio en disco
df -h /var/lib/opensearch

# 7. Si es un cluster de un solo nodo, configurar réplicas en 0
curl -X PUT "http://localhost:9200/_all/_settings" -H 'Content-Type: application/json' -d'
{
  "index": {
    "number_of_replicas": 0
  }
}'
```

### Problema: Alto uso de CPU o RAM

**Síntomas**: Servidor lento, búsquedas lentas

**Solución**:
```bash
# 1. Verificar procesos
top -u graylog
top -u opensearch

# 2. Revisar heap usage de Graylog
# Interfaz web: System → Overview

# 3. Ajustar heap de Graylog
sudo nano /etc/default/graylog-server
# GRAYLOG_SERVER_JAVA_OPTS="-Xms4g -Xmx4g"
sudo systemctl restart graylog-server

# 4. Ajustar heap de OpenSearch
sudo nano /etc/opensearch/jvm.options
# -Xms8g
# -Xmx8g
sudo systemctl restart opensearch

# 5. Optimizar índices
curl -X POST "http://localhost:9200/_forcemerge?max_num_segments=1"

# 6. Cerrar índices antiguos
curl -X POST "http://localhost:9200/graylog_123/_close"
```

### Problema: MongoDB Connection Failed

**Síntomas**: Error "Unable to connect to MongoDB"

**Solución**:
```bash
# 1. Verificar que MongoDB esté corriendo
sudo systemctl status mongod

# 2. Verificar conectividad
mongo --eval "db.adminCommand('ping')"

# 3. Verificar configuración en server.conf
grep mongodb_uri /etc/graylog/server/server.conf

# 4. Verificar logs de MongoDB
sudo tail -f /var/log/mongodb/mongod.log

# 5. Reiniciar MongoDB
sudo systemctl restart mongod

# 6. Verificar puertos
sudo ss -tlnp | grep 27017
```

### Problema: Búsquedas muy lentas

**Síntomas**: Timeouts, búsquedas tardan minutos

**Solución**:

1. **Optimizar consulta**:
   - Reducir rango temporal
   - Usar campos indexados
   - Evitar wildcards al inicio: `*error` (malo) vs `error*` (bueno)

2. **Verificar recursos**:
   ```bash
   # CPU y RAM
   htop
   
   # IO del disco
   iostat -x 1
   ```

3. **Revisar índices**:
   ```bash
   # Estadísticas de índices
   curl -X GET "http://localhost:9200/_stats?pretty"
   
   # Índices más grandes
   curl -X GET "http://localhost:9200/_cat/indices?v&s=store.size:desc"
   ```

4. **Optimizar configuración**:
   ```yaml
   # /etc/opensearch/opensearch.yml
   indices.queries.cache.size: 15%
   indices.fielddata.cache.size: 40%
   ```

### Problema: Inputs muestran "Failed to bind"

**Síntomas**: Input no puede iniciarse, error de puerto

**Solución**:
```bash
# 1. Verificar si el puerto está en uso
sudo ss -tulnp | grep :514

# 2. Matar proceso que usa el puerto
sudo kill -9 <PID>

# 3. Verificar permisos para puertos < 1024
# Graylog necesita privilegios especiales para puertos < 1024
sudo setcap 'cap_net_bind_service=+ep' /usr/share/graylog-server/jre/bin/java

# 4. Usar puerto alternativo > 1024
# Configurar input en puerto 1514 y usar iptables para redirigir:
sudo iptables -t nat -A PREROUTING -p udp --dport 514 -j REDIRECT --to-port 1514
```

### Logs Útiles para Diagnóstico

```bash
# Logs de Graylog
sudo tail -f /var/log/graylog-server/server.log
sudo journalctl -u graylog-server -f

# Logs de OpenSearch
sudo tail -f /var/log/opensearch/graylog.log

# Logs de MongoDB
sudo tail -f /var/log/mongodb/mongod.log

# Logs del sistema
sudo dmesg | tail
sudo journalctl -xe
```

---

### Casos de Uso Avanzados

### Integración con Active Directory

#### Configurar Autenticación LDAP

1. **System** → **Authentication** → **LDAP/Active Directory**
2. Configurar:
   ```
   Server Type: Active Directory
   LDAP Server: ldap://dc.ejemplo.com:389
   System Username: CN=graylog,CN=Users,DC=ejemplo,DC=com
   System Password: password_seguro
   Search Base DN: DC=ejemplo,DC=com
   Search Pattern: (&(objectClass=user)(sAMAccountName={0}))
   Display Name: displayName
   ```

3. Test conexión y guardar
4. Mapear grupos AD a roles de Graylog

### Integración con MITRE ATT&CK

Usar Sigma rules y mapear a técnicas MITRE:

```yaml
# Ejemplo de regla Sigma
title: Suspicious PowerShell Execution
status: experimental
description: Detecta ejecución sospechosa de PowerShell
references:
    - https://attack.mitre.org/techniques/T1059/001/
tags:
    - attack.execution
    - attack.t1059.001
logsource:
    product: windows
    service: powershell
detection:
    selection:
        EventID: 4104
        ScriptBlockText|contains:
            - 'Invoke-Expression'
            - 'IEX'
            - 'DownloadString'
    condition: selection
```

### Correlación de Eventos

Detectar patrones de ataque complejos:

**Event Definition - Brute Force Attack**:
- **Condición**: 5+ login fallidos en 5 minutos
- **Seguido de**: Login exitoso en 10 minutos
- **Acción**: Alerta alta prioridad + bloqueo automático
---

### Integración con Otras Herramientas

#### Graylog + Splunk

Comparación y coexistencia:
- Graylog: Open source, económico, fácil de escalar
- Splunk: Enterprise, costoso, features avanzados
- Estrategia: Graylog para recolección, Splunk para análisis crítico

#### Graylog + SOAR Platforms

Integrar con plataformas SOAR (Security Orchestration, Automation and Response):
- **Cortex**: Respuesta automatizada a alertas
- **TheHive**: Case management
- **Shuffle**: Workflow automation

---


### Recursos Adicionales

#### Documentación Oficial
- **Graylog Docs**: [Graylog Documentation](https://go2docs.graylog.org/)
- **OpenSearch Docs**: [Opensearch Documentation](https://opensearch.org/docs/)
- **MongoDB Docs**: [MongoDB Documentation](https://docs.mongodb.com/)

#### Comunidad
- **Graylog Community**: [Graylog Community](https://community.graylog.org/)
- **GitHub Issues**: [Graylog Server Issues](https://github.com/Graylog2/graylog2-server/issues)

