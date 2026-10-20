-- 1. Roles de Usuario
INSERT INTO usuario_rolusuario (id, rol) VALUES
(1, 'Administrador'),
(2, 'Huesped');

-- 2. Usuarios
INSERT INTO usuario_usuario (id, id_rol_id, nombre, apellido, email, contraseña, fecha_registro) VALUES
(1, 1, 'Admin', 'Admin', 'admin@gmail.com', 'admin123', '2026-09-01'),
(2, 2, 'adriel', 'delosanto', 'adridelosanto@gmail.com', '1234', '2026-09-18'),
(3, 2, 'fernando', 'perez', 'aguss.97@outlook.com', '123456', '2026-09-20'),
(4, 2, 'Alexis', 'Lazarte', 'ale@gmail.com', 'asdasd', '2026-10-12');

-- 3. Tipos de Servicio
INSERT INTO tipo_servicios (id, nombre_servicio) VALUES
(1, 'Co-working'),
(2, 'Sala de conferencias'),
(3, 'Sala privada'),
(4, 'Comedor');

-- 4. Servicios
INSERT INTO servicios (id, id_tipo_servicio, precio, capacidad_maxima) VALUES
(1, 1, 5000.00, 10),
(2, 2, 10000.00, 50),
(3, 3, 15000.00, 12),
(4, 4, 8000.00, 50);

-- 5. Estados de la Habitación
INSERT INTO habitaciones_estadohabitacion (id, nombre) VALUES
(1, 'Disponible'),
(2, 'Ocupada'),
(3, 'Mantenimiento'),
(4, 'Reservada');

-- 6. Comodidades
INSERT INTO habitaciones_comodidad (id, nombre) VALUES
(1, 'Wi-Fi gratis'),
(2, 'Baño privado'),
(3, 'Aire acondicionado'),
(4, 'TV con cable'),
(5, 'Cocina equipada');

-- 7. Tipos de Habitación
INSERT INTO habitaciones_tipohabitacion (id, nombre, cant_cama, descripcion) VALUES
(1, 'Suite Premium', 2, 'Suite de lujo con vista al mar'),
(2, 'Suite Familiar', 4, 'Suite ideal para familias'),
(3, 'Habitación Deluxe', 1, 'Habitación deluxe con vista al río'),
(4, 'Habitación Estándar', 1, 'Habitación estándar con vista al patio');

-- 8. Relación Tipo Habitación y Comodidades
INSERT INTO habitaciones_tipohabitacioncomodidad (id, id_tipo_habitacion_id, id_comodidad_id) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 1, 4),
(5, 1, 5),
(6, 2, 1),
(7, 2, 2),
(8, 2, 3),
(9, 2, 4),
(10, 3, 1),
(11, 3, 2),
(12, 3, 3),
(13, 4, 1),
(14, 4, 2);

-- 9. Habitaciones
INSERT INTO habitaciones_habitacion (id, id_tipo_habitacion_id, id_estado_habitacion_id, numero, piso, precio, capacidad) VALUES
(1, 1, 2, 101, 1, 80000.00, 2),
(2, 2, 3, 102, 1, 120000.00, 4),
(3, 3, 2, 201, 2, 60000.00, 1),
(4, 4, 4, 202, 2, 40000.00, 1);

-- 10. Estados de la Reserva
INSERT INTO reservas_estadoreserva (id, nombre) VALUES
(1, 'confirmada'),
(2, 'cancelada');

-- 11. Reservas
INSERT INTO reservas_reserva (id, id_usuario_id, id_estado_reserva_id, numero_reserva, fecha_hora_reserva) VALUES
(1, 2, 1, 55901, '2026-09-18 10:00:00'),
(2, 3, 1, 88402, '2026-09-20 11:30:00'),
(3, 3, 1, 88403, '2026-09-21 15:00:00'),
(4, 4, 1, 75092, '2026-10-12 17:02:02'),
(5, 4, 1, 83307, '2026-10-12 23:04:05');

-- 12. Reservas por Habitación
INSERT INTO reservas_reservahabitacion (id, id_reserva_id, id_habitacion_id, pago_acordado, fecha_hora_checkin, fecha_hora_checkout) VALUES
(1, 1, 1, 80000, '2026-10-01 14:00:00', '2026-10-10 10:00:00'),
(2, 2, 1, 80000, '2026-10-05 14:00:00', '2026-10-08 10:00:00'),
(3, 3, 4, 40000, '2026-10-12 14:00:00', '2026-10-15 10:00:00'),
(4, 4, 1, 160000, '2026-10-12 14:00:00', '2026-10-14 10:00:00');

-- 13. Reservas por Servicio
INSERT INTO reservas_reservaservicio (id, id_reserva_id, id_servicio_id, capacidad_invitados, pago_acordado, fecha_hora_inicio, fecha_hora_fin) VALUES
(1, 1, 1, 2, 5000, '2026-10-02 09:00:00', '2026-10-02 18:00:00'),
(2, 5, 2, 25, 30000, '2026-10-12 09:00:00', '2026-10-15 18:00:00');
