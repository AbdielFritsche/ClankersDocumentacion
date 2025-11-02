---
slug: /estrategia-ciberseguridad
title: Estrategia de Ciberseguridad 
sidebar_label: Estrategia de Ciberseguridad
position: 5
---

## Estrategia de Ciberseguridad

La estrategia de Ciberseguridad se encargará principalmente de dos activos importantes para esta empresa manufacturera:

* La **continuidad Operacional** (La línea de producción - Entorno OT)
* La **propiedad Intelectual** (Planos, procesos, información sensible - Entorno IT).

El principal objetivo es establecer múltiples capas de seguridad que cubran la prevención de incidentes, la contención de amenazas activas y una respuesta rápida para restaurar la operación.

Las propuestas que están marcadas por un asterisco (**\***) son parte de lo que debería ser una solución en un entorno real, sin embargo, por limitantes como lo son principalmente tiempo y licencias, resultan complejas de implementar actualmente o simplemente en el caso real de la simulación no aplica (Políticas de concientización o capacitación dado a que no existe un personal en sí).

---

### Defensa

Esta fase se enfoca en las medidas proactivas para evitar que un ataque tenga éxito, estableciendo controles fundamentales de acceso y robusteciendo la infraestructura tecnológica tanto en el entorno de IT como en el de OT.

#### Controles Fundamentales de Acceso Basado en Roles (RBAC)

Se aplica el principio de mínimo privilegio para garantizar que los usuarios solo tengan el acceso estrictamente necesario para sus funciones.

1.  **Ingeniero de Control (OT)**
    * **Responsabilidades:** Programar, mantener y solucionar problemas en PLCs, HMIs y sistemas SCADA.
    * **Acceso:** Acceso total a la Red de Operaciones (Nivel 3) y Red de Control (Nivel 2). Acceso muy restringido a la Red Corporativa (IT), limitado a repositorios de código específicos y con acceso a Internet bloqueado o fuertemente filtrado.
    * **Permisos:** Administrador local de la Estación de Ingeniería, permisos de desarrollo en SCADA/HMI y permisos para modificar la lógica de los PLCs.
    * **Justificación:** Su rol requiere control total sobre OT, pero limitar su acceso a IT reduce drásticamente el riesgo de que un ataque salte de un entorno a otro a través de su cuenta.

2.  **Operador de Producción**
    * **Responsabilidades:** Operar la maquinaria a través de las HMIs y monitorear el proceso.
    * **Acceso:** Acceso de solo lectura o muy limitado a la Red de Operaciones (Nivel 3), únicamente a la HMI asignada. Sin acceso a otras redes.
    * **Permisos:** Cuenta de "Operador" en HMI/SCADA para iniciar/detener ciclos y visualizar alarmas. No puede modificar la programación.
    * **Justificación:** Previene cambios accidentales o maliciosos que puedan detener la producción.

3.  **Administrador de Sistemas (IT)**
    * **Responsabilidades:** Gestionar servidores, red y seguridad en el entorno corporativo (IT).
    * **Acceso:** Acceso de administrador a la Red Corporativa (Nivel 4/5) y a la DMZ Industrial (Nivel 3.5). Acceso estrictamente denegado a la Red de Operaciones (OT).
    * **Permisos:** Administrador en servidores IT y firewalls del lado IT.
    * **Justificación:** La separación de deberes entre IT y OT es un control crítico. Si su cuenta es comprometida, el atacante no tiene un camino directo a la producción.

4.  **Empleado Corporativo (Ej. Finanzas, RH)**
    * **Responsabilidades:** Tareas administrativas en la red de negocio.
    * **Acceso:** Acceso de usuario estándar a la Red Corporativa (Nivel 4/5). Sin acceso a la DMZ ni a las redes OT.
    * **Permisos:** Usuario sin privilegios de administrador en su estación de trabajo.
    * **Justificación:** Es el rol más limitado para asegurar que un compromiso (vía phishing) sea contenido dentro de la red IT.

#### Controles Técnicos de Protección por Entorno

* **A. Protección del Entorno IT (Propiedad Intelectual):**
    * Segmentación de la Red Corporativa: Crear VLANs para separar departamentos críticos (ej. Ingeniería de la red Administrativa).
    * Seguridad del Endpoint: (*) Implementar soluciones EDR en todas las estaciones de trabajo.
    * Prevención de Fuga de Datos (DLP): (*) Utilizar herramientas que monitoreen y bloqueen la exfiltración no autorizada de información sensible.
    * Concientización y Capacitación: (*) Realizar campañas periódicas de simulación de phishing.
    * Application Whitelisting: (*) En computadoras, permitir sólo la ejecución de software mínimo indispensable autorizado por la compañía.

