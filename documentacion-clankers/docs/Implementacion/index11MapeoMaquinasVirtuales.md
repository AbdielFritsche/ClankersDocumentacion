---
slug: /mapeo-maquinas-virtuales
title: Mapeo Maquinas Virtuales
sidebar_label: Mapeo Maquinas Virtuales
---

## Mapeo de Equipos por Sección de Red

En esta sección se detalla la distribución de equipos, tanto físicos como virtuales, dentro de la arquitectura de red. El siguiente mapeo agrupa cada dispositivo en su respectivo segmento de red (VLAN) para proporcionar una visión clara de la asignación de recursos y la segmentación lógica del entorno, basado en el diagrama físico.

---

### VLAN 100 (DMZ)

* **F5 BIG IP (Virtual)**
    * Interfaz: `int 1.5`
    * IP: `192.168.100.1`
* **Servidor DHCP/DNS (Virtual)**
    * IP: `192.168.100.11`
* **Servidor SMTP/IMAP (Virtual)**
    * IP: `192.168.100.12`
* **Servidor HTTP (Virtual)**
    * IP: `192.168.100.13`
* **Servidor API/Proxy (Físico - Laptop externa)**
    * IP: `192.168.100.3`

---

### VLAN 30 (OT)

* **F5 BIG IP (Virtual)**
    * Interfaz: `int 1.3`
    * IP: `192.168.30.1`
* **Servidor SCADA (Virtual)**
    * IP: `192.168.30.20`
* **FTP-Gestor de Piezas (Virtual)**
    * IP: `192.168.30.13`
* **Simulador de programas (Virtual)**
    * IP: DHCP (`.50-200`)
* **VM OpenPLC Editor (Virtual)**
    * IP: DHCP (`.50-200`)
* **VM Simulador de diseños CAD (Virtual)**
    * IP: DHCP (`.50-200`)

---

### VLAN 40 (Producción)

* **F5 BIG IP (Virtual)**
    * Interfaz: `int 1.4`
    * IP: `192.168.40.1`
* **PC Línea de producción (Físico - Laptop externa)**
    * IP: `192.168.40.10`

---

### VLAN 10 (Corporativo)

* **F5 BIG IP (Virtual)**
    * Interfaz: `int 1.1`
    * IP: `192.168.10.1`
* **PC-CORP-1 (Virtual)**
    * IP: DHCP (`.50-200`)

---

### VLAN 20 (IT)

* **Enrutador 2911 (Físico)**
    * Gestiona enrutamiento para VLAN 20
* **F5 BIG IP (Virtual)**
    * Interfaz: `int 1.2`
    * IP: `192.168.20.1`
* **Servidor Monitoreo / SIEM (Virtual)**
    * IP: `192.168.20.30`
* **PC-IT-1 (Virtual)**
    * IP: DHCP (`.50-200`)

---

### VLAN 2 (Administración)

* **Enrutador 2911 (Físico)**
    * Interfaz: `Int g0/0.2`
    * IP: `192.168.2.1/24`
* **Host Proxmox (Físico)**
    * IP: `192.168.2.2`
* **F5 BIG IP (Virtual)**
    * Interfaz: `int 1.0`
    * IP: `192.168.2.3`

---

### Red Externa (Atacante)

Este grupo representa dispositivos fuera de la red controlada, sin VLAN asignada.

* **PC Atacante (Físico - Laptop externa)**
    * Servidor SMTP Falso
    * Servidor Payload
    * Servidor HTTP Phishing
    * Servidor C2

---