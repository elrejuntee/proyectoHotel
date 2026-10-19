from .models import Habitacion, EstadoHabitacion, Comodidad, TipoHabitacion, TipoHabitacionComodidad
from rest_framework import serializers

class HabitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habitacion
        fields = '__all__'


class EstadoHabitacionSerializer(serializers.ModelSerializer): 
    class Meta:
        model = EstadoHabitacion
        fields = '__all__'

class ComodidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comodidad
        fields = '__all__'

class TipoHabitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoHabitacion
        fields = '__all__'

class TipoHabitacionComodidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoHabitacionComodidad
        fields = '__all__'