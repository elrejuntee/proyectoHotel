from django.urls import path
from .views import (
    EstadoReservaView, EstadoReservaDetailView,
    ReservaView, ReservaDetailView,
    ReservaHabitacionView, ReservaHabitacionDetailView,
)

urlpatterns = [
    path('estados-reserva', EstadoReservaView.as_view()),
    path('estados-reserva/<int:pk>', EstadoReservaDetailView.as_view()),
    path('reservas', ReservaView.as_view()),
    path('reservas/<int:pk>', ReservaDetailView.as_view()),
    path('reservas-habitacion', ReservaHabitacionView.as_view()),
    path('reservas-habitacion/<int:pk>', ReservaHabitacionDetailView.as_view()),
]