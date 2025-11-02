---
slug: /configuracion-nxlog
title: Configuración NXLog
sidebar_label: Configuración NXLog
---

## Configuración de NXLog para Entornos Windows

### Introducción

NXLog es una solución de recolección, procesamiento y envío de logs multi-plataforma diseñada para facilitar la integración de sistemas Windows con soluciones SIEM (Security Information and Event Management). Esta guía proporciona las directrices necesarias para la descarga, instalación y configuración de NXLog en sistemas Windows legacy y modernos.

### Características Principales de NXLog

NXLog ofrece las siguientes capacidades para entornos empresariales:

- **Compatibilidad Legacy**: Soporte completo para Windows XP, Windows Vista, Windows 7, así como versiones modernas
- **Recolección Centralizada**: Envío de eventos del sistema a servidores SIEM centralizados
- **Múltiples Protocolos**: Transmisión mediante TCP o UDP según los requerimientos de red
- **Procesamiento de Logs**: Capacidad de filtrado, transformación y enriquecimiento de eventos
- **Formato Flexible**: Soporte para Syslog, JSON, XML y formatos personalizados
- **Bajo Consumo de Recursos**: Diseñado para operar eficientemente en sistemas con recursos limitados

### Descarga de NXLog

#### Ubicación Oficial de Descarga

NXLog Community Edition se encuentra disponible en el sitio oficial del desarrollador:

