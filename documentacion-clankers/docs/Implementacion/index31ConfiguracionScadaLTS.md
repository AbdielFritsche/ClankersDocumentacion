---
slug: /configuración-scadalts
title: Configuración ScadaLTS
sidebar_label: Configuración ScadaLTS
---

## Guía de Instalación y Configuración SCADA-LTS con Docker

### Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- Docker Engine (versión 20.10 o superior)
- Docker Compose (versión 1.29 o superior)
- OpenPLC Runtime en ejecución
- Conexión de red entre contenedores

Verifica la instalación:
```bash
docker --version
docker-compose --version
```

---

### Instalación de SCADA-LTS

#### Docker Run (Instalación Simple)

#### Crear el volumen para persistencia de datos
```bash
docker volume create scadalts_data
```

#### Ejecutar el contenedor SCADA-LTS
```bash
docker run -d \
  --name scadalts \
  -p 8080:8080 \
  -v scadalts_data:/opt/tomcat/webapps/Scada-LTS/uploads \
  -e TZ=America/Mexico_City \
  --restart unless-stopped \
  scadalts/scadalts:latest
```

#### Docker Compose (Recomendado)

Crea un archivo `docker-compose.yml`:

```yaml
database:
    container_name: mysql
    image: mysql/mysql-server:5.7
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
      - MYSQL_DATABASE=${MYSQL_DATABASE}
    volumes:
      - ./docker/volumes/databases:/home/
    networks:
      - supervisory_net

scadalts:
    image: scadalts/scadalts:latest
    container_name: scadalts
    depends_on:
      - database
    ports:
      - "8080:8080"
    restart: unless-stopped
    volumns:
      - scadalts_data:/opt/tomcat/webapps/Scada-LTS/uploads
      - scadalts_config:/opt/tomcat/conf
      - scadalts_logs:/opt/tomcat/logs
    networks:
      - supervisory_net
```

Inicia el servicio:
```bash
docker-compose up -d
```

---

### Configuración de Volúmenes

#### Descripción de Volúmenes

| Volumen | Ruta en Contenedor | Propósito |
|---------|-------------------|-----------|
| `scadalts_data` | `/opt/tomcat/webapps/Scada-LTS/uploads` | Archivos subidos y datos de usuario |
| `scadalts_config` | `/opt/tomcat/conf` | Configuración de Tomcat |
| `scadalts_logs` | `/opt/tomcat/logs` | Logs del sistema |
| `mysql_data` | `/var/lib/mysql` | Base de datos MySQL 5.7 |

#### Verificar Volúmenes Creados

```bash
docker volume ls
docker volume inspect scadalts_data
```

#### Backup de Volúmenes

```bash
# Crear backup
docker run --rm -v scadalts_data:/data -v $(pwd):/backup ubuntu tar czf /backup/scadalts_backup_$(date +%Y%m%d).tar.gz /data

# Restaurar backup
docker run --rm -v scadalts_data:/data -v $(pwd):/backup ubuntu tar xzf /backup/scadalts_backup_YYYYMMDD.tar.gz -C /
```

---

### Conexión con OpenPLC

#### Requisitos Previos para la Conexión

1. **OpenPLC Runtime** debe estar ejecutándose en tu instancia
2. Verifica que el servidor Modbus esté habilitado en OpenPLC (puerto 502)
3. Asegúrate de que no haya firewall bloqueando el puerto 502
4. Conoce la dirección IP de la instancia donde corre OpenPLC

Para verificar que OpenPLC está escuchando en el puerto 502:
```bash
# Desde la instancia de OpenPLC
sudo netstat -tulpn | grep :502
# o
sudo ss -tulpn | grep :502
```

### Acceder a SCADA-LTS

1. Abre tu navegador y accede a: `http://localhost:8080/Scada-LTS`
2. **Credenciales por defecto:**
   - **Usuario:** `admin`
   - **Contraseña:** `admin`

> **Importante:** Cambia estas credenciales después del primer acceso por seguridad.

