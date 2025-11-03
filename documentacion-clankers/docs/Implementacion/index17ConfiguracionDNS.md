---
slug: /configuracion-dns
title: Configuración DNS
sidebar_label: Configuración DNS
---

## Configuración de Servidor DNS con BIND9

Esta guía documenta la configuración completa de un servidor DNS usando `BIND9` en Ubuntu 24.04. El servidor actúa como servidor DNS autoritativo para la red interna `clankers.lan`.

### Arquitectura de Red

El servidor DNS está ubicado en la **VLAN 100 (DMZ)** con la dirección IP `192.168.100.11` y proporciona servicio de resolución de nombres a todas las VLANs:

- **VLAN 100 (Servicios/DMZ)**: 192.168.100.0/24
- **VLAN 10 (Corporativo)**: 192.168.10.0/24
- **VLAN 20 (IT)**: 192.168.20.0/24
- **VLAN 30 (OT)**: 192.168.30.0/24
- **VLAN 40 (Línea de Producción)**: 192.168.40.0/24

---

## Instalación del Servidor DNS

### Requisitos previos

- Sistema operativo: Ubuntu 24.04
- Acceso root o sudo
- Conexión a Internet
- IP estática asignada: `192.168.100.11/24`

### Pasos de instalación

#### 1. Actualizar el sistema

```bash
sudo apt update
sudo apt upgrade -y
```

#### 2. Instalar BIND9

```bash
sudo apt install bind9 bind9-utils -y
```

#### 3. Verificar el estado del servicio

```bash
sudo systemctl status bind9
```

El servicio debería estar activo y ejecutándose.

#### 4. Habilitar el servicio al iniciar

```bash
sudo systemctl enable bind9
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
        - 192.168.100.11/24
      routes:
        - to: default
          via: 192.168.100.1
      nameservers:
        addresses:
          - 8.8.8.8
          - 8.8.4.4
```

Aplica los cambios:

```bash
sudo netplan apply
```

---

## Configuración de BIND9

### Archivo de configuración principal: named.conf.local

BIND9 lee su configuración desde `/etc/bind/named.conf`. Las zonas locales se definen en `/etc/bind/named.conf.local`.

#### Crear/Editar el archivo de configuración

```bash
sudo nano /etc/bind/named.conf.local
```

#### Contenido del archivo

```conf
//
// Do any local configuration here
//

zone "clankers.lan" {
    type master;
    file "/etc/bind/db.clankers.lan";
    allow-update { none; };
};

// Consider adding the 1918 zones here, if they are not used in your
// organization
//include "/etc/bind/zones.rfc1918";
```

**Explicación:**
- `zone "clankers.lan"`: Define la zona para el dominio local.
- `type master`: Indica que este servidor es el servidor primario (autoritativo) para esta zona.
- `file "/etc/bind/db.clankers.lan"`: Ruta del archivo de datos de la zona.
- `allow-update { none; }`: Prohíbe actualizaciones dinámicas del DNS.

---

## Archivo de Zona: db.clankers.lan

El archivo de zona contiene todos los registros DNS para el dominio `clankers.lan`.

### Ubicación y creación

```bash
sudo nano /etc/bind/db.clankers.lan
```

### Contenido del archivo

```dns
;
; BIND data file for local loopback interface
;
$TTL	604800
@	IN	SOA	ns1.clankers.lan. root.clankers.lan (
                  6		; Serial
             604800		; Refresh
              86400		; Retry
            2419200		; Expire
             604800 )	; Negative Cache TTL
;

; servidores de nombres
@	IN	NS	ns1.clankers.lan.

; Registro Mail Exchange
@	IN	MX	10 mail.clankers.lan.

;registros de servidores
ns1	IN	A	192.168.100.11
mail	IN	A	192.168.100.12


;registros de ejemplo

pc-admin1	IN	A	192.168.100.3
pc-pruebaTI	IN	A	192.168.20.11
pc-pruebaCorp	IN	A	192.168.10.11
pc-pruebaOT	IN	A	192.168.30.11
```

### Explicación de la Zona

#### Parámetros de SOA (Start of Authority)

