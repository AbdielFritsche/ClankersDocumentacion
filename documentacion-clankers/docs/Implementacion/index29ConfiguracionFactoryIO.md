---
slug: /configuracion-factoryio
title: Configuración FactoryIO
sidebar_label: Configuración FactoryIO
---

## Guía de Factory I/O con OpenPLC (Modbus Server)

Esta guía te enseña cómo usar **Factory I/O** como simulador 3D de procesos industriales y conectarlo a **OpenPLC** mediante **Modbus TCP/IP**, permitiéndonos crear y probar escenarios de automatización sin necesidad de hardware físico.


### ¿Qué es Factory I/O?

**Factory I/O** es un **simulador 3D en tiempo real** de procesos industriales. Te permite:

-  Simular líneas de producción, sistemas de transporte, robots, sensores, actuadores
-  Visualizar tu lógica de control en 3D sin hardware físico
-  Probar escenarios complejos de forma segura
-  Aprender automatización industrial de forma visual e interactiva
-  Conectarse a PLCs reales o virtuales mediante protocolos industriales estándar

### Casos de Uso Comunes:
- **Educación:** Enseñar conceptos de automatización
- **Prototipado:** Validar lógica antes de implementar en hardware real
- **Entrenamiento:** Practicar programación de PLCs
- **Desarrollo:** Crear y depurar programas complejos sin riesgo

> **Nota:** Factory I/O es software **comercial** (no gratuito), pero ofrece una **demo gratuita** con algunas limitaciones y una **licencia educativa** más accesible.

---

### Arquitectura de la Conexión

#### Cómo Funciona:

```
┌─────────────────┐         Modbus TCP/IP          ┌──────────────────┐
│   Factory I/O   │ ◄────────────────────────────► │   OpenPLC        │
│  (Modbus Server)│          (Puerto 502)          │ (Modbus Master)  │
│                 │                                │                  │
│  - Sensores     │                                │  - Lógica LD/FBD │
│  - Actuadores   │                                │  - Variables I/O │
│  - Escena 3D    │                                │  - Control       │
└─────────────────┘                                └──────────────────┘
```

**Roles:**
- **Factory I/O:** Actúa como **Modbus Server** (Maestro), simulando el hardware físico
- **OpenPLC:** Actúa como **Modbus Slave Device** (Esclavo), ejecutando la lógica de control segun las banderas que activen los controles fisicos de la simulación (sensores, timers, etc.)

#### Ventajas de Esta Configuración:
1. **Sin hardware:** Pruebas tu lógica sin comprar sensores, actuadores, PLCs físicos
2. **Seguro:** No hay riesgo de dañar equipos costosos
3. **Rápido:** Itera y prueba cambios en segundos
4. **Realista:** Factory I/O simula física realista (gravedad, inercia, colisiones)
5. **Educativo:** Visualiza exactamente qué hace tu código

---

### Requisitos del Sistema

#### Factory I/O (PC con Windows):
- **SO:** Windows 10/11 (64-bit)
- **Procesador:** Intel i5 o equivalente
- **RAM:** 8 GB mínimo (16 GB recomendado)
- **Gráficos:** GPU dedicada (NVIDIA/AMD) recomendada para escenas complejas
- **Espacio:** ~2 GB

#### OpenPLC Runtime:
- Puede correr en:
  - La misma PC que Factory I/O (localhost)
  - Otra PC en la red local
  - Raspberry Pi conectada a la red
  - Máquina virtual Linux

:::info Importante
Lo mas sencillo es configurar en el mismo equipo FactoryIO y OpenPLC, sin embargo es posible comunicarlos en equipos diferentes, dicha arquitectura requiere configuraciones adicionales, en nuestro caso se maneja en computadoras separadas, siendo una de ellas una maquina virtual en Proxmox. Para más referencia vease la configuración de Proxmox, Router y Switch Cisco asi como F5
:::

---

### Instalación

#### Instalar Factory I/O

