from rest_framework import serializers
from rest_framework.exceptions import ValidationError
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

    def validate(self, attrs):
        habitacion = attrs['id_habitacion']
        fecha_checkin = attrs['fecha_hora_checkin']
        fecha_checkout = attrs['fecha_hora_checkout']

        if fecha_checkout <= fecha_checkin:
            raise ValidationError({
                'fecha_hora_checkout': 'El check-out debe ser posterior al check-in.'
            })

        if habitacion.id_estado_habitacion.nombre != 'Disponible':
            raise ValidationError({
                'id_habitacion': 'La habitación no está disponible para reservar.'
            })

        reservas_solapadas = ReservaHabitacion.objects.filter(
            id_habitacion=habitacion,
            id_reserva__id_estado_reserva__nombre__iexact='confirmada',
            fecha_hora_checkin__lt=fecha_checkout,
            fecha_hora_checkout__gt=fecha_checkin,
        )
        if self.instance:
            reservas_solapadas = reservas_solapadas.exclude(pk=self.instance.pk)
        if reservas_solapadas.exists():
            raise ValidationError({
                'id_habitacion': 'La habitación ya está reservada para esas fechas.'
            })

        return attrs


class ReservaServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservaServicio
        fields = '__all__'

    def validate(self, attrs):
        servicio = attrs['id_servicio']
        fecha_inicio = attrs['fecha_hora_inicio']
        fecha_fin = attrs['fecha_hora_fin']

        if fecha_fin <= fecha_inicio:
            raise ValidationError({
                'fecha_hora_fin': 'La fecha de fin debe ser posterior a la fecha de inicio.'
            })

        if attrs['capacidad_invitados'] > servicio.capacidad_maxima:
            raise ValidationError({
                'capacidad_invitados': 'La cantidad de invitados supera la capacidad del servicio.'
            })

        reservas_solapadas = ReservaServicio.objects.filter(
            id_servicio=servicio,
            id_reserva__id_estado_reserva__nombre__iexact='confirmada',
            fecha_hora_inicio__lt=fecha_fin,
            fecha_hora_fin__gt=fecha_inicio,
        )
        if self.instance:
            reservas_solapadas = reservas_solapadas.exclude(pk=self.instance.pk)
        if reservas_solapadas.exists():
            raise ValidationError({
                'id_servicio': 'Este servicio ya está reservado para ese período.'
            })

        return attrs