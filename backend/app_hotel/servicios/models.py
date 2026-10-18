from django.db import models
from django.core.validators import MinValueValidator

class TipoServicio(models.Model):
    nombre_servicio = models.CharField(max_length=100)

    class Meta:
        db_table = 'TIPO_SERVICIOS'

    def __str__(self):
        return self.nombre_servicio

class Servicio(models.Model):
    id_tipo_servicio = models.ForeignKey(TipoServicio, on_delete=models.CASCADE, db_column='id_tipo_servicio')
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    capacidad_maxima = models.IntegerField()

    class Meta:
        db_table = 'SERVICIOS'

    def __str__(self):
        return f"Servicio - {self.id_tipo_servicio.nombre_servicio}"