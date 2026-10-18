from rest_framework import serializers
from .models import TipoServicio, Servicio

class TipoServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoServicio
        fields = '__all__'

class ServicioSerializer(serializers.ModelSerializer):
    tipo_servicio = TipoServicioSerializer(read_only = True)
    
    class Meta:
        model = Servicio
        fields = '__all__'