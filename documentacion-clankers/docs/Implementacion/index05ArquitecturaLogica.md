---
slug: /arquitectura-logica
title: Arquitectura Logica
sidebar_label: Arquitectura Logica de la Red
---

## Descripción

Esta sección recopila el material gráfico esencial que complementa la documentación técnica. Su propósito es proporcionar una representación visual clara y detallada de la arquitectura de red, separando los diagramas de alta complejidad del cuerpo principal del documento para facilitar la consulta y la legibilidad.

---

### Diagrama de Arquitectura Lógica

Este diagrama ilustra la **topología lógica** de la red. Su objetivo principal es representar el flujo de comunicación y la interrelación funcional entre los diferentes segmentos de red (VLANs). Se abstrae del hardware físico para centrarse en:

* **La Segmentación de Red:** Visualiza la separación de dominios de difusión (VLAN 2, 10, 20, 30, 40, 100) y su alineación con el modelo Purdue.
* **El Plan de Direccionamiento (Subredes):** Detalla la **declaración de cada subred** (ej. `192.168.10.0/24`), su gateway, y los rangos de IP asignados (ej. rangos de DHCP, IPs estáticas para servidores).
* **La Disposición de Servicios:** Muestra la ubicación de las máquinas virtuales (VMs) y los servicios que ejecutan (ej. DNS, DHCP, SCADA, Graylog) dentro de sus VLANs correspondientes.
* **Conteo de Entidades Lógicas:** Define la **cantidad de dispositivos** planeados por subred para asegurar que el dimensionamiento (ej. un `/24`) sea adecuado para la escalabilidad esperada.
* **Los Flujos de Tráfico (ACLs):** Define las rutas de comunicación permitidas y denegadas entre las zonas (ej. el flujo controlado de OT a la DMZ, y la restricción de IT a OT).

---