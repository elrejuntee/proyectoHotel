# El Rejunte Hotel — Angular

Aplicación web para la gestión de habitaciones, reservas, servicios y usuarios del hotel. El frontend está desarrollado con Angular 19 y se conecta a una API Django REST.

## Requisitos

- Node.js LTS y npm
- Python y pip
- MySQL

## Ejecutar el backend

Configura `backend/app_hotel/.env` con los datos de conexión a MySQL:

```env
DB_NAME=nombre_de_la_base
DB_USER=usuario_mysql
DB_PASSWORD=contraseña_mysql
DB_HOST=localhost
DB_PORT=3306
```

Desde la carpeta `backend/app_hotel`, instala las dependencias, aplica migraciones y levanta Django:

```bash
python -m pip install -r ../requirements.txt
python manage.py migrate
python manage.py runserver
```

La API queda disponible en `http://localhost:8000/api`. La base debe contener los catálogos y roles necesarios para las operaciones del hotel.

## Ejecutar el frontend

Desde otra terminal, en la carpeta `frontend`:

```bash
npm install
npm start
```

Abre `http://localhost:4200/`. Las llamadas del frontend se dirigen a `http://localhost:8000/api`; Django permite CORS para el origen local de Angular.
