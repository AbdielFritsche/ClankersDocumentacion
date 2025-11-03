---
slug: /configuracion-switch-cisco
title: Configuración Switch Cisco
sidebar_label: Configuración Switch Cisco
---

## Configuración de Switch con VLANs

Esta configuración implementa un switch de capa 2 con múltiples VLANs, puertos trunk para interconexión con otros dispositivos (como el router ROAS), y puertos de acceso para dispositivos finales.

### Creación de VLANs

Las VLANs permiten segmentar la red en diferentes dominios de broadcast lógicos.

```cisco
vlan 2
 name Administracion
 exit
vlan 10
 name Corporativo
 exit
vlan 20
 name IT
 exit
vlan 30
 name OT
 exit
vlan 40
 name LineaProduccion
 exit
vlan 100
 name Servicios
 exit
```

- Cada VLAN se crea con un ID numérico (2, 10, 20, 30, 40, 100).
- El comando `name` asigna un nombre descriptivo a cada VLAN para facilitar la administración.

### Resumen de VLANs

- **VLAN 2**: Administración
- **VLAN 10**: Corporativo
- **VLAN 20**: IT (Tecnologías de la Información)
- **VLAN 30**: OT (Tecnologías Operacionales)
- **VLAN 40**: Línea de Producción
- **VLAN 100**: Servicios (DMZ)

### Configuración de Puertos Trunk

Los puertos trunk permiten que múltiples VLANs pasen a través de un único enlace físico, usando etiquetado 802.1Q.

#### Puerto GigabitEthernet0/1

```cisco
int g0/1
 switchport mode trunk
 switchport trunk allowed vlan add 2,10,20,30,40,100
 exit
```

- `switchport mode trunk`: Configura el puerto como trunk (permite múltiples VLANs).
- `switchport trunk allowed vlan add ...`: Especifica qué VLANs pueden pasar por este trunk.
- **Uso típico**: Conexión al router (para ROAS) o a otro switch.

#### Puerto FastEthernet0/5

```cisco
int fa0/5
 switchport mode trunk
 switchport trunk allowed vlan add 2,10,20,30,40,100
 exit
```

- Configuración idéntica al puerto anterior.
- **Uso típico**: Conexión a otro switch para expandir la red.

### Configuración de Puertos de Acceso

Los puertos de acceso conectan dispositivos finales (servidores, PCs, impresoras) y solo pertenecen a una VLAN.

```cisco
int range fa0/1 - 4
 switchport mode access
 switchport access vlan 100
 exit
```

- `int range fa0/1 - 4`: Configura múltiples puertos simultáneamente (fa0/1, fa0/2, fa0/3, fa0/4).
- `switchport mode access`: Define los puertos como puertos de acceso (una sola VLAN).
- `switchport access vlan 100`: Asigna estos puertos a la VLAN 100 (Servicios/DMZ).
- **Uso típico**: Conexión de servidores en la DMZ.

### Configuración de Seguridad Básica

#### Contraseñas y Acceso Privilegiado

```cisco
enable secret Cisco123!
```

- `enable secret`: Establece una contraseña encriptada (MD5) para el modo privilegiado.

#### Usuario Local

```cisco
username admin secret Admin123!
```

- Crea un usuario local con contraseña encriptada para acceso al switch.

#### Configuración de Líneas VTY (Acceso Remoto SSH/Telnet)

```cisco
line vty 0 15
 login local
 transport input ssh
 exec-timeout 10 0
 exit
```

- `line vty 0 15`: Los switches suelen tener 16 líneas VTY (0-15).
- `login local`: Requiere autenticación con usuarios locales.
- `transport input ssh`: Solo permite SSH (más seguro que Telnet).
- `exec-timeout 10 0`: Cierra la sesión después de 10 minutos de inactividad.

#### Configuración de Línea de Consola

```cisco
line console 0
 login local
 exec-timeout 5 0
 logging synchronous
 exit
```

- `login local`: Requiere autenticación local.
- `exec-timeout 5 0`: Timeout de 5 minutos.
- `logging synchronous`: Evita que los mensajes del sistema interrumpan la escritura.