```dns
$TTL	604800
@	IN	SOA	ns1.clankers.lan. root.clankers.lan (
                  6		; Serial
             604800		; Refresh
              86400		; Retry
            2419200		; Expire
             604800 )	; Negative Cache TTL
```

- **$TTL 604800**: Tiempo de vida predeterminado (604800 segundos = 7 días) para todos los registros.
- **@**: Representa la zona `clankers.lan`.
- **SOA**: Registro de inicio de autoridad. Define parámetros principales de la zona.
- **ns1.clankers.lan.**: Servidor DNS primario.
- **root.clankers.lan**: Email de contacto (root@clankers.lan).
- **Serial**: Número de versión de la zona. Incrementar cada vez que se modifique.
- **Refresh (604800)**: Tiempo en segundos para que servidores secundarios verifiquen cambios (7 días).
- **Retry (86400)**: Tiempo de espera antes de reintentar si la actualización falla (1 día).
- **Expire (2419200)**: Tiempo máximo que un servidor secundario puede servir datos sin actualizar (28 días).
- **Negative Cache TTL (604800)**: Tiempo de caché para consultas que no devuelven resultados (7 días).

#### Registros de Servidores de Nombres

```dns
@	IN	NS	ns1.clankers.lan.
```

Define que `ns1.clankers.lan` es el servidor de nombres autoritativo para la zona.

#### Registro MX (Mail Exchange)

```dns
@	IN	MX	10 mail.clankers.lan.
```

Define que `mail.clankers.lan` es el servidor de correo con prioridad 10.

#### Registros de Hosts

```dns
ns1	IN	A	192.168.100.11
mail	IN	A	192.168.100.12
pc-admin1	IN	A	192.168.100.3
pc-pruebaTI	IN	A	192.168.20.11
pc-pruebaCorp	IN	A	192.168.10.11
pc-pruebaOT	IN	A	192.168.30.11
```

- **ns1**: Servidor DNS en 192.168.100.11
- **mail**: Servidor de correo en 192.168.100.12
- **pc-admin1**: PC administrativo en 192.168.100.3
- **pc-pruebaTI**: PC de prueba en VLAN IT (192.168.20.11)
- **pc-pruebaCorp**: PC de prueba en VLAN Corporativo (192.168.10.11)
- **pc-pruebaOT**: PC de prueba en VLAN OT (192.168.30.11)

---

## Validación y Prueba de la Configuración

### Validar la sintaxis del archivo de configuración

```bash
sudo named-checkconf /etc/bind/named.conf
```

Si no hay errores, no mostrará salida.

### Validar el archivo de zona

```bash
sudo named-checkzone clankers.lan /etc/bind/db.clankers.lan
```

Salida esperada:
```
zone clankers.lan/IN: loaded serial 6
OK
```

### Reiniciar el servicio BIND9

Después de realizar cambios en la configuración:

```bash
sudo systemctl restart bind9
```

### Verificar el estado del servicio

```bash
sudo systemctl status bind9
```

Deberías ver algo como:
```
● bind9.service - BIND Domain Name Server
     Loaded: loaded (/lib/systemd/system/bind9.service; enabled)
     Active: active (running) since ...
```

### Verificar que BIND9 está escuchando

```bash
sudo ss -tulpn | grep :53
```

o

```bash
sudo netstat -tulpn | grep :53
```

Deberías ver que `named` está escuchando en los puertos 53 (TCP y UDP).

---

## Pruebas del Servidor DNS

### Consultas locales

#### Probar resolución desde el mismo servidor

```bash
nslookup ns1.clankers.lan localhost
```

o

```bash
dig @localhost ns1.clankers.lan
```

Salida esperada:
```
; <<>> DiG 9.x.x-Ubuntu <<>> @localhost ns1.clankers.lan
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: xxxxx
;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

;; QUESTION SECTION:
;ns1.clankers.lan.		IN	A

;; ANSWER SECTION:
ns1.clankers.lan.	604800	IN	A	192.168.100.11
```

#### Consultar registros MX

```bash
dig @localhost clankers.lan MX
```

#### Consultar todos los registros de la zona

```bash
dig @localhost clankers.lan AXFR
```

### Consultas desde clientes remotos

Desde otra máquina en la red:

