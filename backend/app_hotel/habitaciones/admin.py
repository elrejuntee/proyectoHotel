from django.contrib import admin

from habitaciones.models import Habitacion, EstadoHabitacion

admin.site.register(Habitacion)
admin.site.register(EstadoHabitacion)