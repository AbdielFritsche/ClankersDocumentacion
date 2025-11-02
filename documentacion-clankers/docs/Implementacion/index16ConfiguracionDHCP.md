---
slug: /configuracion-dhcp
title: Configuracion DHCP
sidebar_label: Configuracion DHCP
---

## Configuración de Servidor DHCP con ISC-DHCP-Server

Esta guía documenta la configuración completa de un servidor DHCP usando `isc-dhcp-server` en un entorno Linux. El servidor proporcionará direcciones IP dinámicas a múltiples VLANs en la red.

### Arquitectura de Red

El servidor DHCP está ubicado en la **VLAN 100 (DMZ)** con la dirección IP `192.168.100.11` y proporciona servicio a las siguientes redes:

- **VLAN 100 (Servicios/DMZ)**: 192.168.100.0/24
- **VLAN 10 (Corporativo)**: 192.168.10.0/24
- **VLAN 20 (IT)**: 192.168.20.0/24
- **VLAN 30 (OT)**: 192.168.30.0/24
- **VLAN 40 (Línea de Producción)**: 192.168.40.0/24

### Instalación del Servidor DHCP

#### Actualizar el Sistema

```bash
sudo apt update
sudo apt upgrade -y
```

#### Instalar ISC-DHCP-Server

```bash
sudo apt install isc-dhcp-server -y
```

### Configuración de la Interfaz de Red

#### Identificar la Interfaz de Red

Primero, identifica el nombre de tu interfaz de red:

```bash
ip addr show
```

o

```bash
ip link show
```

Busca la interfaz que tiene la IP `192.168.100.11` (por ejemplo: `eth0`, `ens33`, `enp0s3`, etc.)

#### Configurar la Interfaz que Escuchará el DHCP

Edita el archivo de configuración del servidor DHCP para especificar en qué interfaz escuchará:

```bash
sudo nano /etc/default/isc-dhcp-server
```

Busca la línea `INTERFACESv4=""` y especifica tu interfaz. Por ejemplo:

```bash
INTERFACESv4="eth0"
```

O si tu interfaz se llama diferente:

```bash
INTERFACESv4="ens33"
```

**Nota**: Si usas IPv6, también configura `INTERFACESv6`.

#### Configuración de IP Estática (Netplan - Ubuntu/Debian moderno)

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

#### Configuración de IP Estática (Interfaces - Debian antiguo)

Si usas el archivo `/etc/network/interfaces`:

```bash
sudo nano /etc/network/interfaces
```

```bash
auto eth0
iface eth0 inet static
    address 192.168.100.11
    netmask 255.255.255.0
    gateway 192.168.100.1
    dns-nameservers 8.8.8.8 8.8.4.4
```

Reinicia el servicio de red:

```bash
sudo systemctl restart networking
```

### Configuración del Archivo dhcpd.conf

#### Respaldar el Archivo Original

Siempre haz un backup antes de editar:

```bash
sudo cp /etc/dhcp/dhcpd.conf /etc/dhcp/dhcpd.conf.backup
```

#### Editar el Archivo de Configuración

```bash
sudo nano /etc/dhcp/dhcpd.conf
```

### Explicación de la Configuración

#### Parámetros Globales

```dhcp
option domain-name "clankerdhcp.lan";
option domain-name-servers ns1.example.org, ns2.example.org;

default-lease-time 600;
max-lease-time 7200;
authoritative;
```

- `option domain-name`: Nombre de dominio que se asignará a los clientes.
- `option domain-name-servers`: Servidores DNS (estas líneas están sobrescritas más adelante).
- `default-lease-time 600`: Tiempo de arrendamiento por defecto (600 segundos = 10 minutos).
- `max-lease-time 7200`: Tiempo máximo de arrendamiento (7200 segundos = 2 horas).
- `authoritative`: Declara que este servidor es autoritativo para las redes que gestiona.

#### Configuración DNS Local

```dhcp
option domain-name-servers 192.168.100.11;
option domain-name "clankers.lan";
```

- Sobrescribe la configuración global para usar el DNS local en `192.168.100.11`.
- El dominio se establece como `clankers.lan`.

#### VLAN 100 - Servicios/DMZ (192.168.100.0/24)

```dhcp
subnet 192.168.100.0 netmask 255.255.255.0 {
    range 192.168.100.50 192.168.100.200;
    option routers 192.168.100.1;
    option subnet-mask 255.255.255.0;
    option broadcast-address 192.168.100.255;
    option domain-name-servers 192.168.100.11;
}
```

- `range`: Rango de IPs dinámicas asignables (del .50 al .200 = 151 direcciones).
- `option routers`: Gateway de la red (router ROAS).
- `option domain-name-servers`: DNS local.

#### VLAN 10 - Corporativo (192.168.10.0/24)

```dhcp
subnet 192.168.10.0 netmask 255.255.255.0 {
    range 192.168.10.50 192.168.10.150;
    option routers 192.168.10.1;
    option subnet-mask 255.255.255.0;
    option broadcast-address 192.168.10.255;
    option domain-name-servers 192.168.100.11;
}
```

