---
slug: /configuracion-rsyslog
title: Configuración Rsyslog
sidebar_label: Configuración Rsyslog
---

## Configuración de Rsyslog para Centralización de Logs

Esta guía documenta la configuración de `rsyslog` en Ubuntu 24.04. Rsyslog es el demonio de logging del sistema que centraliza todos los logs de las máquinas Linux en la red `clankers.lan`, enviándolos a un servidor central de logging en la VLAN 100 (DMZ).

### Arquitectura de Logging Centralizado

El servidor centralizado de logs está ubicado en la **VLAN 100 (DMZ)** con la dirección IP `192.168.100.30` en el puerto `5140` (TCP). Todas las máquinas Ubuntu en las siguientes VLANs envían sus logs hacia este servidor:

- **VLAN 100 (Servicios/DMZ)**: 192.168.100.0/24
- **VLAN 10 (Corporativo)**: 192.168.10.0/24
- **VLAN 20 (IT)**: 192.168.20.0/24
- **VLAN 30 (OT)**: 192.168.30.0/24
- **VLAN 40 (Línea de Producción)**: 192.168.40.0/24

---

## Instalación de Rsyslog

### Requisitos previos

- Sistema operativo: Ubuntu 24.04
- Acceso root o sudo
- Conexión de red a la VLAN correspondiente
- Servidor centralizado de logs: `192.168.100.30:5140`

### Pasos de instalación

#### 1. Actualizar el sistema

```bash
sudo apt update
sudo apt upgrade -y
```

#### 2. Instalar rsyslog (si no está instalado)

```bash
sudo apt install rsyslog -y
```

#### 3. Verificar el estado del servicio

```bash
sudo systemctl status rsyslog
```

El servicio debería estar activo y ejecutándose.

#### 4. Habilitar el servicio al iniciar

```bash
sudo systemctl enable rsyslog
```

---

## Configuración de Rsyslog

### Archivo de configuración principal: rsyslog.conf

El archivo de configuración principal de rsyslog se encuentra en `/etc/rsyslog.conf`.

#### Crear/Editar el archivo de configuración

```bash
sudo nano /etc/rsyslog.conf
```

#### Contenido del archivo de configuración

```conf
# /etc/rsyslog.conf configuration file for rsyslog
#
# For more information install rsyslog-doc and see
# /usr/share/doc/rsyslog-doc/html/configuration/index.html
#
# Default logging rules can be found in /etc/rsyslog.d/50-default.conf


#################
#### MODULES ####
#################

module(load="imuxsock") # provides support for local system logging
#module(load="immark")  # provides --MARK-- message capability

# provides UDP syslog reception
module(load="imudp")
input(type="imudp" port="514")

# provides TCP syslog reception
module(load="imtcp")
input(type="imtcp" port="514")

# provides kernel logging support and enable non-kernel klog messages
module(load="imklog" permitnonkernelfacility="on")

###########################
#### GLOBAL DIRECTIVES ####
###########################

# Filter duplicated messages
$RepeatedMsgReduction on

#
# Set the default permissions for all log files.
#
$FileOwner syslog
$FileGroup adm
$FileCreateMode 0640
$DirCreateMode 0755
$Umask 0022
$PrivDropToUser syslog
$PrivDropToGroup syslog

#
# Where to place spool and state files
#
$WorkDirectory /var/spool/rsyslog

#
# Include all config files in /etc/rsyslog.d/
#
$IncludeConfig /etc/rsyslog.d/*.conf

#
# Envío de logs al servidor centralizado
#
*.*@192.168.100.30:1540
*.*@@192.168.100.30:5140
```

### Explicación de la Configuración

#### Módulos de Entrada

##### Módulo imuxsock

```conf
module(load="imuxsock") # provides support for local system logging
```

Proporciona soporte para logging del sistema local a través de sockets Unix. Este módulo captura todos los mensajes del sistema.

##### Módulo imudp

```conf
module(load="imudp")
input(type="imudp" port="514")
```

Proporciona recepción de mensajes syslog por UDP en el puerto 514 (puerto estándar de syslog). Útil si rsyslog actúa como servidor central de logs.

##### Módulo imtcp

```conf
module(load="imtcp")
input(type="imtcp" port="514")
```

Proporciona recepción de mensajes syslog por TCP en el puerto 514. También para servidor central de logs.

##### Módulo imklog

