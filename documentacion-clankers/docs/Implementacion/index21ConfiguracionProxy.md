---
slug: /configuracion-proxy
title: Configuración Proxy
sidebar_label: Configuración Proxy
---

## Configuración de TinyProxy en Linux

### ¿Qué es TinyProxy?

TinyProxy es un servidor proxy HTTP/HTTPS ligero y de alto rendimiento diseñado para sistemas Unix/Linux. Es ideal para situaciones donde se necesita un proxy simple pero efectivo, sin la complejidad de soluciones más grandes como Squid. En nuestra arquitectura lo utilizamos cuando requerimos instalar o configurar algo a traves de wget, curl o git

#### Características principales

- **Ligero y rápido**: Consume muy pocos recursos del sistema
- **Fácil de configurar**: Archivo de configuración simple y directo
- **Filtrado de contenido**: Puede bloquear URLs y dominios
- **Control de acceso**: Restricción por IP o redes
- **Transparente**: Puede funcionar como proxy transparente
- **Logging detallado**: Registro de todas las conexiones y peticiones

#### Casos de uso comunes

- **Compartir conexión a Internet**: Permitir que múltiples dispositivos accedan a través de una sola conexión
- **Filtrado de contenido**: Bloquear sitios web no deseados
- **Desarrollo web**: Interceptar y analizar tráfico HTTP/HTTPS
- **Anonimato básico**: Ocultar la IP real de los clientes
- **Control de acceso**: Limitar qué equipos pueden usar la conexión

### Instalación del Servidor TinyProxy

#### Requisitos previos

- Sistema operativo: Debian, Ubuntu
- Acceso root o sudo
- Conexión a Internet

#### Instalación en Debian/Ubuntu

**1. Actualizar el sistema**

```bash
sudo apt update
sudo apt upgrade -y
```

**2. Instalar TinyProxy**

```bash
sudo apt install tinyproxy -y
```

**3. Verificar el estado del servicio**

```bash
sudo systemctl status tinyproxy
```

**4. Habilitar el servicio al iniciar**

```bash
sudo systemctl enable tinyproxy
```

### Configuración del Servidor

#### Archivo de configuración principal

El archivo de configuración se encuentra en: `/etc/tinyproxy/tinyproxy.conf`

**1. Hacer una copia de seguridad**

```bash
sudo cp /etc/tinyproxy/tinyproxy.conf /etc/tinyproxy/tinyproxy.conf.backup
```

**2. Editar el archivo de configuración**

```bash
sudo nano /etc/tinyproxy/tinyproxy.conf
```

#### Configuraciones esenciales

##### Puerto de escucha

Por defecto es 8888. Puedes cambiarlo:

```conf
# Puerto en el que escucha TinyProxy
Port 8888
```

#### Dirección de escucha

Por defecto escucha en todas las interfaces. Para restricción:

```conf
# Escuchar solo en una IP específica
# Listen 192.168.1.100

# Comentar o eliminar esta línea para escuchar en todas las interfaces
# Listen 127.0.0.1
```

**IMPORTANTE**: Se debe comentar o eliminar la línea `Listen 127.0.0.1` para que otras máquinas cliente puedan conectarse.

#### Timeout de conexión

```conf
# Tiempo de espera para conexiones inactivas (en segundos)
Timeout 600
```

#### Archivo de log

```conf
# Ubicación del archivo de log
LogFile "/var/log/tinyproxy/tinyproxy.log"

# Nivel de detalle del log (Critical, Error, Warning, Notice, Connect, Info)
LogLevel Info
```

#### Control de acceso

**Permitir acceso desde redes específicas:**

```conf
# Permitir conexiones desde localhost
Allow 127.0.0.1

# Permitir toda la red local 192.168.1.x
Allow 192.168.1.0/24

# Permitir IP específica
Allow 192.168.1.50

# Permitir múltiples redes
Allow 10.0.0.0/8
Allow 172.16.0.0/12
```

**Denegar acceso:**

```conf
# Denegar una IP específica
Deny 192.168.1.100
```

#### ViaProxyName (Encabezado de proxy)

```conf
# Agregar encabezado Via con nombre del proxy
ViaProxyName "TinyProxy"

# O deshabilitar para mayor anonimato
# DisableViaHeader Yes
```

#### Filtrado de URLs

**Crear archivo de filtros:**

```bash
sudo nano /etc/tinyproxy/filter
```

**Agregar dominios a bloquear (uno por línea):**

