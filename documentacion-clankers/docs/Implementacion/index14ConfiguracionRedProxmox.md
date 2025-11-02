---
slug: /configuracion-red-proxmox
title: Configuracion Red Proxmox
sidebar_label: Configuracion Red Proxmox
---

## Configuración de las interfaces en Proxmox

Al iniciar la máquina de proxmox se genera por defecto un linux bridge asociado a la interfáz seleccionada durante la configuración en la máquina el cuál funcionara como un switch virtual para la arquitectura y tendrá por defecto la IP declarada durante la configuración inicial. Dentro del linux bridge generado será necesario desde el GUI marcar como _"Vlan Aware"_, esta opción viene desmarcada por defecto y es lo que permitira que pueda realizar la conexión entre las vlans generadas, y luego dar click en _"Apply Changes"_

Para la configuración de VLAN no se podrá usar la interfaz gráfica bloqueara la asignación de IP para las subredes que tengan un número inferior a la IP que tenga el número mayor.
El archivo en cuestión sobre el cuál se estará trabajando es:

```bash
/etc/network/interfaces
```

Al acceder al archivo se debería tener algo muy similar a lo siguiente:

Acceder al archivo
```bash
/etc/network/interfaces
```

Interior del archivo
```bin
auto lo
iface lo inet loopback

auto eno1
iface eno1 inet manual

iface eno2 inet manual

auto vmbr0
iface vmbr0 inet static
address 192.168.100.2/24
gateway 192.168.100.1
bridge-ports eno1
bridge-stp off
bridge-fd 0
bridge-vlan-aware yes
bridge-vids 2-4094

source /etc/network/interfaces.d/*
```

Para añadir las VLANS se sigue la siguiente estructura
```bin
auto vmbr0.2
iface vmbr0.2 inet static
address 192.168.2.2/24
gateway 192.168.2.1
#VLAN 2 Administrativo
```
Esto le dice directamente a Proxmox que la VLAN se cree bajo el puente vmbr0 y autómaticamente le asigna el etiquetado de la VLAN especificada.

Finalmente el archivo quedaría así:
```bin
auto lo
iface lo inet loopback

auto eno1
iface eno1 inet manual

iface eno2 inet manual

auto vmbr0
iface vmbr0 inet static
address 192.168.100.2/24
gateway 192.168.100.1
bridge-ports eno1
bridge-stp off
bridge-fd 0
bridge-vlan-aware yes
bridge-vids 2-4094

auto vmbr0.2
iface vmbr0.2 inet static
address 192.168.2.2/24
gateway 192.168.2.1
#VLAN 2 Administrativo

auto vmbr0.10
iface vmbr0.10 inet static
address 192.168.10.2/24
gateway 192.168.10.1
#VLAN 10 Corporativo

auto vmbr0.20
iface vmbr0.20 inet static
address 192.168.20.2/24
gateway 192.168.20.1
#VLAN 20 IT

auto vmbr0.30
iface vmbr0.30 inet static
address 192.168.30.2/24
gateway 192.168.30.1
#VLAN 30 OT

auto vmbr0.40
iface vmbr0.40 inet static
address 192.168.40.2/24
gateway 192.168.40.1
#VLAN 40 LineaProduccion

auto vmbr0.100
iface vmbr0.100 inet static
address 192.168.100.2/24
gateway 192.168.100.1
#VLAN 100 DMZ

source /etc/network/interfaces.d/*