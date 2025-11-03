---
slug: /configuracion-apt-cacher
title: Configuración APT Cacher
sidebar_label: Configuración APT Cacher
---

## Configuración de APT-Cacher-NG en Linux

### ¿Qué es APT-Cacher-NG?

APT-Cacher-NG es un servidor proxy de caché para repositorios de paquetes de Linux (APT, principalmente para distribuciones basadas en Debian/Ubuntu). Su función principal es almacenar en caché los paquetes descargados, permitiendo que múltiples equipos en una red local los reutilicen sin necesidad de descargarlos nuevamente desde Internet. En nuestra arquitectura, el uso de APT-Cacher-NG fue necesaria dado a las limitaciones de proporcionarle acceso a internet a la maquina host de proxmox. Usar este proxy cache de paquetes resulta en:

- **Ahorro significativo de ancho de banda**: Los paquetes se descargan una sola vez desde Internet
- **Actualizaciones más rápidas**: Los clientes obtienen los paquetes desde la red local
- **Reducción de costos**: Especialmente útil en conexiones medidas o limitadas
- **Mayor eficiencia**: Ideal para laboratorios, empresas o entornos con múltiples máquinas Linux

### Instalación del Servidor APT-Cacher-NG

#### Requisitos previos

- Sistema operativo: Debian, Ubuntu o derivados
- Acceso root o sudo
- Conexión a Internet

#### Pasos de instalación

**1. Actualizar el sistema**

```bash
sudo apt update
sudo apt upgrade -y
```

**2. Instalar APT-Cacher-NG**

```bash
sudo apt install apt-cacher-ng -y
```

**3. Verificar el estado del servicio**

```bash
sudo systemctl status apt-cacher-ng
```

El servicio debería estar activo y ejecutándose. Por defecto, escucha en el puerto 3142.

**4. Habilitar el servicio para que inicie automáticamente**

```bash
sudo systemctl enable apt-cacher-ng
```

#### Configuración del servidor

**1. Editar el archivo de configuración principal**

```bash
sudo nano /etc/apt-cacher-ng/acng.conf
```

**2. Configuraciones importantes (opcionales pero recomendadas)**

Busca y ajusta las siguientes líneas según tus necesidades:

```
# Puerto de escucha (por defecto 3142)
Port: 3142

# Directorio de caché
CacheDir: /var/cache/apt-cacher-ng

# Permitir conexiones desde cualquier IP (descomenta si es necesario)
# BindAddress: 0.0.0.0

# Habilitar logs detallados
VerboseLog: 1
```

**3. Guardar y cerrar** (Ctrl+O, Enter, Ctrl+X en nano)

**4. Reiniciar el servicio**

```bash
sudo systemctl restart apt-cacher-ng
```

**5. Verificar la IP del servidor**

```bash
ip addr show
# o más simple:
hostname -I
```

Anota la IP del servidor, la necesitarás para configurar los clientes.

#### Configuración del firewall (si está activo)

```bash
sudo ufw allow 3142/tcp
sudo ufw reload
```

### Configuración de las Máquinas Cliente

#### Método 1: Configuración manual (recomendado)

**1. Crear archivo de configuración para el proxy**

```bash
sudo nano /etc/apt/apt.conf.d/00proxy
```

**2. Agregar la siguiente línea**

Reemplaza `IP_DEL_SERVIDOR` con la IP real de tu servidor APT-Cacher-NG:

```
Acquire::http::Proxy "http://IP_DEL_SERVIDOR:3142";
```

Ejemplo:
```
Acquire::http::Proxy "http://192.168.1.100:3142";
```

**3. Guardar y cerrar el archivo**

**4. Probar la configuración**

```bash
sudo apt update
```

Si todo está correcto, verás que las descargas ahora pasan por el proxy.

#### Método 2: Configuración con detección automática

**1. Instalar el paquete auto-apt-proxy**

```bash
sudo apt install auto-apt-proxy -y
```

Este método intentará detectar automáticamente servidores APT-Cacher-NG en la red local.

#### Método 3: Variable de entorno temporal

Para pruebas rápidas sin modificar archivos de configuración:

```bash
export http_proxy=http://IP_DEL_SERVIDOR:3142
sudo apt update
```

### Verificación y Monitoreo

#### Acceder a la interfaz web

APT-Cacher-NG incluye una interfaz web de administración:

1. Abre un navegador web
2. Visita: `http://IP_DEL_SERVIDOR:3142/acng-report.html`
3. Aquí podrás ver estadísticas de uso, caché, y realizar mantenimiento

#### Ver estadísticas desde la línea de comandos

```bash
# Ver el tamaño del caché
sudo du -sh /var/cache/apt-cacher-ng

# Ver logs en tiempo real
sudo tail -f /var/log/apt-cacher-ng/apt-cacher.log
```

#### Probar que el caché funciona

En una máquina cliente:

```bash
# Primera descarga (desde Internet)
sudo apt install htop -y

# Desinstalar
sudo apt remove htop -y

# Reinstalar (debería ser mucho más rápido, desde caché)
sudo apt install htop -y
```

### Mantenimiento

#### Limpiar el caché

Desde la interfaz web o mediante comandos:

```bash
# Limpiar paquetes obsoletos
sudo apt-cacher-ng -c /etc/apt-cacher-ng
```

#### Liberar espacio en disco

```bash
# Ver archivos que pueden eliminarse
sudo /usr/lib/apt-cacher-ng/acngtool shrink /var/cache/apt-cacher-ng

# Ejecutar limpieza
sudo /usr/lib/apt-cacher-ng/acngtool shrink -f /var/cache/apt-cacher-ng
```

### Solución de Problemas

#### El cliente no puede conectarse al servidor

1. Verifica que el servidor esté ejecutándose:
   ```bash
   sudo systemctl status apt-cacher-ng
   ```

2. Verifica la conectividad de red:
   ```bash
   ping IP_DEL_SERVIDOR
   telnet IP_DEL_SERVIDOR 3142
   ```

3. Revisa el firewall en el servidor

#### Los paquetes no se cachean

1. Verifica los logs:
   ```bash
   sudo tail -f /var/log/apt-cacher-ng/apt-cacher.log
   ```

2. Revisa los permisos del directorio de caché:
   ```bash
   ls -la /var/cache/apt-cacher-ng
   ```

#### Desactivar el proxy en un cliente

Si necesitas desactivar temporalmente el proxy:

```bash
sudo rm /etc/apt/apt.conf.d/00proxy
sudo apt update
```

### Configuraciones Avanzadas

#### Soportar HTTPS (repositorios seguros)

Algunos repositorios modernos usan HTTPS. Para soportarlos, agrega en el cliente:

```bash
sudo nano /etc/apt/apt.conf.d/00proxy
```

Contenido:
```
Acquire::http::Proxy "http://IP_DEL_SERVIDOR:3142";
Acquire::https::Proxy "DIRECT";
```

Esto hará que las conexiones HTTP usen el proxy y las HTTPS se conecten directamente.

#### Configurar múltiples servidores (failover)

En el cliente, puedes configurar un proxy alternativo:

```
Acquire::http::Proxy "http://proxy1:3142";
Acquire::http::Proxy::proxy1 "DIRECT";
```