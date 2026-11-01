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
        max_length=50,
        choices = [
            ('Disponible', 'disponibel'),
            ('Ocupada', 'ocupada'),
            ('Mantenimiento', 'mantenimiento'),
            ('Reservada', 'reservada'),
        ],
        default = 'Disponible'
    )

    def __str__(self):
            return f'{self.nombre}'


class Comodidad(models.Model):
    nombre = models.CharField(
        max_length=50,
        unique =  True,
        choices=[
            ('Wi-Fi gratis', 'Wi-Fi gratis'),
            ('Baño privado', 'Baño privado'),
            ('Aire acondicionado', 'Aire acondicionado'),
            ('TV con cable', 'TV con cable'),
            ('Cocina equipada', 'Cocina equipada')
        ]
    )

    def __str__(self):
        return f'{self.nombre}'


class TipoHabitacion(models.Model):
    nombre = models.CharField(
        max_length=50,
        unique = True,
        choices = [
            ('Suite Premium', 'Suite Premium'),
            ('Suite Familiar', 'Suite Familiar'),
            ('Habitación Deluxe', 'Habitación Deluxe'),
            ('Habitación Estándar', 'Habitación Estándar'),
        ]
    )
    cant_cama = models.IntegerField(
        validators = [
            MinValueValidator(1, message="La capacidad debe ser un valor positivo."),
            MaxValueValidator(4, message="La capacidad maxima es 4 camas"),
        ]
    ) 
    descripcion = models.CharField(
        max_length=200,
        unique = True,
        choices = [
            ('Suite de lujo con vista al mar', 'Suite de lujo con vista al mar'),
            ('Suite ideal para familias', 'Suite ideal para familias'),
            ('Habitación deluxe con vista al río', 'Habitación deluxe con vista al río'),
            ('Habitación estándar con vista al patio', 'Habitación estándar con vista al patio')
        ]
    )

    def __str__(self):
        return self.nombre


class TipoHabitacionComodidad(models.Model): 
    id_tipo_habitacion = models.ForeignKey(
        'TipoHabitacion',
        related_name = "TipoHabitacion",
        on_delete = models.PROTECT
    )

    id_comodidad = models.ForeignKey(
        'Comodidad',
        related_name = "Comodidad",
        on_delete = models.PROTECT
    )