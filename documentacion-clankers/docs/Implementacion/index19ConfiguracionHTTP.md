---
slug: /configuracion-http
title: Configuración HTTP
sidebar_label: Configuración HTTP
---

## Configuración de Servidor Web HTTP con Nginx

Esta guía documenta la configuración completa de un servidor web usando `Nginx` en Ubuntu 24.04. El servidor actúa como servidor web para servir contenido HTTP de la red interna `clankers.lan`.

### Arquitectura de Red

El servidor web está ubicado en la **VLAN 100 (DMZ)** con la dirección IP `192.168.100.13` y proporciona servicio web a todas las VLANs:

- **VLAN 100 (Servicios/DMZ)**: 192.168.100.0/24
- **VLAN 10 (Corporativo)**: 192.168.10.0/24
- **VLAN 20 (IT)**: 192.168.20.0/24
- **VLAN 30 (OT)**: 192.168.30.0/24
- **VLAN 40 (Línea de Producción)**: 192.168.40.0/24

---

## Instalación del Servidor Web

### Requisitos previos

- Sistema operativo: Ubuntu 24.04
- Acceso root o sudo
- Conexión a Internet
- IP estática asignada: `192.168.100.13/24`
- Servidor DNS configurado (clankers.lan debe resolver a 192.168.100.13)

### Pasos de instalación

#### 1. Actualizar el sistema

```bash
sudo apt update
sudo apt upgrade -y
```

#### 2. Instalar Nginx

```bash
sudo apt install nginx -y
```

#### 3. Verificar el estado del servicio

```bash
sudo systemctl status nginx
```

El servicio debería estar activo y ejecutándose.

#### 4. Habilitar el servicio al iniciar

```bash
sudo systemctl enable nginx
```

---

## Configuración de la Interfaz de Red

Asegúrate de que el servidor tenga una IP estática. Edita el archivo de configuración de Netplan:

```bash
sudo nano /etc/netplan/00-installer-config.yaml
```

Ejemplo de configuración:

```yaml
network:
  version: 2
  ethernets:
    eth0:
      addresses:
        - 192.168.100.13/24
      routes:
        - to: default
          via: 192.168.100.1
      nameservers:
        addresses:
          - 192.168.100.11
          - 8.8.8.8
```

Aplica los cambios:

```bash
sudo netplan apply
```

---

## Configuración de Nginx

### Estructura de directorios

#### Crear el directorio raíz del sitio

```bash
sudo mkdir -p /var/www/clankers.lan
```

#### Crear el archivo index.html

```bash
sudo nano /var/www/clankers.lan/index.html
```

#### Contenido del archivo index.html

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <title>Bienvenido a Clankers</title>
</head>
<body>
    <p>Este es el servidor web de clankers.lan, servido por Nginx.</p>
