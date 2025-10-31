---
title: Definición del Escenario
sidebar_label: Definicion del escenario
position: 1
---

## Contexto de la empresa

Se plantea el escenario de una empresa manufacturera del sector automotriz, posicionada como un proveedor (Tier 1) en la cadena de suministro y ubicada estratégicamente en el norte de México. La compañía se especializa en la producción de componentes esenciales que son enviados directamente a las plantas de ensamblaje de vehículos de grandes marcas. Su operación se caracteriza por un alto nivel de automatización y por la necesidad de mantener una disponibilidad operativa del 99.999% para cumplir con los estrictos cronogramas de producción de sus clientes.

---

## Productos y Procesos de Manufactura

La empresa gestiona dos líneas de producción principales, cada una con tecnologías y maquinarias específicas:

### Línea de cabezas de motor

Se enfoca en el maquinado de alta precisión de componentes de motor a partir de bloques de aluminio fundido. El proceso es secuencial y automatizado, abarcando fundición, fresado y torneado en centros de maquinado CNC, lavado industrial, ensamblaje de válvulas y una rigurosa inspección de calidad con Máquinas de Medición por Coordenadas (CMM).

### Línea de Módulos Frontales (Cabezas Frontales)

Consiste en el ensamblaje de múltiples componentes para crear el frente completo de un vehículo. Este proceso integra diversas tecnologías:
* Moldeo por inyección para fabricar piezas plásticas de gran tamaño como fascias y parrillas.
* Estampado de refuerzos y soportes metálicos.
* Ensamblaje automatizado en una línea que integra hasta 140 componentes, incluyendo sistemas de enfriamiento, faros, sensores y cableado.
* Pruebas funcionales de fin de línea para garantizar la calidad de todos los sistemas integrados.

### Maquinaria y Automatización

La plataforma de control está estandarizada con PLCs Allen-Bradley, el medio principal de comunicación será a través de EtherNet/IP y Modbus TCP.

#### Maquinaria CNC (Control Numérico por Computadora)

Son el corazón de la línea de cabezas de motor, se encargan de realizar operaciones de mecanizado de alta precisión a partir de bloques de aluminio fundido.

**Tipos de CNC Utilizados en el caso:**
* **Centro de Maquinado Horizontal (HMC):** Es la máquina principal para la fabricación de las cabezas de motor, su configuración permite maquinar múltiples caras de la pieza en una sujeción, lo que es crucial para la eficiencia y precisión. A menudo tienen un sistema de pallet doble para que se pueda cargar/descargar una pieza mientras otra se está maquinando, minimizando el tiempo de inactividad.
* **Torno CNC:** Se utiliza para operaciones de torneado, como la creación de superficies cilíndricas perfectas para los asientos de las válvulas o conexiones.
* **Máquina de Moldeo por inyección:** Esencial para línea de módulos frontales, estas máquinas fabrican piezas plásticas de gran tamaño.

**Marcas que se especializan en CNCs:**
* **DMG Mori:** Fabricante conocido por su alta precisión y tecnología.
* **Mazak:** Fabricante japonés líder en centros de maquinado de 5 ejes y soluciones de automatización.
* **Haas:** Extremadamente popular en Norteamérica por su excelente costo-beneficio y facilidad de uso.

#### Máquinas de Medición por Coordenadas (CMM)

Estas máquinas son críticas para el control de calidad, asegurando que cada componente cumpla con tolerancias dimensionales muy estrictas antes de pasar al ensamblaje.

**Tipos de CMM Utilizadas:**
* **CMM de Puente (Bridge CMM):** Es el tipo más común y versátil para inspeccionar piezas como las cabezas de motor, funciona usando un palpador de alta precisión para crear un modelo 3D y compararlo con el diseño CAD.
* **Escáner de Luz Estructurado (Óptico):** Un sistema sin contacto que proyecta patrones de luz sobre la pieza para capturar millones de puntos en segundos. Es ideal para verificar la geometría de superficies complejas de forma rápida y completa.

**Marcas que se especializan en CMMs:**
* **Zeiss:** Referente alemán en metrología y óptica de precisión. Sus CMMs son sinónimo de la más alta exactitud.
* **Hexagon (incluye Brown & Sharpe, Leica):** Un proveedor masivo de tecnología de medición, muy presente en la industria automotriz.
* **Mitutoyo:** Compañía japonesa con una reputación impecable en instrumentos de medición de todo tipo.

#### Robots y Cobots Industriales

* **Robot Industrial de Brazo Articulado (6 ejes):** Se utilizan principalmente en:
    * Cargar y descargar los bloques de aluminio en los centros de maquinado CNC.
    * Mover componentes entre estaciones en la línea de ensamblaje de módulos frontales.
    * Aplicar adhesivos o realizar tareas de soldadura.