```conf
module(load="imklog" permitnonkernelfacility="on")
```

Proporciona soporte para logging del kernel. El parámetro `permitnonkernelfacility="on"` permite que aplicaciones envíen mensajes con facility de kernel.

#### Directivas Globales

##### Reducción de Mensajes Duplicados

```conf
$RepeatedMsgReduction on
```

Si el mismo mensaje se repite múltiples veces, rsyslog lo comprime y muestra el mensaje solo una vez con un contador. Esto reduce el tamaño de los logs.

##### Permisos de Archivos de Log

```conf
$FileOwner syslog
$FileGroup adm
$FileCreateMode 0640
$DirCreateMode 0755
$Umask 0022
```

- **$FileOwner syslog**: Propietario de los archivos de log.
- **$FileGroup adm**: Grupo propietario de los archivos de log.
- **$FileCreateMode 0640**: Permisos de creación de archivos (rw-r-----).
- **$DirCreateMode 0755**: Permisos de creación de directorios (rwxr-xr-x).
- **$Umask 0022**: Máscara de permisos (inversa, resta permisos).

##### Privilegios de Rsyslog

```conf
$PrivDropToUser syslog
$PrivDropToGroup syslog
```

Después de iniciar (que requiere permisos root), rsyslog cambia al usuario y grupo `syslog` por seguridad (principio del menor privilegio).

##### Directorio de Trabajo

```conf
$WorkDirectory /var/spool/rsyslog
```

Directorio donde rsyslog almacena archivos temporales, de cola y de estado.

##### Incluir Configuraciones Adicionales

```conf
$IncludeConfig /etc/rsyslog.d/*.conf
```

Incluye todos los archivos de configuración en el directorio `/etc/rsyslog.d/`. Las reglas de logging por defecto están en `/etc/rsyslog.d/50-default.conf`.

#### Envío de Logs al Servidor Centralizado

```conf
*.*@192.168.100.30:1540
*.*@@192.168.100.30:5140
```

- **\*.\***: Todos los mensajes de todas las facilities y severidades.
- **@192.168.100.30:1540**: Envía por UDP al servidor centralizado en puerto 1540 (custom).
- **@@192.168.100.30:5140**: Envía por TCP al servidor centralizado en puerto 5140 (TCP).

**Nota**: Se envían a dos puertos diferentes. El primero usa UDP (conexión sin estado, más rápido) y el segundo usa TCP (confiable, garantizado).

---

## Archivo de Reglas por Defecto: 50-default.conf

El archivo `/etc/rsyslog.d/50-default.conf` contiene las reglas de logging por defecto.

### Crear/Editar el archivo

```bash
sudo nano /etc/rsyslog.d/50-default.conf
```

### Contenido del archivo

```conf
# Log kernel generated UFW log messages to file
:msg,contains,"[UFW " /var/log/ufw.log

# Uncomment the following to stop logging anything that matches the last rule.
# Doing this will stop logging kernel generated UFW log messages to the file
# normally containing kern.* messages (eg, /var/log/kern.log)
#& stop

# Log cloudinit generated log messages to file
:syslogtag, isequal, "[CLOUDINIT]" /var/log/cloud-init.log

# comment out the following line to allow CLOUDINIT messages through.
# Doing so means you'll also get CLOUDINIT messages in /var/log/syslog
& stop

#  Default rules for rsyslog.
#
#			For more information see rsyslog.conf(5) and /etc/rsyslog.conf

#
# First some standard log files.  Log by facility.
#
auth,authpriv.*			/var/log/auth.log
*.*;auth,authpriv.none		-/var/log/syslog
#cron.*				/var/log/cron.log
#daemon.*			-/var/log/daemon.log
kern.*				-/var/log/kern.log
#lpr.*				-/var/log/lpr.log
mail.*				-/var/log/mail.log
#user.*				-/var/log/user.log

#
# Logging for the mail system.  Split it up so that
# it is easy to write scripts to parse these files.
#
#mail.info			-/var/log/mail.info
#mail.warn			-/var/log/mail.warn
mail.err			/var/log/mail.err

#
# Some "catch-all" log files.
#
#*.=debug;\
#	auth,authpriv.none;\
#	news.none;mail.none	-/var/log/debug
#*.=info;*.=notice;*.=warn;\
#	auth,authpriv.none;\
#	cron,daemon.none;\
#	mail,news.none		-/var/log/messages

#
# Emergencies are sent to everybody logged in.
#
*.emerg				:omusrmsg:*

#
# I like to have messages displayed on the console, but only on a virtual
# console I usually leave idle.
#
#daemon,mail.*;\
#	news.=crit;news.=err;news.=notice;\
#	*.=debug;*.=info;\
#	*.=notice;*.=warn	/dev/tty8
```

