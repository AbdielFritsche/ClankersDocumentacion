---
slug: /configuracion-openplc
title: Configuración OpenPLC
sidebar_label: Configuración OpenPLC
---
## Guía Completa de Instalación y Uso de OpenPLC

Esta guía proporciona información detallada para instalar y utilizar los componentes clave del ecosistema OpenPLC: **OpenPLC Runtime** y **OpenPLC Editor**.

### Propósito de Cada Componente

Antes de instalar, es crucial entender la diferencia entre el "Runtime" y el "Editor".

#### OpenPLC Runtime
El **Runtime** es el "motor" de tu PLC. Es el software que **ejecuta** tu lógica de control en tiempo real.

* Se instala en el hardware que actuará como PLC (Ej: una Raspberry Pi, una PC con Linux, Windows, o un dispositivo Arduino).
* No se usa para *crear* programas, sino para *cargarlos y ejecutarlos*.
* Proporciona una interfaz web (Dashboard) para monitorear el PLC, configurar dispositivos esclavos (Modbus, DNP3, etc.) y cargar el programa compilado.

> **Nota:** El Runtime es multiplataforma y se puede instalar en una amplia variedad de dispositivos. Ver la sección de "Plataformas Soportadas" más abajo.

#### OpenPLC Editor
El **Editor** es el Entorno de Desarrollo Integrado (IDE). Es el software que usas para **crear, escribir y compilar** tu lógica de control.

* Se installa en tu computadora de escritorio (Windows, macOS o Linux).
* Permite programar usando los lenguajes estándar de la IEC 61131-3:
    * **LD** (Ladder Logic / Lógica de Escalera)
    * **FBD** (Function Block Diagram / Diagrama de Bloques de Funciones)
    * **SFC** (Sequential Function Chart / Gráfico de Funciones Secuenciales)
    * **ST** (Structured Text / Texto Estructurado)
    * **IL** (Instruction List / Lista de Instrucciones)
* Su función principal es **compilar** tu proyecto (hecho en Escalera, Bloques, etc.) y generar un archivo de **Texto Estructurado (`.st`)** que el Runtime pueda entender y ejecutar.

> **Importante:** El Editor está basado en **Beremiz**, un IDE open-source para automatización. Muchos conceptos y tutoriales de Beremiz son aplicables a OpenPLC Editor.

---

### Plataformas Soportadas para OpenPLC Runtime

El Runtime de OpenPLC es extremadamente versátil y puede ejecutarse en múltiples plataformas:

#### Sistemas Operativos Completos

| Plataforma | Versiones Soportadas | Notas |
|------------|---------------------|-------|
| **Linux** | Ubuntu 18.04+, Debian 9+, CentOS 7+ | Plataforma más estable y recomendada |
| **Raspberry Pi OS** | Bullseye, Buster | Ideal para aplicaciones IoT y embebidas |
| **Windows** | Windows 7, 8, 10, 11 | Funcional pero menos común en producción |
| **macOS** | 10.13+ | Soporte experimental |

#### Hardware Embebido

| Hardware | Nivel de Soporte | Características |
|----------|-----------------|-----------------|
| **Raspberry Pi** (2, 3, 4, 5, Zero) |  Excelente | Mejor relación precio/rendimiento |
| **Arduino** (Uno, Mega, Due) |  Bueno | Limitado por memoria y procesamiento |
| **ESP32** | En desarrollo | WiFi integrado, ideal para IoT |
| **BeagleBone Black** | Excelente | Excelente para I/O industrial |
| **PCs Industriales (IPC)** |  Excelente | Máximo rendimiento y confiabilidad |

> **Recomendación:** Para proyectos de producción o aplicaciones críticas, se recomienda usar una **Raspberry Pi 4 (4GB+)** o un **IPC con Linux**. Para prototipado rápido, Arduino es suficiente.

