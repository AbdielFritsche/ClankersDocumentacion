---
slug: /configuracion-smtp
title: Configuración SMTP e IMAP
sidebar_label: Configuración SMTP e IMAP
---

## Configuración de Servidor de Correo con Postfix e IMAP con Dovecot

Esta guía documenta la configuración completa de un servidor de correo usando `Postfix` (SMTP) y `Dovecot` (IMAP/POP3) en Ubuntu 24.04. El servidor actúa como servidor de correo para la red interna `clankers.lan`.

### Arquitectura de Red

El servidor de correo está ubicado en la **VLAN 100 (DMZ)** con la dirección IP `192.168.100.12` y proporciona servicio de correo a todas las VLANs:

- **VLAN 100 (Servicios/DMZ)**: 192.168.100.0/24
- **VLAN 10 (Corporativo)**: 192.168.10.0/24
- **VLAN 20 (IT)**: 192.168.20.0/24
- **VLAN 30 (OT)**: 192.168.30.0/24
- **VLAN 40 (Línea de Producción)**: 192.168.40.0/24

---

## Instalación de Postfix e IMAP/POP3

### Requisitos previos

- Sistema operativo: Ubuntu 24.04
- Acceso root o sudo
- Conexión a Internet
- IP estática asignada: `192.168.100.12/24`
- Servidor DNS configurado (mail.clankers.lan debe resolver a 192.168.100.12)

### Pasos de instalación

#### 1. Actualizar el sistema

```bash
sudo apt update
sudo apt upgrade -y
```

#### 2. Instalar Postfix

```bash
sudo apt install postfix -y
```

Durante la instalación, selecciona la opción **"Internet Site"** cuando se te solicite.

#### 3. Instalar Dovecot

```bash
sudo apt install dovecot-core dovecot-imapd dovecot-pop3d -y
```

#### 4. Verificar el estado de los servicios

Postfix:
```bash
sudo systemctl status postfix
```

Dovecot:
```bash
sudo systemctl status dovecot
```

#### 5. Habilitar servicios al iniciar

```bash
sudo systemctl enable postfix
sudo systemctl enable dovecot
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
        - 192.168.100.12/24
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

## Configuración de Postfix

### Archivo de configuración principal: main.cf

El archivo de configuración principal de Postfix se encuentra en `/etc/postfix/main.cf`.

#### Crear/Editar el archivo de configuración

```bash
sudo nano /etc/postfix/main.cf
```

#### Contenido del archivo

```conf
# See /usr/share/postfix/main.cf.dist for a commented, more complete version


# Debian specific:  Specifying a file name will cause the first
# line of that file to be used as the name.  The Debian default
# is /etc/mailname.
#myorigin = /etc/mailname

smtpd_banner = $myhostname ESMTP $mail_name (Ubuntu)
biff = no

# appending .domain is the MUA's job.
append_dot_mydomain = no

# Uncomment the next line to generate "delayed mail" warnings
#delay_warning_time = 4h

readme_directory = no

# See http://www.postfix.org/COMPATIBILITY_README.html -- default to 3.6 on
# fresh installs.
compatibility_level = 3.6



# TLS parameters
smtpd_tls_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem
smtpd_tls_key_file=/etc/ssl/private/ssl-cert-snakeoil.key
smtpd_tls_security_level=may

smtp_tls_CApath=/etc/ssl/certs
smtp_tls_security_level=may
smtp_tls_session_cache_database = btree:${data_directory}/smtp_scache


smtpd_relay_restrictions = permit_mynetworks permit_sasl_authenticated defer_unauth_destination
myhostname = mail.clankers.lan
alias_maps = hash:/etc/aliases
alias_database = hash:/etc/aliases
mydomain = clankers.lan
myorigin = $mydomain
mydestination = $myhostname, clankers.lan, localhost 
relayhost = 
mynetworks = 127.0.0.0/8 [::1]/128 192.168.10.0/24 192.168.20.0/24 192.168.30.0/24 192.168.100.0/24 192.168.2.0/24 192.168.40.0/24
mailbox_size_limit = 0
recipient_delimiter = +
inet_interfaces = all
inet_protocols = ipv4

