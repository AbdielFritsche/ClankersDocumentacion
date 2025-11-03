---
slug: /configuracion-red-f5
title: Configuración Red F5
sidebar_label: Configuración Red F5
---

:::info
Es importante que al momento de configurar las interfaces para la máquina vritual de F5 BIG-IP debe tener una interfaz por cada red en la que se va a establecer el firewall, en nuestro caso se añaden 6 interfaces.
:::

### Configuración de IP de management
Dentro de F5 BIG-IP durante la configuración inicial será necesario ingresar la dirección IP en la cuál estará estableciada la interfaz gráfica de configuración, en nuestra arquitectura esa dirección será **192.168.2.3** y mediante el puerto **8443** será posible acceder a la GUI.

### Configuración de VLANS
En la sección de ``` Network > VLANs``` se crean las 5 VLANs de datos para la red:

* VLAN_10_Corp:
    * Tag ID: ```10```
    * Interfaces: ```1.1``` marcada como Untagged

* VLAN_20_IT:
    * Tag ID: ```20```
    * Interfaces: ```1.2``` marcada como Untagged

* VLAN_30_OT:
    * Tag ID: ```30```
    * Interfaces: ```1.3``` marcada como Untagged

* VLAN_40_Prod:
    * Tag ID: ```40```
    * Interfaces: ```1.4``` marcada como Untagged

* VLAN_100_DMZ
    * Tag ID: ```100```
    * Interfaces ```1.5``` marcada como Untagged

Al seleccionar la interfaz se marca como untagged ya que tenemos un switch externo que ya esta marcando el tráfico con la etiqueta correspondiente a su VLAN.

### Configuración de Self IPs (Gateways)

En la sección de ```Network > Self IP's``` se asocia una IP para cada VLAN creada y su interfaz asociada. Esta IP será el gateway de la red asociada a la VLAN.

* SelfIP_10_Corp:
    * IP Address: ```192.168.10.1```
    * Netmask: ```255.255.255.0```
    * VLAN: ```VLAN_10_Corp```
    * Port Lockdown: ```Allow Default```

* SelfIP_20_IT:
    * IP Address: ```192.168.20.1```
    * Netmask: ```255.255.255.0```
    * VLAN: ```VLAN_20_IT```
    * Port Lockdown: ```Allow Default```

* SelfIP_30_OT:
    * IP Address: ```192.168.30.1```
    * Netmask: ```255.255.255.0```
    * VLAN: ```VLAN_30_OT```
    * Port Lockdown: ```Allow Default```

* SelfIP_40_Prod:
    * IP Address: ```192.168.40.1```
    * Netmask: ```255.255.255.0```
    * VLAN: ```VLAN_10_Prod```
    * Port Lockdown: ```Allow Default```

* SelfIP_100_DMZ:
    * IP Address: ```192.168.100.1```
    * Netmask: ```255.255.255.0```
    * VLAN: ```VLAN_100_DMZ```
    * Port Lockdown: ```Allow Default```

Con esta configuración, BIG IP estaría listo para funcionar como "Router on a stick" por lo que se tendrá que reconfigurar el router físico para que solo trabaje con la VLAN 2.

:::warning Atención
La VLAN 2 solo podrá ser accesible por dispositivos de su propia red para restringir totalmente su acceso a usuarios no autorizados.
:::