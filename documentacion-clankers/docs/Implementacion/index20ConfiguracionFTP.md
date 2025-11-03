---
slug: /configuracion-ftp
title: Configuración FTP
sidebar_label: Configuración FTP
---

## Configuración de Servidor FTP con vsftpd

Esta guía documenta la configuración completa de un servidor FTP usando `vsftpd` (Very Secure FTP Daemon) en Ubuntu 24.04. El servidor actúa como servidor FTP para la transferencia de archivos de la red interna `clankers.lan`.

### Arquitectura de Red

El servidor FTP está ubicado en la **VLAN 100 (DMZ)** con la dirección IP `192.168.100.14` y proporciona servicio FTP a todas las VLANs:

- **VLAN 100 (Servicios/DMZ)**: 192.168.100.0/24
- **VLAN 10 (Corporativo)**: 192.168.10.0/24
- **VLAN 20 (IT)**: 192.168.20.0/24
- **VLAN 30 (OT)**: 192.168.30.0/24
- **VLAN 40 (Línea de Producción)**: 192.168.40.0/24

---

## Instalación del Servidor FTP

### Requisitos previos

- Sistema operativo: Ubuntu 24.04
- Acceso root o sudo
- Conexión a Internet
- IP estática asignada: `192.168.100.14/24`
- Servidor DNS configurado (ftp.clankers.lan debe resolver a 192.168.100.14)

### Pasos de instalación

#### 1. Actualizar el sistema

```bash
sudo apt update
sudo apt upgrade -y
```

#### 2. Instalar vsftpd

```bash
sudo apt install vsftpd -y
```

#### 3. Verificar el estado del servicio

```bash
sudo systemctl status vsftpd
```

El servicio debería estar activo y ejecutándose.

#### 4. Habilitar el servicio al iniciar

