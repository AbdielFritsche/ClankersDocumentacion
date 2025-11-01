---
title: Arquitectura
sidebar_label: Arquitectura del escenario
position: 4
---

## Arquitectura Lógica de Red

Esta sección cuenta con los siguientes diagramas:

- Diagrama de Bajo Nivel
- Diagrama de Alto Nivel

**Link para ver ambos diagramas:** [Lucidchart](https://lucid.app/lucidchart/04fc7cc8-1d97-4e36-8e6c-162733957f6b/view?page=0_0&invitationId=inv_79338959-8596-42f0-b228-12c3ba36f43d#)

**Link de descarga de ambos diagramas:** [Diagrama Clankers PDF](https://lucid.app/publicSegments/view/19896652-cca1-4eb2-a313-2ac3b37f02fe)

### Zonas/Segmentos de Red

**Nivel 4/5 (Red Corporativa - IT):** Zonas de Empresa y Oficina. Incluye todos los sistemas de negocio: servidores de correo, ERP, sistemas de logística y estaciones de trabajo administrativas. Es la red con mayor exposición a internet.

**Nivel 3.5 (DMZ Industrial):** Esta es una zona de amortiguamiento crítica entre la red de IT y la de OT. En lugar de ser una DMZ general, su propósito específico es mediar la comunicación segura. Aloja servidores intermediarios como un servidor de parches (WSUS) o un servidor de historiales.

**Nivel 3 (Red de Operaciones y Supervisión - OT):** Zona de Operaciones y Supervisión. Contiene los sistemas que gestionan la producción, como las estaciones de ingeniería, los sistemas SCADA y las Interfaces Humano-Máquina (HMI). Desde aquí se monitorea y se comanda el proceso.

**Nivel 2 (Red de Control de Procesos - OT):** Zona de Control de procesos. Es una red más restringida donde habitan los PLCs. La comunicación aquí es principalmente entre controladores y sistemas de supervisión.

**Nivel 1/0 (Red de Proceso y Dispositivos de Campo - OT):** Zona de Proceso. Contiene los actuadores y sensores físicos (motores, válvulas, robots, sensores de temperatura) que son directamente controlados por los PLCs.

**Zona Externa (Atacante):** Representa cualquier red no confiable, principalmente internet, desde donde se originan las amenazas externas.

## Flujo de Tráfico

### Flujos Permitidos

**Zona Externa → DMZ Industrial:**
- **Permitido:** Solo tráfico específico para acceso remoto seguro o sincronización con servicios en la nube autorizados.

**Red Corporativa (Nivel 4) → DMZ Industrial:**
- **Permitido:** Estaciones de trabajo de administradores autorizados para gestionar los servidores en la DMZ.
- **Propósito:** Permite la administración y el parcheo de los sistemas intermediarios.

**DMZ Industrial → Red de Operaciones (Nivel 3):**
- **Permitido:** Solo el servidor de parches puede iniciar conexiones hacia las estaciones de ingeniería y SCADA para actualizarlas. El servidor de historiales recibe datos de los sistemas SCADA.
- **Propósito:** Transferir datos de producción de forma segura hacia arriba y distribuir actualizaciones de forma controlada hacia abajo.

**Red de Operaciones (Nivel 3) → Red de Control (Nivel 2):**
- **Permitido:** La estación de ingeniería puede enviar (descargar) nueva lógica a un PLC. Las HMI/SCADA pueden leer y escribir en los registros de los PLCs.
- **Propósito:** Es el flujo principal para el control y monitoreo del proceso. Se debe restringir a los protocolos industriales necesarios (ej. EtherNet/IP, PROFINET).

**Red de Control (Nivel 2) → Red de Proceso (Nivel 1/0):**
- **Permitido:** Los PLCs envían comandos a los actuadores y reciben lecturas de los sensores.
- **Propósito:** Es la interacción física directa con la maquinaria.

### Flujos Denegados

- Bloquear todo el tráfico iniciado desde la Red Corporativa (IT) directamente hacia la Red de Operaciones (OT). Este es el control de seguridad más importante del modelo.
- Bloquear cualquier intento de los PLCs (Nivel 2) de iniciar comunicación hacia redes superiores (Nivel 3 o superior). Los PLCs solo deben responder a las peticiones de los sistemas de supervisión.
- Bloquear el acceso a internet desde cualquier nivel de la red OT (Niveles 0-3).