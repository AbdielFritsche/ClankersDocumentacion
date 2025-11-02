---
slug: /reglas-flujo-trafico
title: Reglas Flujo Trafico
sidebar_label: Reglas Flujo Trafico
---
## Matriz de Flujo de Tráfico

### Descripción

Esta matriz detalla la política de seguridad fundamental de la arquitectura, la cual se basa en un principio de **"Denegación por Defecto" (Default Deny)**.

Su propósito es definir de manera explícita todas las reglas de Listas de Control de Acceso (ACLs) que rigen la comunicación entre los distintos segmentos de red (VLANs). Esta tabla es la implementación técnica de las directrices de segmentación del Modelo Purdue, asegurando que el flujo de tráfico entre las zonas corporativas (IT) y las zonas industriales (OT) esté estrictamente controlado y limitado a lo esencial.

Cada entrada especifica una comunicación permitida, detallando el Origen, Destino, Protocolo/Puerto y su justificación. Todo el tráfico que no esté explícitamente listado en esta matriz se considera prohibido y es bloqueado por defecto por el firewall (F5 BIG-IP).

### Tabla de reglas de flujo

Enlace al recurso: [Tabla Reglas de Flujo](https://docs.google.com/spreadsheets/d/1_V7T2b9zgjGvDnzrdK8ZQT9tZggSOiDpnyJYqfNkQJY/edit?usp=sharing)

---

##  Reglas de Firewall (ACLs)

### Descripción

Este anexo documenta la implementación técnica y el conjunto de reglas específicas configuradas en el firewall (F5 BIG-IP) para hacer cumplir la política de flujo de tráfico.

Mientras que la Matriz de Flujo (Anexo A-3.1) define la política conceptual, este anexo detalla las Listas de Control de Acceso (ACLs) secuenciales que la ejecutan. Las reglas se aplican en la interfaz de entrada de cada VLAN (zona) y se procesan en orden. La política base es **Denegar Todo por Defecto**.

*(Nota: Las reglas están en un pseudocódigo claro. `any` se refiere a cualquier dirección IP en la zona de origen especificada).*

### Reglas ACLs

Enlace al recurso: [Reglas ACLs](https://docs.google.com/spreadsheets/d/1OJ8X2R9JGRRMQGn-IPhUaV9ZjNC9YVCo1yGdH2WZoEs/edit?usp=sharing)