---
slug: /Software Utilizado
title: Software Utilizado
sidebar_label: Software Utilizado
---

## Software

### Monitoreo de Software - Terceros

**Grafana**
* **Uso:** Es la plataforma de visualización y dashboarding. Se utiliza para crear paneles de control (dashboards) en tiempo real que muestran gráficas y alertas. Grafana no almacena datos; consulta InfluxDB para obtener las métricas y las presenta de forma legible.
* **Configuración Base:** Se instala el servicio de Grafana. Se configura una "Fuente de Datos" (Data Source) para conectarse a la base de datos InfluxDB (especificando su IP, puerto y credenciales). Luego, se crean o importan los dashboards seleccionando las métricas (queries) de InfluxDB que se desean graficar (ej. uso de CPU, consumo de memoria RAM para cada VM hosteada).
* **Lugar en la arquitectura:** Se instala idealmente en una VM dedicada dentro de la DMZ/Servicios (192.168.100.0). El personal de IT y Administración (VLAN 10 y 2) accedería a su interfaz web a través de la red para monitorear el estado de toda la infraestructura.

**InfluxDB**
* **Uso:** Es la base de datos de series temporales (Time Series Database - TSDB). Su propósito es almacenar de manera altamente eficiente cualquier métrica que cambie con el tiempo: uso de CPU/RAM de servidores, tráfico de red, logs, temperaturas, etc. Es el backend de almacenamiento para Grafana.
* **Configuración Base:** Se instala el servicio InfluxDB. Se crea una base de datos (ej. "metrics") y "buckets" para organizar los datos. Se configuran las políticas de retención (cuánto tiempo se guardan los datos, ej. 30 días)
* **Lugar en la arquitectura:** Se instala en una VM dedicada dentro de la DMZ/Servicios (192.168.100.0), preferiblemente en la misma máquina que Grafana si los recursos son limitados, o en una VM separada para mejor rendimiento.

**Nxlog**
* **Uso:** Es un agente de recolección de logs (log collector). Se instala en las máquinas que se desea monitorear (Windows). Su función es leer archivos de log (ej. Event Logs de Windows), filtrarlos, convertirlos a un formato estructurado (como JSON) y enviarlos a Graylog para su procesamiento.
* **Configuración Base:**
    * **En el Agente (VMs cliente):** Se configura el archivo `nxlog.conf` para definir Input (qué archivos leer), Output (la dirección IP y puerto del servidor Graylog) y el formato de salida (usualmente GELF o JSON).
    * **En el Servidor (VM Graylog):** Se debe configurar Graylog para que "escuche" (Input) los logs que envía Nxlog y los escriba en la base de datos (MongoDB).
* **Lugar en la arquitectura:** Instalados en todas las VMs Windows dado su compatibilidad con sistemas legacy que se quieren monitorear (servidores de la DMZ, máquinas en VLANs, etc.).

### Gestor de Eventos e Información de Seguridad (SIEM) - Terceros

**Graylog**
* **Uso:** Es una plataforma de gestión centralizada de logs (SIEM). Su propósito es recolectar, parsear (analizar y estructurar) y almacenar grandes volúmenes de logs de toda la infraestructura (enviados por agentes como Nxlog). Se utiliza para auditorías de seguridad, análisis forense, detección de amenazas y troubleshooting de aplicaciones en tiempo real.
* **Configuración Base:** Se instala el servidor Graylog. Se configuran "Inputs" (ej. un listener GELF o Syslog) para recibir los logs. Se conecta Graylog a sus dos bases de datos requeridas: MongoDB (para la configuración) y Elasticsearch/OpenSearch (para almacenar los logs). Se crean "Streams" para clasificar logs y "Alertas" para notificar sobre eventos específicos.
* **Lugar en la arquitectura:** Se instala en una VM dedicada dentro de la DMZ/Servicios (192.168.100.0). Los agentes Nxlog y rsyslog de todas las VMs apuntan a la IP de esta VM para enviar sus logs. El personal de IT y Admin (VLAN 10 y 2) accede a su interfaz web.