```
facebook.com
twitter.com
youtube.com
*.ads.com
```

**Habilitar el filtro en tinyproxy.conf:**

```conf
# Archivo con lista de URLs bloqueadas
Filter "/etc/tinyproxy/filter"

# Tipo de filtro (Default: bloquea las URLs en el archivo)
FilterURLs On

# Expresiones regulares extendidas
FilterExtended On
```

#### Páginas de error personalizadas

```conf
# Directorio con páginas de error HTML personalizadas
ErrorFile 404 "/usr/share/tinyproxy/404.html"
ErrorFile 403 "/usr/share/tinyproxy/403.html"
```

#### Modo anónimo

```conf
# Ocultar información del cliente (mayor privacidad)
Anonymous "Host"
Anonymous "Authorization"
```

#### Configuración completa recomendada

```conf
##
## TinyProxy Configuration File
##

User tinyproxy
Group tinyproxy

Port 8888

# Comentar esta línea para permitir conexiones externas
# Listen 127.0.0.1

Timeout 600

DefaultErrorFile "/usr/share/tinyproxy/default.html"
StatFile "/usr/share/tinyproxy/stats.html"

LogFile "/var/log/tinyproxy/tinyproxy.log"
LogLevel Info

PidFile "/run/tinyproxy/tinyproxy.pid"

# Control de acceso - Ajusta según tu red
Allow 127.0.0.1
Allow 192.168.1.0/24
Allow 192.168.0.0/24
Allow 10.0.0.0/8

# Identificación del proxy
ViaProxyName "TinyProxy"

# Filtrado (opcional)
# Filter "/etc/tinyproxy/filter"
# FilterURLs On

# Límites de conexión
MaxClients 100
MinSpareServers 5
MaxSpareServers 20
StartServers 10
MaxRequestsPerChild 0

# Anonimato (opcional)
# DisableViaHeader Yes
```

#### Aplicar cambios

**1. Reiniciar el servicio**

```bash
sudo systemctl restart tinyproxy
```

**2. Verificar que está funcionando**

```bash
sudo systemctl status tinyproxy
```

**3. Verificar que escucha en el puerto correcto**

```bash
sudo netstat -tlnp | grep tinyproxy
# o
sudo ss -tlnp | grep tinyproxy
```

**4. Obtener la IP del servidor**

```bash
hostname -I
# o
ip addr show
```

#### Configuración del firewall

**En sistemas con UFW (Ubuntu/Debian):**

```bash
sudo ufw allow 8888/tcp
sudo ufw reload
sudo ufw status
```

### Configuración de Clientes

#### Linux (Terminal)

#### Configuración temporal (sesión actual)

**Para todas las aplicaciones que respetan variables de entorno:**

```bash
# HTTP Proxy
export http_proxy="http://IP_SERVIDOR:8888"
export HTTP_PROXY="http://IP_SERVIDOR:8888"

# HTTPS Proxy
export https_proxy="http://IP_SERVIDOR:8888"
export HTTPS_PROXY="http://IP_SERVIDOR:8888"

# FTP Proxy (opcional)
export ftp_proxy="http://IP_SERVIDOR:8888"
export FTP_PROXY="http://IP_SERVIDOR:8888"

# Sin proxy para localhost y red local
export no_proxy="localhost,127.0.0.1,192.168.0.0/16,10.0.0.0/8"
export NO_PROXY="localhost,127.0.0.1,192.168.0.0/16,10.0.0.0/8"
```

**Ejemplo completo:**

```bash
export http_proxy="http://192.168.1.100:8888"
export https_proxy="http://192.168.1.100:8888"
export no_proxy="localhost,127.0.0.1"
```

#### Configuración permanente

**Para el usuario actual (Bash):**

```bash
nano ~/.bashrc
# o
nano ~/.bash_profile
```

**Agregar al final del archivo:**

```bash
# Configuración de proxy
export http_proxy="http://192.168.1.100:8888"
export https_proxy="http://192.168.1.100:8888"
export ftp_proxy="http://192.168.1.100:8888"
export no_proxy="localhost,127.0.0.1,192.168.0.0/16"
```

**Aplicar cambios:**

```bash
source ~/.bashrc
```

**Para el sistema completo (todos los usuarios):**

```bash
sudo nano /etc/environment
```

**Agregar:**

```bash
http_proxy="http://192.168.1.100:8888"
https_proxy="http://192.168.1.100:8888"
ftp_proxy="http://192.168.1.100:8888"
no_proxy="localhost,127.0.0.1,192.168.0.0/16"
```