* **B. Protección del Entorno OT (Línea de Producción):**
    * Fortalecimiento de la DMZ Industrial: Todo el tráfico entre IT y OT debe ser inspeccionado rigurosamente.
    * Control Físico y Lógico de Puertos: (*) Deshabilitar puertos USB en HMIs y estaciones de ingeniería.
    * Application Whitelisting: (*) En sistemas SCADA y HMI, permitir sólo la ejecución de software autorizado.
    * Monitoreo Pasivo de la Red OT: (*) Desplegar un IDS capaz de entender protocolos industriales (ej. EtherNet/IP, Modbus) para alertar sobre comandos anómalos.

#### Mapeo de Defensa con el Framework MITRE ATT&CK

MITRE ATT&CK (Adversarial Tactics, Techniques, and Common Knowledge) es una base de conocimiento globalmente accesible de tácticas y técnicas de adversarios basada en observaciones del mundo real. Este framework permite mapear exactamente cómo un atacante tratará de lograr su objetivo, paso a paso y aplicar controles para cada etapa del ataque.

##### Escenario 1: Ataque Externo (Phishing en Red Corporativa)

El objetivo del atacante es pasar de un correo electrónico en la red IT (Nivel 4/5 del Modelo Purdue) a modificar el firmware de un PLC en la red OT (Nivel 2 del Modelo Purdue).

**Táctica de Acceso Inicial:**
* **Tecnica:** T1566.001 - Phishing: Spearphishing Attachment
* El atacante envía un correo dirigido a un empleado con un archivo malicioso (ej. un falso PDF o factura).
* **Controles y Estrategias:**
    * Implementar un Email Gateway que analice adjuntos en un sandbox antes de entregarlos.
    * Soluciones de Seguridad del Endpoint (EDR) en la estación de trabajo para detectar y bloquear la ejecución del malware.
    * Campañas de concientización y simulación de phishing para que los empleados identifiquen y reporten estos correos.

**Táctica Ejecución:**
* **Tecnica:** T1204.002 - User Execution: Malicious File
* El atacante envía un correo dirigido a un empleado con un archivo malicioso (ej. un falso PDF o factura) El empleado abre el archivo, ejecutando un malware (ej. un RAT Remote Access Trojan).
* **Controles y Estrategias:**
    * Application Whitelisting en las estaciones de trabajo para impedir la ejecución de software no autorizado.
    * EDR para detectar comportamiento anómalo del proceso (ej. Word abriendo una conexión a red) y poner el dispositivo en cuarentena automática.

**Táctica Descubrimiento:**
* **Técnica:** T1057 - Process Discovery
* El atacante lista los procesos en ejecución para entender el entorno y evitar ser detectado.
* **Tecnica:** T1049 System Network Connection Discovery
* El atacante busca conexiones de red activas para identificar servidores importantes, como los que se comunican con la DMZ Industrial.
* **Controles y Estrategias:**
    * Monitoreo de la Red IT con herramientas que alerten sobre escaneos de red internos inusuales. así mismo un EDR puede alertar sobre comandos de descubrimiento.

**Táctica Movimiento Lateral:**
* **Técnica:** T1021.001 - Remote Services: Remote Desktop Protocol.
* El atacante, habiendo robado credenciales, intenta moverse a servidores en la DMZ o, si la segmentación falla directamente a una Estación de Ingeniería en la red OT.
* **Controles y Estrategias:**
    * Segmentación estricta IT/OT, el firewall debe bloquear todo tráfico RDP desde la red IT hacia la DMZ y la red OT, excepto desde IPs de administración autorizadas.
    * Gestión de cuentas de usuario con el principio de mínimo privilegio. La cuenta del empleado comprometido no debería tener permisos de administrador en otros sistemas.
    * Monitoreo de logs de autenticación para detectar múltiples intentos de inicio de sesión fallidos o exitosos desde ubicaciones inusuales.

