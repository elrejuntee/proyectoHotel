from rest_framework import serializers
from .models import RolUsuario, Usuario


class RolUsuarioSerializer(serializers.ModelSerializer):

  class Meta:
    model = RolUsuario
    fields = '__all__'


class UsuarioSerializer(serializers.ModelSerializer):
 
  class Meta:
    model = Usuario
    fields = '__all__'

class UsuarioConRolSerializer(serializers.ModelSerializer):
  rol = RolUsuarioSerializer(source='id_rol', read_only = True)
  class Meta:
    model = Usuario
    fields = '__all__'