// USUARIOS
export interface RolUsuario {
  id_rol: number;
  rol: string;
}
 
export interface Usuario {
  id_usuario: number;
  id_rol: number;
  nombre: string;
  apellido: string;
  email: string;
  fecha_registro: string; 
  password: string;     
}
 
// HABITACIONES
export interface EstadoHabitacion {
  id_estado_habitacion_id: number;
  estado_habitacion: string;
}
 
export interface Comodidad {
  id_comodidad: number;
  comodidad: string;
}
 
export interface TipoHabitacion {
  id_tipo_habitacion_id: number;
  nombre: string;
  cant_cama: number;
  descripcion: string;
}
 
export interface Habitacion {
  id: number;
  id_tipo_habitacion_id: number;
  id_estado_habitacion_id: number;
  numero: number;
  piso: number;
  precio: number;  
  capacidad: number;
}

export interface TipoHabitacionesComodidades {
    id_tipo_habitacion_comodidad: number;
    id_tipo_habitacion: number;
    id_comodidad: number;
}
 
// SERVICIOS
export interface TipoServicio {
  id_tipo_servicio: number;
  nombre_servicio: string;
}
 
export interface Servicio {
  id_servicio: number;
  id_tipo_servicio: number;
  precio: number;
  capacidad_maxima: number;
}
 
// RESERVAS
export interface EstadoReserva {
  id_estado_reserva: number;
  estado_reserva: string;
}
 
export interface Reserva {
  id_reserva: number;
  id_usuario: number;
  id_estado_reserva: number;
  numero_reserva: number;
  fecha_reserva: string;
}
 
export interface ReservaHabitacion {
  id_reserva_habitacion: number;
  id_habitacion: number;
  id_reserva: number;
  pago_acordado: number;
  fecha_checkin: string;
  fecha_checkout: string;
}
 
export interface ReservaServicio {
  id_reserva_servicio: number;
  id_servicio: number;
  id_reserva: number;
  pago_acordado: number;
  fecha_inicio: string;
  fecha_fin: string;
  capacidad_invitados: number;
}