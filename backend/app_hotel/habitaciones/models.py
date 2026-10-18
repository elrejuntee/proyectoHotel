from django.db import models

class Habitacion(models.Model):
    id_tipo_habitacion = models.ForeignKey('TipoHabitacion', related_name='habitaciones', on_delete=models.CASCADE)
    id_estado_habitacion = models.ForeignKey('EstadoHabitacion', related_name='habitaciones', on_delete=models.CASCADE)
    numero = models.IntegerField(min_value=1, unique=True)
    piso = models.IntegerField(min_value=1)
    precio = models.DecimalField(decimal_places=2, max_digits=10)
    capacidad = models.IntegerField(min_value=1, max_value=4)

    def __str__(self): 
        return f'Habitación {self.numero} - Piso {self.piso} - Capacidad {self.capacidad}'