**URL Principal**: [NXLog](https://nxlog.co/products/nxlog-community-edition/download)

#### Versiones Disponibles

El desarrollador proporciona las siguientes distribuciones:

#### Para Sistemas Windows de 32 bits (x86)
- **Windows XP/Vista/7/8/10 (32-bit)**
- Archivo: `nxlog-ce-{version}.msi` (x86)
- Tamaño aproximado: 8-12 MB

#### Para Sistemas Windows de 64 bits (x64)
- **Windows 7/8/10/11/Server (64-bit)**
- Archivo: `nxlog-ce-{version}.msi` (x64)
- Tamaño aproximado: 9-13 MB

#### Consideraciones para Sistemas Legacy

Para sistemas Windows XP y Windows 7, se recomienda utilizar versiones específicas de NXLog que mantienen compatibilidad:

- **Windows XP**: NXLog CE 2.10.x o anterior (última versión compatible)
- **Windows 7**: NXLog CE 2.11.x o superior
- **Windows 10 Enterprise**: NXLog CE 3.x (última versión estable)

### Estructura de Directorios de NXLog

Una vez instalado, NXLog crea la siguiente estructura de directorios en el sistema:

#### Directorio de Instalación Principal

**Ruta por Defecto (64-bit)**:
```
C:\Program Files\nxlog\
```

#### Subdirectorios Importantes

```
C:\Program Files\nxlog\
├── bin\                    # Binarios ejecutables
│   ├── nxlog.exe          # Ejecutable principal del servicio
│   └── nxlog-processor.exe # Procesador de eventos
├── conf\                   # Configuración
│   ├── nxlog.conf         # Archivo de configuración principal
│   └── nxlog.conf.sample  # Ejemplo de configuración
├── data\                   # Datos persistentes
│   └── nxlog.cache        # Caché de eventos
├── doc\                    # Documentación
├── modules\                # Módulos de NXLog
└── cert\                   # Certificados SSL/TLS (opcional)
```

#### Rutas de Archivos de Log

NXLog genera sus propios logs de operación en:

**Ruta de Log Interno**:
```
C:\Program Files\nxlog\data\nxlog.log
```

**Ruta de Caché de Eventos**:
```
C:\Program Files\nxlog\data\nxlog.cache
```

#### Archivo de Configuración Principal

**Ubicación del Archivo de Configuración**:
```
C:\Program Files\nxlog\conf\nxlog.conf
```

Este archivo debe ser modificado con privilegios de administrador para aplicar configuraciones personalizadas.

### Instalación de NXLog

#### Requisitos Previos

Antes de proceder con la instalación, se deben verificar los siguientes requisitos:

- **Privilegios Administrativos**: La instalación requiere permisos de administrador local
- **Conectividad de Red**: Acceso al servidor SIEM destino
- **Puertos de Firewall**: Configuración de reglas para permitir tráfico saliente TCP/UDP
- **Espacio en Disco**: Mínimo 50 MB de espacio disponible

#### Proceso de Instalación

#### Instalación en Windows XP/7

1. Se ejecuta el instalador MSI descargado con privilegios de administrador
2. Se acepta el acuerdo de licencia
3. Se selecciona el directorio de instalación (se recomienda la ruta por defecto)
4. Se completa el asistente de instalación
5. El servicio de NXLog se instala automáticamente pero NO se inicia

#### Instalación en Windows 10 Enterprise

El proceso es similar al descrito anteriormente, con las siguientes consideraciones adicionales:

1. Se puede requerir la confirmación de User Account Control (UAC)
2. Windows Defender puede requerir aprobación explícita
3. Se recomienda verificar la compatibilidad con políticas de grupo corporativas

#### Instalación Silenciosa (Despliegue Masivo)

Para despliegues automatizados en entornos empresariales:

```cmd
msiexec /i nxlog-ce-3.x.xxxx.msi /quiet /norestart
```

Parámetros opcionales:
```cmd
msiexec /i nxlog-ce-3.x.xxxx.msi /quiet /norestart INSTALLDIR="C:\nxlog"
```

### Configuración de NXLog para SIEM

#### Estructura del Archivo de Configuración

El archivo `nxlog.conf` se divide en las siguientes secciones:

1. **Definición de Rutas y Variables**
2. **Configuración de Módulos**
3. **Definición de Inputs (Entradas)**
4. **Definición de Outputs (Salidas)**
5. **Rutas de Procesamiento**

#### Configuración para Windows XP

Los sistemas Windows XP requieren una configuración específica debido a las limitaciones del sistema operativo.

#### Archivo nxlog.conf para Windows XP

```conf
## Configuración NXLog para Windows XP
## Envío de eventos a SIEM

## Definición de la raíz de instalación
define ROOT C:\Program Files\nxlog

## Módulos principales
Moduledir %ROOT%\modules
CacheDir %ROOT%\data
Pidfile %ROOT%\data\nxlog.pid
SpoolDir %ROOT%\data
LogFile %ROOT%\data\nxlog.log

## Nivel de logging interno (INFO, WARNING, ERROR, DEBUG)
LogLevel INFO

##############################################
## MÓDULOS DE EXTENSIÓN
##############################################

## Módulo para conversión Syslog
<Extension syslog>
    Module      xm_syslog
</Extension>

## Módulo para formato JSON (opcional)
<Extension json>
    Module      xm_json
</Extension>

##############################################
## INPUT: Event Log de Windows XP
##############################################

<Input eventlog>
    Module      im_msvistalog
    
    ## Canales de eventos a recolectar
    ## Windows XP utiliza el formato de Event Log clásico
    
    ## Para recolectar todos los eventos
    Query       <QueryList>\
                  <Query Id="0">\
                    <Select Path="Application">*</Select>\
                    <Select Path="System">*</Select>\
                    <Select Path="Security">*</Select>\
                  </Query>\
                </QueryList>
    
    ## Alternativa: Configuración simplificada para XP
    # Channel     Application
    # Channel     System
    # Channel     Security
    
    ## Intervalo de polling (en segundos)
    PollInterval 1
    
    ## Guardar posición de lectura
    SavePos     TRUE
    
    ## Buffer de lectura
    ReadFromLast TRUE
</Input>

##############################################
## OUTPUT: Envío a SIEM vía TCP
##############################################

<Output siem_tcp>
    Module      om_tcp
    
    ## Dirección IP y puerto del servidor SIEM
    Host        Direccion IP del SIEM
    Port        Puerto en el que escucha el SIEM TCP
    
    ## Formato de salida (Syslog estándar)
    Exec        to_syslog_snare();
    
    ## Opciones de reconexión
    Reconnect   10
</Output>

##############################################
## OUTPUT: Envío a SIEM vía UDP (Alternativa)
##############################################

<Output siem_udp>
    Module      om_udp
    
    ## Dirección IP y puerto del servidor SIEM
    Host        Direccion IP del SIEM
    Port        Puerto en el que escucha el SIEM UDP
    
    ## Formato de salida (Syslog estándar)
    Exec        to_syslog_snare();
</Output>

##############################################
## RUTAS DE PROCESAMIENTO
##############################################

## Ruta para TCP (comentar/descomentar según necesidad)
<Route eventlog_to_siem_tcp>
    Path        eventlog => siem_tcp
</Route>

## Ruta para UDP (comentar/descomentar según necesidad)
# <Route eventlog_to_siem_udp>
#     Path        eventlog => siem_udp
# </Route>
```

#### Configuración para Windows 7

Windows 7 introduce mejoras en el sistema de Event Log que permiten configuraciones más avanzadas.

#### Archivo nxlog.conf para Windows 7

```conf
## Configuración NXLog para Windows 7
## Envío de eventos a SIEM

## Definición de la raíz de instalación
define ROOT C:\Program Files\nxlog
define CERTDIR %ROOT%\cert
define CONFDIR %ROOT%\conf
define LOGFILE %ROOT%\data\nxlog.log

## Módulos principales
Moduledir %ROOT%\modules
CacheDir %ROOT%\data
Pidfile %ROOT%\data\nxlog.pid
SpoolDir %ROOT%\data
LogFile %LOGFILE%

## Nivel de logging interno
LogLevel INFO

##############################################
## MÓDULOS DE EXTENSIÓN
##############################################

<Extension syslog>
    Module      xm_syslog
</Extension>

<Extension json>
    Module      xm_json
</Extension>

## Módulo para ejecución de scripts
<Extension exec>
    Module      xm_exec
</Extension>

##############################################
## INPUT: Event Log de Windows 7
##############################################

<Input eventlog>
    Module      im_msvistalog
    
    ## Query XML para eventos específicos
    ## Recolecta eventos de seguridad, aplicación y sistema
    
    <QueryXML>
        <QueryList>
            <Query Id="0">
                <!-- Eventos de Aplicación -->
                <Select Path="Application">*[System[(Level=1 or Level=2 or Level=3)]]</Select>
                
                <!-- Eventos del Sistema -->
                <Select Path="System">*[System[(Level=1 or Level=2 or Level=3)]]</Select>
                
                <!-- Eventos de Seguridad (todos) -->
                <Select Path="Security">*</Select>
                
                <!-- Eventos de PowerShell (si está habilitado) -->
                <Select Path="Windows PowerShell">*[System[(Level=1 or Level=2 or Level=3)]]</Select>
            </Query>
        </QueryList>
    </QueryXML>
    
    ## Configuración de lectura
    SavePos     TRUE
    ReadFromLast TRUE
    PollInterval 1
    
    ## Procesamiento adicional
    Exec        $Hostname = hostname();
</Input>

##############################################
## OUTPUT: Envío a SIEM vía TCP con Syslog
##############################################

<Output siem_tcp>
    Module      om_tcp
    Host        Direccion IP del SIEM
    Port        Puerto en el que escucha el SIEM TCP
    
    ## Formato Syslog con enriquecimiento
    Exec        to_syslog_snare();
    
    ## Agregar hostname al mensaje
    Exec        $Message = $Hostname + ' ' + $Message;
    
    ## Configuración de reconexión
    Reconnect   10
    
    ## Buffer de salida
    OutputType  LineBased
</Output>

##############################################
## OUTPUT: Envío a SIEM vía UDP con Syslog
##############################################

<Output siem_udp>
    Module      om_udp
    Host        Direccion IP del SIEM
    Port        Puerto en el que escucha el SIEM UDP
    
    Exec        to_syslog_snare();
    Exec        $Message = $Hostname + ' ' + $Message;
    
    OutputType  LineBased
</Output>

##############################################
## OUTPUT: Formato JSON para SIEM Moderno (Opcional)
##############################################

<Output siem_json_tcp>
    Module      om_tcp
    Host        Direccion IP del SIEM
    Port        Puerto en el que escucha el SIEM GELF TCP
    
    ## Conversión a formato JSON
    Exec        to_json();
    
    Reconnect   10
    OutputType  LineBased
</Output>

##############################################
## RUTAS DE PROCESAMIENTO
##############################################

## Ruta principal: TCP con Syslog (Recomendado)
<Route eventlog_to_siem>
    Path        eventlog => siem_tcp
</Route>

## Alternativas (comentar/descomentar según necesidad):

## Ruta UDP con Syslog
# <Route eventlog_to_siem_udp>
#     Path        eventlog => siem_udp
# </Route>

## Ruta TCP con JSON
# <Route eventlog_to_siem_json>
#     Path        eventlog => siem_json_tcp
# </Route>
```

**Nota importante**: El querer extraer logs de Sistemas Legacy Windows (XP/7) presento cierta incompatibilidad al momento de usar certificados TLS/SSL debido a que en estas versiones el maximo era TLS 1.0-TLS1.1 y SSLv2/SSLv3. Por lo cual puede que llegue a generar inconsistencias en la transmision de Logs al SIEM 

#### Configuración para Windows 10 Enterprise

Windows 10 Enterprise ofrece capacidades avanzadas de auditoría y logging que pueden ser aprovechadas.

#### Archivo nxlog.conf para Windows 10 Enterprise

```conf
## Configuración NXLog para Windows 10 Enterprise
## Envío de eventos a SIEM con capacidades avanzadas

## Definición de rutas
define ROOT C:\Program Files (x86)\nxlog
define CERTDIR %ROOT%\cert
define CONFDIR %ROOT%\conf
define LOGFILE %ROOT%\data\nxlog.log
define LOGDIR %ROOT%\data

## Configuración de módulos
Moduledir %ROOT%\modules
CacheDir %ROOT%\data
Pidfile %ROOT%\data\nxlog.pid
SpoolDir %ROOT%\data
LogFile %LOGFILE%

## Nivel de logging
LogLevel INFO

## Limitaciones de recursos
#MaxQueueSize 100000
#FlushLimit 5000
#FlushInterval 1

##############################################
## MÓDULOS DE EXTENSIÓN
##############################################

<Extension _syslog>
    Module      xm_syslog
</Extension>

<Extension _json>
    Module      xm_json
</Extension>

<Extension _exec>
    Module      xm_exec
</Extension>

<Extension _charconv>
    Module      xm_charconv
    AutodetectCharsets utf-8, utf-16, utf-32
</Extension>

##############################################
## INPUT: Event Logs de Windows 10
##############################################

<Input eventlog_system>
    Module      im_msvistalog
    
    ## Query avanzada para Windows 10
    <QueryXML>
        <QueryList>
            <Query Id="0">
                <!-- Eventos Críticos y Errores del Sistema -->
                <Select Path="System">*[System[(Level=1 or Level=2 or Level=3)]]</Select>
                
                <!-- Eventos de Aplicación Críticos -->
                <Select Path="Application">*[System[(Level=1 or Level=2 or Level=3)]]</Select>
                
                <!-- Todos los Eventos de Seguridad -->
                <Select Path="Security">*</Select>
                
                <!-- Eventos de Windows Defender -->
                <Select Path="Microsoft-Windows-Windows Defender/Operational">*</Select>
                
                <!-- Eventos de PowerShell (Ejecutado y Errores) -->
                <Select Path="Microsoft-Windows-PowerShell/Operational">*[System[(Level=1 or Level=2 or Level=3 or Level=4)]]</Select>
                
                <!-- Eventos de Firewall -->
                <Select Path="Microsoft-Windows-Windows Firewall With Advanced Security/Firewall">*</Select>
                
                <!-- Eventos de Sysmon (si está instalado) -->
                <Select Path="Microsoft-Windows-Sysmon/Operational">*</Select>
                
                <!-- Eventos de Terminal Services -->
                <Select Path="Microsoft-Windows-TerminalServices-LocalSessionManager/Operational">*</Select>
                
                <!-- Eventos de WMI -->
                <Select Path="Microsoft-Windows-WMI-Activity/Operational">*[System[(Level=1 or Level=2 or Level=3)]]</Select>
            </Query>
        </QueryList>
    </QueryXML>
    
    ## Configuración de lectura
    SavePos         TRUE
    ReadFromLast    TRUE
    PollInterval    1
    
    ## Enriquecimiento de eventos
    Exec            $Hostname = hostname();
    Exec            $SourceName = 'NXLog-' + $Hostname;
</Input>

##############################################
## PROCESADOR: Filtrado y Enriquecimiento
##############################################

<Processor filter_and_enrich>
    Module      pm_filter
    
    ## Filtrar eventos de bajo nivel (Informativos no críticos)
    ## Comentar esta línea para enviar TODOS los eventos
    Exec        if ($SeverityValue > 4) drop();
    
    ## Enriquecer con información adicional
    Exec        $EventReceivedTime = now();
    
    ## Agregar identificador único
    Exec        $UUID = generate_guid();
    
    ## Normalización de caracteres
    Exec        convert_fields("AUTO", "utf-8");
</Processor>

##############################################
## OUTPUT: TCP con Syslog (Estándar)
##############################################

<Output siem_tcp_syslog>
    Module      om_tcp
    Host        Direccion IP del SIEM
    Port        Puerto en el que escucha el SIEM TCP
    
    ## Formato Syslog BSD
    Exec        to_syslog_bsd();
    
    ## Opciones de conexión
    Reconnect   10
    OutputType  LineBased
    
    ## SSL/TLS (descomentar si el SIEM lo requiere)
    # OutputType  Binary
    # <Exec>
    #     if not defined $Hostname { $Hostname = hostname(); }
    # </Exec>
</Output>

##############################################
## OUTPUT: TCP con Formato JSON
##############################################

<Output siem_tcp_json>
    Module      om_tcp
    Host        Direccion IP del SIEM
    Port        Puerto en el que escucha el SIEM GELF TCP
    
    ## Conversión a JSON
    Exec        to_json();
    
    ## Opciones de conexión
    Reconnect   10
    OutputType  LineBased
</Output>

##############################################
## OUTPUT: UDP con Syslog (Alternativa)
##############################################

<Output siem_udp_syslog>
    Module      om_udp
    Host        Direccion IP del SIEM
    Port        Puerto en el que escucha el SIEM UDP
    
    ## Formato Syslog
    Exec        to_syslog_bsd();
    OutputType  LineBased
</Output>

##############################################
## OUTPUT: TLS/SSL Seguro (Opcional)
##############################################

<Output siem_ssl>
    Module      om_ssl
    Host        Direccion IP del SIEM
    Port        Puerto en el que escucha el SIEM Si esta habilitado para recibir comunicacion con TLS/SSL
    
    ## Certificados (configurar según el SIEM)
    # CAFile      %CERTDIR%\ca.pem
    # CertFile    %CERTDIR%\client-cert.pem
    # CertKeyFile %CERTDIR%\client-key.pem
    # AllowUntrusted TRUE
    
    ## Formato
    Exec        to_syslog_bsd();
    Reconnect   10
    OutputType  LineBased
</Output>

##############################################
## RUTAS DE PROCESAMIENTO
##############################################

## Ruta Principal: TCP con Syslog (RECOMENDADO)
<Route main_route>
    Path        eventlog_system => filter_and_enrich => siem_tcp_syslog
</Route>

## Alternativas (activar según requerimientos):

## TCP con JSON
# <Route json_route>
#     Path        eventlog_system => filter_and_enrich => siem_tcp_json
# </Route>

## UDP con Syslog
# <Route udp_route>
#     Path        eventlog_system => filter_and_enrich => siem_udp_syslog
# </Route>

## TLS/SSL Seguro
# <Route ssl_route>
#     Path        eventlog_system => filter_and_enrich => siem_ssl
# </Route>
```

### Configuración de Protocolos de Transporte

#### Consideraciones para TCP vs UDP

La selección del protocolo de transporte debe basarse en los siguientes criterios:

#### Protocolo TCP (Recomendado)

**Ventajas**:
- Garantía de entrega de eventos
- Control de flujo y congestión
- Reconexión automática en caso de fallos
- Ideal para eventos de seguridad críticos

**Desventajas**:
- Mayor overhead de red
- Posible latencia en redes congestionadas

**Casos de Uso Recomendados**:
- Eventos de seguridad críticos
- Auditoría de cumplimiento
- Ambientes donde la pérdida de logs es inaceptable

#### Protocolo UDP

**Ventajas**:
- Menor latencia
- Menor consumo de recursos
- Adecuado para alto volumen de eventos

**Desventajas**:
- No garantiza entrega de eventos
- Posible pérdida de logs en redes congestionadas
- Sin mecanismo de reconexión

**Casos de Uso Recomendados**:
- Ambientes con ancho de banda limitado
- Logs no críticos
- Redes con alta confiabilidad

#### Configuración de Puertos Estándar

Los puertos comúnmente utilizados para envío de logs son:

- **Puerto 514 (UDP/TCP)**: Syslog estándar
- **Puerto 5514 (TCP)**: Formato JSON sobre TCP
- **Puerto 6514 (TCP)**: Syslog sobre TLS
- **Puerto 1514 (TCP/UDP)**: Alternativa común para Syslog

En nuestra arquitectura utilizamos:
- **Puerto 1514 UDP**: Trafico UDP
- **Puerto 5140 TCP**: Trafico TCP


### Gestión del Servicio NXLog

#### Inicio Manual del Servicio

#### Mediante Interfaz Gráfica (services.msc)

1. Se presiona `Windows + R` y se ejecuta `services.msc`
2. Se localiza el servicio "nxlog"
3. Se hace clic derecho y se selecciona "Iniciar"
4. Se configura el tipo de inicio como "Automático"

#### Mediante Línea de Comandos

**Iniciar el servicio**:
```cmd
net start nxlog
```

**Detener el servicio**:
```cmd
net stop nxlog
```

**Reiniciar el servicio**:
```cmd
net stop nxlog && net start nxlog
```

**Verificar estado**:
```cmd
sc query nxlog
```

#### Configuración de Inicio Automático

#### Windows XP/7

```cmd
sc config nxlog start= auto
```

#### Windows 10 Enterprise

```cmd
sc config nxlog start= delayed-auto
```

El inicio diferido (delayed-auto) permite que el sistema operativo complete su inicialización antes de iniciar NXLog.

#### Verificación de Funcionamiento

#### Verificar que el Servicio está en Ejecución

```cmd
sc query nxlog | findstr STATE
```

La salida debe mostrar: `STATE : 4 RUNNING`

#### Verificar Conectividad con el SIEM

```cmd
netstat -ano | findstr : Puerto a usar declarado (514,5140,1514,22021)
```

Este comando muestra las conexiones activas al puerto del SIEM.

#### Revisar Logs Internos de NXLog

El archivo de log interno se encuentra en:
```
C:\Program Files\nxlog\data\nxlog.log
```

Contenido típico de funcionamiento correcto:
```
2024-11-02 10:15:23 INFO nxlog-ce-3.2.2329 started
2024-11-02 10:15:23 INFO successfully connected to IP del SIEM:Puerto a usar
2024-11-02 10:15:24 INFO [eventlog] started
```

### Configuración de Firewall de Windows

Para permitir el tráfico saliente hacia el servidor SIEM, se deben configurar las siguientes reglas:

#### Windows XP/7 (Firewall Clásico)

#### Mediante Interfaz Gráfica

1. Panel de Control → Firewall de Windows
2. Permitir un programa a través del Firewall
3. Agregar nxlog.exe a la lista de excepciones

#### Mediante Línea de Comandos

```cmd
netsh firewall add allowedprogram "C:\Program Files\nxlog\bin\nxlog.exe" "NXLog Service" ENABLE
```

#### Windows 10 Enterprise (Firewall Avanzado)

#### Mediante PowerShell (Recomendado)

```powershell
New-NetFirewallRule -DisplayName "NXLog Outbound TCP" -Direction Outbound -Program "C:\Program Files\nxlog\bin\nxlog.exe" -Protocol TCP -Action Allow

New-NetFirewallRule -DisplayName "NXLog Outbound UDP" -Direction Outbound -Program "C:\Program Files\nxlog\bin\nxlog.exe" -Protocol UDP -Action Allow
```

#### Mediante netsh

```cmd
netsh advfirewall firewall add rule name="NXLog Outbound" dir=out action=allow program="C:\Program Files (x86)\nxlog\bin\nxlog.exe" enable=yes

netsh advfirewall firewall add rule name="NXLog TCP Puerto a usar" dir=out action=allow protocol=TCP remoteport=Puerto a usar enable=yes

netsh advfirewall firewall add rule name="NXLog UDP Puerto a usar" dir=out action=allow protocol=UDP remoteport=Puerto a usar enable=yes
```

#### Validación de Configuración

#### Verificación Sintáctica del Archivo de Configuración

Antes de iniciar el servicio, se recomienda validar la sintaxis del archivo de configuración:

```cmd
"C:\Program Files\nxlog\bin\nxlog.exe" -v -c "C:\Program Files\nxlog\conf\nxlog.conf"
```

La salida debe indicar: `Configuration validation successful`

#### Ejecución en Modo de Depuración

Para diagnosticar problemas, se puede ejecutar NXLog en modo foreground:

```cmd
"C:\Program Files\nxlog\bin\nxlog.exe" -f -c "C:\Program Files\nxlog\conf\nxlog.conf"
```

Este modo muestra los eventos en tiempo real en la consola.

#### Prueba de Conectividad con el SIEM

#### Mediante telnet

```cmd
telnet 192.168.1.100 514
```

Si la conexión es exitosa, el SIEM está accesible.

#### Mediante Test-NetConnection (PowerShell - Windows 10)

```powershell
Test-NetConnection -ComputerName IP SIEM -Port Puerto Declarado
```

## Solución de Problemas Comunes

#### El Servicio No Inicia

**Síntomas**: El servicio de NXLog falla al iniciar o se detiene inmediatamente.

**Causas Comunes**:
1. Error de sintaxis en nxlog.conf
2. Permisos insuficientes en directorios
3. Puerto ya en uso por otra aplicación
4. Conflicto con software de seguridad

**Solución**:

1. Validar sintaxis del archivo de configuración:
```cmd
"C:\Program Files\nxlog\bin\nxlog.exe" -v
```

2. Revisar el log interno:
```cmd
type "C:\Program Files\nxlog\data\nxlog.log"
```

3. Verificar permisos de directorio:
```cmd
icacls "C:\Program Files\nxlog\data"
```

4. Ejecutar en modo debug para identificar el error:
```cmd
"C:\Program Files\nxlog\bin\nxlog.exe" -f -c "C:\Program Files\nxlog\conf\nxlog.conf"
```

#### No se Envían Eventos al SIEM

**Síntomas**: El servicio está en ejecución pero el SIEM no recibe eventos.

**Causas Comunes**:
1. Firewall bloqueando tráfico saliente
2. Dirección IP o puerto incorrectos en la configuración
3. El SIEM no está escuchando en el puerto configurado
4. Formato de eventos incompatible con el SIEM

**Solución**:

1. Verificar conectividad:
```cmd
ping IP del SIEM
telnet IP del SIEM Puerto declarado 
```

2. Verificar reglas de firewall:
```cmd
netsh advfirewall firewall show rule name=all | findstr NXLog
```

3. Revisar estadísticas de conexión en el log de NXLog:
```cmd
type "C:\Program Files\nxlog\data\nxlog.log" | findstr "connected"
```

4. Capturar tráfico de red con Wireshark en el puerto 514 para verificar envío de paquetes

#### Alto Consumo de Recursos

**Síntomas**: NXLog consume CPU o memoria excesiva.

**Causas Comunes**:
1. Configuración de PollInterval muy agresiva
2. Query XML muy amplia capturando demasiados eventos
3. Falta de filtrado de eventos
4. Buffer insuficiente

**Solución**:

1. Ajustar PollInterval en nxlog.conf:
```conf
PollInterval 5
```

2. Implementar filtrado de eventos:
```conf
Exec if ($SeverityValue > 4) drop();
```

3. Limitar el volumen de eventos capturados:
```conf
MaxQueueSize 50000
FlushLimit 2000
```