---
slug: /configuracion-grafana
title: Configuración Grafana
sidebar_label: Configuración Grafana
---

## Instalación de Grafana con Docker

### Introducción

Grafana es una plataforma de código abierto para visualización y análisis de datos. Esta guía proporciona los pasos necesarios para desplegar Grafana usando Docker, asegurando la persistencia de datos y la configuración óptima para entornos de monitoreo.

### Requisitos Previos

- Docker Engine instalado y en ejecución
- Acceso a la línea de comandos con permisos sudo
- Puerto 3000 disponible en el servidor
- Conexión a Internet para descargar la imagen de Grafana

### Proceso de Instalación

#### Crear un volumen para persistencia

El primer paso es crear un volumen de Docker que garantice que la configuración, dashboards y datos de Grafana no se pierdan cuando el contenedor se reinicie o se elimine.

```bash
docker volume create grafana-storage
```

**¿Por qué es importante?**
- Preserva la configuración de Grafana entre reinicios
- Mantiene los dashboards personalizados
- Guarda las fuentes de datos configuradas
- Protege las credenciales de usuarios

**Verificar el volumen creado:**

```bash
docker volume ls | grep grafana
```

#### Ejecutar el contenedor de Grafana

Ejecutar el siguiente comando para iniciar Grafana en un contenedor Docker:

```bash
docker run -d \
  -p 3000:3000 \
  --name=grafana \
  -v grafana-storage:/var/lib/grafana \
  grafana/grafana-oss
```

#### Explicación de cada parámetro

| Parámetro | Descripción |
|-----------|-------------|
| `-d` | Ejecuta el contenedor en segundo plano (detached mode) |
| `-p 3000:3000` | Mapea el puerto 3000 del contenedor al puerto 3000 del host. Accesible desde `http://<ip-servidor>:3000` |
| `--name=grafana` | Asigna el nombre "grafana" al contenedor para facilitar su gestión |
| `-v grafana-storage:/var/lib/grafana` | Monta el volumen de persistencia en el directorio de datos de Grafana |
| `grafana/grafana-oss` | Especifica la imagen oficial de Grafana Open Source desde Docker Hub |

#### Verificar que el contenedor esté en ejecución

Comprobar el estado del contenedor de Grafana:

```bash
docker ps
```

**Salida esperada:**

```
CONTAINER ID   IMAGE                 COMMAND     CREATED         STATUS         PORTS                    NAMES
abc123def456   grafana/grafana-oss   "/run.sh"   2 minutes ago   Up 2 minutes   0.0.0.0:3000->3000/tcp   grafana
```

**Comandos adicionales de verificación:**

```bash
# Ver logs del contenedor
docker logs grafana

# Ver logs en tiempo real
docker logs -f grafana

# Verificar el estado detallado
docker inspect grafana
```

#### Acceder al panel web de Grafana

Abrir un navegador web y acceder a:

```
http://<IP_de_tu_servidor>:3000
```

**Ejemplos de URLs:**
- Servidor local: `http://localhost:3000`
- Servidor en red local: `http://192.168.1.100:3000`
- Servidor público: `http://tu-dominio.com:3000`

#### Credenciales por defecto

Al acceder por primera vez a Grafana, utilizar las siguientes credenciales:

- **Usuario:** `admin`
- **Contraseña:** `admin`

**Importante:** Grafana solicitará cambiar la contraseña predeterminada en el primer inicio de sesión. Se recomienda establecer una contraseña segura que cumpla con las políticas de seguridad de la organización.

#### Configurar reinicio automático (Opcional pero recomendado)

Para asegurar que Grafana se reinicie automáticamente cuando el servidor se reinicie o si el contenedor falla:

```bash
docker update --restart=always grafana
```

**Políticas de reinicio disponibles:**

| Política | Descripción |
|----------|-------------|
| `no` | No reiniciar automáticamente (por defecto) |
| `on-failure` | Reiniciar solo si el contenedor termina con error |
| `always` | Siempre reiniciar el contenedor, independientemente del estado de salida |
| `unless-stopped` | Reiniciar siempre, excepto si se detuvo manualmente |

**Verificar la política de reinicio:**

```bash
docker inspect grafana | grep RestartPolicy -A 3
```