### Explicación de las Reglas de Logging

#### Filtrado de Logs específicos

```conf
:msg,contains,"[UFW " /var/log/ufw.log
```

Captura mensajes que contienen "[UFW " y los guarda en `/var/log/ufw.log`. El prefijo `:` indica que es una directiva de filtro moderna.

#### Regla de parada (& stop)

```conf
:syslogtag, isequal, "[CLOUDINIT]" /var/log/cloud-init.log
& stop
```

- Captura mensajes de Cloud-Init en `/var/log/cloud-init.log`.
- `& stop`: Detiene el procesamiento de este mensaje (no continúa a otras reglas).

#### Logging por Facility

```conf
auth,authpriv.*			/var/log/auth.log
*.*;auth,authpriv.none		-/var/log/syslog
kern.*				-/var/log/kern.log
mail.*				-/var/log/mail.log
mail.err			/var/log/mail.err
```

- **auth,authpriv.\***: Todos los mensajes de autenticación van a `/var/log/auth.log`.
- **\*.\*;auth,authpriv.none**: Todos los mensajes EXCEPTO autenticación van a `/var/log/syslog`.
- **kern.\***: Mensajes del kernel en `/var/log/kern.log`.
- **mail.\***: Mensajes del correo en `/var/log/mail.log`.
- **mail.err**: Solo errores de correo en `/var/log/mail.err`.

**Nota**: El `-` antes del archivo (ej: `-/var/log/syslog`) indica que no sincroniza a disco después de cada mensaje (mejora rendimiento).

#### Mensajes de Emergencia

```conf
*.emerg				:omusrmsg:*
```

Los mensajes con severidad `emerg` (emergencia) se envían a todos los usuarios conectados. El módulo de salida es `omusrmsg` (output module user messages).

---

## Estructura de Severidades de Syslog

Las severidades en rsyslog son las siguientes (de menor a mayor gravedad):

| Número | Nombre      | Descripción                              |
|--------|-------------|------------------------------------------|
| 0      | emerg       | Sistema inutilizable                     |
| 1      | alert       | Acción inmediata requerida               |
| 2      | crit        | Condición crítica                        |
| 3      | err         | Condición de error                       |
| 4      | warning     | Condición de advertencia                 |
| 5      | notice      | Condición normal pero significativa      |
| 6      | info        | Mensaje informativo                      |
| 7      | debug       | Mensaje de depuración                    |

---

## Estructura de Facilities de Syslog

Las facilities agrupan tipos de procesos que generan logs:

| Código | Facility    | Descripción                              |
|--------|-------------|------------------------------------------|
| 0      | kern        | Mensajes del kernel                      |
| 1      | user        | Mensajes de usuario                      |
| 2      | mail        | Sistema de correo                        |
| 3      | daemon      | Demonios del sistema                     |
| 4      | auth        | Autenticación y autorización             |
| 16     | local0      | Uso local 0                              |
| 17     | local1      | Uso local 1                              |
| 18     | local2      | Uso local 2                              |
| 19     | local3      | Uso local 3                              |
| 20     | local4      | Uso local 4                              |
| 21     | local5      | Uso local 5                              |
| 22     | local6      | Uso local 6                              |
| 23     | local7      | Uso local 7                              |

---

## Validación y Prueba de la Configuración

### Validar la sintaxis de configuración

```bash
sudo rsyslogd -N1
```

Salida esperada (si es correcta):
```
rsyslogd: version N/A [V8.2xxx.xx], config validation run (level 1), master config: /etc/rsyslog.conf
rsyslogd: End of config validation run. Bye.
```

### Reiniciar el servicio

Después de realizar cambios en la configuración:

```bash
sudo systemctl restart rsyslog
```

### Verificar el estado del servicio

```bash
sudo systemctl status rsyslog
```

Salida esperada:
```
● rsyslog.service - System Logging Daemon
     Loaded: loaded (/lib/systemd/system/rsyslog.service; enabled; preset: enabled)
     Active: active (running) since Fri 2025-11-02 10:30:00 UTC
```

