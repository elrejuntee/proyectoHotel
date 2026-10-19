from django.urls import path
from .views import RolUsuarioView, UsuarioView, UsuarioDetailView

urlpatterns = [
    path("usuario", UsuarioView.as_view()),
    path(
        "usuario/<int:pk>", UsuarioDetailView.as_view()
    ),  # Endpoint para modificar un usuario por ID
    path("roles", RolUsuarioView.as_view()),
]