---
slug: /plan-direccionamiento-ip
title: Plan Direccionamiento IP
sidebar_label: Plan Direccionamiento IP
---

## Descripción

La siguiente tabla detalla el plan de asignación de direccionamiento IP (IPAM) para la arquitectura de red. Define los rangos de red, las máscaras, las puertas de enlace y las asignaciones de IP estáticas clave para cada VLAN, asegurando la segmentación y evitando conflictos.

### Convenciones de asignación

* **Puerta de Enlace (Gateway):** Se reserva la dirección `.1` de cada subred para la interfaz del router que gestiona el enrutamiento inter-VLAN.
* **Servidores e infraestructura:** Las direcciones IP estáticas se asignan desde el rango `.3` hasta `.49` para servidores, y dispositivos de red.
* **Clientes DHCP:** Los rangos dinámicos para estaciones de trabajo y dispositivos de cliente comienzan en `.50` y terminan en `.200`.

### Tabla de direccionamiento

Enlace al recurso: [Tabla de Direccionamientos IP](https://docs.google.com/spreadsheets/d/1Hg3vgKzXPNut3hqnWZAalN-jdz71zp2SKPgZqJ0g-Tk/edit?usp=sharing)