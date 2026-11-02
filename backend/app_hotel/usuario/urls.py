from django.urls import path
from .views import RolUsuarioView, RolUsuarioDetailView, UsuarioView, UsuarioDetailView, UsuarioConRolView

urlpatterns = [
    path("usuarios/", UsuarioView.as_view()),
    path(
        "usuario/<int:pk>", UsuarioDetailView.as_view()
    ),
    path("roles/", RolUsuarioView.as_view()),
    path("rol/<int:pk>", RolUsuarioDetailView.as_view()),

    path("login/", UsuarioConRolView.as_view()),
]