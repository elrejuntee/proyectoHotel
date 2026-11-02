from django.urls import path
from .views import TipoServicioAPIView, TipoServicioDetailView, ServicioAPIView, ServicioDetailView

urlpatterns = [
    path('tipo-servicios/', TipoServicioAPIView.as_view(), name='tipos-servicio-list'),
    path('tipo-servicios/<int:pk>/', TipoServicioDetailView.as_view(), name='tipos-servicio-detail'),
    path('servicios/', ServicioAPIView.as_view(), name='servicios-list'),
    path('servicios/<int:pk>/', ServicioDetailView.as_view(), name='servicios-detail'),
]