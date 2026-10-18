from django.urls import path
from .views import TipoServicioAPIView, ServicioAPIView

urlpatterns = [
    path('tipo-servicios/', TipoServicioAPIView.as_view(), name='tipos-servicio-list'),
    path('servicios/', ServicioAPIView.as_view(), name='servicios-list'),
]