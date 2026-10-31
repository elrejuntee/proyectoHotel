from django.urls import path
from .views import (
    EstadoReservaView, 
    ReservaServicioView,
    ReservaView,
    ReservaHabitacionView,
)

urlpatterns = [
    path('estados-reserva/', EstadoReservaView.as_view()),
    path('reservas/', ReservaView.as_view()),
    path('reservas-habitacion/', ReservaHabitacionView.as_view()),
    path('reservas-servicio/', ReservaServicioView.as_view()),
]