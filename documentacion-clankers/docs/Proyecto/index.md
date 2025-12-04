---
title: Justificación y Objetivos
sidebar_position: 1
---

## El Panorama: La Nueva Frontera del Riesgo

La industria manufacturera se encuentra en una encrucijada. Durante décadas, las redes de Tecnología de Operaciones (OT) que controlan la maquinaria física como PLCs, robots y sistemas CNC operaron en un completo aislamiento, priorizando la disponibilidad y la seguridad física por encima de todo.

Hoy, la Industria 4.0 y la necesidad de análisis de datos en tiempo real han forzado una convergencia sin precedentes entre las redes IT (Tecnología de la Información) y OT. Esta conexión, si bien es vital para la competitividad, ha abierto una caja de Pandora, exponiendo la maquinaria crítica a ciberataques para los que nunca fue diseñada.

El crecimiento de los ataques a la industria es exponencial. Ya no se trata de simples ataques de ransomware que cifran servidores de IT; ahora, los actores maliciosos tienen en la mira la infraestructura física:

* **Ataques Dirigidos:** Grupos de ciberdelincuentes y actores estado-nación están desarrollando malware específico, como PIPEDREAM o TRITON, diseñado no para robar datos, sino para **manipular o sabotear controladores lógicos programables (PLCs)**.
* **Paralización de la Producción:** Incidentes como el de Colonial Pipeline (aunque fue un ataque a IT que paralizó OT) o los paros en plantas de gigantes automotrices demuestran que detener la producción es un objetivo primario y altamente lucrativo.
* **Pérdida de Confianza:** Un ataque que altere sutilmente el firmware de un PLC en una línea de cabezas de motor o una CMM podría llevar a la producción de miles de piezas defectuosas, causando fallos catastróficos, retiradas masivas (recalls) y un daño irreparable a la reputación.

## Marco Referencial: El Costo de la Inactividad Industrial

Para dimensionar la urgencia de este proyecto, es necesario analizar el impacto financiero de los fallos operativos. Según el reporte *“The True Cost of Downtime 2024”* de SIEMENS, la inactividad no planificada ha dejado de ser un mero inconveniente operativo para convertirse en una amenaza financiera directa a la rentabilidad global.

Actualmente, las pérdidas anuales para las principales empresas industriales ascienden a **$1.4 billones de dólares**, lo que representa un impacto equivalente al **11% de sus ingresos anuales**. Este escenario exige una mitigación inmediata basada en los siguientes factores críticos:

### 1. Vulnerabilidad Extrema del Sector Automotriz
Este sector presenta la mayor exposición al riesgo financiero. El costo de detener una línea de producción en una planta de gran envergadura ha alcanzado cifras alarmantes:
* **Costo por hora:** $2.3 millones de dólares.
* **Pérdida por segundo:** Más de $600 dólares.
* **Pérdida anual estimada:** $750 millones de dólares por planta.

### 2. Escalada de Costos Desproporcionada
El impacto económico de los paros técnicos crece a un ritmo que supera los indicadores macroeconómicos.
* Mientras la inflación acumulada en EE.UU. (2019-2023) fue del 19%, el costo operativo de una hora de inactividad en el sector automotriz aumentó un **113%** en el mismo periodo.
* En la industria pesada, este costo se ha cuadruplicado, registrando un aumento del **319%**.

### 3. Complejidad en la Recuperación
La sofisticación de los sistemas actuales ha extendido los tiempos de respuesta ante fallos. El tiempo promedio para reiniciar operaciones tras un incidente ha aumentado a **81 minutos**.
Bajo el análisis de *Expectativa de Pérdida Única (SLE)*, esto significa que un solo evento de interrupción genera una pérdida promedio superior a los **$3.1 millones de dólares**.

### 4. Oportunidad de Rentabilidad y Eficiencia
La implementación de arquitecturas robustas ante ataques y fallas, así como el mantenimiento predictivo, no solo mitiga riesgos, sino que desbloquea valor. Se estima que la adopción tecnológica para reducir la inactividad puede generar:
* **Ahorros globales:** $388 mil millones de dólares mediante mejoras en productividad.
* **Reducción de costos:** $233 mil millones de dólares en mantenimiento.
* **Recuperación de tiempo:** Hasta 2.1 millones de horas productivas al año.

## El Contexto: Vulnerabilidad en la Cadena de Suministro

Considerando los costos expuestos anteriormente, nuestro escenario se centra en un proveedor **Tier 1 automotriz**. Este no es un objetivo cualquiera; la industria automotriz opera con un modelo *Just-in-Time* (JIT) que exige una disponibilidad operativa del 99.999%.

Un paro de línea en un proveedor Tier 1 no solo detiene su propia fábrica; detiene la planta de ensamblaje final de su cliente (OEM), generando penalizaciones que, como vimos en el marco referencial, ascienden a millones de dólares por hora.

El vector de ataque más probable no es un hacker irrumpiendo por un firewall de OT. Es un ataque de ingeniería social:

1.  Un correo de phishing exitoso en la red corporativa (IT).
2.  Un actor interno que introduce una USB maliciosa en una estación de ingeniería.

Estos puntos de entrada, aparentemente inofensivos, se convierten en la cabeza de playa para pivotar hacia la red OT, escalar privilegios y, finalmente, tomar control del "cerebro" de la maquinaria: el PLC.


## El Propósito Real del Laboratorio

El propósito de este proyecto es demostrar de forma irrefutable que este escenario de ataque no es teórico, sino una amenaza práctica y presente.

No estamos construyendo un simple entorno de pruebas. Estamos creando un "gemelo digital" de una red industrial viva para simular un ataque de sabotaje de firmware dirigido y, lo más importante, diseñar, implementar y validar una arquitectura de defensa robusta basada en los estándares de la industria (como el Modelo Purdue e ISA/IEC 62443).

Este laboratorio es la herramienta para responder a las preguntas críticas que la alta dirección debe hacerse:
* *¿Somos vulnerables a un ataque de phishing que termine parando la línea de producción?*
* *¿Podemos detectar a un actor interno modificando el programa de un PLC?*
* *¿Funcionan realmente nuestros controles de segmentación de red?*

## Objetivos Específicos

Para cumplir con este propósito, el proyecto se divide en los siguientes objetivos clave:

1.  **Construir:** Replicar un entorno industrial a escala, incluyendo una red corporativa (IT) y una red de control (OT) segregadas, con PLCs Allen-Bradley virtualizados.
2.  **Simular (Atacar):** Ejecutar una cadena de ataque completa (`kill chain`) desde el phishing inicial hasta la modificación del firmware del PLC, demostrando el impacto tangible (ej. "detener un motor" o "dar una falsa lectura de calidad").
3.  **Implementar (Defender):** Desplegar una arquitectura de defensa en capas, incluyendo segmentación de red estricta (VLANs y firewalls), monitoreo de tráfico de red OT y control de acceso riguroso.
4.  **Validar:** Repetir el ataque contra la red defendida para demostrar cómo las medidas de seguridad previenen, detectan y contienen la amenaza, proporcionando un modelo de defensa comprobado.
5.  **Documentar:** Presentar todos los hallazgos, configuraciones y guías en este sitio, sirviendo como un recurso de capacitación y un plan de acción aplicable a entornos de producción reales.