---

## Pruebas del Servicio Rsyslog

### Verificar que rsyslog está escuchando (si es servidor central)

```bash
sudo ss -tulpn | grep rsyslog
```

Salida esperada:
```
LISTEN 0 25 0.0.0.0:514 0.0.0.0:* users:(("rsyslogd",pid=xxxx,fd=3))
```

### Generar un mensaje de prueba

```bash
logger "Mensaje de prueba desde rsyslog"
```

### Ver el mensaje en el log

```bash
sudo tail -f /var/log/syslog
```

Deberías ver una línea similar a:
```
Nov  2 10:30:00 servidor logger: Mensaje de prueba desde rsyslog
```

### Probar envío remoto de logs

Desde una máquina cliente, genera un mensaje:

```bash
logger "Mensaje de prueba desde cliente remoto"
```

En el servidor centralizado (192.168.100.30), deberías recibir el mensaje en `/var/log/syslog` o en el archivo configurado.

### Usar logger con diferentes facilities y severidades

```bash
# Mensaje con facility mail y severidad error
logger -p mail.err "Error en sistema de correo"

# Mensaje con facility local0 y severidad info
logger -p local0.info "Información de aplicación personalizada"

# Mensaje de depuración
logger -p user.debug "Mensaje de depuración"
```

---

## Configuración de Firewall (UFW)

Si usas UFW y tienes un servidor centralizado, permite el tráfico de rsyslog:

```bash
# Permitir UDP en puerto 514
sudo ufw allow 514/udp

# Permitir TCP en puerto 514
sudo ufw allow 514/tcp

# Permitir puertos custom (ejemplo: 1540, 5140)
sudo ufw allow 1540/udp
sudo ufw allow 5140/tcp

sudo ufw reload
```

Verifica el estado:

```bash
sudo ufw status
```

---

## Monitoreo y Troubleshooting

### Ver los Logs de Rsyslog

#### Log del sistema general

```bash
sudo tail -f /var/log/syslog
```

#### Log de autenticación

```bash
sudo tail -f /var/log/auth.log
```

#### Log del kernel

```bash
sudo tail -f /var/log/kern.log
```

#### Log de correo

```bash
sudo tail -f /var/log/mail.log
```

#### Ver logs del servicio rsyslog

```bash
sudo journalctl -u rsyslog -f
```

### Comandos Útiles para Rsyslog

#### Verificar el proceso de rsyslog

```bash
ps aux | grep rsyslog
```

Salida esperada:
```
syslog    xxxx  0.0  0.2  14000  5000 ?        Sl   10:30   0:00 /usr/sbin/rsyslogd -n
root      xxxx  0.0  0.0   2456   560 pts/0    S+   10:30   0:00 grep rsyslog
```

#### Ver estadísticas de rsyslog

```bash
sudo systemctl status rsyslog -l
```

#### Listar todos los archivos de log

```bash
ls -la /var/log/
```

#### Ver tamaño de los logs

```bash
du -sh /var/log/*
```

#### Comprimir logs antiguos

```bash
sudo gzip /var/log/syslog.1
```

---

## Rotación de Logs con Logrotate

Rsyslog usa `logrotate` para rotar (archivar y comprimir) los logs cuando superan cierto tamaño.

### Verificar configuración de logrotate

```bash
cat /etc/logrotate.d/rsyslog
```

Salida esperada:
```
/var/log/syslog
/var/log/mail.log
/var/log/mail.err
/var/log/auth.log
/var/log/kern.log
{
    rotate 4
    missingok
    notifempty
    compress
    delaycompress
    sharedscripts
    postrotate
        /usr/lib/rsyslog/rsyslog-rotate
    endscript
}
```

- **rotate 4**: Mantiene 4 versiones anteriores comprimidas.
- **compress**: Comprime los logs rotados.
- **delaycompress**: Retrasa la compresión del log anterior.
- **notifempty**: No rota si el archivo está vacío.
- **postrotate**: Comando ejecutado después de rotar.

### Forzar rotación manual

```bash
sudo logrotate -f /etc/logrotate.d/rsyslog
```

---

## Resolución de Problemas Comunes

### Problema: Rsyslog no inicia

**Causa**: Error de sintaxis en la configuración.

**Solución**:

```bash
sudo rsyslogd -N1
```