- Rango más pequeño: del .50 al .150 (101 direcciones).
- Las solicitudes DHCP llegan aquí mediante **DHCP Relay** configurado en el router.

#### VLAN 20 - IT (192.168.20.0/24)

```dhcp
subnet 192.168.20.0 netmask 255.255.255.0 {
    range 192.168.20.50 192.168.20.200;
    option routers 192.168.20.1;
    option subnet-mask 255.255.255.0;
    option broadcast-address 192.168.20.255;
    option domain-name-servers 192.168.100.11;
}
```

#### VLAN 30 - OT (192.168.30.0/24)

```dhcp
subnet 192.168.30.0 netmask 255.255.255.0 {
    range 192.168.30.50 192.168.30.200;
    option routers 192.168.30.1;
    option subnet-mask 255.255.255.0;
    option broadcast-address 192.168.30.255;
    option domain-name-servers 192.168.100.11;
}
```

#### VLAN 40 - Línea de Producción (192.168.40.0/24)

```dhcp
subnet 192.168.40.0 netmask 255.255.255.0 {
    range 192.168.40.50 192.168.40.200;
    option routers 192.168.40.1;
    option subnet-mask 255.255.255.0;
    option broadcast-address 192.168.40.255;
    option domain-name-servers 192.168.100.11;
}
```

### Archivo de Configuración Completo

```dhcp
# Parámetros Globales
option domain-name "clankerdhcp.lan";
option domain-name-servers ns1.example.org, ns2.example.org;

default-lease-time 600;
max-lease-time 7200;
authoritative;

# Configuración DNS Local
option domain-name-servers 192.168.100.11;
option domain-name "clankers.lan";

# VLAN 100: Servicios/DMZ - 192.168.100.0/24
subnet 192.168.100.0 netmask 255.255.255.0 {
    range 192.168.100.50 192.168.100.200;
    option routers 192.168.100.1;
    option subnet-mask 255.255.255.0;
    option broadcast-address 192.168.100.255;
    option domain-name-servers 192.168.100.11;
}

# VLAN 10: Corporativo - 192.168.10.0/24
subnet 192.168.10.0 netmask 255.255.255.0 {
    range 192.168.10.50 192.168.10.150;
    option routers 192.168.10.1;
    option subnet-mask 255.255.255.0;
    option broadcast-address 192.168.10.255;
    option domain-name-servers 192.168.100.11;
}

# VLAN 20: IT - 192.168.20.0/24
subnet 192.168.20.0 netmask 255.255.255.0 {
    range 192.168.20.50 192.168.20.200;
    option routers 192.168.20.1;
    option subnet-mask 255.255.255.0;
    option broadcast-address 192.168.20.255;
    option domain-name-servers 192.168.100.11;
}

# VLAN 30: OT - 192.168.30.0/24
subnet 192.168.30.0 netmask 255.255.255.0 {
    range 192.168.30.50 192.168.30.200;
    option routers 192.168.30.1;
    option subnet-mask 255.255.255.0;
    option broadcast-address 192.168.30.255;
    option domain-name-servers 192.168.100.11;
}

# VLAN 40: Línea de Producción - 192.168.40.0/24
subnet 192.168.40.0 netmask 255.255.255.0 {
    range 192.168.40.50 192.168.40.200;
    option routers 192.168.40.1;
    option subnet-mask 255.255.255.0;
    option broadcast-address 192.168.40.255;
    option domain-name-servers 192.168.100.11;
}
```

### Validación y Prueba de la Configuración

#### Validar la Sintaxis del Archivo

Antes de iniciar el servicio, verifica que no haya errores de sintaxis:

```bash
sudo dhcpd -t -cf /etc/dhcp/dhcpd.conf
```

Si todo está correcto, verás:

```
Internet Systems Consortium DHCP Server 4.x.x
Copyright 2004-20xx Internet Systems Consortium.
All rights reserved.
For info, please visit https://www.isc.org/software/dhcp/
Config file: /etc/dhcp/dhcpd.conf
Database file: /var/lib/dhcp/dhcpd.leases
PID file: /var/run/dhcpd.pid
```

#### Iniciar el Servicio DHCP

```bash
sudo systemctl start isc-dhcp-server
```

#### Verificar el Estado del Servicio

```bash
sudo systemctl status isc-dhcp-server
```

Deberías ver algo como:

```
● isc-dhcp-server.service - ISC DHCP IPv4 server
     Loaded: loaded (/lib/systemd/system/isc-dhcp-server.service; enabled)
     Active: active (running) since ...
```

#### Habilitar el Servicio en el Arranque

```bash
sudo systemctl enable isc-dhcp-server
```

### Monitoreo y Troubleshooting

#### Ver los Logs del Servidor DHCP

```bash
sudo tail -f /var/log/syslog | grep dhcpd
```

