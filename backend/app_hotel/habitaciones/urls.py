from django.urls import path
from .views import (
    HabitacionesView,
    HabitacionDetailView,
    EstadoHabitacionView,
    TipoHabitacionAPIView,
    TipoHabitacionDetailView,
    TipoHabitacionComodidadView,
    ComodidadView,
)

urlpatterns = [
    path('habitaciones/', HabitacionesView.as_view(), name='habitaciones-list'),
    path('habitaciones/<int:pk>/', HabitacionDetailView.as_view(), name='habitaciones-detail'),
    path('estados-habitaciones/', EstadoHabitacionView.as_view(), name='estados-habitaciones-list'),
    path('tipos-habitaciones/', TipoHabitacionAPIView.as_view(), name='tipo-habitaciones-list'),
    path('tipos-habitaciones/<int:pk>/', TipoHabitacionDetailView.as_view(), name='tipo-habitaciones-detail'),
    path('tipos-habitaciones-comodidades/', TipoHabitacionComodidadView.as_view(), name='tipo-habitaciones-comodidad-list'),
    path('comodidades/', ComodidadView.as_view(), name='comodidades-list'),
]