from django.contrib import admin
from .models import EstadoReserva, Reserva, ReservaHabitacion

admin.site.register(EstadoReserva)
admin.site.register(Reserva)
admin.site.register(ReservaHabitacion)