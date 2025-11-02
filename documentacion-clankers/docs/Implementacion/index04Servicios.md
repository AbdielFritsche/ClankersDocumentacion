---
slug: /servicios
title: Servicios
sidebar_label: Servicios de la Arquitectura
---

## Servicios

### DHCP
* **Software:** ISC DHCP Server
* **Uso:** Asignar direcciones IP, máscaras de subred y puertas de enlace (gateways) de forma automática a todos los dispositivos cliente dentro de las diferentes VLANs (Corp, IT, OT, etc).
* **Implementación en la red:** Actúa como un servidor DHCP centralizado para toda la infraestructura. Se configura con diferentes “ámbitos”, uno para cada VLAN. El router de Cisco con ip-helper-address enviará las peticiones DHCP de cada VLAN a este servidor.

### DNS
* **Software:** BIND9
* **Uso:** Traducir nombres de dominio legibles en la red local a sus direcciones IP correspondientes
* **Implementación en la Red:** Funciona como el servidor DNS autoritativo para la red interna. Permite que todos los servidores y VMs se comuniquen entre sí usando nombres, lo cual es crucial para los servicios de SMTP o HTTP.

### SMTP/IMAP
* **Software:** POSTFIX (SMTP) y Dovecot (IMAP)
* **Uso:**
    * **POSTFIX:** Se encarga de enviar y recibir correos electrónicos
    * **Dovecot:** Permite a los usuarios almacenar y leer sus correos desde clientes (Outlook o Thunderbird)
* **Implementación en la Red:** Proporciona un servicio de correo electrónico interno. Su fin principal es permitir que las áreas Corp, IT, y servicios de monitoreo como Grafana puedan enviar alertas.

### HTTP
* **Software:** NGINX
* Uso: Servir de contenido web a traves de protocolo HTTP/S
* **Implementación en la Red:** Actúa como el servidor web principal. Su rol más importante en esta arquitectura es funcionar como un Proxy Inverso (Reverse Proxy). Esto permite acceder a todas las interfaces web de los servicios internos (Grafana, Graylog, Proxmox) a través de un único punto de entrada, simplificando la gestión de accesos y certificados SSL.

### FTP
* **Software:** vsftpd (Very Secure FTP Daemon)
* **Uso:** Proporcionar un método para la transferencia de archivos entre servidores y estaciones de trabajo.
* **Implementación en la Red:** Sirve como un repositorio de archivos centralizado en la DMZ. Su fin principal es ser el punto de intercambio de archivos entre la PC de Línea de Producción (VLAN 40) (para subir ejecutables o logs) y los servidores de la DMZ (VLAN 100), de forma controlada y segura.

### Syslog
* **Software:** Rsyslog
* **Uso:** Recolectar mensajes de log de eventos del sistema y de la red en un formato estándar (Syslog).
* **Implementación en la Red:** A diferencia de Nxlog (para Windows), Rsyslog se usa como el colector de logs para equipos de Linux o de infraestructura. Su fin es recibir logs de dispositivos que no pueden usar un agente como el F5 BIG-IP y el propio host Proxmox.