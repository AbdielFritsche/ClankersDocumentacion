---
slug: /equipos-fisicos
title: Implementación del Laboratorio
sidebar_label: Equipos Fisicos
---

## Herramientas Físicas

### Router

* **Modelo:** Router Cisco 2911
* **Especificaciones:** Router de Servicios Integrados (ISR) con 3 puertos Gigabit Ethernet (GE), ranuras de expansión (EHWIC) y capacidades de enrutamiento avanzado, NAT, QoS y seguridad (VPN, Firewall).
* **Propósito:** Servir como la puerta de enlace (gateway) principal. Realizar el enrutamiento Inter-VLAN (comunicación entre las redes 10, 20, 30, 40, 100 y 2).

---

### Switch

* **Modelo:** Switch Cisco 2960
* **Especificaciones:** Switch gestionable de Capa 2 (L2) con 24 o 48 puertos (FastEthernet o GigabitEthernet) y soporte completo de VLANs (estándar 802.1Q).
* **Propósito:** Ser el punto central de conexión de la red física. Segmentar la red en las diferentes VLANs (Admin, Corp, IT, OT, etc.) y conectar el host Proxmox con los dispositivos físicos de administración.

---

### PCs

#### PC Host Para Virtualización

* **Modelo:** Lanix Titan Mini PC
* **Especificaciones:**
    * **RAM:** 32GB RAM
    * **CPU:** i7 13620H
    * **Almacenamiento:** 1TB SSD
* **Propósito:** Servir como el hipervisor Proxmox VE (Virtual Environment). Su función es alojar, ejecutar y gestionar de forma centralizada todas las máquinas virtuales (VMs) y contenedores (CTs) que componen la infraestructura de red, incluyendo los servidores de la DMZ (192.168.100.0) y las distintas VLANs de usuarios (Corp, IT, OT, etc.).
* **Configuración Básica:**
    * **OS:** Instalación de Proxmox VE como sistema operativo base (bare-metal).
    * **Conectividad-Red:** Configuración de la interfaz de red física (conectada al puerto Trunk del Switch 2960) como parte de un Linux Bridge (ej. vmbr0).
    * **VLANs:** Habilitación del modo "VLAN-aware" en el bridge vmbr0 para que pueda gestionar el tráfico etiquetado 802.1Q de todas las VLANs.
    * **Red:** Asignación de una IP de gestión estática a la interfaz de Proxmox (ej. 192.168.2.10/24) dentro de la VLAN 2 (Administración), permitiendo el acceso a la interfaz web de Proxmox desde las PCs físicas de administración.
    * **Tags:** Creación de las VMs y asignación de la VLAN Tag correspondiente a la interfaz de red virtual de cada máquina (ej. VM de Vlan Corp con Tag=10, VM del servidor DHCP con Tag=100).

#### PC ProxyServer - APT Server

* **Modelo:** Asus TUF Gaming F15 FX506H
* **Especificaciones:**
    * **RAM:** 16GB RAM
    * **CPU:** i5 11400H
    * **GPU:** RTX 3050 Ti
    * **Almacenamiento:** 1: 512SSD / 2: 1TB HDD
    * **OS:** Windows 11 Home 23H2 / Ubuntu 24.04 LTS
* **Propósito:** Operando bajo Ubuntu 24.04 LTS, esta máquina actúa como un servidor de servicios esencial para optimizar y asegurar la red. Su función es doble:
    * **Proxy HTTP/S (Tinyproxy):** Proporciona acceso a internet filtrado y controlado para las máquinas virtuales (especialmente servidores en la DMZ) que no tienen salida directa, permitiéndoles consumir APIs o descargar recursos web externos de forma segura.
    * **Caché de Paquetes (apt-cacher-ng):** Sirve como un repositorio local (proxy) para actualizaciones de software. Centraliza la descarga de paquetes Debian/Ubuntu, reduciendo drásticamente el consumo de ancho de banda de Internet y acelerando significativamente los despliegues (apt install) y actualizaciones (apt upgrade) de todas las VMs Linux en Proxmox.
* **Configuración:**
    * **Red:** Configurada con una IP estática (ej. 192.168.100.5) dentro de la VLAN de Servicios/DMZ para ser accesible por las otras redes.
    * **Tinyproxy:** Servicio instalado y configurado (vía `/etc/tinyproxy/tinyproxy.conf`) para escuchar en un puerto (ej. 8888). Las directivas `Allow` están configuradas para aceptar conexiones únicamente desde los rangos IP internos de las VLANs (ej. 192.168.10.0/24, 192.168.100.0/24, etc.).
    * **APT Server (apt-cacher-ng):** Servicio instalado y escuchando en su puerto por defecto (3142). El directorio de caché (en `/var/cache/apt-cacher-ng`) está configurado para utilizar el HDD de 1TB, reservando el SSD para el sistema operativo y el software.
    * **Firewall (UFW):** Configurado para permitir el tráfico entrante en los puertos `8888/tcp` (Tinyproxy) y `3142/tcp` (apt-cacher-ng) solo desde las VLANs internas.
    * **Cliente SSH:** Instalación de PuTTY como cliente principal para pruebas de conectividad (Telnet, SSH) y acceso a la CLI de los equipos de red (Switch/Router) si es necesario.

#### PC Linea de Produccion

* **Modelo:** MSI GL65 Leopard 10SKF
* **Especificaciones:**
    * **RAM:** 16GB RAM
    * **CPU:** i7 10750H
    * **GPU:** RTX 2070 Ti
    * **Almacenamiento:** 1: 512SSD / 2: 1TB HDD / 3: 2TB HDD
    * **OS:** Windows 10 Home 22H2
* **Propósito:** Servir como la workstation de simulación industrial (OT). Su tarea principal es renderizar y ejecutar el software Factory I/O, representando el nivel más bajo de comunicación en la arquitectura (VLAN 40). Adicionalmente, al no tener acceso directo a internet el equipo host (PROXMOX PC), funciona como un servidor FTP local para transferir ejecutables y archivos de configuración a otras máquinas virtuales de la red.
* **Configuración:**
    * **Red:** IP estática asignada dentro del rango de la VLAN 192.168.40.0/24.
    * **Server FTP:** Habilitación del rol "Servidor FTP" desde las "Características de Windows". Se configura un sitio FTP apuntando a un repositorio local (ej. en el HDD de 2TB) para alojar los ejecutables, con permisos de acceso para las VMs de servicio.
    * **Cliente Telnet:** Habilitación de la característica "Cliente Telnet" para realizar pruebas básicas de conectividad y verificación de puertos contra los servicios en la DMZ (como el propio IIS o el FTP).
    * **Cliente SSH:** Instalación de PuTTY como cliente principal para pruebas de conectividad (Telnet, SSH) y acceso a la CLI de los equipos de red (Switch/Router) si es necesario.

---

### Otros

* Cable de consola.
* Cables Ethernet.
* PC para configurar switch y router.
* Cables de alimentación.