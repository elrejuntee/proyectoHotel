from django.db import models

# Create your models here.

class EstadoReserva(models.Model):
    nombre = models.CharField(
        max_length=50,
        unique=True,
        choices=[('confirmada', 'Confirmada'), ('cancelada', 'Cancelada')],
        help_text="Nombre del estado de la reserva.",
    )

    def __str__(self):
        return self.nombre


class Reserva(models.Model):

    id_usuario = models.ForeignKey(
        'usuarios.Usuario',
        on_delete=models.PROTECT,
        related_name='reservas',
        help_text="Usuario que realizó la reserva.",
    )

    id_estado_reserva = models.ForeignKey(
        EstadoReserva,
        on_delete=models.PROTECT,
        related_name='reservas',
        help_text="Estado actual de la reserva.",
    )

    numero_reserva = models.IntegerField(
        unique=True,
        help_text="Número identificador de la reserva.",
    )

    fecha_hora_reserva = models.DateTimeField(
        help_text="Fecha y hora en la que se realizó la reserva.",
    )

    def __str__(self):
        return f"Reserva Nº{self.numero_reserva} ({self.id_estado_reserva.nombre})"


class ReservaHabitacion(models.Model):

    id_reserva = models.ForeignKey(
        Reserva,
        on_delete=models.PROTECT,
        related_name='habitaciones',
        help_text="Reserva a la que pertenece esta habitación reservada.",
    )

    # Apunta al modelo Habitacion de la app 'habitaciones' (la gestiona otro integrante del equipo).
    id_habitacion = models.ForeignKey(
        'habitaciones.Habitacion',
        on_delete=models.PROTECT,
        related_name='reservas_habitacion',
        help_text="Habitación reservada.",
    )

    pago_acordado = models.IntegerField(
        help_text="Monto acordado por la estadía en esta habitación.",
    )

    fecha_hora_checkin = models.DateTimeField(
        help_text="Fecha y hora de check-in.",
    )

    fecha_hora_checkout = models.DateTimeField(
        help_text="Fecha y hora de check-out.",
    )

    def __str__(self):
        return f"Habitación de la reserva Nº{self.id_reserva.numero_reserva}"