#### Encriptación de Contraseñas

```cisco
service password-encryption
```

- Encriptar todas las contraseñas visibles en la configuración.

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

#### Configuración de Interfaz de Administración (SVI)

```cisco
int vlan 2
 ip address 192.168.2.10 255.255.255.0
 no shutdown
 exit

ip default-gateway 192.168.2.1
```

- `int vlan 2`: Crear una interfaz virtual (SVI) en la VLAN de administración.
- `ip address`: Asignar una IP al switch para administración remota.
- `ip default-gateway`: Definir el gateway (normalmente el router ROAS).

#### Deshabilitar Servicios Innecesarios

```cisco
no ip http server
no ip http secure-server
no cdp run
```

- Desactivar servicios que no se utilizan y que pueden ser vectores de ataque.
- **Nota**: Solo desactiva CDP si no se necesita para monitoreo.

### Seguridad Adicional en Puertos de Acceso

#### Port Security (Ejemplo en fa0/1)

```cisco
int fa0/1
 switchport port-security
 switchport port-security maximum 2
 switchport port-security violation restrict
 switchport port-security mac-address sticky
 exit
```

- `port-security`: Activa la seguridad por puerto.
- `maximum 2`: Permite máximo 2 direcciones MAC en el puerto.
- `violation restrict`: Descarta tráfico de MACs no autorizadas pero mantiene el puerto activo.
- `mac-address sticky`: Aprende dinámicamente las MACs y las guarda en la configuración.

#### BPDU Guard en Puertos de Acceso

```cisco
spanning-tree portfast bpduguard default
```

- Protege contra ataques de Spanning Tree en puertos de acceso.
- Si un puerto de acceso recibe una BPDU, el puerto se deshabilita automáticamente.

---

### Configuración Completa con Seguridad

El siguiente script contiene una configuración estandard inicial para copiar y pegar en un switch

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
 exec-timeout 10 0
 exit

! === DESACTIVAR SERVICIOS INNECESARIOS ===
no ip http server
no ip http secure-server

! === SEGURIDAD DE SPANNING TREE ===
spanning-tree portfast bpduguard default

! === CREACIÓN DE VLANs ===
vlan 2
 name Administracion
 exit
vlan 10
 name Corporativo
 exit
vlan 20
 name IT
 exit
vlan 30
 name OT
 exit
vlan 40
 name LineaProduccion
 exit
vlan 100
 name Servicios
 exit

! === CONFIGURACIÓN DE INTERFAZ DE ADMINISTRACIÓN ===
int vlan 2
 ip address 192.168.2.10 255.255.255.0
 no shutdown
 exit

ip default-gateway 192.168.2.1

! === CONFIGURACIÓN DE PUERTOS TRUNK ===
int g0/1
 switchport mode trunk
 switchport trunk allowed vlan 2,10,20,30,40,100
 exit

int fa0/5
 switchport mode trunk
 switchport trunk allowed vlan 2,10,20,30,40,100
 exit

! === CONFIGURACIÓN DE PUERTOS DE ACCESO ===
int range fa0/1 - 4
 switchport mode access
 switchport access vlan 100
 spanning-tree portfast
 exit

```

### Notas Importantes

1. **Cambiar las contraseñas por defecto**: Las contraseñas `Cisco123!` y `Admin123!` son ejemplos. Usar contraseñas seguras en producción.

2. **Configurar SSH**: Para usar SSH en lugar de Telnet, se necesita generar claves RSA:
   ```cisco
   ip domain-name midominio.local
   crypto key generate rsa modulus 2048
   ```

3. **Port Security**: La configuración de port-security mostrada es un ejemplo. Requiere ajustes según las necesidades específicas.

4. **VLAN nativa**: Por defecto, la VLAN 1 es la VLAN nativa en los trunks. Cambiarla por seguridad es una buena practica:
   ```cisco
   int g0/1
    switchport trunk native vlan 999
   ```

5. **Verificación**: Después de aplicar la configuración, verificar que este activa con:
   - `show vlan brief`
   - `show interfaces trunk`
   - `show interfaces status`
   - `show port-security`