Revisa los errores reportados y corrígelos en `/etc/rsyslog.conf`.

### Problema: Los logs no se están enviando al servidor centralizado

**Causa 1**: La configuración de envío remoto no está correcta.

**Solución**: Verifica la línea de envío remoto en `/etc/rsyslog.conf`:

```bash
grep "192.168.100.30" /etc/rsyslog.conf
```

**Causa 2**: El firewall bloquea el tráfico.

**Solución**: Abre los puertos correspondientes:

```bash
sudo ufw allow 1540/udp
sudo ufw allow 5140/tcp
sudo ufw reload
```

**Causa 3**: El servidor centralizado no está escuchando.

**Solución**: En el servidor centralizado, verifica:

```bash
sudo ss -tulpn | grep 514
sudo ss -tulpn | grep 1540
sudo ss -tulpn | grep 5140
```

### Problema: El archivo de log crece demasiado

**Causa**: La rotación de logs no está funcionando.

**Solución**: Comprueba la configuración de logrotate:

```bash
cat /etc/logrotate.d/rsyslog
sudo logrotate -f /etc/logrotate.d/rsyslog
```

### Problema: Permisos insuficientes para leer logs

**Causa**: El usuario no pertenece al grupo `adm`.

**Solución**: Añade el usuario al grupo `adm`:

```bash
sudo usermod -aG adm $USER
```

El usuario debe desconectarse y reconectarse para que los cambios tengan efecto.

### Problema: Demasiados mensajes duplicados

**Causa**: `$RepeatedMsgReduction` está deshabilitada.

**Solución**: Asegúrate que en `/etc/rsyslog.conf` está:

```conf
$RepeatedMsgReduction on
```

Reinicia rsyslog:

```bash
sudo systemctl restart rsyslog
```

---

## Resumen de Puertos y Servicios

| Servicio | Puerto | Protocolo | Descripción                          |
|----------|--------|-----------|--------------------------------------|
| Syslog   | 514    | UDP/TCP   | Puerto estándar de syslog            |
| Custom   | 1540   | UDP       | Puerto custom para syslog (UDP)      |
| Custom   | 5140   | TCP       | Puerto custom para syslog (TCP)      |

---

## Resumen de Archivos y Directorios

| Ruta                              | Descripción                                    |
|-----------------------------------|------------------------------------------------|
| /etc/rsyslog.conf                 | Archivo principal de configuración             |
| /etc/rsyslog.d/                   | Directorio de configuraciones adicionales      |
| /etc/rsyslog.d/50-default.conf    | Reglas de logging por defecto                  |
| /var/log/syslog                   | Log general del sistema                        |
| /var/log/auth.log                 | Log de autenticación                           |
| /var/log/kern.log                 | Log del kernel                                 |
| /var/log/mail.log                 | Log del sistema de correo                      |
| /var/log/ufw.log                  | Log del firewall UFW                           |
| /var/spool/rsyslog/               | Directorio de spool de rsyslog                 |
| /etc/logrotate.d/rsyslog          | Configuración de rotación de logs              |

---

## Mejores Prácticas

1. **Respaldar configuración**: Siempre haz copias de seguridad antes de cambios:

   ```bash
   sudo cp /etc/rsyslog.conf /backup/rsyslog.conf.$(date +%Y%m%d)
   ```

2. **Validar antes de aplicar**: Siempre valida la configuración:

   ```bash
   sudo rsyslogd -N1
   ```

3. **Usar relay TCP para confiabilidad**: Cuando envíes logs a servidor remoto, usa TCP (`@@`) además de UDP (`@`) para mayor confiabilidad.

4. **Rotación de logs**: Configura logrotate para rotar logs periódicamente y evitar que crezcan demasiado.

5. **Centralizar logs**: Envía todos los logs a un servidor central para mejor auditoría y análisis.

6. **Monitoreo regular**: Revisa regularmente los logs para detectar problemas y anomalías.

7. **Limpiar logs antiguos**: Elimina logs muy antiguos que ya no sean necesarios para liberar espacio.

8. **Seguridad**: Restringe acceso a los logs a usuarios autorizados.

9. **Documentación**: Mantén documentadas las reglas de logging y cambios realizados.

10. **Sincronización de tiempo**: Asegúrate que todos los servidores tengan la hora sincronizada (NTP) para que los timestamps sean consistentes.