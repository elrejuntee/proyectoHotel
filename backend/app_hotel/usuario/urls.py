from django.urls import path
from .views import RolUsuarioView, UsuarioView, UsuarioDetailView

urlpatterns = [
    path("usuarios/", UsuarioView.as_view()),
    path(
        "usuario/<int:pk>", UsuarioDetailView.as_view()
    ),
    path("roles/",RolUsuarioView.as_view()),
]