</body>
</html>
```

#### Configurar permisos

Asegúrate de que el directorio y sus archivos pertenecen al usuario `www-data` (usuario que ejecuta Nginx):

```bash
sudo chown -R www-data:www-data /var/www/clankers.lan
```

Verifica los permisos:

```bash
ls -la /var/www/clankers.lan
```

Salida esperada:
```
drwxr-xr-x  2 www-data www-data 4096 Nov  2 10:30 clankers.lan
-rw-r--r--  1 www-data www-data  220 Nov  2 10:30 index.html
```

---

## Archivo de Configuración del Sitio

### Crear el archivo de configuración

```bash
sudo nano /etc/nginx/sites-available/clankers.lan
```

### Contenido del archivo de configuración

```nginx
server {
    listen 80;
    server_name clankers.lan www.clankers.lan;

    root /var/www/clankers.lan;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

### Explicación de la Configuración

#### Directiva listen

```nginx
listen 80;
```

Nginx escucha en el puerto 80 (HTTP estándar) en todas las interfaces de red.

#### Directiva server_name

```nginx
server_name clankers.lan www.clankers.lan;
```

Define los nombres de dominio que este bloque de servidor maneja:
- `clankers.lan`: Dominio base
- `www.clankers.lan`: Subdominio www

#### Directiva root

```nginx
root /var/www/clankers.lan;
```

Define la ruta base del directorio donde se encuentran los archivos del sitio web.

#### Directiva index

```nginx
index index.html;
```

Define el archivo por defecto que se sirve cuando se accede a un directorio. En este caso, si se accede a `/`, se sirve `/index.html`.

#### Bloque location

```nginx
location / {
    try_files $uri $uri/ =404;
}
```

Define cómo manejar las solicitudes a la raíz del sitio:
- `try_files $uri`: Intenta servir el archivo solicitado tal cual.
- `try_files $uri/`: Intenta servir como directorio.
- `=404`: Si ninguno existe, devuelve un error 404.

---

## Habilitar la Configuración del Sitio

### Crear un enlace simbólico

Para habilitar la configuración, crea un enlace simbólico desde `sites-available` a `sites-enabled`:

```bash
sudo ln -s /etc/nginx/sites-available/clankers.lan /etc/nginx/sites-enabled/
```

Verifica que el enlace se creó correctamente:

```bash
ls -la /etc/nginx/sites-enabled/
```

Salida esperada:
```
lrwxrwxrwx 1 root root 39 Nov  2 10:30 clankers.lan -> /etc/nginx/sites-available/clankers.lan
```

### Deshabilitar el sitio por defecto

Si aún existe el sitio por defecto, deshabilitalo:

```bash
sudo rm /etc/nginx/sites-enabled/default
```

o

```bash
sudo unlink /etc/nginx/sites-enabled/default
```

Verifica que fue removido:

```bash
ls -la /etc/nginx/sites-enabled/
```

Solo debe mostrarse `clankers.lan`.

---

## Validación y Prueba de la Configuración

### Validar la sintaxis de configuración

```bash
sudo nginx -t
```

Salida esperada:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Recargar la configuración

```bash
sudo systemctl reload nginx
```

o

```bash
sudo nginx -s reload
```

### Verificar el estado del servicio

```bash
sudo systemctl status nginx
```

Salida esperada:
```
● nginx.service - A high performance web server and a reverse proxy server
     Loaded: loaded (/lib/systemd/system/nginx.service; enabled; preset: enabled)
     Active: active (running) since Fri 2025-11-02 10:30:00 UTC
```

---

## Pruebas del Servidor Web

### Verificar que Nginx está escuchando

```bash
sudo ss -tulpn | grep :80
```

Salida esperada:
```
LISTEN 0 511 0.0.0.0:80 0.0.0.0:* users:(("nginx",pid=xxxx,fd=6))
```

### Prueba desde el mismo servidor

#### Usando curl

```bash
curl http://localhost
```

Salida esperada:
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <title>Bienvenido a Clankers</title>
</head>
<body>
    <p>Este es el servidor web de clankers.lan, servido por Nginx.</p>
</body>
</html>
```

#### Usando wget

```bash
wget -O - http://localhost
```

### Prueba desde otra máquina en la red

#### Usando curl

```bash
curl http://192.168.100.13
```

o

```bash
curl http://clankers.lan
```

#### Usando navegador web

Abre un navegador web e ingresa:
```
http://clankers.lan
```

o

```
http://www.clankers.lan
```

Deberías ver la página "Bienvenido a Clankers".

#### Usando wget

```bash
wget http://clankers.lan
```

---

## Configuración de Firewall (UFW)

Si usas UFW, permite el tráfico HTTP:

```bash
sudo ufw allow 80/tcp
sudo ufw reload
```

Verifica el estado:

```bash
sudo ufw status
```

---

## Monitoreo y Troubleshooting

### Ver los Logs de Nginx

#### Log de acceso

```bash
sudo tail -f /var/log/nginx/access.log
```

Ejemplo de salida:
```
192.168.100.3 - - [02/Nov/2025:10:30:00 +0000] "GET / HTTP/1.1" 200 220 "-" "Mozilla/5.0"
```

#### Log de errores

```bash
sudo tail -f /var/log/nginx/error.log
```

#### Ver logs del servicio

```bash
sudo journalctl -u nginx -f
```

### Comandos Útiles para Nginx

#### Verificar el estado del proceso

```bash
ps aux | grep nginx
```

Salida esperada:
```
root      xxxx  0.0  0.1  53120  3456 ?        Ss   10:30   0:00 nginx: master process
www-data  xxxx  0.0  0.2  84260  5456 ?        S    10:30   0:00 nginx: worker process
```

#### Contar conexiones activas

```bash
sudo ss -an | grep :80 | grep ESTABLISHED | wc -l
```

#### Ver archivos de configuración activos

```bash
sudo nginx -T
```

#### Recargar Nginx sin reiniciar

```bash
sudo systemctl reload nginx
```

---

## Resolución de Problemas Comunes

### Problema: Error "Permission denied" al acceder a archivos

**Causa**: Los permisos del directorio no son correctos.

**Solución**:

```bash
# Asignar propiedad al usuario www-data
sudo chown -R www-data:www-data /var/www/clankers.lan

# Asignar permisos adecuados
sudo chmod -R 755 /var/www/clankers.lan
sudo chmod -R 644 /var/www/clankers.lan/*
```

### Problema: Error "404 Not Found" al acceder al sitio

**Causa 1**: El archivo `index.html` no existe.

**Solución**:
```bash
ls -la /var/www/clankers.lan/
```

Verifica que `index.html` existe. Si no, créalo.

**Causa 2**: La ruta en el archivo de configuración es incorrecta.

**Solución**: Verifica la directiva `root` en `/etc/nginx/sites-available/clankers.lan`.

**Causa 3**: El sitio no está habilitado.

**Solución**:
```bash
ls -la /etc/nginx/sites-enabled/clankers.lan
```

Verifica que el enlace simbólico existe.

### Problema: El sitio por defecto se sigue sirviendo

**Causa**: El sitio por defecto aún está habilitado.

**Solución**: Deshabilita el sitio por defecto:

```bash
sudo rm /etc/nginx/sites-enabled/default
sudo systemctl reload nginx
```

### Problema: Error "Address already in use"

**Causa**: Otro proceso está usando el puerto 80.

**Solución**: Identifica el proceso:

```bash
sudo ss -tulpn | grep :80
```

Detén el proceso o cambia el puerto en la configuración de Nginx.

### Problema: DNS no resuelve clankers.lan

**Causa**: El cliente no está configurado para usar el DNS correcto.

**Solución**: Verifica la configuración DNS del cliente:

```bash
cat /etc/resolv.conf
```

Debe incluir:
```
nameserver 192.168.100.11
```

---

## Resumen de Puertos y Servicios

| Servicio | Puerto | Protocolo | Descripción               |
|----------|--------|-----------|---------------------------|
| HTTP     | 80     | TCP       | Servidor web (Nginx)      |

---

## Resumen de Archivos y Directorios

| Ruta                                          | Descripción                              |
|-----------------------------------------------|------------------------------------------|
| /var/www/clankers.lan                         | Directorio raíz del sitio web            |
| /var/www/clankers.lan/index.html              | Página de inicio del sitio web           |
| /etc/nginx/sites-available/clankers.lan       | Archivo de configuración del sitio       |
| /etc/nginx/sites-enabled/clankers.lan         | Enlace simbólico de configuración activa |
| /var/log/nginx/access.log                     | Log de acceso de Nginx                   |
| /var/log/nginx/error.log                      | Log de errores de Nginx                  |

---

## Mejores Prácticas

1. **Respaldar configuración**: Siempre haz copias de seguridad antes de cambios:

   ```bash
   sudo cp /etc/nginx/sites-available/clankers.lan /backup/clankers.lan.$(date +%Y%m%d)
   ```

2. **Validar antes de aplicar**: Siempre valida la configuración:

   ```bash
   sudo nginx -t
   ```

3. **Usar reload en lugar de restart**: Usa `reload` para cambios de configuración sin interrumpir conexiones:

   ```bash
   sudo systemctl reload nginx
   ```

4. **Monitoreo regular**: Implementa monitoreo del servidor web (Nagios, Zabbix, etc.).

5. **Actualizar contenido web**: Mantén el contenido del sitio web actualizado y seguro.

6. **Logs y auditoría**: Revisa regularmente los logs de acceso y errores para detectar problemas.

7. **Documentación**: Mantén documentados todos los cambios y configuraciones realizadas.