### Configurar Data Source Modbus TCP/IP

1. En el menú principal, ve a **Data sources** → **Add Data Source**
2. Selecciona **Modbus IP** como tipo de fuente de datos
3. Completa la configuración:

```
Nombre: OpenPLC_DataSource
Tipo: Modbus IP

Configuración de Conexión:
- Host: <IP_DE_TU_INSTANCIA_OPENPLC>  (ejemplo: 192.168.1.100)
- Puerto: 502
- Timeout: 5000 ms
- Retries: 3
- Contiguous Batches: Sí
```

**Nota:** Reemplaza `<IP_DE_TU_INSTANCIA_OPENPLC>` con la dirección IP real donde está corriendo OpenPLC Runtime.

### Verificar Conectividad desde SCADA-LTS

```bash
# Verificar que SCADA puede alcanzar la instancia de OpenPLC
docker exec scadalts ping -c 4 <IP_DE_TU_INSTANCIA_OPENPLC>

# Verificar conectividad al puerto Modbus
docker exec scadalts nc -zv <IP_DE_TU_INSTANCIA_OPENPLC> 502
```

### Configurar Data Points (Puntos de Datos)

#### Ejemplo: Leer Registros Holding (Holding Registers)

1. Dentro del Data Source, haz clic en **Add Data Point**
2. Configura según tus necesidades:

```
Nombre: Temperatura_Sensor1
Tipo de Registro: Holding Register (Read Only)
Offset: 0
Slave ID: 1
Multiplier: 1
Additive: 0
Data Type: 2 Byte Signed Integer
```

#### Ejemplo: Escribir Coils (Salidas Digitales)

```
Nombre: Bomba_ON_OFF
Tipo de Registro: Coil Status (Read/Write)
Offset: 0
Slave ID: 1
Data Type: Binary
Settable: Sí
```

### Activar el Data Source

1. Guarda la configuración
2. Haz clic en el icono de **Enable/Start** (ícono de play)
3. Verifica que el estado cambie a **Running** (verde)

#### Configuración de Direccionamiento Modbus

| Tipo | Rango OpenPLC | Función Modbus | Descripción |
|------|---------------|----------------|-------------|
| Coils | %QX100.0 - %QX100.7 | 01 (Read), 05 (Write) | Salidas digitales |
| Discrete Inputs | %IX100.0 - %IX199.7 | 02 (Read) | Entradas digitales |
| Input Registers | %IW100 - %IW1023 | 04 (Read) | Registros de entrada |
| Holding Registers | %QW100 - %QW1023 | 03 (Read), 06 (Write) | Registros de salida |

---

### Acceso y Configuración Inicial

#### Primera Configuración

1. **Accede a la interfaz web:** `http://localhost:8080/Scada-LTS`
2. **Inicia sesión con las credenciales por defecto:**
   - Usuario: `admin`
   - Contraseña: `admin`

#### Cambiar Contraseña por Defecto 

1. Ve a **Users** → **Edit User**
2. Selecciona el usuario `admin`
3. Ingresa una nueva contraseña segura
4. Guarda los cambios

> **Seguridad:** Es crítico cambiar tanto la contraseña de la interfaz web como las credenciales de MySQL en un entorno de producción.

#### Crear un Watch List

1. Ve a **Watch lists** → **Add Watch List**
2. Nombra tu lista
3. Arrastra los Data Points configurados a la lista
4. Guarda y visualiza en tiempo real

#### Crear Visualizaciones

1. Ve a **Graphical views** → **Add Graphical View**
2. Arrastra componentes desde la paleta
3. Asocia Data Points a los componentes
4. Configura colores, rangos y comportamientos

---

### Solución de Problemas

#### El contenedor no inicia

```bash
# Ver logs del contenedor
docker logs scadalts

# Ver logs en tiempo real
docker logs -f scadalts
```

#### No se puede conectar a OpenPLC

