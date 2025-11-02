---
slug: /arquitectura-fisica
title: Arquitectura Fisica
sidebar_label: Arquitectura Fisica de la Red
---

###  Diagrama de Arquitectura Física

Este diagrama documenta la **topología física** y el inventario de hardware que soporta la arquitectura de red. Su propósito es mostrar la disposición exacta de los equipos tangibles y sus interconexiones cableadas. Este diagrama detalla:

* **Inventario y Conectividad:** La conexión puerto a puerto entre los dispositivos (Router Cisco 2911, Switch Cisco 2960, host Proxmox, F5 BIG-IP) y las PCs físicas.
* **Asignación de Interfaces:** Especifica qué tarjetas de red (NICs) físicas se utilizan para qué propósitos (ej. interfaz de gestión, enlace troncal `dot1q`, conexión a la WAN).
* **Direccionamiento de Gestión:** Asigna las direcciones IP de gestión a los dispositivos de hardware (ej. IP del Switch, IP del host Proxmox, IP del F5).
* **Equipamiento Adicional:** Muestra la ubicación de **otros equipos físicos** relevantes, como Firewalls perimetrales, UPS (Sistemas de Alimentación Ininterrumpida), o patch panels, aunque no tengan direccionamiento IP.
* **Adaptabilidad y Escenarios Futuros:** Puede incluir conexiones físicas redundantes (ej. enlaces agregados - LACP) o puertos designados para crecimiento futuro (ej. "Puerto para futuro Servidor Web"), demostrando la **adaptabilidad del diseño**.

---

### Enlace a Diagramas

Enlace al diagramas: [Diagrama de Arquitectura Físico y Lógico](https://lucid.app/lucidchart/6f986918-c2f5-44e1-9aa5-1bbecff4f7ae/view)