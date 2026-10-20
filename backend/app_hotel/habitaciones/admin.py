from django.contrib import admin

from habitaciones.models import Habitacion, EstadoHabitacion, Comodidad, TipoHabitacion, TipoHabitacionComodidad

admin.site.register(Habitacion)
admin.site.register(EstadoHabitacion)
admin.site.register(Comodidad)
admin.site.register(TipoHabitacion)
admin.site.register(TipoHabitacionComodidad)