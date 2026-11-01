from django.db import migrations


def seed_reservation_states(apps, schema_editor):
    EstadoReserva = apps.get_model('reservas', 'EstadoReserva')
    database = schema_editor.connection.alias

    for name in ('confirmada', 'cancelada'):
        EstadoReserva.objects.using(database).get_or_create(nombre=name)


class Migration(migrations.Migration):

    dependencies = [
        ('reservas', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_reservation_states, migrations.RunPython.noop),
    ]
