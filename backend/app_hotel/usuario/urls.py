from django.urls import path
from .views import LoginView, RolUsuarioView, UsuarioView, UsuarioDetailView

urlpatterns = [
    path("login/", LoginView.as_view()),
    path("usuario/", UsuarioView.as_view()),
    path("usuario/<int:pk>/", UsuarioDetailView.as_view()),
    path("roles", RolUsuarioView.as_view()),
]