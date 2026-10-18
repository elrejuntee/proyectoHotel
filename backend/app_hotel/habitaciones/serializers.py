from .models import Habitacion, EstadoHabitacion
from rest_framework import serializers

class HabitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habitacion
        fields = '__all__'


class EstadoHabitacionSerializer(serializers.ModelSerializer): 
    class Meta:
        model = EstadoHabitacion
        fields = '__all__'