1. Verifica que OpenPLC Runtime esté ejecutándose en la instancia:
```bash
# En la instancia de OpenPLC
sudo systemctl status openplc
# o si se ejecuta manualmente
ps aux | grep openplc
```

2. Verifica que el servidor Modbus esté habilitado:
   - Accede a la interfaz web de OpenPLC: `http://<IP_INSTANCIA>:8080`
   - Ve a **Slave Devices** y verifica que el servidor Modbus esté activo

3. Verifica conectividad de red desde el contenedor SCADA:
```bash
docker exec scadalts ping -c 4 <IP_DE_TU_INSTANCIA_OPENPLC>
```

4. Verifica que el puerto Modbus (502) esté abierto:
```bash
docker exec scadalts nc -zv <IP_DE_TU_INSTANCIA_OPENPLC> 502
```

5. Verifica reglas de firewall en la instancia de OpenPLC:
```bash
# En la instancia de OpenPLC
sudo ufw status
sudo iptables -L -n | grep 502
```

6. Si hay firewall, permite el puerto 502:
```bash
# En la instancia de OpenPLC
sudo ufw allow 502/tcp
# o
sudo iptables -A INPUT -p tcp --dport 502 -j ACCEPT
```

#### Error de permisos en volúmenes

```bash
# Dar permisos al volumen
docker exec -u root scadalts chown -R tomcat:tomcat /opt/tomcat/webapps/Scada-LTS/uploads
```

#### Reiniciar servicios

```bash
# Reiniciar SCADA-LTS con Docker Compose
docker-compose restart

# Reiniciar SCADA-LTS con Docker Run
docker restart scadalts

# Reiniciar OpenPLC Runtime (en la instancia de OpenPLC)
sudo systemctl restart openplc
```

#### Acceder a la base de datos interna

SCADA-LTS usa una base de datos **MySQL 5.7** embebida en la imagen Docker.

#### Acceder desde la línea de comandos:

```bash
# Acceder al contenedor
docker exec -it scadalts bash

# Conectar a MySQL
mysql -u root -p
# Contraseña: root
```

#### Credenciales de MySQL:
- **Usuario:** `root`
- **Contraseña:** `root`
- **Base de datos:** `scadalts`

#### Comandos útiles de MySQL:

```sql
-- Ver todas las bases de datos
SHOW DATABASES;

-- Usar la base de datos de SCADA-LTS
USE scadalts;

-- Ver todas las tablas
SHOW TABLES;

-- Ver configuración de Data Sources
SELECT * FROM dataSources;

-- Ver Data Points
SELECT * FROM dataPoints;

-- Backup de la base de datos
```

Crear backup desde fuera del contenedor:
```bash
docker exec scadalts mysqldump -u root -proot scadalts > scadalts_backup_$(date +%Y%m%d).sql
```

Restaurar backup:
```bash
docker exec -i scadalts mysql -u root -proot scadalts < scadalts_backup_YYYYMMDD.sql
```

---

### Comandos Útiles

```bash
# Ver estado del contenedor SCADA-LTS
docker-compose ps

# Ver uso de recursos
docker stats scadalts

# Acceder a la terminal del contenedor
docker exec -it scadalts bash

# Exportar configuración
docker cp scadalts:/opt/tomcat/conf/server.xml ./server_backup.xml

# Limpiar logs
docker exec scadalts sh -c "rm -rf /opt/tomcat/logs/*"

# Verificar conectividad con OpenPLC desde SCADA
docker exec scadalts ping <IP_INSTANCIA_OPENPLC>
docker exec scadalts telnet <IP_INSTANCIA_OPENPLC> 502
```


### Otros Recursos

- [Sitio Oficial SCADA-LTS](http://scada-lts.com/)
- [GitHub SCADA-LTS](https://github.com/SCADA-LTS/Scada-LTS/wiki)
- [OpenPLC Documentation](https://www.openplcproject.com/)
- [Protocolo Modbus TCP/IP](http://www.modbus.org/)

---