---
title: Linea Base de Seguridad
sidebar_label: Linea Base
position: 2
---

## Premisas

Para el desarrollo de este proyecto, se parte de un escenario con un nivel de madurez definido en ciberseguridad, asumiendo las siguientes condiciones como ciertas:

### Arquitectura de Red Segmentada bajo Modelos de Referencia
Se considera que la empresa no solo separa las redes IT y OT, sino que lo hace siguiendo estrictamente los niveles del **Modelo Purdue**. Esto garantiza que no existan rutas de comunicación directas desde la red corporativa (Nivel 4) a los dispositivos de control de procesos como los PLCs (Niveles 1 y 0). Toda comunicación necesaria es filtrada a través de una **DMZ Industrial (Nivel 3.5)**.

### Marco de Cumplimiento Específico para la Industria Automotriz
La empresa no solo sigue estándares generales como ISO/IEC 27001, sino que también está alineada con **TISAX (Trusted Information Security Assessment Exchange)**. Este marco, impulsado por la industria automotriz alemana, es un requisito para colaborar con los principales fabricantes y asegura controles estrictos en áreas como la protección de prototipos y la confidencialidad de la información en toda la cadena de suministro.

### Políticas de Seguridad Robustas y Aplicadas
Se asume que la empresa va más allá de tener políticas escritas y las aplica activamente. Esto incluye:

* **Seguridad Física Estricta:** Controles de acceso basados en tarjetas o datos biométricos para ingresar a la planta de producción. Los gabinetes que contienen PLCs y switches de red críticos están cerrados con llave.
* **Política de Medios Extraíbles:** Existe una política que prohíbe el uso de dispositivos USB personales en cualquier equipo dentro de la red OT. Solo se permite el uso de dispositivos encriptados y previamente analizados por el equipo de seguridad en una estación aislada.
* **Gestión de Cuentas de Usuario:** Se aplican principios de mínimo privilegio, especialmente para las cuentas con acceso a las estaciones de ingeniería y sistemas SCADA.

### Infraestructura de Red y Control Moderna
* **DMZ y Firewalls:** La DMZ no es solo una red aislada, sino que está protegida por firewalls que realizan inspección profunda de paquetes y filtrado de aplicaciones, limitando el tráfico a lo estrictamente necesario.
* **PLCs Estándar con Funciones de Seguridad:** Se utilizan PLCs de fabricantes reconocidos que, aunque históricamente inseguros, en sus versiones modernas incorporan características de seguridad básicas. Se asume que, como mínimo, se han cambiado las contraseñas por defecto y se utiliza el switch físico para poner el PLC en modo "RUN", lo que impide la carga de nuevos programas de forma remota.

### Adopción de un Marco de Gestión de Riesgos
Además de los estándares de cumplimiento, la empresa utiliza el **NIST Cybersecurity Framework (CSF)** como guía para sus operaciones de seguridad. Esto implica que la organización ya tiene procesos para las cinco funciones clave: **Identificar** activos críticos, **Proteger** la infraestructura, **Detectar** anomalías, **Responder** a incidentes y **Recuperar** la operación.