* **Cobot (Robot Colaborativo):** Un robot más pequeño y seguro, diseñado para trabajar junto a los operarios humanos sin necesidad de jaulas de seguridad. Se usaría en estaciones de ensamblaje final o de inspección de calidad donde se requiere tanto la destreza humana como la precisión del robot.
* **AGVs (Vehículos de Guiado Automático):** Estos robots móviles son responsables de la logística interna, transportando de forma autónoma los componentes terminados desde el final de la línea hasta el área de empaque y expedición.

**Marcas Líderes en la Industria:**
* **FANUC:** Robots extremadamente populares en la industria automotriz por su velocidad y fiabilidad legendaria.
* **KUKA:** Fabricante alemán con una fuerte presencia en la automatización de ensamblaje de vehículos.
* **Universal Robots (UR):** El líder indiscutible en el mercado de los cobots.
* **MiR (Mobile Industrial Robots):** Una marca líder en el segmento de AGVs y robots móviles autónomos (AMRs).

### El rol de los PLCs en la Producción

Los **Controladores Lógicos Programables (PLCs)** son dispositivos electrónicos robustos que actúan como el sistema nervioso central de la maquinaria industrial. Su función es leer las señales de entrada de diversos sensores y basándose en un programa lógico, activar actuadores para ejecutar una secuencia de acciones de forma repetitiva y precisa. En ambas líneas de producción su rol es indispensable para el funcionamiento de las mismas.

#### Línea de cabezas de motor

En esta línea, los PLCs garantizan la secuencia y precisión del maquinado.

* **Fundición y Maquinado CNC:** Aunque la máquina CNC tiene su propio controlador para ejecutar el código de corte, el PLC controla todo el proceso periférico. Esto incluye la secuencia de carga y descarga de la cabeza de motor en el CNC mediante brazos robóticos, accionamiento de las prensas hidráulicas que sujetan la pieza y la operación de las cintas transportadoras que mueven el componente entre maquina y maquina.
* **Lavado Industrial:** El PLC gestiona el ciclo de lavado completo. Controla las electroválvulas para el flujo de agua y detergentes, los motores de las bombas de presión y la velocidad de la cinta transportadora que pasa las piezas a través de la cámara de lavado y secado.
* **Ensamblaje de Válvulas:** En las estaciones de automatizado, el PLC coordina los actuadores neumáticos y servomotores que posicionan y presionan las válvulas y los resortes en la cabeza del motor con la fuerza exacta requerida.
* **Inspección y Logística:** El PLC dirige el flujo de las piezas. Lee los resultados de la Máquina de Medición por Coordenadas CMM y según la pieza sea aprobada o rechazada, activa los desviadores en la cinta transportadora para enviarla al área de empaque o la de retrabajo.

#### Línea de módulos frontales (Cabezas Frontales)

En el ensamblaje, la función principal del PLC es la orquestación de múltiples estaciones y dispositivos que trabajan en conjunto.

* **Moldeo por inyección:** Cada máquina de moldeo es controlada internamente por un PLC. Este gestiona todas las variables del proceso. La temperatura de fusión del plástico, la presión de la inyección, el tiempo de enfriamiento y la secuencia de expulsión de la pieza terminada (fascia o parrilla).
* **Línea de ensamblaje automatizado:** Los PLCs interactúan de la siguiente manera:
    * **Control de transporte:** El PLC principal de la línea sincroniza el movimiento de toda la cadena de producción, ya sea una cinta transportadora o vehículos de guiado automático (AGVs). Sabe en qué estación está cada módulo y cuando debe moverse a la siguiente.
    * **Coordinación de robots:** El PLC actúa como el maestro de los robots, enviando señales para iniciar la secuencia, así como esperar una señal de vuelta antes de ordenar a la línea que avance. Esto asegura que un robot no empiece a trabajar si la pieza no está perfectamente colocada.
    * **Integración de sensores:** El PLC recibe y procesa información de cientos de sensores de proximidad, que confirman que un componente está presente así como como sistemas de visión que verifican la orientación de una pieza.
    * **Pruebas funcionales:** El PLC automatiza la secuencia de pruebas. Activa los circuitos eléctricos para encender los faros, envía señales a los sensores para verificar su respuesta y lee los datos del equipo de diagnostico. Basándose en los resultados, el PLC toma la decisión final de aprobar el módulo y enviarlo a expedición.

---

## Alcance de la simulación

El alcance de este proyecto se centra en diseñar, simular y documentar una estrategia de ciberseguridad integral para proteger las líneas de producción descritas. El objetivo principal es mitigar la amenaza de un ataque de firmware dirigido, que podría ser perpetrado por un actor tanto externo como interno.

El vector de ataque a analizar es la ingeniería social, específicamente mediante dos escenarios:

* Un ataque de phishing dirigido a un empleado de la red corporativa para ganar un punto de acceso inicial.
* La introducción de un dispositivo USB malicioso directamente en la red de control (OT) por parte de un actor interno.

La solución propuesta demostrará un entorno de simulación a escala, utilizando máquinas virtuales y software de simulación de PLC. El propósito es validar las medidas de evitación, contención y minimización del impacto, presentando un modelo de defensa robusto y aplicable a un entorno industrial real.