> **Limitaciones de Arduino:**
> - **Memoria limitada:** Los programas complejos pueden no caber en la memoria de un Arduino Uno (32KB Flash, 2KB RAM)
> - **Sin interfaz web:** En Arduino, el Runtime no tiene dashboard web; se programa directamente
> - **I/O limitado:** Menos pines que una Raspberry Pi o IPC
> - **Recomendado para:** Proyectos educativos o aplicaciones muy simples

---

### Instalación

#### Instalación de OpenPLC Runtime

El Runtime se instala en el dispositivo que servirá como controlador.

#### **Método Recomendado (Linux/Raspberry Pi):**

1.  Abre una terminal en tu dispositivo.
2.  Ejecuta el script oficial de instalación. Este script se encarga de todas las dependencias:

    ```bash
    wget https://github.com/thiagoralves/OpenPLC_v3/raw/main/install.sh
    chmod +x install.sh
    sudo ./install.sh
    ```

3.  El script te preguntará qué tipo de hardware estás usando. Selecciona la opción apropiada:
    - `1` - Linux (x86/x64)
    - `2` - Raspberry Pi
    - `3` - Arduino (requiere configuración adicional)
    - Otras opciones según tu hardware

4.  Espera a que termine la instalación (puede tomar 10-30 minutos dependiendo del hardware).

