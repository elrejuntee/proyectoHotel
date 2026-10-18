from rest_framework import serializers
from .models import RolUsuario, Usuario


class RolUsuarioSerializer(serializers.ModelSerializer):

  class Meta:
    model = RolUsuario
    fields = '__all__'


class UsuarioSerializer(serializers.ModelSerializer):
  # Serializador anidado opcional si se requiere la información del rol desde el lado "muchos"
  id_rol = RolUsuarioSerializer(read_only=True)

  class Meta:
    model = Usuario
    fields = '__all__'