---
slug: /configuracion-docker
title: Configuración Docker
sidebar_label: Configuración Docker
---

## Instalación de Docker Engine en Ubuntu

### Introducción

Esta guía proporciona los pasos necesarios para instalar Docker Engine en Ubuntu. Docker Engine es una plataforma de contenedorización que permite empaquetar, distribuir y ejecutar aplicaciones en contenedores aislados.

### Requisitos Previos

- Ubuntu instalado
- Acceso root o privilegios sudo
- Conexión a Internet
- Arquitectura compatible: x86_64/amd64, armhf, arm64, o s390x

### Proceso de Instalación

#### Actualizar el índice de paquetes de APT

Antes de instalar cualquier paquete nuevo, es recomendable actualizar el índice de paquetes del sistema:

```bash
sudo apt-get update
```

#### Instalar los paquetes necesarios

Instalar los paquetes requeridos para permitir que APT use repositorios sobre HTTPS:

```bash
sudo apt-get install ca-certificates curl gnupg lsb-release
```

**Descripción de paquetes**:
- `ca-certificates`: Certificados de autoridades certificadoras comunes
- `curl`: Herramienta para transferir datos con URLs
- `gnupg`: Suite de encriptación y firma GNU Privacy Guard
- `lsb-release`: Información de la versión de Linux Standard Base

#### Agregar la clave GPG oficial de Docker

Crear el directorio para almacenar las claves de los repositorios y agregar la clave GPG de Docker:

```bash
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

**Nota**: La clave GPG garantiza la autenticidad de los paquetes descargados desde el repositorio de Docker.

#### Configurar el repositorio de Docker

Agregar el repositorio oficial de Docker a las fuentes de APT:

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

Este comando:
- Detecta automáticamente la arquitectura del sistema
- Configura la clave GPG para verificación
- Establece la versión de Ubuntu correcta
- Usa el canal "stable" (recomendado para producción)

#### Actualizar el índice de paquetes de APT (nuevamente)

Actualizar el índice de paquetes para incluir el repositorio de Docker recién agregado:

```bash
sudo apt-get update
```

#### Instalar Docker Engine y sus componentes

Instalar Docker Engine junto con todos los componentes necesarios:

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

**Componentes instalados**:
- `docker-ce`: Docker Community Edition (motor principal)
- `docker-ce-cli`: Interfaz de línea de comandos de Docker
- `containerd.io`: Runtime de contenedores
- `docker-buildx-plugin`: Plugin para construcción avanzada de imágenes
- `docker-compose-plugin`: Plugin para orquestación multi-contenedor

#### Verificar la instalación

Verificar que Docker Engine se instaló correctamente ejecutando la imagen de prueba:

```bash
sudo docker run hello-world
```

**Salida esperada**:
```
Hello from Docker!
This message shows that your installation appears to be working correctly.
```

Si se muestra este mensaje, Docker está instalado y funcionando correctamente.

### Configuración Post-Instalación

#### Permitir a usuarios no-root ejecutar comandos de Docker

Por defecto, los comandos de Docker requieren privilegios de root (sudo). Para permitir que usuarios sin privilegios ejecuten comandos de Docker:

#### Agregar el usuario al grupo docker

```bash
sudo usermod -aG docker $USER
```

#### Activar los cambios de grupo

```bash
newgrp docker
```

**Alternativa**: Cerrar sesión y volver a iniciarla para que los cambios surtan efecto.

#### Verificar que funciona sin sudo

```bash
docker run hello-world
```

Este comando debe ejecutarse sin necesidad de sudo.

### Verificación de la Instalación

#### Verificar versión de Docker

```bash
docker --version
```

Salida esperada:
```
Docker version 24.x.x, build xxxxxxx
```

#### Verificar información del sistema Docker

```bash
docker info
```

Este comando muestra información detallada sobre la configuración de Docker, incluyendo:
- Número de contenedores
- Número de imágenes
- Versión del kernel
- Sistema operativo
- Arquitectura
- Configuración de almacenamiento

#### Verificar que el servicio Docker está activo

```bash
sudo systemctl status docker
```

El servicio debe mostrar el estado "active (running)".

### Comandos Útiles de Docker

#### Gestión del servicio Docker

```bash
# Iniciar Docker
sudo systemctl start docker

# Detener Docker
sudo systemctl stop docker

# Reiniciar Docker
sudo systemctl restart docker

# Habilitar Docker al inicio del sistema
sudo systemctl enable docker

# Deshabilitar Docker al inicio del sistema
sudo systemctl disable docker
```

#### Comandos básicos de Docker

```bash
# Listar imágenes descargadas
docker images

# Listar contenedores en ejecución
docker ps

# Listar todos los contenedores (incluidos los detenidos)
docker ps -a

# Eliminar un contenedor
docker rm <container_id>

# Eliminar una imagen
docker rmi <image_id>

# Ver logs de un contenedor
docker logs <container_id>

# Ejecutar un contenedor en modo interactivo
docker run -it ubuntu bash

# Detener un contenedor
docker stop <container_id>

# Iniciar un contenedor detenido
docker start <container_id>
```

### Solución de Problemas

#### Error: Cannot connect to the Docker daemon

**Causa**: El servicio Docker no está en ejecución.

**Solución**:
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

#### Error: Permission denied while trying to connect to the Docker daemon socket

**Causa**: El usuario actual no tiene permisos para acceder al socket de Docker.

**Solución**:
```bash
sudo usermod -aG docker $USER
newgrp docker
```

#### Error: Package docker-ce has no installation candidate

**Causa**: El repositorio de Docker no se agregó correctamente.

**Solución**:
1. Verificar el contenido de `/etc/apt/sources.list.d/docker.list`
2. Ejecutar `sudo apt-get update`
3. Intentar la instalación nuevamente

### Desinstalación de Docker

Si es necesario desinstalar Docker completamente:

```bash
# Desinstalar paquetes de Docker
sudo apt-get purge docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Eliminar imágenes, contenedores y volúmenes
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd

# Eliminar archivo de configuración del repositorio
sudo rm /etc/apt/sources.list.d/docker.list

# Eliminar clave GPG
sudo rm /etc/apt/keyrings/docker.gpg
```

### Recursos Adicionales

- **Documentación oficial de Docker**: [Documentacion Oficial](https://docs.docker.com/)
- **Docker Hub**: [Docker Hub](https://hub.docker.com/)
- **Guías de Docker**: [Guias](https://docs.docker.com/get-started/)
- **Referencia de Dockerfile**: [Dockerfile](https://docs.docker.com/engine/reference/builder/)
- **Referencia de Docker Compose**: [Docker Compose](https://docs.docker.com/compose/compose-file/)