> **Tip:** Si tienes problemas con el script, puedes consultar la [Instalación Manual](https://github.com/thiagoralves/OpenPLC_v3/wiki/Installation) en el wiki de GitHub.

#### **Windows:**

1.  Descarga el instalador desde [Runtime para Windows](https://www.openplcproject.com/runtime/windows)
2.  Ejecuta el archivo `.exe` y sigue las instrucciones del asistente
3.  El Runtime se instalará como un servicio de Windows

> **Nota Windows:** Algunos antivirus pueden marcar el instalador como falso positivo. Esto es normal para software de automatización.

#### **Arduino:**

Para Arduino, el proceso es diferente:

1.  Ejecuta el script de instalación en una PC Linux y selecciona la opción de Arduino
2.  Conecta tu Arduino a la PC
3.  El script compilará y subirá el firmware de OpenPLC al Arduino
4.  **No hay interfaz web en Arduino** - programas directamente desde el Editor

> **Documentación Arduino:** [Documentación Arduino](https://www.openplcproject.com/runtime/arduino)

#### **Verificar la Instalación:**

Una vez instalado, verifica que el Runtime está corriendo:

```bash
# En Linux/Raspberry Pi
sudo systemctl status openplc

# O navega a:
http://localhost:8080
```

Si vez la pantalla de login, ¡la instalación fue exitosa!

---

#### Instalación de OpenPLC Editor

El Editor se instala en tu PC de trabajo (donde vas a programar).

1.  Ve a la sección de descargas: [https://www.openplcproject.com/plcopen-editor](https://www.openplcproject.com/plcopen-editor)
2.  Descarga el instalador correspondiente a tu sistema operativo:
    - **Windows:** `OpenPLC_Editor_v*.exe`
    - **macOS:** `OpenPLC_Editor_v*.dmg`
    - **Linux:** `OpenPLC_Editor_v*.run` o usa el script:
      ```bash
      wget https://github.com/thiagoralves/OpenPLC_Editor/raw/master/install.sh
      chmod +x install.sh
      ./install.sh
      ```
3.  Ejecuta el instalador y sigue las instrucciones

> **Tip:** El Editor requiere Python y algunas dependencias. El instalador las incluye automáticamente en Windows/macOS. En Linux, el script las instala.

---

### Uso de OpenPLC Runtime (Interfaz Web)

Una vez que el Runtime está instalado y ejecutándose en tu dispositivo (ej. tu Raspberry Pi), puedes acceder a él desde cualquier navegador en la misma red.

#### Acceso Inicial

1.  Abre tu navegador y ve a la dirección IP de tu dispositivo Runtime, en el puerto **8080**.
    * Ejemplo: `http://192.168.1.10:8080`
    * Si está en tu misma PC: `http://localhost:8080`
    
2.  El login por defecto es:
    * **Usuario:** `openplc`
    * **Contraseña:** `openplc`

> **Seguridad:** Es **altamente recomendado** cambiar estas credenciales después del primer login. Ve a **Settings > Users** para cambiar la contraseña.

> **Importante:** Si tu Runtime está expuesto a Internet, **DEBES** cambiar las credenciales y considerar usar HTTPS o una VPN.

#### Dashboard (Panel Principal)

El Dashboard te muestra:
- **Estado del PLC:** Running (Corriendo) o Stopped (Detenido)
- **Ciclo de scan:** Tiempo que toma ejecutar un ciclo completo
- **Variables en tiempo real:** Valores actuales de entradas/salidas
- **Botones de control:**
  - **Start PLC:** Inicia la ejecución del programa
  - **Stop PLC:** Detiene la ejecución
  - **Restart PLC:** Reinicia el Runtime

> **Tip:** El "Scan Time" debe ser consistente. Si varía mucho, puede indicar que tu programa es muy pesado para el hardware.

#### Subir un Programa (.st)

Esta es la tarea principal del Runtime.

1.  En el menú de la izquierda, haz clic en **Programs**.
2.  Verás un botón que dice **Browse...** o **Seleccionar archivo**.
3.  Busca y selecciona el archivo `.st` que generaste con el **OpenPLC Editor**.
4.  Haz clic en el botón **Upload Program**.
5.  El Runtime compilará el archivo `.st` a código nativo. Si todo está bien, verás el mensaje "Program uploaded successfully!".
6.  Ve a **Dashboard** en el menú y haz clic en el botón **Start PLC** para ejecutar tu programa.

> **Errores Comunes al Subir:**
> - **"Compilation Error":** Revisa tu código ST, probablemente hay un error de sintaxis
> - **"File too large":** Tu programa es muy grande para el hardware (común en Arduino)
> - **"Invalid file format":** Asegúrate de subir un archivo `.st` válido generado por el Editor

#### Monitoreo en Tiempo Real

En la sección **Monitoring**, puedes:
- Ver el estado de todas las variables (entradas, salidas, internas)
- **Forzar valores** manualmente para pruebas (útil para debugging)
- Ver gráficos históricos de variables (si la función está habilitada)

> **Tip:** Usa el "Force" con cuidado en producción. Forzar valores puede causar comportamientos inesperados en tu proceso físico.

#### Interactuar con Slave Devices (Dispositivos Esclavos)

El Runtime puede actuar como un *Maestro* (Master) para comunicarse con otros dispositivos *Esclavos* (Slaves) usando protocolos industriales, comúnmente Modbus.

#### **Protocolos Soportados:**
- **Modbus TCP/IP:** Para dispositivos en red Ethernet
- **Modbus RTU:** Para dispositivos en red serial (RS-232/RS-485)
- **DNP3:** Protocolo usado en energía/utilities
- **EtherNet/IP:** Protocolo industrial de Rockwell/Allen-Bradley (experimental)

#### **Configurar un Dispositivo Modbus:**

1.  En el menú de la izquierda, haz clic en **Slave Devices**.
2.  En la parte superior, haz clic en el botón **Add Device**.
3.  Se abrirá una ventana para configurar tu dispositivo esclavo:
    * **Device Name:** Un nombre descriptivo (Ej: "Sensor_Temp_Bodega")
    * **Device Protocol:** Selecciona el protocolo (Ej: **Modbus TCP** o **Modbus RTU**)
    * **Slave ID:** El ID del dispositivo Modbus (usualmente 1, 2, etc. - consulta el manual del dispositivo)
    * **Para Modbus TCP:**
      - **IP Address:** La IP del dispositivo esclavo (Ej: `192.168.1.50`)
      - **Port:** Usualmente `502` (puerto estándar de Modbus TCP)
    * **Para Modbus RTU:**
      - **COM Port:** El puerto serial (Ej: `/dev/ttyUSB0` en Linux, `COM3` en Windows)
      - **Baud Rate:** Velocidad de comunicación (común: `9600`, `19200`, `115200`)
      - **Parity:** Usualmente `None` o `Even`
      - **Stop Bits:** Usualmente `1`
4.  Haz clic en **Save Device**.

> **Tip:** Puedes usar herramientas como **ModbusPal** (simulador) o **QModMaster** (cliente Modbus) para probar tu configuración antes de conectar hardware real.

#### **Mapeo de Variables:**

Después de agregar el dispositivo, debes configurar qué variables de tu programa PLC se mapean a qué registros del dispositivo Modbus:

1.  En la lista de Slave Devices, haz clic en el botón **Configure** del dispositivo
2.  Aparecerá una tabla para mapear:
    - **PLC Variable:** Variable en tu programa (Ej: `%IW0` = Input Word 0)
    - **Modbus Address:** Dirección en el dispositivo Modbus
    - **Function Code:** Tipo de registro Modbus:
      - `1` - Read Coils (bobinas, digitales)
      - `2` - Read Discrete Inputs
      - `3` - Read Holding Registers (registros, analógicos)
      - `4` - Read Input Registers
      - `5` - Write Single Coil
      - `6` - Write Single Register
      - `15/16` - Write Multiple Coils/Registers

> **Aprende más sobre Modbus:** [Informacion Modbus](https://www.simplymodbus.ca/) - Excelente recurso para entender el protocolo

> **Común:** Si tu dispositivo no responde, verifica:
> - La IP/Puerto son correctos
> - El firewall no está bloqueando el puerto 502
> - El Slave ID coincide con el configurado en el dispositivo físico
> - Los cables están bien conectados (para RTU)

---

### Uso de OpenPLC Editor

El Editor es donde crearás la lógica de control.

#### Crear un Proyecto Nuevo

1.  Abre OpenPLC Editor.
2.  Ve a **File > New** (Archivo > Nuevo).
3.  Dale un nombre al proyecto y selecciona dónde guardarlo.
4.  En la ventana "New POU" (Program Organization Unit):
    * **POU Name:** Dale un nombre a tu bloque de programa (Ej: `Control_Principal`)
    * **POU Type:** Selecciona `program`
    * **Language:** Aquí seleccionas cómo quieres programar:
        * `LD` (Escalera / Ladder)
        * `FBD` (Bloques / Function Block)
        * `ST` (Texto Estructurado / Structured Text)
        * `SFC` (Secuencial / Sequential Function Chart)
        * `IL` (Lista de Instrucciones / Instruction List)
5.  Haz clic en **OK**.

#### Interfaz del Editor

La interfaz consta de varias áreas:

- **Barra de Menú:** Archivo, Edición, Ver, Proyecto, etc.
- **Panel Izquierdo:** Árbol del proyecto, POUs, Variables
- **Área de Trabajo Central:** Donde dibujas tu lógica
- **Barra de Herramientas Superior:** Elementos de programación (contactos, bobinas, bloques, etc.)
- **Panel Inferior:** Mensajes de compilación y errores

#### Declarar Variables

Antes de programar, necesitas declarar las variables que usarás:

1.  Haz doble clic en tu POU (Ej: `Control_Principal`) en el panel izquierdo
2.  En la parte superior del área de trabajo, verás tabs: **Variables**, **Code**
3.  Haz clic en **Variables**
4.  Agrega variables con esta sintaxis:

```
Nombre : Tipo := Valor_Inicial;
```

**Ejemplos:**
```
Boton_Inicio : BOOL := FALSE;
Motor_Activo : BOOL := FALSE;
Temperatura : INT := 0;
Setpoint : REAL := 25.5;
```

**Tipos de Variables Comunes:**
- `BOOL` - Booleano (TRUE/FALSE)
- `INT` - Entero con signo (-32768 a 32767)
- `DINT` - Entero doble (-2147483648 a 2147483647)
- `REAL` - Punto flotante (números decimales)
- `TIME` - Tiempo (Ej: `T#5s` = 5 segundos)
- `STRING` - Cadena de texto

> **Referencia IEC 61131-3:** [IEC 61131-3](https://www.plcopen.org/iec-61131-3)

#### Programar en Escalera (LD) y Bloques (FBD)

La interfaz es visual y tipo "drag-and-drop".

#### **Lógica de Escalera (Ladder):**

1.  En la barra de herramientas superior, verás iconos para:
    - **Contact (Contacto):** Representa una entrada o condición
      - `| |` - Normalmente abierto (ON cuando TRUE)
      - `|/|` - Normalmente cerrado (ON cuando FALSE)
    - **Coil (Bobina):** Representa una salida
      - `( )` - Bobina normal
      - `(/)` - Bobina negada
      - `(S)` - Set (mantiene en TRUE)
      - `(R)` - Reset (pone en FALSE)
2.  Haz clic en un elemento (Ej: Contact)
3.  Haz clic en el área de trabajo para colocarlo
4.  Haz doble clic en el elemento y escribe el nombre de la variable
5.  Para conectar elementos:
    - Haz clic en la salida (lado derecho) de un elemento
    - Arrastra hasta la entrada (lado izquierdo) del siguiente elemento

**Ejemplo Simple - Control de Motor:**
```
|  Boton_Inicio  |-------|  Motor_Activo  ( )
```
Esto significa: "Si Boton_Inicio es TRUE, entonces Motor_Activo es TRUE"

#### **Bloques de Funciones (FBD):**

Similar a LD, pero usas bloques lógicos:
- **AND** - Salida TRUE si todas las entradas son TRUE
- **OR** - Salida TRUE si alguna entrada es TRUE
- **NOT** - Invierte la entrada
- **TON** - Timer On Delay (temporizador con retardo al encender)
- **TOF** - Timer Off Delay
- **CTU** - Counter Up (contador ascendente)

> **Tip:** Puedes mezclar LD y FBD en el mismo proyecto usando diferentes POUs.

#### Temporizadores y Contadores

OpenPLC incluye bloques de función estándar muy útiles:

#### **TON - Timer On Delay:**
```
MiTimer : TON;
MiTimer(IN := Boton_Inicio, PT := T#5s);
Salida := MiTimer.Q;
```
- **IN:** Entrada que activa el timer
- **PT:** Preset Time (tiempo a contar)
- **Q:** Salida (TRUE cuando el tiempo se cumple)
- **ET:** Elapsed Time (tiempo transcurrido)

#### **CTU - Counter Up:**
```
MiContador : CTU;
MiContador(CU := Pulso_Entrada, PV := 10);
Alarma := MiContador.Q;
```
- **CU:** Count Up (pulso para incrementar)
- **R:** Reset (pone el contador en 0)
- **PV:** Preset Value (valor objetivo)
- **Q:** TRUE cuando CV >= PV
- **CV:** Current Value (valor actual)

> **Biblioteca de Bloques:** El Editor incluye muchos más bloques. Ve a **Insert > Function Block** para ver todos los disponibles.

#### Generar el Archivo y Conversión a ST

Este es el paso más importante en el Editor.

> **Importante:** OpenPLC Editor (basado en Beremiz) **SIEMPRE** convierte tu lógica visual (LD o FBD) a **Texto Estructurado (ST)** antes de compilar. El archivo `.st` es el producto final que se envía al Runtime.

**Cómo Generar el Archivo `.st`:**

1.  Una vez que tu lógica esté terminada, ve a **Edit > Build** (Editar > Compilar) o presiona `Ctrl+R`
2.  El Editor verificará tu código y mostrará errores si los hay en el panel inferior
3.  Si no hay errores, verás "Build successful" o similar
4.  Ve a **File > Generate Program for OpenPLC** (Archivo > Generar Programa para OpenPLC)
5.  El Editor te pedirá dónde guardar el archivo `.st`
6.  Guarda el archivo con un nombre descriptivo (Ej: `control_motor_v1.st`)

> **Tip:** También puedes usar el ícono de "Play" o "Generate" en la barra de herramientas (un engrane o flecha verde).

**Este archivo `.st` es el que debes subir al Runtime (como se vio en el paso 4.3).**

#### Programación Directa en ST

Si prefieres escribir código en lugar de usar gráficos, puedes programar directamente en **Structured Text**:

1.  Crea un nuevo POU y selecciona **ST** como lenguaje
2.  Escribe tu código directamente:

```
PROGRAM Control_Motor
VAR
    Boton_Inicio : BOOL;
    Motor_Activo : BOOL;
    Timer1 : TON;
END_VAR

Timer1(IN := Boton_Inicio, PT := T#5s);
Motor_Activo := Timer1.Q;

END_PROGRAM
```

> **Ventajas de ST:** Más rápido para programadores con experiencia, mejor para lógica compleja, más fácil de versionar en Git.

---

### Configuración de I/O (Entradas/Salidas)

OpenPLC usa una convención especial para nombrar las I/O físicas:

#### **Nomenclatura de Variables I/O:**

| Tipo | Formato | Ejemplo | Descripción |
|------|---------|---------|-------------|
| **Entrada Digital** | `%IX[byte].[bit]` | `%IX0.0` | Primera entrada digital |
| **Salida Digital** | `%QX[byte].[bit]` | `%QX0.0` | Primera salida digital |
| **Entrada Analógica** | `%IW[word]` | `%IW0` | Primera entrada analógica (0-65535) |
| **Salida Analógica** | `%QW[word]` | `%QW0` | Primera salida analógica (0-65535) |

**Ejemplos:**
- `%IX0.0`, `%IX0.1`, ..., `%IX0.7` - Primeros 8 bits de entrada
- `%QX0.0`, `%QX0.1`, ..., `%QX0.7` - Primeros 8 bits de salida
- `%IW0`, `%IW1`, `%IW2` - Primeras 3 entradas analógicas

#### **Mapeo de Hardware:**

El mapeo depende del hardware que uses:

#### **Raspberry Pi:**
- Configurado en **Hardware > Raspberry Pi**
- Puedes mapear pines GPIO específicos a variables PLC

#### **Arduino:**
- Mapeo automático según el modelo:
  - Entradas digitales: Pines 2-13
  - Salidas digitales: Pines 2-13
  - Entradas analógicas: A0-A5

> **Documentación de I/O:** [Documentacion para placas físicas](https://www.openplcproject.com/reference/basics/io-addressing)

---

### Flujo de Trabajo Completo (Resumen)

#### **Configuración Inicial (Una vez):**
1.  Instala el **Runtime** en tu dispositivo target (Raspberry Pi, PC Linux, etc.)
2.  Instala el **Editor** en tu PC de desarrollo
3.  Configura el hardware I/O en el Runtime (si es necesario)

#### **Ciclo de Desarrollo (Iterativo):**
1.  **(En el Editor)** Crea/Edita tu programa en LD, FBD, o ST
2.  **(En el Editor)** Compila y genera el archivo `.st`
3.  **(En el Runtime Web)** Sube el archivo `.st` en la sección **Programs**
4.  **(En el Runtime Web)** Ve al **Dashboard** y haz clic en **Start PLC**
5.  **(En el Runtime Web)** Monitorea las variables en **Monitoring**
6.  **(Opcional)** Configura **Slave Devices** para comunicación Modbus
7.  Prueba, depura, y repite desde el paso 1 si es necesario

> **Tip Pro:** Usa control de versiones (Git) para tu código `.st` y archivos de proyecto. Esto te permite rastrear cambios y revertir si algo sale mal.

---

### Mejores Prácticas

#### **Programación:**
-  Usa nombres descriptivos para variables (Ej: `Motor_Bomba_A` en lugar de `M1`)
-  Comenta tu código generosamente
-  Divide programas grandes en múltiples POUs (Functions, Function Blocks)
-  Usa temporizadores en lugar de contadores de ciclos para timing
-  Implementa lógica de seguridad (E-stops, límites, timeouts)

#### **Hardware:**
-  Usa una fuente de alimentación confiable y regulada
-  Protege las entradas/salidas con optoacopladores o relés
-  Implementa watchdogs para detectar fallos del PLC
-  Haz backups regulares de tu configuración

#### **Redes y Seguridad:**
-  Cambia las credenciales por defecto inmediatamente
-  Usa VLANs para separar la red de control de la red corporativa
-  Considera usar HTTPS o VPN para acceso remoto
-  Implementa firewall rules restrictivas

> **ADVERTENCIA DE SEGURIDAD:**
> OpenPLC NO está certificado para aplicaciones de seguridad crítica (SIL). No lo uses para sistemas donde un fallo podría causar:
> - Lesiones o muerte
> - Daño ambiental significativo
> - Pérdidas económicas catastróficas
>
> Para estas aplicaciones, usa PLCs certificados de fabricantes como Siemens, Allen-Bradley, o Schneider.
> Este es solo un software para practica y de codigo abierto por lo cual fue seleccionado en este laboratorio
---

### Troubleshooting (Solución de Problemas)

#### Problema: No puedo acceder a la interfaz web del Runtime

- Verifica que el Runtime esté corriendo: sudo systemctl status openplc
- Verifica la IP: ip addr (Linux) o ipconfig (Windows)
- Asegúrate de usar el puerto correcto (:8080)
- Revisa el firewall: sudo ufw allow 8080 (Linux)

#### Problema: El programa no compila en el Runtime

- Revisa los mensajes de error en la página de Programs
- Verifica que el archivo .st sea válido (ábrelo en un editor de texto)
- Comprueba que no hay errores de sintaxis en el Editor
- Asegúrate de que el programa no sea muy grande para el hardware (especialmente en Arduino)
- Verifica que todas las librerías necesarias estén instaladas

#### Problema: Las variables no cambian en Monitoring

- Asegúrate de que el PLC esté en modo Running (Dashboard)
- Verifica que el hardware I/O esté correctamente mapeado
- Comprueba las conexiones físicas (cables, sensores, actuadores)
- Usa "Force" para probar manualmente si la lógica funciona

#### Problema: Modbus no se conecta

- Verifica IP, Puerto y Slave ID
- Usa herramientas como ModbusPal o QModMaster para probar el dispositivo
- Revisa el firewall (puerto 502 para Modbus TCP)
- Para RTU: verifica baudrate, paridad, y stop bits
- Revisa los logs del Runtime: /var/log/openplc.log (Linux)

#### Problema: El Editor no abre o da errores

- Verifica que Python esté instalado (el Editor lo requiere)
- Reinstala el Editor
- Revisa permisos de archivo
- En Linux: asegúrate de que el archivo .run sea ejecutable: chmod +x OpenPLC_Editor*.run

---

### Recursos Oficiales y Comunidad

Antes de comenzar, aquí están los recursos más importantes:

#### Sitios Oficiales
- **Sitio Web Principal:** [Sitio Web OpenPLC](https://www.openplcproject.com)
- **Documentación Oficial:** [Documentacion Oficial](https://autonomylogic.com/docs/openplc-overview)
- **GitHub del Proyecto:** [Github OpenPLC](https://github.com/thiagoralves/OpenPLC_v3)

#### Comunidad y Soporte
- **Foro Oficial:** [Foro OpenPLC](https://openplc.discussion.community)
- **Canal de YouTube:** [OpenPLC Project](https://www.youtube.com/@OpenPLCproject) - Tutoriales en video
- **Discord:** Comunidad activa para consultas en tiempo real
- **Stack Overflow:** Tag `openplc` para preguntas técnicas

#### Recursos Educativos
- **Tutoriales Interactivos:** [Tutoriales](https://autonomylogic.com/learning)
- **Ejemplos de Proyectos:** Disponibles en el repositorio de GitHub en la carpeta `/examples`

---