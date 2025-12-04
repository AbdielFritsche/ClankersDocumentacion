---
slug: /met-ataque
title: Metodologia del ataque
sidebar_position: 1
---

Esta sección detalla los procedimientos técnicos, herramientas y tácticas empleadas para comprometer la infraestructura OT simulada. Se presentan dos vectores de ataque distintos: Ingeniería Social (Acceso Inicial) y Fuerza Bruta (Compromiso de Servicios).

---

## Ataque: Shell Inversa vía Ingeniería Social

En este escenario se simula un ataque dirigido a la infraestructura OT, utilizando ingeniería social para establecer una conexión reversa, escalar privilegios y ganar control sobre la estación de ingeniería encargada de gestionar el PLC.


### Contexto Operacional y Objetivos

El propósito de este ejercicio es demostrar la cadena de compromiso completa (**Kill Chain**), desde la intrusión inicial hasta la capacidad de interrupción del proceso industrial.

* **Arquitectura:** Red segmentada basada en el Modelo Purdue (ISA-95).
* **Ubicación:** Segmento aislado correspondiente al Nivel 2 (Supervisión/HMI) y Nivel 1 (Control/PLC).
* **Activo Comprometido:** Estación de Trabajo del Administrador OT (Windows 10 Enterprise x64).
* **Servicio Crítico:** Software OpenPLC para la gestión de la simulación industrial.

**Metas del ataque:**
1.  Ganar un acceso inicial a la computadora del administrador del sector OT.
2.  Establecer persistencia mediante acceso remoto.
3.  Escalar privilegios a nivel administrativo (SYSTEM).
4.  Modificar o detener el PLC para comprometer la producción.

### Reconocimiento y Seleccion de Objetivo

* **Objetivo:** Identificación de perfiles críticos dentro del organigrama de OT.
* **Lógica de Selección:** Se selecciona al **Director del área OT** como objetivo de alto valor (High-Value Target) por:
    * Poseer credenciales con privilegios sobre sistemas SCADA/HMI.
    * Tener visibilidad de red cruzada (IT/OT).
    * Tener acceso legítimo a interfaces de programación de PLC.

### Cadena de Ataque (Cyber Kill Chain)

#### FASE 1: Armamento (Weaponization)
Creación del artefacto malicioso diseñado para evadir detecciones básicas.

* **Herramienta:** Framework Metasploit (`msfvenom`).
* **Payload:** `windows/x64/meterpreter/reverse_tcp` (Arquitectura x64 para estabilidad).
* **Estrategia de Evasión:** El ejecutable es renombrado como `Update_PLC_v2.exe`.

> **Nota Técnica:** Se pueden aplicar técnicas de *file extension spoofing* (ej. caracteres RTLO) para que el archivo parezca un controlador `.ST` (Structured Text) en lugar de un `.exe`, explotando la confianza del operador.

#### FASE 2: Entrega (Delivery)
Inserción del payload mediante **Spear Phishing**.

* **Asunto:** "URGENTE: Actualización crítica de seguridad para controladores PLC".
* **Pretexto:** Uso de terminología técnica para generar confianza y urgencia ("Instalar inmediatamente para evitar fallos").

#### FASE 3: Explotación (Exploitation)
Ejecución de código y establecimiento de C2.

1.  La víctima ejecuta la "actualización".
2.  El payload inicia una conexión TCP saliente (Reverse Shell) hacia el atacante.
3.  **Listener (Atacante):**
    * Herramienta: `msfconsole`
    * Configuración: `IP 192.168.100.68`, `Puerto 4444`.
4.  **Resultado:** Sesión de Meterpreter con integridad media.

#### FASE 4: Escalada de Privilegios
Elevación de "Usuario Estándar" a "SYSTEM".

* **Técnica:** Bypass de UAC mediante Hijacking del Registro (`fodhelper.exe`).
* **Procedimiento:**
    1.  Verificación de pertenencia al grupo de administradores.
    2.  Ejecución del módulo `exploit/windows/local/bypassuac_fodhelper`.
* **Criterio de Éxito:** Comando `getuid` devuelve `NT AUTHORITY\SYSTEM`.

#### FASE 5: Persistencia
Asegurar el reingreso al sistema.

* **Método:** Habilitación forzada de RDP y creación de usuario "Backdoor".
* **Herramienta:** Script `getgui`.
* **Comando:**
    ```bash
    run getgui -e -u soporte_it -p P@ssw0rd123!
    ```
* **Acciones:** Habilita puerto 3389, crea excepción en Firewall y añade el usuario al grupo de Administradores.

#### FASE 6: Acción sobre el Objetivo
* Enumeración de red interna para localizar OpenPLC.
* Identificación de archivos de proyecto (`.st`, `.ladder`).
* Detención del servicio o inyección de lógica alterada.

### Herramientas y Tecnologías

* **Kali Linux:** SO ofensivo.
* **Nmap:** Escaneo de red.
* **Metasploit Framework:** Generación de payloads y gestión de sesiones.
* **Meterpreter:** Payload avanzado (inyección en memoria).

### Limitaciones Observadas

* **Dependencia de Firewall:** Fue necesario crear excepciones manuales en Windows Defender para la conexión inversa.
* **Arquitectura:** Los exploits de 32 bits fallaron en el sistema de 64 bits; fue crítico ajustar el payload.
* **Firmas:** Los payloads *vanilla* de `msfvenom` son detectados por antivirus actualizados sin ofuscación avanzada.