#virtual_transport = lmtp:unix:private/dovecot-lmtp
#virtual_mailbox_domains = clankers.lan
mailbox_command = /usr/lib/dovecot/deliver
```

### Explicación de la Configuración de Postfix

#### Parámetros de Identidad

```conf
myhostname = mail.clankers.lan
mydomain = clankers.lan
myorigin = $mydomain
mydestination = $myhostname, clankers.lan, localhost
```

- **myhostname**: Nombre del servidor de correo que será mostrado en el banner SMTP.
- **mydomain**: Dominio de la organización.
- **myorigin**: Dominio que se añade a direcciones sin dominio.
- **mydestination**: Dominios para los cuales el servidor es receptor final de correo.

#### Parámetros de Interfaz de Red

```conf
inet_interfaces = all
inet_protocols = ipv4
```

- **inet_interfaces = all**: Escucha en todas las interfaces de red.
- **inet_protocols = ipv4**: Usa solo IPv4 (no IPv6).

#### Redes Permitidas

```conf
mynetworks = 127.0.0.0/8 [::1]/128 192.168.10.0/24 192.168.20.0/24 192.168.30.0/24 192.168.100.0/24 192.168.2.0/24 192.168.40.0/24
```

Define las redes que están permitidas para relayar correo (enviar correo a través de este servidor sin autenticación). Incluye:
- Localhost (127.0.0.0/8)
- VLAN 10 (Corporativo)
- VLAN 20 (IT)
- VLAN 30 (OT)
- VLAN 100 (DMZ)
- VLAN 2 (Gestión)
- VLAN 40 (Línea de Producción)

#### Control de Relay

```conf
smtpd_relay_restrictions = permit_mynetworks permit_sasl_authenticated defer_unauth_destination
```

Define la política de relay:
- `permit_mynetworks`: Permite relay desde redes confiables.
- `permit_sasl_authenticated`: Permite relay desde usuarios autenticados.
- `defer_unauth_destination`: Rechaza relay de fuentes no autorizadas.

#### Seguridad TLS

```conf
smtpd_tls_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem
smtpd_tls_key_file=/etc/ssl/private/ssl-cert-snakeoil.key
smtpd_tls_security_level=may

smtp_tls_CApath=/etc/ssl/certs
smtp_tls_security_level=may
```

- **Certificados**: Usa certificados autofirmados (snakeoil). Para producción, usar certificados reales.
- **smtpd_tls_security_level=may**: TLS es opcional pero ofrecido a clientes.
- **smtp_tls_security_level=may**: El servidor intentará usar TLS cuando envía correo a otros servidores.

#### Integración con Dovecot

```conf
mailbox_command = /usr/lib/dovecot/deliver
```

Postfix usa el comando `deliver` de Dovecot para entregar mensajes en los buzones.

#### Limitación de Tamaño

```conf
mailbox_size_limit = 0
recipient_delimiter = +
```

- **mailbox_size_limit = 0**: Sin límite de tamaño de buzón.
- **recipient_delimiter = +**: Permite direcciones como `usuario+carpeta@clankers.lan`.

#### Banner SMTP

```conf
smtpd_banner = $myhostname ESMTP $mail_name (Ubuntu)
```

Mensaje de bienvenida mostrado cuando se conecta un cliente. Ejemplo: `mail.clankers.lan ESMTP Postfix (Ubuntu)`.

---

## Configuración de Dovecot

### Archivo de configuración principal: dovecot.conf

El archivo de configuración principal de Dovecot se encuentra en `/etc/dovecot/dovecot.conf`.

#### Crear/Editar el archivo de configuración

```bash
sudo nano /etc/dovecot/dovecot.conf
```

#### Contenido del archivo

```conf
## Dovecot configuration file

