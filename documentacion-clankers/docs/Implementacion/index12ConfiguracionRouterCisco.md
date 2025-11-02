---
slug: /configuracion-router-cisco
title: Configuracion Router Cisco
sidebar_label: Configuracion Router Cisco
---

:::info Importante
Esta configuración esta pensada específicamente para realizar el montaje inicial de la arquitectura ya que más adelante con la configuración de F5 BIG-IP, **la máquina virtual de BIG-IP actuara como router**. Una vez implementado el firewall no será necesario el router.
:::

## Router-on-a-Stick (ROAS)

Esta configuración implementa un "Router-on-a-Stick" (ROAS). Su propósito es usar una **única interfaz física** del router (`GigabitEthernet0/0`) para **enrutar el tráfico entre múltiples VLANs**.

Esto se logra creando sub-interfaces virtuales (una para cada VLAN) que etiquetan el tráfico usando el protocolo `802.1Q`.

### Habilitación de la Interfaz Física

```cisco
enable
conf t

int g0/0
 no shutdown
 exit
```

- `int g0/0`: Ingresa a la configuración de la interfaz física GigabitEthernet0/0.
- `no shutdown`: Activa la interfaz. Si esta interfaz física está apagada, ninguna de las sub-interfaces virtuales funcionará.

### Creación de Sub-interfaces (Gateways VLAN)

Se crea una sub-interfaz para cada VLAN. Cada una actúa como la puerta de enlace (gateway) para los dispositivos en esa red.

```cisco
int g0/0.2
 ip address 192.168.2.1 255.255.255.0
 encapsulation dot1q 2
 exit
```

- `int g0/0.2`: Crea la sub-interfaz virtual .2 (asociada a la VLAN 2).
- `ip address 192.168.2.1 ...`: Asigna la dirección IP que servirá como gateway para la VLAN 2 (Administración).
- `encapsulation dot1q 2`: Es el comando crucial. Le dice al router que todo el tráfico que salga por esta sub-interfaz debe ser "etiquetado" con el ID de VLAN 2.

### Configuración del DHCP Relay

Para las VLANs que no tienen su propio servidor DHCP, se usa un "helper address" para reenviar las solicitudes de DHCP a un servidor centralizado.

```cisco
int g0/0.10
 ip address 192.168.10.1 255.255.255.0
 encapsulation dot1q 10
 ip helper-address 192.168.100.11
 exit
```

- `ip helper-address 192.168.100.11`: Le indica al router que cualquier solicitud de DHCP (que es un broadcast) recibida en esta interfaz (g0/0.10) debe ser reenviada como un paquete unicast al servidor DHCP ubicado en 192.168.100.11 (en la DMZ).

### Resumen de la Configuración

- **VLAN 2 (Admin)**: Gateway 192.168.2.1
- **VLAN 10 (Corp)**: Gateway 192.168.10.1 - Usa DHCP Relay
- **VLAN 20 (IT)**: Gateway 192.168.20.1 - Usa DHCP Relay
- **VLAN 30 (OT)**: Gateway 192.168.30.1 - Usa DHCP Relay
- **VLAN 40 (Producción)**: Gateway 192.168.40.1 - Usa DHCP Relay
- **VLAN 100 (DMZ)**: Gateway 192.168.100.1 - No necesita relay, el servidor DHCP está aquí
---

### Configuración de Seguridad Básica

#### Contraseñas y Acceso Privilegiado

```cisco
enable secret Cisco123!
```

- `enable secret`: Establece una contraseña encriptada (usando MD5) para acceder al modo privilegiado. **Siempre usar `secret` en lugar de `password`** porque la contraseña se guarda encriptada.

#### Usuario Local

```cisco
username admin secret Admin123!  
```

- Crear un usuario local con contraseña encriptada para acceso al dispositivo.

#### Configuración de Líneas VTY (Acceso Remoto SSH/Telnet)

```cisco
line vty 0 15
 login local
 transport input ssh
 exec-timeout 5 0
 exit
```

- `line vty 0 15`: Configura las 5 líneas VTY (0-15) para acceso remoto.
- `login local`: Requiere autenticación usando usuarios locales (definidos con `username`).
- `transport input ssh`: **Solo permite SSH**, bloqueando Telnet (más seguro).
- `exec-timeout 5 0`: Cierra la sesión automáticamente después de 10 minutos de inactividad.

#### Configuración de Línea de Consola

```cisco
line console 0
 login local
 exec-timeout 5 0
 logging synchronous
 exit
```

- `line console 0`: Configura el acceso por consola física.
- `login local`: Requiere autenticación con usuario local.
- `exec-timeout 5 0`: Cierra la sesión después de 5 minutos de inactividad.
- `logging synchronous`: Evita que los mensajes del sistema interrumpan lo que estás escribiendo.

#### Encriptación de Contraseñas

```cisco
service password-encryption
```

- Encripta todas las contraseñas en texto plano del archivo de configuración (usa un cifrado débil tipo 7, pero es mejor que nada).

#### Banner de Advertencia Legal

```cisco
banner motd #
*****************************************************
*  ACCESO AUTORIZADO SOLAMENTE                      *
*  El acceso no autorizado está prohibido           *
*  Todas las actividades son monitoreadas           *
*****************************************************
#
```

- Muestra un mensaje legal antes del login. Importante para temas de cumplimiento y aspectos legales.

---

### Configuración Completa con Seguridad

Aquí está el script completo listo para copiar y pegar en la terminal de configuración del router:

```cisco
enable
conf t

! === CONFIGURACIÓN DE SEGURIDAD BÁSICA ===
enable secret Cisco123!
username admin secret Admin123!
service password-encryption

banner motd #
*****************************************************
*  ACCESO AUTORIZADO SOLAMENTE                      *
*  El acceso no autorizado está prohibido           *
*  Todas las actividades son monitoreadas           *
*****************************************************
#

! === CONFIGURACIÓN DE LÍNEAS ===
line console 0
 login local
 exec-timeout 5 0
 logging synchronous
 exit

line vty 0 15
 login local
 transport input ssh
 exec-timeout 5 0
 exit

! === CONFIGURACIÓN DE INTERFAZ FÍSICA ===
int g0/0
 no shutdown
 exit

! === CONFIGURACIÓN DE SUB-INTERFACES Y VLANs ===
int g0/0.2
 ip address 192.168.2.1 255.255.255.0
 encapsulation dot1q 2
 exit

int g0/0.10
 ip address 192.168.10.1 255.255.255.0
 encapsulation dot1q 10
 ip helper-address 192.168.100.11
 exit

int g0/0.20
 ip address 192.168.20.1 255.255.255.0
 encapsulation dot1q 20
 ip helper-address 192.168.100.11
 exit

int g0/0.30
 ip address 192.168.30.1 255.255.255.0
 encapsulation dot1q 30
 ip helper-address 192.168.100.11
 exit

int g0/0.40
 ip address 192.168.40.1 255.255.255.0
 encapsulation dot1q 40
 ip helper-address 192.168.100.11
 exit

int g0/0.100
 ip address 192.168.100.1 255.255.255.0
 encapsulation dot1q 100
 exit

```