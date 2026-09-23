# El Rejunte Hotel — Aplicación Web (Angular)

## ¿Qué es este proyecto?

**El Rejunte Hotel** es una aplicación web desarrollada como sistema de gestión hotelera, construida utilizando componentes modernos y herramientas de desarrollo frontend.

El propósito del desarrollo es permitir la optimización de procesos relacionados con reservas, control de habitaciones, registro de usuarios y gestión de servicios adicionales, proporcionando una interfaz rápida, modular y mantenible.

---

## ¿Qué páginas tiene el sitio?

### Para cualquier visitante
- **Inicio:** foto principal del hotel, lista de servicios (comedor, piscina, WiFi, gimnasio, traslado) y las habitaciones disponibles con sus precios.
- **Quiénes somos:** historia del hotel y presentación de los desarrolladores de la web.
- **Iniciar sesión:** formulario para ingresar al área privada con correo y contraseña.
- **Registrarse:** formulario para registrarse al sistema.

### Para huéspedes registrados
- **Mi panel:** el cliente puede ver su información personal, las habitaciones que visitó recientemente y su historial de reservas con fechas y montos.
- **Reservas:** sección interactiva para consultar disponibilidad, seleccionar fechas, elegir tipos de habitación y gestionar o concretar nuevas reservas.

### Para el personal del hotel
- **Panel de administración:** vista completa del estado de las habitaciones (cuántas están disponibles, ocupadas o en mantenimiento), con buscador, filtros y opción de agregar nuevas habitaciones.

### Control de errores y estados vacíos
- **Error 404 / Listas vacías:** Componentes diseñados para mostrar una tarjeta centrada con imagen y mensaje descriptivo cuando una ruta no existe o cuando una búsqueda no arroja resultados.

---

## Tecnologías y Herramientas Utilizadas

- **Framework:** [Angular](https://angular.dev/) (v19)
- **Estilos:** Bootstrap / CSS
- **Control de versiones:** Git y GitHub
- **Metodología / Organización:** Scrum

---

## Utilización de las siguientes IA:
- Claude
- Gemini

---

## ¿Cómo ver y ejecutar el proyecto en tu computadora?

### Lo que necesitás tener instalado
- [Git](https://git-scm.com/) — para clonar el repositorio.
- [Node.js](https://nodejs.org/) (versión LTS recomendada) — incluye npm para gestionar las dependencias.
- [Visual Studio Code](https://code.visualstudio.com/) — el entorno de desarrollo recomendado.

### Pasos para ponerlo en marcha

**1. Clonar el repositorio**

Abrí tu terminal (Git Bash o la consola de tu preferencia) y ejecutá el siguiente comando:
```bash
git clone [https://github.com/adriel1364/proyectoHotel.git](https://github.com/adriel1364/proyectoHotel.git)l1364/proyectoHotel.git)

**2. Abrir la carpeta en Visual Studio Code:**
Entra a Visual Studio Code, ve a Archivo > Abrir carpeta... y selecciona la carpeta del proyecto clonado.

**3. Instalar las dependencias:**
Abre la terminal integrada dentro de Visual Studio Code y ejecuta: npm install

**4. Ejecutar el servidor de desarrollo:**
Escribe el siguiente comando en la terminal para poner en marcha la aplicación: ng serve

**5. Abrir el navegador**
Una vez que el servidor compile correctamente, el mensaje en la terminal te indicará que la aplicación está lista. Abre tu navegador web de preferencia y entra a la dirección:

http://localhost:4200/