```bash
sudo systemctl enable vsftpd
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
        - 192.168.100.14/24
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

## Configuración de vsftpd

### Archivo de configuración principal: vsftpd.conf

El archivo de configuración principal de vsftpd se encuentra en `/etc/vsftpd.conf`.

#### Crear/Editar el archivo de configuración

```bash
sudo nano /etc/vsftpd.conf
```

#### Contenido del archivo de configuración

```conf
# Configuración general de vsftpd
listen=YES
listen_ipv6=NO
anonymous_enable=NO
local_enable=YES
write_enable=YES
local_umask=022
dirmessage_enable=YES
use_localtime=YES
xferlog_enable=YES
xferlog_file=/var/log/vsftpd.log
xferlog_std_format=YES
ftpd_banner=Servidor FTP - clankers.lan
chroot_local_user=YES
chroot_list_enable=YES
chroot_list_file=/etc/vsftpd.chroot_list
allow_writeable_chroot=YES
secure_chroot_dir=/var/run/vsftpd/empty
pam_service_name=vsftpd
rsa_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem
rsa_key_file=/etc/ssl/private/ssl-cert-snakeoil.key
ssl_enable=YES
allow_anon_ssl=NO
force_local_data_ssl=YES
force_local_logins_ssl=YES
ssl_tlsv1=YES
ssl_tlsv1_2=YES
ssl_sslv3=NO
require_ssl_reuse=NO
ssl_ciphers=DEFAULT
data_connection_timeout=300
connect_timeout=60
idle_session_timeout=300
max_clients=0
max_per_ip=0
pasv_enable=YES
pasv_min_port=40000
pasv_max_port=40100
pasv_address=192.168.100.14
port_enable=YES
```

### Explicación de la Configuración

#### Configuración Básica

```conf
listen=YES
listen_ipv6=NO
```

- **listen=YES**: vsftpd escucha en modo standalone (no requiere xinetd).
- **listen_ipv6=NO**: Desactiva IPv6, solo usa IPv4.

#### Control de Acceso

```conf
anonymous_enable=NO
local_enable=YES
```

- **anonymous_enable=NO**: Desactiva acceso anónimo (más seguro).
- **local_enable=YES**: Permite acceso a usuarios del sistema local.

#### Permisos de Escritura

```conf
write_enable=YES
local_umask=022
```

- **write_enable=YES**: Permite a usuarios locales escribir/subir archivos.
- **local_umask=022**: Permisos predeterminados para archivos nuevos (755 en directorios, 644 en archivos).

#### Mensajes y Logging

```conf
dirmessage_enable=YES
use_localtime=YES
xferlog_enable=YES
xferlog_file=/var/log/vsftpd.log
xferlog_std_format=YES
ftpd_banner=Servidor FTP - clankers.lan
```

- **dirmessage_enable=YES**: Muestra mensaje al entrar a directorio.
- **use_localtime=YES**: Usa hora local en logs.
- **xferlog_enable=YES**: Habilita logging de transferencias.
- **xferlog_file**: Archivo de log para transferencias.
- **xferlog_std_format=YES**: Usa formato estándar de logs.
- **ftpd_banner**: Mensaje de bienvenida mostrado al conectar.

#### Jaula (Chroot)

```conf
chroot_local_user=YES
chroot_list_enable=YES
chroot_list_file=/etc/vsftpd.chroot_list
allow_writeable_chroot=YES
secure_chroot_dir=/var/run/vsftpd/empty
```

- **chroot_local_user=YES**: Confina usuarios a su directorio home.
- **chroot_list_enable=YES**: Usa archivo de lista para excepciones.
- **chroot_list_file**: Archivo con usuarios que NO están confinados.
- **allow_writeable_chroot=YES**: Permite escribir en el directorio raíz de chroot.
- **secure_chroot_dir**: Directorio seguro para chroot.

#### Seguridad SSL/TLS

```conf
rsa_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem
rsa_key_file=/etc/ssl/private/ssl-cert-snakeoil.key
ssl_enable=YES
allow_anon_ssl=NO
force_local_data_ssl=YES
force_local_logins_ssl=YES
ssl_tlsv1=YES
ssl_tlsv1_2=YES
ssl_sslv3=NO
require_ssl_reuse=NO
ssl_ciphers=DEFAULT
```

- **rsa_cert_file/rsa_key_file**: Certificados SSL (autofirmados por defecto).
- **ssl_enable=YES**: Habilita soporte SSL/TLS.
- **allow_anon_ssl=NO**: No permite SSL para acceso anónimo.
- **force_local_data_ssl=YES**: Obliga a SSL en conexiones de datos.
- **force_local_logins_ssl=YES**: Obliga a SSL en login.
- **ssl_tlsv1=YES / ssl_tlsv1_2=YES**: Habilita protocolos seguros.
- **ssl_sslv3=NO**: Desactiva protocolo inseguro.

#### Timeouts de Conexión

```conf
data_connection_timeout=300
connect_timeout=60
idle_session_timeout=300
```

- **data_connection_timeout=300**: Timeout para conexión de datos (5 minutos).
- **connect_timeout=60**: Timeout para conexión (1 minuto).
- **idle_session_timeout=300**: Timeout para sesión inactiva (5 minutos).

#### Límites de Clientes

```conf
max_clients=0
max_per_ip=0
```

- **max_clients=0**: Sin límite de clientes totales.
- **max_per_ip=0**: Sin límite de conexiones por IP.

#### Modo Pasivo

```conf
pasv_enable=YES
pasv_min_port=40000
pasv_max_port=40100
pasv_address=192.168.100.14
port_enable=YES
```

- **pasv_enable=YES**: Habilita modo pasivo (recomendado).
- **pasv_min_port/pasv_max_port**: Rango de puertos para modo pasivo.
- **pasv_address**: Dirección IP que se anuncia en modo pasivo.
- **port_enable=YES**: Habilita modo activo.

---

## Estructura de Directorios para FTP

### Crear directorio raíz de FTP

```bash
sudo mkdir -p /home/ftp
```

### Crear directorio para archivos compartidos

```bash
sudo mkdir -p /home/ftp/compartidos
```

### Configurar permisos

```bash
sudo chown -R root:root /home/ftp
sudo chmod 755 /home/ftp
sudo chmod 755 /home/ftp/compartidos
```

---

## Configuración de Usuarios FTP

### Crear archivo de lista de chroot

El archivo `/etc/vsftpd.chroot_list` contiene usuarios que NO están confinados a su directorio home.

```bash
sudo nano /etc/vsftpd.chroot_list
```

Por defecto, mantén el archivo vacío (todos los usuarios estarán confinados):

```
# Los usuarios listados aquí NO estarán confinados a su home
# Ejemplo:
# admin
```

### Crear un usuario FTP local

```bash
sudo adduser ftpuser
```

Durante la creación, ingresa una contraseña segura. Este usuario podrá acceder por FTP.

Para crear el directorio home del usuario:

```bash
sudo mkdir -p /home/ftpuser/ftp
sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
sudo chmod 755 /home/ftpuser/ftp
```

### Verificar usuarios existentes

```bash
getent passwd | grep ftp
```

---

## Validación y Prueba de la Configuración

### Validar la sintaxis de configuración

```bash
sudo vsftpd -olisten=NO /etc/vsftpd.conf
```

o simplemente verifica que el servicio inicia sin errores:

```bash
sudo systemctl restart vsftpd
```

### Verificar el estado del servicio

```bash
sudo systemctl status vsftpd
```

Salida esperada:
```
● vsftpd.service - vsftpd FTP server
     Loaded: loaded (/lib/systemd/system/vsftpd.service; enabled; preset: enabled)
     Active: active (running) since Fri 2025-11-02 10:30:00 UTC
