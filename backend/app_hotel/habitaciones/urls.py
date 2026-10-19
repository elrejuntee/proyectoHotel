from django.urls import path
from .views import TipoHabitacionAPIView
from habitaciones.views import EstadoHabitacionView, HabitacionesView, TipoHabitacionComodidadView, ComodidadView, TipoHabitacionAPIView

urlpatterns = [
    path('habitaciones/', HabitacionesView.as_view(), name='habitaciones-list'),
    path('Estados-Habitaciones/', EstadoHabitacionView.as_view(), name='estados-habitaciones-list'),
    path('tipos-habitaciones/', TipoHabitacionAPIView.as_view(), name='tipo-habitaciones-list'),
    path('tipos-habitaciones-comodidades/', TipoHabitacionComodidadView.as_view(), name='tipo-habitaciones-comodidad-list'),
    path('comodidades/', ComodidadView.as_view(), name='comodidades-list'),
]