**MongoDB**
* **Uso:** Es una base de datos de configuración requerida por Graylog. (Aclaración importante: MongoDB no almacena los mensajes de log en sí, esa función la cumple Elasticsearch/OpenSearch). MongoDB se usa exclusivamente para guardar toda la metadata de configuración de Graylog, como cuentas de usuario, permisos, definiciones de "Streams", dashboards, "Extractors" y alertas.
* **Configuración Base:** Se instala el servicio de MongoDB. Se crea una base de datos y un usuario específico para que Graylog pueda conectarse. La cadena de conexión (`mongodb_uri`) se especifica en el archivo de configuración de Graylog (`graylog.conf`) para enlazar ambos servicios.
* **Lugar en la arquitectura:** Se instala en la misma VM que el servidor Graylog (192.168.100.0). Solo necesita ser accesible por el propio servicio de Graylog, por lo que su puerto (por defecto 27017) puede estar cerrado al resto de la red.

### Linea OT

**OpenPLC Editor:**
* **Link de descarga:** OpenPLC Download
* **Uso:** Es el Entorno de Desarrollo Integrado (IDE) o software de ingeniería. Se utiliza para crear, programar y depurar la lógica de control (en Ladder Logic, Function Block Diagram, etc.) que gobernará el proceso industrial.
* **Configuración Base:** Instalación estándar en una estación de trabajo de ingeniería. Se usa para escribir el programa y luego cargarlo (vía red) a la VM que ejecuta OpenPLC Runtime.
* **Lugar en la arquitectura:** Instalado en una PC de la VLAN Corp (VLAN 30), desde donde el ingeniero diseña la automatización.

**OpenPLC Runtime:**
* **Link de descarga:** OpenPLC Download
* **Uso:** Es el "Soft PLC" o controlador lógico programable en software. Su función es ejecutar en tiempo real el programa de control (hecho en el Editor) y comunicarse con el hardware o la simulación de la planta (Factory I/O) usando protocolos industriales como Modbus/TCP.
* **Configuración Base:** Se instala como una VM dedicada dentro de Proxmox. Se le asigna una IP estática y se configura para cargar el programa compilado desde el OpenPLC Editor. Debe configurarse para escuchar peticiones Modbus/TCP desde Factory I/O.
* **Lugar en la arquitectura:** Se ejecuta como una VM en Proxmox, asignada a la VLAN OT (192.168.30.0). Actúa como el "cerebro" que controla la simulación que corre en la VLAN 30.

**Factory I/O:**
* **Link de descarga:** Factory I/O Download
* **Uso:** Es el software de simulación de entorno industrial 3D (a veces llamado "Digital Twin"). Proporciona la representación visual y física de la línea de producción (sensores, actuadores, cintas transportadoras).
* **Configuración Base:** Instalado en la PC de Línea de Producción. Se configura el driver de comunicación (ej. Modbus TCP/IP Server) para que se conecte a la dirección IP del servidor OpenPLC Runtime (en VLAN 40). Esto enlaza las señales virtuales (sensores/actuadores) con la lógica del PLC.
* **Lugar en la arquitectura:** Se ejecuta en la PC Línea de Producción (PC MSI), la cual reside físicamente en la VLAN LineaProd (192.168.40.0).

**SCADA-LTS:**
* **Link de descarga:** SCADA LTS Download
* **Uso:** Servir como el sistema de Supervisión, Control y Adquisición de Datos. Su función es proporcionar una interfaz gráfica de usuario (HMI) centralizada para que los operadores puedan monitorear en tiempo real (ver estados, gráficas) y controlar (enviar comandos) el proceso industrial simulado en Factory I/O y ejecutado por OpenPLC Runtime.
* **Configuración Base:** La configuración de las "Fuentes de Datos" (Data Sources) para conectarse al PLC y la "Base de Datos" (MySQL). Creación de las "Vistas Gráficas" (HMIs).
* **Implementación en la Red:** Actúa como el "centro de control y monitoreo" de la red OT. Se conecta al OpenPLC Runtime (VLAN 30) mediante un data source (Modbus/TCP) para leer y escribir valores de las variables del PLC (tags). A su vez, utiliza MySQL como su base de datos backend.

**MySQL:**
* **Uso (Propósito):** Funciona como la base de datos histórica y de configuración para el sistema SCADA-LTS.
* **Implementación en la Red:** Su único fin en este contexto es almacenar todos los datos que SCADA-LTS necesita para operar, lo cual incluye:
    * Datos Históricos: Valores de los tags a lo largo del tiempo (para gráficas).
    * Alarmas: Un registro de todas las alarmas generadas.
    * Configuración: Definiciones de vistas, usuarios, permisos y data sources.
* **Configuración Base:** Se instala en la misma VM que SCADA-LTS (VLAN 30). Se crea una base de datos (ej. `scada_lts`) y un usuario específico que SCADA-LTS usará para conectarse y operar.