```

---

## Pruebas del Servidor FTP

### Verificar que vsftpd está escuchando

```bash
sudo ss -tulpn | grep :21
```

Salida esperada:
```
LISTEN 0 32 0.0.0.0:21 0.0.0.0:* users:(("vsftpd",pid=xxxx,fd=3))
```

### Prueba desde el mismo servidor

#### Usando ftp

```bash
ftp localhost
```

Cuando solicite usuario:
```
Name: ftpuser
Password: [ingresa contraseña]
```

Comandos útiles:
```
ls              # Listar archivos
cd directorio   # Cambiar directorio
get archivo     # Descargar archivo
put archivo     # Subir archivo
quit            # Salir
```

#### Usando telnet (solo para verificar conexión)

```bash
telnet localhost 21
```

Salida esperada:
```
Connected to localhost.
Escape character is '^]'.
220 Servidor FTP - clankers.lan
```

Escribe `QUIT` para salir.

### Prueba desde otra máquina en la red

#### Usando ftp

```bash
ftp 192.168.100.14
```

o

```bash
ftp ftp.clankers.lan
```

#### Usando lftp (cliente FTP moderno)

```bash
sudo apt install lftp
lftp -u ftpuser 192.168.100.14
```

#### Usando cliente gráfico FileZilla

1. Descarga FileZilla desde http://filezilla-project.org
2. Abre FileZilla y crea una nueva conexión:
   - **Host**: 192.168.100.14 o ftp.clankers.lan
   - **Usuario**: ftpuser
   - **Contraseña**: [contraseña del usuario]
   - **Puerto**: 21

---

## Configuración de Firewall (UFW)

Si usas UFW, permite el tráfico FTP:

```bash
sudo ufw allow 21/tcp
sudo ufw allow 40000:40100/tcp
sudo ufw reload
```

Verifica el estado:

```bash
sudo ufw status
```

---

## Monitoreo y Troubleshooting

### Ver los Logs de vsftpd

#### Log de transferencias

```bash
sudo tail -f /var/log/vsftpd.log
```

Ejemplo de salida:
```
Sun Nov 02 10:30:00 2025 [pid 1234] [ftpuser] OK LOGIN. Client "192.168.100.3"
Sun Nov 02 10:30:15 2025 [pid 1234] [ftpuser] FTP response: Client "192.168.100.3", "230 Login successful."
Sun Nov 02 10:30:30 2025 [pid 1234] [ftpuser] FTP command: Client "192.168.100.3", "LIST"
```

#### Ver logs del sistema

```bash
sudo journalctl -u vsftpd -f
```

### Comandos Útiles para vsftpd

#### Verificar el estado del proceso

```bash
ps aux | grep vsftpd
```

Salida esperada:
```
root      xxxx  0.0  0.1  14120  2056 ?        Ss   10:30   0:00 /usr/sbin/vsftpd /etc/vsftpd.conf
```

#### Ver puertos abiertos

```bash
sudo netstat -tulpn | grep vsftpd
```

#### Recargar configuración

```bash
sudo systemctl reload vsftpd
```

#### Reiniciar servicio

```bash
sudo systemctl restart vsftpd
```

---

## Resolución de Problemas Comunes

### Problema: Conexión rechazada en puerto 21

**Causa**: El servicio vsftpd no está corriendo.

**Solución**:

```bash
sudo systemctl status vsftpd
sudo systemctl restart vsftpd
```

### Problema: Error de autenticación "530 Login incorrect"

**Causa 1**: Usuario no existe.

**Solución**: Verifica que el usuario existe:

```bash
getent passwd ftpuser
```

**Causa 2**: Contraseña incorrecta.

**Solución**: Restablece la contraseña del usuario:

```bash
sudo passwd ftpuser
```

### Problema: Error "553 Could not create file" al subir archivos

**Causa**: Permisos insuficientes en el directorio.

**Solución**: Verifica y ajusta permisos:

```bash
ls -la /home/ftpuser/ftp
sudo chmod 755 /home/ftpuser/ftp
sudo chown ftpuser:ftpuser /home/ftpuser/ftp
```

### Problema: Modo pasivo no funciona

**Causa**: El rango de puertos pasivo está bloqueado en el firewall.

**Solución**: Permite los puertos pasivos en el firewall:

```bash
sudo ufw allow 40000:40100/tcp
sudo ufw reload
```

### Problema: Error "500 OOPS: vsftpd: refusing to run with writable root inside chroot()"

**Causa**: La opción `allow_writeable_chroot` es necesaria cuando el directorio raíz de chroot es escribable.

**Solución**: Verifica que en `/etc/vsftpd.conf` existe:

```conf
allow_writeable_chroot=YES
```

Reinicia el servicio:

```bash
sudo systemctl restart vsftpd
```

### Problema: No se pueden listar archivos en modo pasivo

**Causa**: La dirección IP en `pasv_address` puede ser incorrecta o el cliente no puede conectar a los puertos pasivos.

**Solución**: Verifica la configuración:

```bash
grep pasv_address /etc/vsftpd.conf
```

Asegúrate que sea la IP correcta:

```conf
pasv_address=192.168.100.14
```

---

## Resumen de Puertos y Servicios

| Servicio | Puerto      | Protocolo | Descripción                    |
|----------|-------------|-----------|--------------------------------|
| FTP      | 21          | TCP       | Control (comando)              |
| FTP      | 40000-40100 | TCP       | Datos (modo pasivo)            |

---

## Resumen de Archivos y Directorios

| Ruta                          | Descripción                                |
|-------------------------------|--------------------------------------------|
| /etc/vsftpd.conf              | Archivo principal de configuración         |
| /etc/vsftpd.chroot_list       | Lista de usuarios sin confinamiento        |
| /home/ftpuser                 | Directorio home del usuario FTP            |
| /home/ftpuser/ftp             | Directorio raíz de FTP para el usuario     |
| /home/ftp/compartidos         | Directorio compartido general               |
| /var/log/vsftpd.log           | Log de transferencias FTP                  |

---

## Mejores Prácticas

1. **Respaldar configuración**: Siempre haz copias de seguridad antes de cambios:

   ```bash
   sudo cp /etc/vsftpd.conf /backup/vsftpd.conf.$(date +%Y%m%d)
   ```

2. **Usar certificados válidos**: Reemplaza los certificados autofirmados con certificados válidos en producción.

3. **Usuarios dedicados**: Crea usuarios específicos para FTP en lugar de usar cuentas administrativas.

4. **Confinar usuarios**: Mantén `chroot_local_user=YES` para confinar usuarios a sus directorios home.

5. **Limitar acceso**: Usa `chroot_list_file` para controlar qué usuarios tienen acceso sin restricciones.

6. **Monitoreo regular**: Revisa logs de FTP regularmente para detectar actividades sospechosas.

7. **Permisos correctos**: Asegúrate de que los permisos de directorios sean correctos (755 para directorios, 644 para archivos).

8. **Documentación**: Mantén documentados todos los usuarios FTP y configuraciones realizadas.