#### Configuración para APT (Debian/Ubuntu)

```bash
sudo nano /etc/apt/apt.conf.d/proxy.conf
```

**Contenido:**

```conf
Acquire::http::Proxy "http://192.168.1.100:8888";
Acquire::https::Proxy "http://192.168.1.100:8888";
```

**Agregar:**

```conf
proxy=http://192.168.1.100:8888
```

#### Git Bash (Windows)

#### Configuración temporal

```bash
export http_proxy=http://IP_SERVIDOR:8888
export https_proxy=http://IP_SERVIDOR:8888
```

#### Configuración permanente

**Editar archivo de perfil:**

```bash
nano ~/.bash_profile
# o
nano ~/.bashrc
```

**Agregar:**

```bash
export http_proxy="http://192.168.1.100:8888"
export https_proxy="http://192.168.1.100:8888"
export no_proxy="localhost,127.0.0.1"
```

**Aplicar:**

```bash
source ~/.bash_profile
```

#### MSYS2/MinGW

#### Configuración temporal

```bash
export http_proxy=http://IP_SERVIDOR:8888
export https_proxy=http://IP_SERVIDOR:8888
```

#### Configuración permanente

**Editar archivo de perfil:**

```bash
nano ~/.bashrc
```

**Agregar:**

```bash
# Proxy configuration
export http_proxy="http://192.168.1.100:8888"
export https_proxy="http://192.168.1.100:8888"
export ftp_proxy="http://192.168.1.100:8888"
export no_proxy="localhost,127.0.0.1"
```

**Recargar:**

```bash
source ~/.bashrc
```

#### Configuración de aplicaciones específicas

#### Git

```bash
# Configurar proxy para Git
git config --global http.proxy http://192.168.1.100:8888
git config --global https.proxy http://192.168.1.100:8888

# Ver configuración
git config --global --get http.proxy
git config --global --get https.proxy

# Eliminar proxy de Git
git config --global --unset http.proxy
git config --global --unset https.proxy
```

#### Wget

**Configuración temporal:**

```bash
wget -e use_proxy=yes -e http_proxy=192.168.1.100:8888 URL
```

**Configuración permanente:**

```bash
nano ~/.wgetrc
```

**Agregar:**

```
http_proxy = http://192.168.1.100:8888
https_proxy = http://192.168.1.100:8888
use_proxy = on
```

#### Curl

**Uso directo:**

```bash
curl -x http://192.168.1.100:8888 http://example.com
```

**Configuración permanente:**

```bash
nano ~/.curlrc
```

**Agregar:**

```
proxy = http://192.168.1.100:8888
```

#### npm (Node.js)

```bash
npm config set proxy http://192.168.1.100:8888
npm config set https-proxy http://192.168.1.100:8888

# Ver configuración
npm config get proxy
npm config get https-proxy

# Eliminar proxy
npm config delete proxy
npm config delete https-proxy
```

#### pip (Python)

**Configuración temporal:**

```bash
pip install paquete --proxy http://192.168.1.100:8888
```

**Configuración permanente:**

```bash
nano ~/.pip/pip.conf
# o en Windows: %APPDATA%\pip\pip.ini
```

**Agregar:**

```ini
[global]
proxy = http://192.168.1.100:8888
```

#### Windows (Sistema completo)

**Método 1: Variables de entorno del sistema**

1. Buscar "variables de entorno" en el menú inicio
2. Click en "Variables de entorno"
3. En "Variables del sistema", crear nuevas:
   - `HTTP_PROXY`: `http://192.168.1.100:8888`
   - `HTTPS_PROXY`: `http://192.168.1.100:8888`
   - `NO_PROXY`: `localhost,127.0.0.1`

**Método 2: PowerShell (temporal)**

```powershell
$env:HTTP_PROXY = "http://192.168.1.100:8888"
$env:HTTPS_PROXY = "http://192.168.1.100:8888"
```

**Método 3: Configuración de red de Windows**

1. Configuración → Red e Internet → Proxy
2. Configuración manual del proxy
3. Activar "Usar un servidor proxy"
4. Dirección: `192.168.1.100`
5. Puerto: `8888`

### Verificación y Pruebas

#### Verificar que el proxy funciona

**Desde Linux/Git Bash/MSYS2:**

