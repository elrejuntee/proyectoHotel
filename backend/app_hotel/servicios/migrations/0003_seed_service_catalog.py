from django.db import migrations


SERVICES = (
    ('Co-working', 5000, 10),
    ('Sala de conferencias', 10000, 50),
    ('Sala privada', 15000, 12),
    ('Comedor', 8000, 50),
)


def seed_services(apps, schema_editor):
    TipoServicio = apps.get_model('servicios', 'TipoServicio')
    Servicio = apps.get_model('servicios', 'Servicio')
    database = schema_editor.connection.alias

    for name, price, capacity in SERVICES:
        tipo, _ = TipoServicio.objects.using(database).get_or_create(
            nombre_servicio=name,
        )
        Servicio.objects.using(database).get_or_create(
            id_tipo_servicio=tipo,
            defaults={
                'precio': price,
                'capacidad_maxima': capacity,
            },
        )


class Migration(migrations.Migration):

    dependencies = [
        ('servicios', '0002_alter_servicio_id_tipo_servicio_and_more'),
    ]

    operations = [
        migrations.RunPython(seed_services, migrations.RunPython.noop),
    ]
