from rest_framework import serializers
from .models import RolUsuario, Usuario


class RolUsuarioSerializer(serializers.ModelSerializer):

  class Meta:
    model = RolUsuario
    fields = '__all__'


class UsuarioSerializer(serializers.ModelSerializer):
  id_rol = RolUsuarioSerializer(read_only=True)

  class Meta:
    model = Usuario
    fields = '__all__'