from django.db import models

# Create your models here.

class EstadoReserva(models.Model):
    nombre = models.CharField(
        max_length=50,
        unique=True,
        help_text="Nombre del estado de la reserva.",
    )

    def __str__(self):
        return self.estado_reserva


class Reserva(models.Model):

    id_usuario = models.ForeignKey(
        'usuario.Usuario',
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

    fecha_reserva = models.DateTimeField(
        help_text="Fecha en la que se realizó la reserva.",
    )

    def __str__(self):
        return f"Reserva Nº{self.numero_reserva} ({self.id_estado_reserva.estado_reserva})"


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
    #Que no pongan un numero negativo, y el pago tiene que ser un decimal.
    pago_acordado = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Monto acordado por la estadía en esta habitación.",
    )

    fecha_checkin = models.DateTimeField(
        help_text="Fecha de check-in.",
    )

    fecha_checkout = models.DateTimeField(
        help_text="Fecha de check-out.",
    )
    #tiene que retornar todos los datos de la reserva, no solo el numero de reserva.
    def __str__(self):
        return f"Habitación de la reserva Nº{self.id_reserva.numero_reserva}"

class ReservaServicio(models.Model):
    id_reserva = models.ForeignKey(
        Reserva,
        on_delete=models.PROTECT,
        related_name='servicios',
        help_text="Reserva a la que pertenece el servicio.",
    )
    id_servicio = models.ForeignKey(
        'servicios.Servicio',
        on_delete=models.PROTECT,
        related_name='reservas_servicio',
        help_text="Servicio reservado.",
    )
    capacidad_invitados = models.IntegerField(
        help_text="Cantidad de invitados para el servicio.")
    
    pago_acordado = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Monto acordado por el servicio.")
    
    fecha_inicio = models.DateTimeField(
        help_text="Fecha de inicio del servicio.")
    
    fecha_fin = models.DateTimeField(
        help_text="Fecha de fin del servicio.")
    #tiene que retornar todos los datos de la reserva, no solo el numero de reserva.
    def __str__(self):
        return f"Servicio reservado para Reserva Nº{self.id_reserva.numero_reserva}"