1. Ve a [FactoryIO Download](https://factoryio.com)
2. Descarga el instalador (requiere registro)
3. Ejecuta el instalador y sigue las instrucciones
4. Al abrir por primera vez:
   - Selecciona **Demo Mode** (gratuito con limitaciones) o introduce tu licencia
   - Completa el tutorial introductorio (recomendado)

#### Instalar OpenPLC Runtime (Windows)

Si no lo tienes instalado:

1. Descarga el instalador desde [OpenPLC Runtime](https://autonomylogic.com/docs/installing-openplc-runtime-on-windows)
2. Ejecuta el archivo `.exe`
3. Sigue el asistente de instalación
4. Al finalizar, el Runtime se iniciará automáticamente
5. Abre tu navegador y ve a `http://localhost:8080`
6. Login:
   - Usuario: `openplc`
   - Contraseña: `openplc`

> **Seguridad:** Cambia la contraseña por defecto en **Settings > Users**.

#### Instalar OpenPLC Editor

1. Descarga desde [https://www.openplcproject.com/plcopen-editor](https://autonomylogic.com/download-windows)
2. Ejecuta el instalador
3. Abre el Editor para verificar que funciona

---

:::info Importante
Para más detalle en la configuración y funcionamiento de OpenPLC, la sección dedicada al software se encuentra previamente a esta de FactoryIO. Si aun no tienes configurado OpenPLC, considera verla previamente y volver a la seccion de FactoryIO.
:::

### Configurar Factory I/O como Modbus Server

#### Seleccionar un Escenario

1. Abre **Factory I/O**
2. En el menú principal, haz clic en **File > Open Sample** (o `Ctrl+O`)
3. Para empezar, selecciona un escenario simple como:
   - **"Sorting by Height"** (clasificación por altura)
   - **"Palletizer"** (paletizador)
   - **"Pick and Place"** (recoger y colocar)

> **Tip:** FactoryIO tiene escenarios personalizados para practicar, pero si es de tu deseo puedes crear tu propio escenario y codigo para el mismo. Este apartado se enfoca más en conectar y configurar FactoryIO con OpenPLC que en generar un espacio operativo.

#### Configurar el Driver Modbus TCP/IP

1. En Factory I/O, ve a **File > Drivers** (o presiona `F4`)
2. En la ventana de Drivers, verás una lista de controladores disponibles
3. Busca **"Modbus TCP/IP Server"** en la lista
4. Haz clic en **"Modbus TCP/IP Server"**
5. Haz clic en el botón **"CONFIGURATION"** (⚙️)

**Parámetros de Configuración:**

| Parámetro | Valor Recomendado | Descripción |
|-----------|-------------------|-------------|
| **Host** | `127.0.0.1` | IP local (localhost) si OpenPLC está en la misma PC |
| **Port** | `502` | Puerto estándar de Modbus TCP |
| **Slave ID** | `1` | ID del dispositivo Modbus |
| **Timeout** | `5000` ms | Tiempo de espera para conexiones |

6. Haz clic en **"OK"** para guardar

7. De vuelta en la ventana de Drivers, haz clic en **"CONNECT"**

> **Verificación:** Si la conexión es exitosa, verás el estado cambiar a **"Connected"** (Conectado) con un ícono verde.

> **Error Común:** Si dice "Failed to bind socket", verifica que:
> - Nada más esté usando el puerto 502
> - El firewall de Windows no esté bloqueando el puerto
> - Factory I/O tenga permisos de administrador

:::info Warning
Verifica que los valores de las variables (Coils, Registers, etc.) tengan la misma cantidad que el Slave Device de OpenPLC que creaste. Además la direccion IP y Puerto del mismo tienen que ser exactamente iguales que las que son declaradas en FactoryIO. De lo contrario no habra comunicación.
:::

#### Mapear las Variables (Tags)

Factory I/O usa un sistema de **Tags** para identificar cada sensor y actuador en la escena.

1. En la ventana de Drivers, haz clic en la pestaña **"TAGS"**
2. Verás una tabla con todas las variables disponibles en la escena:
   - **Name:** Nombre descriptivo (Ej: "Emitter at entry", "Conveyor")
   - **Type:** Tipo de variable (Digital Input, Digital Output, Analog Input, etc.)
   - **Address:** Dirección Modbus asignada automáticamente

**Tipos de Tags:**

| Tipo Factory I/O | Tipo Modbus | Ejemplo |
|------------------|-------------|---------|
| **Digital Input** | Discrete Input | Sensor de presencia, sensor inductivo |
| **Digital Output** | Coil | Motor ON/OFF, válvula, luz indicadora |
| **Analog Input** | Input Register | Sensor de distancia, medidor de flujo |
| **Analog Output** | Holding Register | Velocidad de motor variable, posición |

> **Importante:** Factory I/O asigna direcciones automáticamente. Toma nota de las direcciones para configurar OpenPLC después.

**Ejemplo de Mapeo Típico:**
```
Digital Inputs (Sensores) → Modbus Addresses 0-99
Digital Outputs (Actuadores) → Modbus Addresses 0-99
Analog Inputs → Modbus Addresses 0-99
Analog Outputs → Modbus Addresses 0-99
```

---

### Configurar OpenPLC como Modbus Master

Ahora configuramos OpenPLC para que "hable" con Factory I/O.

#### Acceder al Runtime

1. Abre tu navegador
2. Ve a `http://localhost:8080`
3. Login con tus credenciales

#### Agregar Factory I/O como Slave Device

1. En el menú izquierdo, haz clic en **"Slave Devices"**
2. Haz clic en el botón **"Add Device"** (arriba)
3. Completa el formulario:

| Campo | Valor |
|-------|-------|
| **Device Name** | `FactoryIO` (o el nombre que prefieras) |
| **Device Protocol** | Selecciona **"Generic Modbus TCP Device"** |
| **Slave ID** | `1` (debe coincidir con Factory I/O) |
| **IP Address** | `127.0.0.1` (localhost si está en la misma PC) |
| **IP Port** | `502` |
| **Timeout** | `1000` ms |

4. Haz clic en **"Save Device"**

> **Verificación:** El dispositivo aparecerá en la lista con un indicador de estado. Si está verde/conectado, ¡perfecto!

#### Configurar el Mapeo de I/O

Ahora debemos decirle a OpenPLC qué variables PLC corresponden a qué direcciones Modbus en Factory I/O.

1. En la lista de Slave Devices, haz clic en el botón **"Configure"** (⚙️) del dispositivo `FactoryIO`
2. Verás una tabla de mapeo con columnas:
   - **PLC Location:** Variable en tu programa OpenPLC
   - **Modbus Address:** Dirección en Factory I/O
   - **Function Code:** Tipo de operación Modbus
   - **Size:** Tamaño en bits/registros

**Function Codes Comunes:**

| Function Code | Descripción | Uso en Factory I/O |
|---------------|-------------|--------------------|
| **01 - Read Coils** | Leer salidas digitales (solo lectura) | No común |
| **02 - Read Discrete Inputs** | Leer entradas digitales | **Sensores** (At sensor, Entry sensor, etc.) |
| **03 - Read Holding Registers** | Leer registros (lectura/escritura) | Variables analógicas |
| **04 - Read Input Registers** | Leer registros de entrada | **Sensores analógicos** |
| **05 - Write Single Coil** | Escribir salida digital | **Actuadores digitales** (Conveyors, Pushers, etc.) |
| **06 - Write Single Register** | Escribir registro | **Actuadores analógicos** (velocidad, posición) |

**Ejemplo de Configuración para "Sorting by Height":**

Supongamos que Factory I/O tiene:
- **Sensor "At entry"** → Discrete Input, Address `0`
- **Sensor "At exit"** → Discrete Input, Address `1`
- **Conveyor** → Coil, Address `0`

Configuras en OpenPLC:

| PLC Location | Modbus Address | Function Code | Size |
|--------------|----------------|---------------|------|
| `%IX100.0` | `0` | `02` (Read Discrete Inputs) | `1` |
| `%IX100.1` | `1` | `02` (Read Discrete Inputs) | `1` |
| `%QX100.0` | `0` | `05` (Write Single Coil) | `1` |

> **Convención de Direcciones:**
> - Usa `%IX100.x` para entradas digitales (sensores)
> - Usa `%QX100.x` para salidas digitales (actuadores)
> - Usa `%IW100` para entradas analógicas
> - Usa `%QW100` para salidas analógicas

3. Haz clic en **"Save Configuration"**

---


### Cargar y Ejecutar el Programa

#### Subir el Programa al Runtime

1. En el navegador, abre `http://localhost:8080`
2. Ve a **"Programs"** en el menú izquierdo
3. Haz clic en **"Browse..."** y selecciona `FactoryIO_Sorting.st`
4. Haz clic en **"Upload Program"**
5. Espera a que compile (verás "Program uploaded successfully!")

#### Iniciar el PLC

1. Ve a **"Dashboard"**
2. Verifica que el dispositivo `FactoryIO` esté conectado (debe aparecer en verde)
3. Haz clic en **"Start PLC"**

> **Éxito:** El PLC ahora está corriendo y comunicándose con Factory I/O.

#### Probar en Factory I/O

1. Vuelve a **Factory I/O**
2. Haz clic en **"Play"** (▶️) para iniciar la simulación
3. Observa:
   - Cuando una pieza llega al `Sensor_Entry`, el `Conveyor` debe encenderse
   - El conveyor moverá la pieza
   - Cuando la pieza llega al `Sensor_Exit`, puedes detener el conveyor (si agregaste esa lógica)

> **Tip:** Usa la vista de cámara libre (tecla `F`) para moverte por la escena 3D.

---

### Monitoreo y Debugging

#### Monitorear Variables en Tiempo Real

En OpenPLC Runtime:

1. Ve a **"Monitoring"** en el menú
2. Verás una tabla con todas las variables y sus valores actuales
3. Observa cómo cambian cuando interactúas con Factory I/O

#### Forzar Valores (Testing)

Para probar sin depender de la simulación:

1. En la sección **"Monitoring"**
2. Encuentra la variable que quieres forzar (Ej: `Sensor_Entry`)
3. Haz clic en el checkbox **"Force"**
4. Ingresa un valor (Ej: `1` para TRUE)
5. Observa el efecto en Factory I/O

> **Advertencia:** Recuerda desactivar el "Force" después de probar, o tu programa no responderá a los sensores reales.

#### Ver el Estado en Factory I/O

Factory I/O muestra el estado de I/O en tiempo real:

1. En Factory I/O, presiona `F3` para abrir **"Scene Objects"**
2. Expande los nodos de sensores y actuadores
3. Verás el estado actual (ON/OFF, valores analógicos)
4. Los objetos activos se resaltan en la escena 3D

---

### Escenarios Personalizados

Una de las grandes ventajas de Factory I/O es poder crear tus propios escenarios.

#### Crear un Escenario Nuevo

1. En Factory I/O, ve a **File > New Scene**
2. Aparecerá una escena vacía
3. Presiona `F2` para abrir la **"Parts Palette"** (paleta de componentes)

#### Agregar Componentes

La paleta está organizada en categorías:

#### **Transportadores (Conveyors):**
- **Straight Conveyor:** Banda recta
- **Curve Conveyor:** Banda curva
- **Lift Conveyor:** Elevador
- **Transfer Conveyor:** Transferidor

#### **Sensores (Sensors):**
- **Vision Sensor:** Detecta objetos por color, altura, forma
- **Diffuse Sensor:** Sensor de proximidad difuso
- **Retroreflective Sensor:** Sensor retroreflectivo
- **At Sensor:** Sensor de posición exacta

#### **Actuadores (Actuators):**
- **Pusher:** Empujador neumático
- **Stopper:** Freno/detención
- **Remover:** Remueve piezas de la escena
- **Sorter:** Clasificador automático

#### **Piezas (Parts):**
- **Emitter:** Generador de piezas
- **Pallet:** Pallets/tarimas
- **Box (varios tamaños):** Cajas de diferentes dimensiones


### Tips y Trucos

#### Optimización de Escenas

-  **Limita objetos activos:** Cada sensor/actuador consume recursos
-  **Usa "Removers":** Elimina piezas que ya no necesitas en la escena
-  **Reduce calidad gráfica:** Si la simulación va lenta, ve a **Options > Graphics** y baja la calidad

#### Debugging

-  **Modo paso a paso:** En Factory I/O, usa `Ctrl+P` para pausar y avanzar frame por frame
-  **Vista de Tags:** Presiona `F3` para ver todos los I/O en tiempo real
-  **Logs:** OpenPLC guarda logs en `C:\OpenPLC\openplc.log` (Windows)

#### Buenas Prácticas

-  **Nombra descriptivamente:** Usa nombres claros para tags y variables
-  **Documenta tu código:** Agrega comentarios en el programa PLC
-  **Versiona tus escenas:** Guarda versiones de tu escena con nombres incrementales
-  **Prueba incrementalmente:** Agrega un componente a la vez y prueba

#### Reutilizar Escenas

Factory I/O permite guardar "plantillas" de componentes:

1. Selecciona un grupo de objetos
2. Clic derecho → **"Create Prefab"**
3. Dale un nombre
4. Ahora puedes reutilizarlo en otras escenas desde la paleta

---


###  Recursos Oficiales

#### Factory I/O
- **Sitio Web:** [FactoryIO](https://factoryio.com)
- **Documentación:** [FactoryIO Documentacion](https://docs.factoryio.com)
- **Tutoriales en Video:** [Canal de YouTube Factory I/O](https://www.youtube.com/@RealgamesPt)

#### OpenPLC
- **Sitio Web:** [OpenPLC](https://www.openplcproject.com)
- **Foro Comunitario:** [OpenPLC Foros](https://openplc.discussion.community)

---