```bash
# Probar con curl
curl -I http://www.google.com

# Ver IP pública (debería mostrar la IP del servidor proxy)
curl http://ifconfig.me
curl http://icanhazip.com

# Probar con wget
wget --spider http://www.google.com
```

**Verificar variables de entorno:**

```bash
echo $http_proxy
echo $https_proxy
env | grep -i proxy
```

#### Monitorear el servidor TinyProxy

**Ver logs en tiempo real:**

```bash
sudo tail -f /var/log/tinyproxy/tinyproxy.log
```

**Ver estadísticas:**

Accede desde un navegador a: `http://IP_SERVIDOR:8888/stats` (si está habilitado en la configuración)

**Verificar conexiones activas:**

```bash
sudo netstat -tnpa | grep 8888
# o
sudo ss -tnpa | grep 8888
```

**Ver uso de recursos:**

```bash
ps aux | grep tinyproxy
```

### Solución de Problemas

#### El cliente no puede conectarse

**1. Verificar que el servicio está activo:**

```bash
sudo systemctl status tinyproxy
```

**2. Verificar que escucha en el puerto correcto:**

```bash
sudo netstat -tlnp | grep 8888
```

**3. Verificar conectividad de red:**

```bash
ping IP_SERVIDOR
telnet IP_SERVIDOR 8888
```

**4. Revisar configuración de Allow en el servidor:**

```bash
sudo grep -i "Allow" /etc/tinyproxy/tinyproxy.conf
```

**5. Revisar firewall:**

```bash
sudo ufw status
# o
sudo firewall-cmd --list-all
```

#### El proxy no funciona con HTTPS

- TinyProxy puede tener problemas con HTTPS si el sitio usa HSTS
- Verifica que `https_proxy` esté configurado
- Considera usar `CONNECT` method habilitado en la configuración

#### Errores de acceso denegado (403)

**Revisar archivo de log:**

```bash
sudo tail -50 /var/log/tinyproxy/tinyproxy.log
```

**Verificar que la IP del cliente está en Allow:**

```bash
sudo nano /etc/tinyproxy/tinyproxy.conf
```

#### Rendimiento lento

**Aumentar recursos:**

```conf
MaxClients 200
MaxSpareServers 40
StartServers 20
```

**Reiniciar servicio:**

```bash
sudo systemctl restart tinyproxy
```

#### Desactivar proxy temporalmente

**En Linux/Git Bash/MSYS2:**

```bash
unset http_proxy
unset https_proxy
unset HTTP_PROXY
unset HTTPS_PROXY
```

**En Git:**

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

### Seguridad y Mejores Prácticas

#### Autenticación básica

TinyProxy no soporta autenticación nativa. Para agregar autenticación, se tendria que contemplar lo siguiente:

1. Usar un proxy inverso con autenticación (nginx, apache)
2. Implementar VPN para controlar acceso
3. Usar reglas de firewall estrictas

#### Restricciones recomendadas

```conf
# Limitar a redes confiables
Allow 192.168.1.0/24
Deny 0.0.0.0/0

# Filtrar sitios peligrosos
Filter "/etc/tinyproxy/filter"
FilterURLs On
```

#### Monitoreo

```bash
# Crear script de monitoreo
sudo nano /usr/local/bin/tinyproxy-monitor.sh
```

**Contenido:**

```bash
#!/bin/bash
tail -f /var/log/tinyproxy/tinyproxy.log | while read line; do
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $line"
done
```

**Dar permisos:**

```bash
sudo chmod +x /usr/local/bin/tinyproxy-monitor.sh
```

#### Rotación de logs

```bash
sudo nano /etc/logrotate.d/tinyproxy
```

**Agregar:**

```
/var/log/tinyproxy/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 640 tinyproxy tinyproxy
    sharedscripts
    postrotate
        systemctl reload tinyproxy > /dev/null 2>&1 || true
    endscript
}
```

#### Ventajas principales

- Configuración rápida y sencilla
- Bajo consumo de recursos
- Fácil integración con sistemas Linux
- Compatible con la mayoría de herramientas y aplicaciones

#### Limitaciones

- No soporta autenticación nativa
- Funcionalidad limitada comparado con proxies más robustos
- No apto para entornos empresariales grandes que requieren características avanzadas

En el caso de nuestro laboratorio tinyproxy cumple su proposito sencillo de ayudarnos a comunicar la PC Host de Proxmox con internet para descargar y aplicar parches. Para necesidades más complejas, consideramos que se deben usar alternativas mas complejas como Squid, HAProxy o NGINX.