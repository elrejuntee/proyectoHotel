from django.db import migrations


ROOM_TYPES = (
    ('Suite Premium', 2, 'Suite de lujo con vista al mar'),
    ('Suite Familiar', 4, 'Suite ideal para familias'),
    ('Habitación Deluxe', 1, 'Habitación deluxe con vista al río'),
    ('Habitación Estándar', 1, 'Habitación estándar con vista al patio'),
)

ROOMS = (
    (101, 1, 1, 80000, 2),
    (102, 2, 1, 120000, 4),
    (201, 3, 2, 60000, 1),
    (202, 4, 2, 40000, 1),
)


def seed_room_catalog(apps, schema_editor):
    EstadoHabitacion = apps.get_model('habitaciones', 'EstadoHabitacion')
    TipoHabitacion = apps.get_model('habitaciones', 'TipoHabitacion')
    Habitacion = apps.get_model('habitaciones', 'Habitacion')
    database = schema_editor.connection.alias

    estados = {}
    for name in ('Disponible', 'Ocupada', 'Mantenimiento', 'Reservada'):
        estado, _ = EstadoHabitacion.objects.using(database).get_or_create(
            nombre=name,
        )
        estados[name] = estado

    tipos = {}
    for name, beds, description in ROOM_TYPES:
        tipo, _ = TipoHabitacion.objects.using(database).update_or_create(
            nombre=name,
            defaults={
                'cant_cama': beds,
                'descripcion': description,
            },
        )
        tipos[name] = tipo

    room_types_by_catalog_id = {
        1: 'Suite Premium',
        2: 'Suite Familiar',
        3: 'Habitación Deluxe',
        4: 'Habitación Estándar',
    }
    for number, catalog_type_id, floor, price, capacity in ROOMS:
        Habitacion.objects.using(database).get_or_create(
            numero=number,
            defaults={
                'id_tipo_habitacion': tipos[room_types_by_catalog_id[catalog_type_id]],
                'id_estado_habitacion': estados['Disponible'],
                'piso': floor,
                'precio': price,
                'capacidad': capacity,
            },
        )


class Migration(migrations.Migration):

    dependencies = [
        ('habitaciones', '0002_alter_tipohabitacion_nombre'),
    ]

    operations = [
        migrations.RunPython(seed_room_catalog, migrations.RunPython.noop),
    ]