o en sistemas más nuevos:

```bash
sudo journalctl -u isc-dhcp-server -f
```

#### Ver las Asignaciones de IP Activas

```bash
sudo cat /var/lib/dhcp/dhcpd.leases
```

#### Verificar Conexiones de Clientes

Cuando un cliente solicita una IP, verás algo así en los logs:

```
DHCPDISCOVER from aa:bb:cc:dd:ee:ff via eth0
DHCPOFFER on 192.168.10.50 to aa:bb:cc:dd:ee:ff via eth0
DHCPREQUEST for 192.168.10.50 from aa:bb:cc:dd:ee:ff via eth0
DHCPACK on 192.168.10.50 to aa:bb:cc:dd:ee:ff via eth0
```

#### Reiniciar el Servicio

Si haces cambios en la configuración:

```bash
sudo systemctl restart isc-dhcp-server
```

#### Comandos Útiles de Diagnóstico

Verificar que el servidor está escuchando en el puerto 67:

```bash
sudo netstat -tulpn | grep :67
```

o

```bash
sudo ss -tulpn | grep :67
```

Verificar procesos DHCP activos:

```bash
ps aux | grep dhcpd
```

### Configuración de Firewall (UFW)

Si usas UFW (Uncomplicated Firewall), permite el tráfico DHCP:

```bash
sudo ufw allow 67/udp
sudo ufw allow 68/udp
sudo ufw reload
```

### Resolución de Problemas Comunes

#### Problema: El servicio no inicia

**Solución 1**: Verifica los logs para ver el error específico:

```bash
sudo journalctl -xe -u isc-dhcp-server
```

**Solución 2**: Verifica que la interfaz de red esté correctamente configurada en `/etc/default/isc-dhcp-server`.

**Solución 3**: Asegúrate de que no haya otro servicio DHCP corriendo:

```bash
sudo systemctl status dnsmasq
```

#### Problema: Los clientes no reciben IP

**Solución 1**: Verifica que el router tenga configurado el DHCP Relay (`ip helper-address`).

**Solución 2**: Verifica que el firewall no esté bloqueando los puertos 67/68 UDP.

**Solución 3**: Verifica la conectividad de red:

```bash
ping 192.168.10.1
ping 192.168.20.1
```

#### Problema: "No subnet declaration" en los logs

**Causa**: El servidor DHCP debe tener una declaración de subnet para la red en la que está físicamente conectado.

**Solución**: Asegúrate de que existe la declaración `subnet 192.168.100.0` en tu configuración.

### Reservas DHCP Estáticas (Opcional)

Para asignar siempre la misma IP a un dispositivo específico basándose en su MAC:

```dhcp
host impresora-oficina {
    hardware ethernet 00:11:22:33:44:55;
    fixed-address 192.168.10.100;
}

host servidor-backup {
    hardware ethernet AA:BB:CC:DD:EE:FF;
    fixed-address 192.168.100.20;
}
```

Agrega estas declaraciones dentro del archivo `/etc/dhcp/dhcpd.conf` al mismo nivel que las declaraciones `subnet`.

### Mejores Prácticas

1. **Backup Regular**: Haz copias de seguridad del archivo de configuración y del archivo de leases.

   ```bash
   sudo cp /etc/dhcp/dhcpd.conf /backup/dhcpd.conf.$(date +%Y%m%d)
   sudo cp /var/lib/dhcp/dhcpd.leases /backup/dhcpd.leases.$(date +%Y%m%d)
   ```

2. **Documentación**: Mantén documentadas todas las reservas estáticas y rangos de IP.

3. **Monitoreo**: Implementa monitoreo del servicio DHCP (Nagios, Zabbix, etc.).

4. **Seguridad**: Limita el acceso al servidor DHCP solo desde las redes internas.

5. **Tiempos de Lease**: Ajusta los tiempos según tus necesidades:
   - Redes con muchos dispositivos transitorios: tiempos cortos (30 minutos - 2 horas)
   - Redes estables: tiempos largos (8-24 horas)

### Resumen de Rangos de IP

| VLAN | Red              | Rango DHCP              | IPs Disponibles | Gateway       | DNS           |
|------|------------------|-------------------------|-----------------|---------------|---------------|
| 100  | 192.168.100.0/24 | .50 - .200              | 151             | 192.168.100.1 | 192.168.100.11|
| 10   | 192.168.10.0/24  | .50 - .150              | 101             | 192.168.10.1  | 192.168.100.11|
| 20   | 192.168.20.0/24  | .50 - .200              | 151             | 192.168.20.1  | 192.168.100.11|
| 30   | 192.168.30.0/24  | .50 - .200              | 151             | 192.168.30.1  | 192.168.100.11|
| 40   | 192.168.40.0/24  | .50 - .200              | 151             | 192.168.40.1  | 192.168.100.11|

**Nota**: Las IPs del .1 al .49 están reservadas para asignación estática (servidores, impresoras, etc.).