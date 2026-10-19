from django.core.validators import MinValueValidator, MaxValueValidator

from django.db import models

class Habitacion(models.Model):
    id_tipo_habitacion = models.ForeignKey(
        'TipoHabitacion', 
        related_name='habitaciones', 
        on_delete=models.PROTECT
    )
    
    id_estado_habitacion = models.ForeignKey(
        'EstadoHabitacion', 
        related_name='habitaciones', 
        on_delete=models.PROTECT
    )
    
    numero = models.IntegerField(
        validators = [MinValueValidator(1, message="El número de la habitación debe ser un valor positivo.")], 
        unique=True
    )
    
    piso = models.IntegerField(
        validators = [MinValueValidator(1, message="El piso debe ser un valor positivo.")]
    )
    
    precio = models.DecimalField(
        decimal_places=2, 
        max_digits=10
    
    )
    capacidad = models.IntegerField(
        validators = [MinValueValidator(1, message="La capacidad debe ser un valor positivo."), MaxValueValidator(4, message="La capacidad máxima es de 4 personas.")]
    )

    def __str__(self): 
        return f'Habitación {self.numero} - Piso {self.piso} - Capacidad {self.capacidad}'


class EstadoHabitacion(models.Model):
    nombre = models.CharField(
        choices = [
            ('Disponible', 'disponibel'),
            ('Ocupada', 'ocupada'),
            ('Mantenimiento', 'mantenimiento'),
            ('Reservada', 'reservada'),
        ],
        default = 'Disponible'
    )

class Comodidad(models.Model):
    nombre = models.CharField(
        unique =  True,
        choices=[
            ('Wi-Fi gratis', 'Wi-Fi gratis'),
            ('Baño privado', 'Baño privado'),
            ('Aire acondicionado', 'Aire acondicionado'),
            ('TV con cable', 'TV con cable'),
            ('Cocina equipada', 'Cocina equipada')
        ]
    )