**Táctica Impacto:**
* **Técnica:** T1499.001 - Endpoint Denial of Service: OS Shutdown/Reboot
* Como paso final, el atacante no logra llegar al PLC, pero causa un impacto menor reiniciando sistemas en la red IT.
* **Técnica:** T0845 - Manipulate I/O
* **Controles y Estrategias:**
    * El switch físico del PLC en modo RUN es un control físico crucial que impide la carga remota de programas.
    * Restaurar desde backups seguros tanto la lógica del PLC como la imagen de la Estación de Ingeniería.

##### Escenario 2: Ataque Interno (USB Malicioso en Red de Control)

Un actor interno introduce un USB malicioso directamente en la estación de Ingeniería (Nivel 3 Modulo Perdue).

**Táctica de Acceso Inicial:**
* **Técnica:** T1200 - Hardware Additions
* Se introduce físicamente el dispositivo USB en el puerto de la Human Machine Interface (HMI) o la Estación de Ingeniería.
* **Controles y Estrategias:**
    * Control Fisico y Logico de Puertos, deshabilitar puertos USB en BIOS/SO o usar software de control de dispositivos.
    * Seguridad Física Estricta con gabinetes bajo llave y control de acceso a la planta.
    * Política de Medios Extraíbles que solo permite el uso de dispositivos encriptados y previamente analizados.

**Táctica Ejecución:**
* **Técnica:** T1091 - Replication Through Removable Media
* El malware se ejecuta, ya sea por autorun o engañando al operador.
* **Controles y Estrategias:**
    * Deshabilitar Autorun/Autoplay, Application Whitelisting (control más efectivo), Antivirus/EDR configurado para escanear USBs.

**Táctica de Recolección e Impacto:**
* **Técnica:** T0821 - Data from Industrial Control Systems.
* El malware busca archivos de proyecto del PLC en la Estación de Ingeniería para robar propiedad intelectual (lógica de control).
* **Técnica:** T0845 - Manipulate I/O.
* El malware modifica la lógica del PLC directamente o reemplaza el firmware para alterar el proceso físico, causando paros de producción o daños a la maquinaria.
* **Controles y Estrategias Sugeridas:**
    * Monitoreo Pasivo de la Red OT con un IDS que entienda protocolos industriales. Este sistema alertará sobre comandos de "descarga de programa" enviados al PLC fuera de una ventana de mantenimiento programada.
    * Aislamiento de Segmentos de Red. Si se detecta un comportamiento anómalo en un PLC, las reglas del firewall deberían permitir aislar esa celda de producción para evitar que el ataque se propague a otros PLCs.
    * Plan de Operación en modo Degradado para operar manualmente la celda afectada mientras se recupera el sistema.
    * Restaurar el firmware y la lógica desde un backup limpio y validado.

---

### Mitigación

Si un atacante logra superar las defensas iniciales, el objetivo es limitar el daño y evitar que la amenaza se propague.

* **Aislamiento de Segmentos de Red:** En caso de detectar una anomalía en una celda de manufactura (ej. un brazo robótico con comportamiento errático) las reglas del firewall entre segmentos deben permitir aislar esa celda especifica del resto de la red OT con un solo clic permitiendo que las otras líneas de producción sigan operando.
* **Cuarentena Automática de Dispositivos:** (*) Si una estación de trabajo en la red IT se ve comprometida (detectado por el EDR) esta debe ser puesta en cuarentena de la red automáticamente para evitar que el malware se propague lateralmente.
* **Plan de Operación en modo Degradado:** (*) Para los procesos más críticos de la línea, tener un plan para cambiar a operación manual o semiautomática de forma segura si los sistemas de control automatizado no son confiables, garantizado una producción mínima y evitando un paro total.

---

### Respuesta

Esta fase define pasos para erradicar la amenaza, recuperar sistemas y volver al flujo normal.

* **Identificación:** Confirmar el incidente a través de alertas y reportes a los operarios.
* **Análisis:** Determinar la causa raíz del ataque y el alcance del compromiso ¿Que equipo fue afectado? ¿Hubo fuga de información?
* **Erradicación:** Eliminar la amenaza del entorno, ya sea un malware o una cuenta de usuario comprometida.
* **Recuperación:** Restaurar desde Backups Seguros: Restaurar el firmware y la lógica de los PLCs y HMI afectados a partir de copias de seguridad conocidas, limpias y almacenadas fuera de la línea.
* **Validación del Sistema:** Antes de volver a conectar la celda de producción a la red realizar pruebas exhaustivas para asegurar que la operación es normal y segura.
* **Reactivación escalonada:** Poner en marcha la línea de producción en forma gradual, monitoreando el comportamiento de los sistemas.