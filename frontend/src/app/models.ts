// USUARIOS
export interface RolUsuario {
  id: number;
  rol: string;
}
 
export interface Usuario {
  id: number;
  id_rol: number;
  nombre: string;
  apellido: string;
  email: string;
  fecha_registro: string;
  password?: string;
}
 
// HABITACIONES
export interface EstadoHabitacion {
  id: number;
  nombre: string;
}
 
export interface Comodidad {
  id: number;
  nombre: string;
}
 
export interface TipoHabitacion {
  id: number;
  nombre: string;
  cant_cama: number;
  descripcion: string;
}
 
export interface Habitacion {
  id: number;
  id_tipo_habitacion: number;
  id_estado_habitacion: number;
  numero: number;
  piso: number;
  precio: number;
  capacidad: number;
}

export interface TipoHabitacionesComodidades {
  id: number;
  id_tipo_habitacion: number;
  id_comodidad: number;
}
 
// SERVICIOS
export interface TipoServicio {
  id: number;
  nombre_servicio: string;
}
 
export interface Servicio {
  id: number;
  id_tipo_servicio: number;
  precio: number;
  capacidad_maxima: number;
}
 
// RESERVAS
export interface EstadoReserva {
  id: number;
  nombre: string;
}
 
export interface Reserva {
  id: number;
  id_usuario: number;
  id_estado_reserva: number;
  numero_reserva: number;
  fecha_hora_reserva: string;
}
 
export interface ReservaHabitacion {
  id: number;
  id_habitacion: number;
  id_reserva: number;
  pago_acordado: number;
  fecha_hora_checkin: string;
  fecha_hora_checkout: string;
}
 
export interface ReservaServicio {
  id: number;
  id_servicio: number;
  id_reserva: number;
  pago_acordado: number;
  fecha_hora_inicio: string;
  fecha_hora_fin: string;
  capacidad_invitados: number;
}