# Enable installed protocols
!include_try /usr/share/dovecot/protocols.d/*.protocol

# Base directory where to store runtime data.
#base_dir = /var/run/dovecot/

# Name of this instance. In multi-instance setup doveadm and other commands
# can use -i <instance_name> to select which instance is used (an alternative
# to -c <config_path>). The instance name is also added to Dovecot processes
# in ps output.
#instance_name = dovecot

# Greeting message for clients.
#login_greeting = Dovecot ready.

# Enable installed protocols
protocols = pop3 imap

dict {
  #quota = mysql:/etc/dovecot/dovecot-dict-sql.conf.ext
}

# Most of the actual configuration gets included below. The filenames are
# first sorted by their ASCII value and parsed in that order. The 00-prefixes
# in filenames are intended to make it easier to understand the ordering.
!include conf.d/*.conf

# A config file can also tried to be included without giving an error if
# it's not found:
!include_try local.conf
```

### Explicación de la Configuración de Dovecot

#### Protocolos Habilitados

```conf
protocols = pop3 imap
```

Habilita los protocolos:
- **IMAP**: Internet Message Access Protocol (protocolo recomendado, acceso desde múltiples dispositivos).
- **POP3**: Post Office Protocol version 3 (protocolo legado, descarga de correo).

#### Incluir Configuración Adicional

```conf
!include conf.d/*.conf
```

Dovecot lee archivos de configuración adicionales de `/etc/dovecot/conf.d/`. Los archivos más importantes son:

- **10-auth.conf**: Configuración de autenticación
- **10-mail.conf**: Configuración de buzones
- **10-master.conf**: Configuración de sockets y servicios

#### Diccionario

```conf
dict {
  #quota = mysql:/etc/dovecot/dovecot-dict-sql.conf.ext
}
```

Usado para almacenar cuotas y otros datos. Comentado por defecto (usa almacenamiento local).

---

## Verificación y Validación de la Configuración

### Validar la configuración de Postfix

```bash
sudo postfix check
```

Si no hay errores, no mostrará salida.

### Validar la configuración de Dovecot

```bash
sudo doveconf -n
```

Muestra la configuración efectiva de Dovecot (sin comentarios).

### Reiniciar los servicios

Después de realizar cambios en la configuración:

Postfix:
```bash
sudo systemctl restart postfix
```

Dovecot:
```bash
sudo systemctl restart dovecot
```

### Verificar el estado de los servicios

```bash
sudo systemctl status postfix
sudo systemctl status dovecot
```

Ambos deberían estar en estado `active (running)`.

---

## Pruebas del Servidor de Correo

### Verificar que Postfix está escuchando

```bash
sudo ss -tulpn | grep :25
sudo ss -tulpn | grep :587
```

Salida esperada:
```
LISTEN 0 100 *:25 *:* 
LISTEN 0 100 *:587 *:*
```

### Verificar que Dovecot está escuchando

```bash
sudo ss -tulpn | grep :143
sudo ss -tulpn | grep :110
```

Salida esperada:
```
LISTEN 0 4096 *:143 *:* 
LISTEN 0 4096 *:110 *:*
```

Donde:
- **25**: Puerto SMTP (no autenticado)
- **587**: Puerto SMTP submission (con autenticación, recomendado)
- **143**: Puerto IMAP
- **110**: Puerto POP3

### Prueba de conectividad SMTP

Desde otra máquina en la red:

```bash
telnet 192.168.100.12 25
```

Salida esperada:
```
Trying 192.168.100.12...
Connected to 192.168.100.12.
Escape character is '^]'.
220 mail.clankers.lan ESMTP Postfix (Ubuntu)
```

Escribe `QUIT` para salir.

### Prueba de conectividad IMAP

```bash
telnet 192.168.100.12 143
```

Salida esperada:
```
Trying 192.168.100.12...
Connected to 192.168.100.12.
Escape character is '^]'.
* OK [CAPABILITY IMAP4rev1 STARTTLS LOGINDISABLED ID CHILDREN LITERAL+...] Dovecot ready.
```

Escribe `LOGOUT` para salir.

### Prueba de conectividad POP3

```bash
telnet 192.168.100.12 110
```

Salida esperada:
```
Trying 192.168.100.12...
Connected to 192.168.100.12.
Escape character is '^]'.
+OK Dovecot ready.
```

Escribe `QUIT` para salir.

---

## Configuración de Firewall (UFW)

Si usas UFW, permite el tráfico de correo:

```bash
sudo ufw allow 25/tcp
sudo ufw allow 143/tcp
sudo ufw allow 110/tcp
sudo ufw allow 587/tcp
sudo ufw reload
```

Verifica el estado:

```bash
sudo ufw status
```

---

## Monitoreo y Troubleshooting

### Ver los Logs de Postfix

```bash
sudo tail -f /var/log/mail.log
```

o

```bash
sudo journalctl -u postfix -f
```

### Ver los Logs de Dovecot

```bash
sudo journalctl -u dovecot -f
```

### Comandos Útiles para Postfix

#### Ver la cola de correo

```bash
sudo postqueue -p
```

#### Vaciar la cola de correo

```bash
sudo postsuper -d ALL
```

#### Recargar la configuración sin reiniciar

```bash
sudo postfix reload
```

### Crear Usuarios de Correo

Los usuarios de correo son usuarios del sistema. Para crear un usuario:

```bash
sudo adduser usuario_correo
```

Esto crea un usuario del sistema que puede acceder a través de IMAP/POP3 con sus credenciales del sistema.

---

## Resolución de Problemas Comunes

### Problema: Postfix rechaza el correo con "Relay access denied"

**Causa**: La dirección IP del cliente no está en `mynetworks`.

**Solución**: Añade la red a la directiva `mynetworks` en `/etc/postfix/main.cf` y recarga Postfix.

```bash
# Edita main.cf
sudo nano /etc/postfix/main.cf

# Encuentra mynetworks y añade tu red
# Ejemplo: mynetworks = 127.0.0.0/8 [::1]/128 192.168.0.0/16

# Recarga Postfix
sudo systemctl reload postfix
```

### Problema: Dovecot no inicia

**Solución 1**: Verifica los logs de Dovecot:

```bash
sudo journalctl -xe -u dovecot
```

**Solución 2**: Valida la configuración:

```bash
sudo doveconf -n
```

**Solución 3**: Verifica permisos del directorio de correo:

```bash
ls -la /var/mail/
```

### Problema: No se pueden enviar correos

**Causa común**: El servidor DNS no resuelve `mail.clankers.lan` correctamente.

**Solución**: Verifica la resolución DNS:

```bash
nslookup mail.clankers.lan 192.168.100.11
dig @192.168.100.11 mail.clankers.lan
```

### Problema: Clientes IMAP/POP3 no pueden conectar

**Causa común 1**: Usuario no existe o contraseña incorrecta.

```bash
# Verifica usuarios del sistema
getent passwd | grep usuario
```

**Causa común 2**: El firewall bloquea los puertos.

```bash
# Verifica las reglas de firewall
sudo ufw status
```

**Causa común 3**: Dovecot no está escuchando en la interfaz correcta.

```bash
# Verifica que Dovecot escucha en todas las interfaces
sudo ss -tulpn | grep dovecot
```

### Problema: Correos no se entregan localmente

**Solución**: Verifica que el dominio está en `mydestination`:

```bash
sudo nano /etc/postfix/main.cf
# Busca mydestination y asegúrate que incluye clankers.lan
```

---

## Resumen de Puertos y Servicios

| Servicio | Puerto | Protocolo | Descripción                        |
|----------|--------|-----------|-----------------------------------|
| SMTP     | 25     | TCP       | Correo entre servidores            |
| SMTP     | 587    | TCP       | Correo con autenticación (Submission) |
| IMAP     | 143    | TCP       | Acceso a correo (recomendado)      |
| POP3     | 110    | TCP       | Descarga de correo (heredado)      |

---

## Resumen de Archivos de Configuración

| Servicio | Archivo                      | Descripción                          |
|----------|------------------------------|--------------------------------------|
| Postfix  | /etc/postfix/main.cf         | Configuración principal de Postfix   |
| Postfix  | /etc/aliases                 | Aliases de correo                    |
| Dovecot  | /etc/dovecot/dovecot.conf    | Configuración principal de Dovecot   |
| Dovecot  | /etc/dovecot/conf.d/         | Configuración adicional (auth, mail) |

---

## Mejores Prácticas

1. **Respaldar configuración**: Siempre haz copias de seguridad antes de cambios:

   ```bash
   sudo cp /etc/postfix/main.cf /backup/main.cf.$(date +%Y%m%d)
   sudo cp /etc/dovecot/dovecot.conf /backup/dovecot.conf.$(date +%Y%m%d)
   ```

2. **Validar antes de aplicar**: Siempre valida cambios:

   ```bash
   sudo postfix check
   sudo doveconf -n
   ```

3. **Usar TLS en producción**: Obtén certificados SSL válidos (Let's Encrypt) en lugar de autofirmados.

4. **Monitoreo regular**: Implementa monitoreo del servicio de correo (Nagios, Zabbix, etc.).

5. **Limpiar cola regularmente**: Limpia correos no entregables periódicamente.

6. **Documentación**: Mantén documentados todos los usuarios y configuraciones realizadas.