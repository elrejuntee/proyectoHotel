from django.db import models


class RolUsuario(models.Model):
    rol = models.CharField(
        max_length=50, 
        unique=True, 
        help_text="Nombre del rol, debe ser único."
    )

    def __str__(self):
        return self.rol


class Usuario(models.Model):
    id_rol = models.ForeignKey(
        RolUsuario, 
        on_delete=models.CASCADE, 
        related_name='usuarios',
        help_text="Rol asignado al usuario."
    )
    nombre = models.CharField(
        max_length=100, 
        help_text="Nombre del usuario."
    )
    apellido = models.CharField(
        max_length=100, 
        help_text="Apellido del usuario."
    )
    email = models.EmailField(
        unique=True, 
        help_text="Correo electrónico único."
    )
    contraseña = models.CharField(
        max_length=100, 
        help_text="Contraseña del usuario."
    )
    fecha_registro = models.DateField(
        auto_now_add=True, 
        help_text="Fecha de registro automática."
    )

    def __str__(self):
        return f"{self.nombre} {self.apellido}"