### Configuración de Fuentes de Datos

#### Agregar InfluxDB como fuente de datos

:::info **Nota Importante**
Esta configuración debe realizarse simultáneamente con la configuración de InfluxDB. Asegúrese de tener InfluxDB instalado y configurado antes de proceder con esta sección. Los siguientes parámetros deben coincidir con la configuración de su instancia de InfluxDB.
:::

#### Paso 1: Acceder a la configuración de fuentes de datos

1. Iniciar sesión en Grafana con las credenciales de administrador
2. En el menú lateral izquierdo, hacer clic en el icono de engranaje ⚙️ (Configuration)
3. Seleccionar **"Data Sources"** (Fuentes de datos)
4. Hacer clic en el botón **"Add data source"** (Agregar fuente de datos)

#### Paso 2: Seleccionar InfluxDB

1. En la lista de fuentes de datos disponibles, buscar y seleccionar **"InfluxDB"**
2. Grafana mostrará el formulario de configuración

#### Paso 3: Configurar la conexión a InfluxDB

**Configuración básica:**

| Campo | Valor | Descripción |
|-------|-------|-------------|
| **Name** | InfluxDB | Nombre identificativo de la fuente de datos |
| **Default** | ✓ | Marcar si será la fuente de datos predeterminada |

**Configuración de conexión HTTP:**

| Campo | Valor de Ejemplo | Descripción |
|-------|------------------|-------------|
| **URL** | `http://influxdb:8086` | URL del servidor InfluxDB (usar nombre del contenedor si están en la misma red Docker) |
| **Access** | Server (default) | Método de acceso a la fuente de datos |

Es importante incluir el usuario de Influxdb, asi como el Token proporcionado inicialmente al abrirlo por primera vez al igual que la organización inicial declarada en la parte de metricas del cluster de Proxmox


:::info **Conectividad entre contenedores**
Si InfluxDB y Grafana están en contenedores Docker separados, deben estar en la misma red Docker o usar la IP del host. Para crear una red compartida:

```bash
docker network create monitoring-network
docker network connect monitoring-network grafana
docker network connect monitoring-network influxdb
```
:::

### Gestión del Contenedor de Grafana

#### Comandos útiles

```bash
# Ver logs del contenedor
docker logs grafana

# Ver logs en tiempo real
docker logs -f grafana

# Detener el contenedor
docker stop grafana

# Iniciar el contenedor
docker start grafana

# Reiniciar el contenedor
docker restart grafana

# Eliminar el contenedor (los datos persisten en el volumen)
docker rm grafana

# Ver estadísticas de uso de recursos
docker stats grafana

# Ejecutar comandos dentro del contenedor
docker exec -it grafana bash
```

#### Comandos de mantenimiento del volumen

```bash
# Listar volúmenes
docker volume ls

# Inspeccionar el volumen
docker volume inspect grafana-storage

# Hacer backup del volumen
docker run --rm -v grafana-storage:/data -v $(pwd):/backup ubuntu tar czf /backup/grafana-backup.tar.gz -C /data .

# Restaurar el volumen desde backup
docker run --rm -v grafana-storage:/data -v $(pwd):/backup ubuntu tar xzf /backup/grafana-backup.tar.gz -C /data
```

### Configuración Avanzada

#### Variables de entorno útiles

Para personalizar la configuración de Grafana al crear el contenedor:

```bash
docker run -d \
  -p 3000:3000 \
  --name=grafana \
  -e "GF_SERVER_ROOT_URL=http://grafana.midominio.com" \
  -e "GF_SECURITY_ADMIN_PASSWORD=mi_password_segura" \
  -e "GF_INSTALL_PLUGINS=grafana-clock-panel,grafana-simple-json-datasource" \
  -v grafana-storage:/var/lib/grafana \
  grafana/grafana-oss
```

**Variables de entorno comunes:**

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `GF_SECURITY_ADMIN_PASSWORD` | Contraseña del usuario admin | `admin123` |
| `GF_SERVER_ROOT_URL` | URL raíz de Grafana | `http://grafana.example.com` |
| `GF_INSTALL_PLUGINS` | Plugins a instalar automáticamente | `grafana-clock-panel` |
| `GF_AUTH_ANONYMOUS_ENABLED` | Habilitar acceso anónimo | `true` |

