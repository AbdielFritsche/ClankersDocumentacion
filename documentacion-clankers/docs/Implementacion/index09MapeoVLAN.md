---
slug: /mapeo-vlan
title: Mapeo VLAN
sidebar_label: Mapeo VLAN
---

## Descripción

La infraestructura de red virtual se articula sobre un Linux Bridge principal (**vmbr0**), configurado en modo **VLAN-aware**. Esta configuración permite al hipervisor gestionar y distribuir el tráfico etiquetado (IEEE 802.1Q) a través de una única interfaz física, segmentando eficientemente las máquinas virtuales en sus redes lógicas correspondientes.

### Bridge Principal

* **vmbr0:**
    * **Descripción:** Interfaz de bridge principal de Proxmox. No se le asigna una IP directamente, sino que actúa como un switch virtual de Capa 2.
    * **Configuración:** Modo "VLAN-aware" habilitado. La interfaz de red física del host (ej. `eno1`) está agregada como puerto de este bridge, permitiendo que actúe como el enlace troncal (Trunk) hacia el switch físico.

### Interfaces VLAN

* **vmbr0.2:**
    * **ID Vlan Tag:** 2
    * **Nombre:** Administración
    * **Función:** Segmento de gestión de infraestructura. Aloja los dispositivos críticos de administración de red, como la interfaz de gestión del F5 BIG-IP y el propio host Proxmox.

* **vmbr0.10:**
    * **ID Vlan Tag:** 10
    * **Nombre:** Corporativo
    * **Función:** Segmento de red para usuarios finales y servicios corporativos (ej. departamentos de Ventas, RH). Corresponde al Nivel 4 (Empresarial) del modelo Purdue.

* **vmbr0.20:**
    * **ID Vlan Tag:** 20
    * **Nombre:** IT
    * **Función:** Segmento dedicado al personal y los servicios de Tecnologías de la Información, incluyendo las plataformas de monitoreo (Graylog, Grafana) y gestión de sistemas.

* **vmbr0.30:**
    * **ID Vlan Tag:** 30
    * **Nombre:** OT
    * **Función:** Red de Operaciones (Nivel 3 Purdue). Alberga los sistemas de supervisión y control (SCADA-LTS, HMI) y los servicios operativos (OpenPLC Runtime, FTP de Piezas).

* **vmbr0.40:**
    * **ID Vlan Tag:** 40
    * **Nombre:** Línea de Producción
    * **Función:** Red de Proceso y Control Básico (Nivel 2 Purdue). Aloja los dispositivos que interactúan directamente con el proceso industrial simulado (Factory I/O).

* **vmbr0.100:**
    * **ID Vlan Tag:** 100
    * **Nombre:** Zona Desmilitarizada (DMZ)
    * **Función:** Zona Desmilitarizada (Nivel 3.5 Purdue). Provee servicios compartidos (DNS, DHCP, Proxy, SMTP) de forma segura y controlada para todas las VLANs.