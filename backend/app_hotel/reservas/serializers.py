from rest_framework import serializers
from .models import EstadoReserva, Reserva, ReservaHabitacion, ReservaServicio


class EstadoReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoReserva
        fields = '__all__'


class ReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = '__all__'


class ReservaHabitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservaHabitacion
        fields = '__all__'

class ReservaServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservaServicio
        fields = '__all__'