#### Usar Docker Compose (Recomendado para producción)

Crear un archivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: always
    ports:
      - "3000:3000"
    volumes:
      - grafana-storage:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false
    networks:
      - monitoring

volumes:
  grafana-storage:

networks:
  monitoring:
    driver: bridge
```

**Iniciar con Docker Compose:**

```bash
docker-compose up -d
```

### Solución de Problemas

#### Problema: No se puede acceder a Grafana en el puerto 3000

**Causas posibles:**
1. El contenedor no está en ejecución
2. El puerto 3000 está siendo usado por otra aplicación
3. El firewall está bloqueando el puerto

**Soluciones:**

```bash
# Verificar que el contenedor está corriendo
docker ps | grep grafana

# Verificar que el puerto está mapeado correctamente
docker port grafana

# Verificar procesos usando el puerto 3000
sudo netstat -tulpn | grep 3000

# Abrir el puerto en el firewall (UFW)
sudo ufw allow 3000/tcp

# Abrir el puerto en el firewall (firewalld)
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

#### Problema: Error de permisos en el volumen

**Error:** `GF_PATHS_DATA='/var/lib/grafana' is not writable`

**Solución:**

```bash
# Cambiar permisos del volumen
docker run --rm -v grafana-storage:/var/lib/grafana ubuntu chown -R 472:472 /var/lib/grafana
```

#### Problema: No se puede conectar a InfluxDB

**Verificaciones:**

```bash
# Desde el contenedor de Grafana, probar conectividad
docker exec -it grafana ping influxdb

# Verificar que InfluxDB está escuchando
docker exec -it influxdb netstat -tulpn | grep 8086

# Verificar logs de InfluxDB
docker logs influxdb
```

### Actualización de Grafana

#### Actualizar a la última versión

```bash
# Detener el contenedor actual
docker stop grafana

# Eliminar el contenedor (los datos persisten)
docker rm grafana

# Descargar la última imagen
docker pull grafana/grafana-oss:latest

# Crear nuevo contenedor con la última versión
docker run -d \
  -p 3000:3000 \
  --name=grafana \
  --restart=always \
  -v grafana-storage:/var/lib/grafana \
  grafana/grafana-oss:latest
```

### Seguridad

#### Recomendaciones de seguridad

1. **Cambiar la contraseña por defecto** inmediatamente después de la instalación
2. **Usar HTTPS** mediante un proxy inverso (nginx, Traefik)
3. **Restringir acceso** mediante firewall o VPN
4. **Deshabilitar registro público** de usuarios: `GF_USERS_ALLOW_SIGN_UP=false`
5. **Implementar autenticación externa** (LDAP, OAuth, SAML)
6. **Realizar backups regulares** del volumen de datos
7. **Mantener Grafana actualizado** a la última versión estable

#### Configurar HTTPS con proxy inverso (nginx)

Ejemplo básico de configuración de nginx:

```nginx
server {
    listen 443 ssl;
    server_name grafana.example.com;

    ssl_certificate /etc/ssl/certs/grafana.crt;
    ssl_certificate_key /etc/ssl/private/grafana.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

:::warning Importante
Esta configuración usa Grafana con Influx, sin embargo hay otras variantes como Telegraf o Prometheus, de igual manera esta esta pensada usando Influxdb 2.7 y la ultima version de Grafana, por lo que puede que esta configuración cambie en el futuro. Hay que tomar en cuenta las variaciones y compatibilidad con el equipo Host con Proxmox. La versatilidad y facilidad para reutilizar dashboards de la comunidad es el motivo por el cual la escogimos.
:::


### Recursos Adicionales

- **Documentación oficial de Grafana:** [Documentacion Grafana Oficial](https://grafana.com/docs/)
- **Grafana Docker Hub:** [Docker Image en Docker Hub](https://hub.docker.com/r/grafana/grafana)
- **Galería de dashboards:** [Dashboards de la comunidad](https://grafana.com/grafana/dashboards/)
- **Plugins de Grafana:** [Plugins](https://grafana.com/grafana/plugins/)
- **Comunidad de Grafana:** [Comunidad](https://community.grafana.com/)