### Metricas de Éxito

| Métrica |  Estado  | Descripción |
| :--- | :----: | :--- |
| **Acceso Inicial** | ✅ Logrado | Conexión remota establecida tras ejecución del usuario. |
| **Escalada de Privilegios** | ✅ Logrado | Identidad SYSTEM obtenida vía evasión de UAC. |
| **Persistencia** | ✅ Logrado | Acceso RDP habilitado independiente de Meterpreter. |
| **Control de OT** | ✅ Logrado | Acceso de escritura sobre configuración OpenPLC. |
| **Sigilo (Evasión)** | ⚠️ Parcial | Requirió modificaciones en defensas (Firewall) que generarían alertas reales. |

## Ataque: Fuerza Bruta contra Servicio PLC

Escenario donde se busca obtener control directo sobre el servicio OpenPLC explotando credenciales débiles o por defecto mediante ataques automatizados.

### Contexto y Objetivos

* **Activo Comprometido:** Interfaz web del servicio OpenPLC (Puerto 8080).
* **Metas:**
    1.  Enumerar servicios vulnerables.
    2.  Ejecutar fuerza bruta contra la autenticación.
    3.  Ganar acceso a la interfaz web.
    4.  Impactar la línea de producción modificando la lógica.

### Reconocimiento
El atacante explora la topología para identificar versiones de servicios y mecanismos de autenticación. Se detecta el panel de login de OpenPLC susceptible a ataques de diccionario.

### Cadena de Ataque



#### FASE 1: Armamento
Preparación de diccionarios.
* **Técnica:** Uso de lista personalizada con patrones industriales (`admin`, `plc`, `siemens`, `1234`) y credenciales por defecto (`openplc`).

#### FASE 2: Entrega
Identificación del vector.
* **Vector:** Formulario de autenticación HTTP (POST requests).
* **Análisis:** Uso de `CURL` para entender los parámetros de login.

#### FASE 3: Explotación
Ejecución del ataque de fuerza bruta.
* **Herramienta:** **Hydra** (THC Hydra).
* **Comando (ejemplo conceptual):**
    ```bash
    hydra -l openplc -P /usr/share/wordlists/rockyou.txt 192.168.100.59 http-post-form "/login:user=^USER^&pass=^PASS^:F=Login failed"
    ```
* **Resultado:** Hydra identifica credenciales válidas.

#### FASE 4: Escalada y Persistencia
* **Acción:** Tras ingresar como administrador legítimo, el atacante crea un **nuevo usuario falso** con permisos administrativos para operar sin levantar sospechas sobre la cuenta principal.

#### FASE 5: Acción sobre el Objetivo
* Desde la cuenta fraudulenta, se carga un programa modificado (`malicious.st`) en el PLC.
* **Impacto:** La línea de producción fabrica lotes defectuosos, generando pérdidas económicas directas.

###  Limitaciones
* **WAF / Firewall:** El dispositivo F5 BIG-IP (simulado o real) puede bloquear el ataque si detecta un exceso de peticiones por segundo (Rate Limiting). Se requiere optimizar los tiempos de espera entre intentos.

###  Métricas de Éxito

| Métrica | Estado | Descripción |
| :--- | :---: | :--- |
| **Obtención de Credenciales** | ✅ Logrado | Se encontraron usuario/contraseña válidos. |
| **Acceso Web** | ✅ Logrado | Inicio de sesión exitoso en OpenPLC. |
| **Impersonación** | ✅ Logrado | Creación de cuenta administrativa "backdoor". |
| **Sabotaje** | ✅ Logrado | Modificación de rutina del PLC para afectar producción. |

---

## Resultados de los Ataques

### Resultados Ataque Shell Inverso
* Acceso total (SYSTEM) a la estación de ingeniería.
* Capacidad de movimiento lateral hacia la red de control.

### Resultados Ataque Fuerza Bruta
Se obtuvieron las siguientes credenciales válidas mediante fuerza bruta:

```text
Usuario:    openplc
Contraseña: openplc
```


Hallazgos y Recomendaciones

### 1. El Factor Humano (Ataque de Shell)
El éxito del ataque dependió enteramente de la interacción del usuario. Esto demuestra que el usuario sigue siendo el eslabón más débil, independientemente de la segmentación de red.

:::tip Recomendaciones
* **Capacitación:** Entrenamiento continuo anti-phishing específico para personal de planta.
* **Mínimo Privilegio:** Retirar permisos de administrador local a los operadores de estaciones de ingeniería.
:::

### 2. Configuración de Seguridad y EDR
Durante el reconocimiento, se identificó que planear los ataques para evadir herramientas específicas (como versiones antiguas de Defender) es viable.

:::tip Recomendaciones
* **Actualización:** Mantener firmas de AV/EDR y bases de datos de IDS actualizadas en tiempo real.
* **Auditorías:** Realizar ejercicios de Red Teaming periódicos para validar la detección.
:::

### 3. Políticas de Contraseñas (Ataque Fuerza Bruta)
El uso de credenciales por defecto (`openplc`/`openplc`) permitió un compromiso trivial del sistema de control.

:::danger Recomendación Crítica
* **Gestión de Identidad:** Implementar MFA (Autenticación Multifactor) para acceso a interfaces de control.
* **Higiene:** Forzar el cambio de contraseñas por defecto durante la puesta en marcha (commissioning).
:::