```bash
nslookup pc-admin1.clankers.lan 192.168.100.11
```

o

```bash
dig @192.168.100.11 pc-admin1.clankers.lan
```

---

## Configuración de Firewall (UFW)

Si usas UFW, permite el tráfico DNS:

```bash
sudo ufw allow 53/tcp
sudo ufw allow 53/udp
sudo ufw reload
```

Verifica el estado:

```bash
sudo ufw status
```

---

## Monitoreo y Troubleshooting

### Ver los Logs del Servidor DNS

```bash
sudo journalctl -u bind9 -f
```

o en sistemas con syslog tradicional:

```bash
sudo tail -f /var/log/syslog | grep named
```

### Comandos Útiles de Diagnóstico

#### Verificar que el servicio está ejecutándose

```bash
ps aux | grep named
```

#### Ver estadísticas del servidor DNS

```bash
rndc stats
```

Las estadísticas se escriben en `/var/log/named.stats`.

#### Recargar la configuración sin reiniciar

```bash
sudo rndc reload
```

#### Limpiar la caché del servidor

```bash
sudo rndc flush
```

---

## Resolución de Problemas Comunes

### Problema: El servicio no inicia

**Solución 1**: Verifica los logs para ver el error específico:

```bash
sudo journalctl -xe -u bind9
```

**Solución 2**: Verifica la sintaxis del archivo de configuración:

```bash
sudo named-checkconf /etc/bind/named.conf
```

**Solución 3**: Verifica permisos del archivo de zona:

```bash
ls -la /etc/bind/db.clankers.lan
```

El archivo debe ser propiedad de `bind` y tener permisos de lectura.

### Problema: No se resuelven los nombres

**Solución 1**: Verifica que el cliente está configurado para usar el DNS correcto:

```bash
cat /etc/resolv.conf
```

Debe incluir:
```
nameserver 192.168.100.11
```

**Solución 2**: Verifica que el archivo de zona tiene los registros correctos:

```bash
sudo named-checkzone clankers.lan /etc/bind/db.clankers.lan
```

**Solución 3**: Recarga la zona:

```bash
sudo rndc reload clankers.lan
```

### Problema: Errores de permiso

Si ves errores como "permission denied", asegúrate que los archivos pertenecen al usuario `bind`:

```bash
sudo chown bind:bind /etc/bind/db.clankers.lan
sudo chmod 640 /etc/bind/db.clankers.lan
```

---

## Mejores Prácticas

1. **Incrementar Serial**: Siempre incrementa el número de serie en el registro SOA cuando modificas el archivo de zona.

2. **Backup Regular**: Haz copias de seguridad de los archivos de configuración:

   ```bash
   sudo cp /etc/bind/named.conf.local /backup/named.conf.local.$(date +%Y%m%d)
   sudo cp /etc/bind/db.clankers.lan /backup/db.clankers.lan.$(date +%Y%m%d)
   ```

3. **Validar antes de aplicar**: Siempre valida los archivos con `named-checkconf` y `named-checkzone` antes de reiniciar.

4. **Documentación**: Mantén documentados todos los registros DNS y cambios realizados.

5. **Monitoreo**: Implementa monitoreo del servicio DNS (Nagios, Zabbix, etc.).

6. **TTL adecuado**: Ajusta los valores de TTL según tus necesidades:
   - Valores altos (604800): Para registros estáticos y estables
   - Valores bajos (300): Para registros que cambian frecuentemente

---

## Resumen de Registros

| Nombre del Host   | Tipo | Dirección IP   | VLAN | Descripción                    |
|-------------------|------|----------------|------|--------------------------------|
| ns1.clankers.lan  | A    | 192.168.100.11 | 100  | Servidor DNS primario          |
| mail.clankers.lan | A    | 192.168.100.12 | 100  | Servidor de correo             |
| pc-admin1         | A    | 192.168.100.3  | 100  | PC administrativa              |
| pc-pruebaTI       | A    | 192.168.20.11  | 20   | PC prueba IT                   |
| pc-pruebaCorp     | A    | 192.168.10.11  | 10   | PC prueba Corporativo          |
| pc-pruebaOT       | A    | 192.168.30.11  | 30   | PC prueba OT                   |

