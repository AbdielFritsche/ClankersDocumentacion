---
title: Definición Requerimientos
sidebar_label: Requerimientos del Escenario
position: 3
---

## Requerimientos

Los requerimientos definen las capacidades y condiciones que la solución de ciberseguridad debe cumplir. Se dividen en Requerimientos Funcionales, que describen qué debe hacer el sistema, y Requerimientos No Funcionales, que describen cómo debe hacerlo, estableciendo criterios de calidad, rendimiento y seguridad.

### Requerimientos Funcionales

Requisitos que definen las funciones específicas que el sistema debe ser capaz de realizar.

* **Segmentación de Red IT/OT:** Se debe mantener una red segmentada que aísle la red corporativa (IT) de la red de control de producción (OT), siguiendo los niveles del Modelo Purdue. Esta separación es el principal control para impedir el movimiento lateral de amenazas.
    * **Protocolos:** TCP/IP, Ethernet, VLAN (802.1Q).

* **Zona Desmilitarizada (DMZ) Industrial:** Debe existir una DMZ industrial que actúe como una zona de amortiguamiento controlada entre las redes IT y OT. Toda la comunicación necesaria entre ambos mundos debe ser mediada y filtrada a través de esta zona.
    * **Protocolos:** HTTPS (para acceso a aplicaciones web), RDP (altamente restringido a hosts de gestión específicos), DNS.

* **Sistema de Supervisión y Control (SCADA):** La línea de producción debe contar con un sistema SCADA para la monitorización y control centralizado de los procesos industriales, interactuando con las HMIs y los PLCs en los niveles inferiores.
    * **Protocolos Industriales:** EtherNet/IP, Modbus TCP/IP (para la comunicación con los PLCs y sensores).

* **Dashboard Centralizado de Seguridad y Operación:** Se debe implementar un dashboard que consolide la visualización de datos críticos para la seguridad y la producción. Este debe ser capaz de mostrar:
    * Tráfico de red sospechoso y flujos de comunicación bloqueados.
    * Alertas de seguridad activas, como intentos de acceso no autorizados.
    * Estado y disponibilidad de los activos críticos, como los PLCs.
    * Protocolos de Monitoreo: SNMP, Syslog, NetFlow.

* **Servicio de Correo Corporativo:** La empresa debe contar con un servicio de correo electrónico dedicado para las comunicaciones de negocio. Este servicio debe ser tratado como un vector de ataque principal y, por lo tanto, estar protegido con medidas avanzadas.
    * **Protocolos:** SMTP, IMAP/POP3, HTTPS.

* **Capacidad de Aislamiento y Contención:** El sistema debe permitir el aislamiento rápido de segmentos de red o celdas de manufactura específicas en caso de un incidente de seguridad, para contener la amenaza y permitir que el resto de la planta continúe operando.
    * **Protocolos:** Se implementa a través de la gestión de Listas de Control de Acceso (ACLs) en los firewalls.

### Requerimientos No Funcionales

Estos son los requisitos que definen los atributos de calidad y los estándares que el sistema debe cumplir.

* **Tecnología de Firewall Avanzada:** Se debe utilizar un firewall, específicamente un F5, capaz de realizar inspección profunda de paquetes (DPI) y filtrado de aplicaciones, especialmente en el perímetro de la DMZ industrial.

* **Alta Disponibilidad Operacional:** La línea de producción debe mantener una disponibilidad del 99.999% ("cinco nueves"). Esto se traduce en un tiempo de inactividad no planificado máximo de aproximadamente 5.26 minutos por año, lo que exige una infraestructura de red y control extremadamente robusta y redundante.

* **Plataforma de Visualización: El dashboard de monitoreo debe estar implementado en Tableau, operando en un servidor local para mantener todos los datos de operación y seguridad dentro del perímetro de la empresa.

* **Seguridad y Cumplimiento Normativo:** La arquitectura y las políticas de seguridad deben estar alineadas con marcos de trabajo y estándares reconocidos en la industria, como ISO/IEC 27001, TISAX (específico del sector automotriz) y el NIST Cybersecurity Framework.

* **Usabilidad del Dashboard:** La interfaz del dashboard debe ser intuitiva y clara, permitiendo a los analistas de seguridad y al personal de operaciones identificar rápidamente anomalías y el estado de los activos críticos sin necesidad de una interpretación técnica compleja.

* **Escalabilidad:** La arquitectura de red y seguridad debe ser diseñada de manera modular para permitir la expansión futura de las líneas de producción o la integración de nuevas tecnologías sin necesidad de un rediseño completo.