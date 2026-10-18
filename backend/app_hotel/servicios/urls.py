from django.urls import path
from .views import TipoServicioAPIView, ServicioAPIView

urlpatterns = [
    path('api/v1/tipo-servicios/', TipoServicioAPIView.as_view(), name='tipos-servicio-list'),
    path('api/v1/servicios/', ServicioAPIView.as_view(), name='servicios-list'),
]