from rest_framework import serializers
from .models import RolUsuario, Usuario


class RolUsuarioSerializer(serializers.ModelSerializer):

  class Meta:
    model = RolUsuario
    fields = '__all__'


class UsuarioSerializer(serializers.ModelSerializer):
  id_rol = serializers.PrimaryKeyRelatedField(
    queryset=RolUsuario.objects.all(),
    required=False,
  )
  rol = serializers.CharField(source='id_rol.rol', read_only=True)
  password = serializers.CharField(
    source='contraseña',
    write_only=True,
    min_length=6,
    max_length=10,
  )

  class Meta:
    model = Usuario
    fields = ('id', 'id_rol', 'rol', 'nombre', 'apellido', 'email', 'password', 'fecha_registro')
    read_only_fields = ('id', 'fecha_registro')