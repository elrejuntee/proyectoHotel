from rest_framework import serializers
from .models import EstadoReserva, Reserva, ReservaHabitacion


class EstadoReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoReserva
        fields = ['id', 'nombre']


class ReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = ['id', 'id_usuario', 'id_estado_reserva', 'numero_reserva', 'fecha_hora_reserva']


class ReservaHabitacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservaHabitacion
        fields = ['id', 'id_reserva', 'id_habitacion', 'pago_acordado', 'fecha_hora_checkin', 'fecha_hora_checkout']