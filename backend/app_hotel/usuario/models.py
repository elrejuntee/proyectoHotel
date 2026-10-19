from django.core.validators import RegexValidator
from django.db import models


class RolUsuario(models.Model):
    rol = models.CharField(
        max_length=50, 
        unique=True,
        choices=[('admin','admin'),('usuario','usuario')],
        default='usuario',
        help_text="Nombre del rol, debe ser único."
    )

    def __str__(self):
        return self.rol


class Usuario(models.Model):
    id_rol = models.ForeignKey(
        RolUsuario, 
        on_delete=models.PROTECT, 
        related_name='usuarios',
        help_text="Rol asignado al usuario."
    )
    nombre = models.CharField(
        max_length=50, 
        help_text="Nombre del usuario."
    )
    apellido = models.CharField(
        max_length=30, 
        help_text="Apellido del usuario."
    )
    email = models.EmailField(
        unique=True, 
        help_text="Correo electrónico único."
    )
    contraseña = models.CharField(
        max_length=10,
        validators=[RegexValidator(regex=r'^.{6,}$')],
        help_text='La contraseña debe tener al menos 6 caracteres.',
    )
    
    fecha_registro = models.DateField(
        auto_now_add=True, 
        help_text="Fecha de registro automática."
    )

    def __str__(self):
        return f"{self.nombre} {self.apellido} {self.email}"