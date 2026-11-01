from django.urls import path
from .views import (
    ServicioAPIView,
    ServicioDetailAPIView,
    TipoServicioAPIView,
    TipoServicioDetailAPIView,
)

urlpatterns = [
    path('tipo-servicios/', TipoServicioAPIView.as_view(), name='tipos-servicio-list'),
    path('tipo-servicios/<int:pk>/', TipoServicioDetailAPIView.as_view(), name='tipos-servicio-detail'),
    path('servicios/', ServicioAPIView.as_view(), name='servicios-list'),
    path('servicios/<int:pk>/', ServicioDetailAPIView.as_view(), name='servicios-detail'),
]