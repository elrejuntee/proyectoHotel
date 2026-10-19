from django.urls import path
from .views import TipoHabitacionAPIView
from habitaciones.views import EstadoHabitacionView, HabitacionesView

urlpatterns = [
    path('habitaciones/', HabitacionesView.as_view(), name='habitaciones'),
    path('Estados-Habitaciones/', EstadoHabitacionView.as_view(), name='estados-habitaciones'),
    path('tipo-habitaciones/', TipoHabitacionAPIView.as_view(), name='tipo-habitaciones-list'),
]