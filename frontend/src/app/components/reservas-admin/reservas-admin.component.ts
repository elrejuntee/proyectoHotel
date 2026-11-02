import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  EstadoReserva,
  Habitacion,
  Reserva,
  ReservaHabitacion,
  ReservaServicio,
  Servicio,
  TipoHabitacion,
  TipoServicio,
  Usuario
} from '../../models';
import { HabitacionesService } from '../../services/habitaciones/habitaciones.service';
import { ReservasService } from '../../services/reservas/reservas.service';
import { ServiciosService } from '../../services/servicios/servicios.service';

/** Fila de la tabla: una reserva de habitación o de servicio, con los datos ya resueltos para mostrar. */
interface FilaReserva {
  clave: string;
  tipoReserva: string;
  numeroReserva: number;
  nombre: string;
  detalle: string;
  imagen: string;
  huesped: string;
  estado: string;
  fechaInicio: string;
  fechaFin: string;
  pagoAcordado: number;
}

@Component({
  selector: 'app-reservas-admin',
  imports: [DatePipe, FormsModule],
  templateUrl: './reservas-admin.component.html',
  styleUrl: './reservas-admin.component.css'
})
export class ReservasAdminComponent {

  // ===== Datos: vienen del backend a través de los servicios =====
  reservas: Reserva[] = [];
  reservasHabitacion: ReservaHabitacion[] = [];
  reservasServicio: ReservaServicio[] = [];
  habitaciones: Habitacion[] = [];
  tiposHabitacion: TipoHabitacion[] = [];
  servicios: Servicio[] = [];
  tiposServicio: TipoServicio[] = [];
  usuarios: Usuario[] = [];
  estadosReserva: EstadoReserva[] = [];
  errorReservas: string | null = null;

  // ===== Filtros de la tabla =====
  huespedBuscado: string = '';
  numeroReservaBuscado: string = '';

  // ===== Modal "Ver" =====
  filaSeleccionada: FilaReserva | null = null;

  // Se inyectan los servicios en el constructor
  constructor(
    private reservasService: ReservasService,
    private habitacionesService: HabitacionesService,
    private serviciosService: ServiciosService
  ) {
    this.cargarReservas();
    this.cargarReservasHabitacion();
    this.cargarReservasServicio();
    this.cargarUsuarios();
    this.cargarEstadosReserva();
    this.cargarHabitaciones();
    this.cargarTiposHabitacion();
    this.cargarServicios();
    this.cargarTiposServicio();
  }

  // ===== Filas de la tabla =====

  /** Todas las reservas (de habitación y de servicio) como filas listas para mostrar. */
  get filas(): FilaReserva[] {
    const filasHabitacion = this.reservasHabitacion.map(reservaHabitacion => this.armarFilaHabitacion(reservaHabitacion));
    const filasServicio = this.reservasServicio.map(reservaServicio => this.armarFilaServicio(reservaServicio));
    return filasHabitacion.concat(filasServicio);
  }

  /** Filas que cumplen los dos filtros a la vez: huésped y número de reserva. */
  get filasFiltradas(): FilaReserva[] {
    const huesped = this.huespedBuscado.trim().toLowerCase();
    const numeroReserva = this.numeroReservaBuscado.trim();

    return this.filas.filter(fila =>
      fila.huesped.toLowerCase().includes(huesped) &&
      fila.numeroReserva.toString().includes(numeroReserva)
    );
  }

  // ===== Carga de datos: el componente se suscribe al observable del servicio =====
  cargarReservas(): void {
    this.reservasService.obtenerReservas().subscribe({
      next: (reservas) => {
        this.reservas = reservas;
      },
      error: (error) => {
        this.errorReservas = error.message;
      }
    });
  }

  cargarReservasHabitacion(): void {
    this.reservasService.obtenerReservasHabitacion().subscribe({
      next: (reservasHabitacion) => {
        this.reservasHabitacion = reservasHabitacion;
      },
      error: (error) => {
        this.errorReservas = error.message;
      }
    });
  }

  cargarReservasServicio(): void {
    this.reservasService.obtenerReservasServicio().subscribe({
      next: (reservasServicio) => {
        this.reservasServicio = reservasServicio;
      },
      error: (error) => {
        this.errorReservas = error.message;
      }
    });
  }

  cargarUsuarios(): void {
    this.reservasService.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
      },
      error: (error) => {
        this.errorReservas = error.message;
      }
    });
  }

  cargarEstadosReserva(): void {
    this.reservasService.obtenerEstadosReserva().subscribe({
      next: (estadosReserva) => {
        this.estadosReserva = estadosReserva;
      },
      error: (error) => {
        this.errorReservas = error.message;
      }
    });
  }

  cargarHabitaciones(): void {
    this.habitacionesService.obtenerHabitaciones().subscribe({
      next: (habitaciones) => {
        this.habitaciones = habitaciones;
      },
      error: (error) => {
        this.errorReservas = error.message;
      }
    });
  }

  cargarTiposHabitacion(): void {
    this.habitacionesService.obtenerTiposHabitacion().subscribe({
      next: (tiposHabitacion) => {
        this.tiposHabitacion = tiposHabitacion;
      },
      error: (error) => {
        this.errorReservas = error.message;
      }
    });
  }

  cargarServicios(): void {
    this.serviciosService.obtenerServicios().subscribe({
      next: (servicios) => {
        this.servicios = servicios;
      },
      error: (error) => {
        this.errorReservas = error.message;
      }
    });
  }

  cargarTiposServicio(): void {
    this.serviciosService.obtenerTiposServicio().subscribe({
      next: (tiposServicio) => {
        this.tiposServicio = tiposServicio;
      },
      error: (error) => {
        this.errorReservas = error.message;
      }
    });
  }

  // ===== Modal: Ver =====
  verReserva(fila: FilaReserva): void {
    this.filaSeleccionada = fila;
  }

  cerrarModal(): void {
    this.filaSeleccionada = null;
  }

  // ===== Armado de filas =====
  private armarFilaHabitacion(reservaHabitacion: ReservaHabitacion): FilaReserva {
    const reserva = this.obtenerReserva(reservaHabitacion.id_reserva);
    const habitacion = this.obtenerHabitacion(reservaHabitacion.id_habitacion);
    const tipoHabitacion = habitacion ? this.obtenerTipoHabitacion(habitacion.id_tipo_habitacion) : undefined;

    return {
      clave: 'habitacion-' + reservaHabitacion.id,
      tipoReserva: 'Habitación',
      numeroReserva: reserva ? reserva.numero_reserva : 0,
      nombre: tipoHabitacion ? tipoHabitacion.nombre : '',
      detalle: habitacion ? 'Habitación ' + habitacion.numero : '',
      // Si todavía no se encontró la habitación, el servicio devuelve la imagen por defecto
      imagen: this.habitacionesService.obtenerImagenPrincipal(habitacion ? habitacion.id_tipo_habitacion : 0),
      huesped: this.obtenerHuesped(reserva),
      estado: this.obtenerNombreEstado(reserva),
      fechaInicio: reservaHabitacion.fecha_checkin,
      fechaFin: reservaHabitacion.fecha_checkout,
      pagoAcordado: reservaHabitacion.pago_acordado
    };
  }

  private armarFilaServicio(reservaServicio: ReservaServicio): FilaReserva {
    const reserva = this.obtenerReserva(reservaServicio.id_reserva);
    const servicio = this.obtenerServicio(reservaServicio.id_servicio);
    const tipoServicio = servicio ? this.obtenerTipoServicio(servicio.id_tipo_servicio) : undefined;

    return {
      clave: 'servicio-' + reservaServicio.id,
      tipoReserva: 'Servicio',
      numeroReserva: reserva ? reserva.numero_reserva : 0,
      nombre: tipoServicio ? tipoServicio.nombre_servicio : '',
      detalle: reservaServicio.capacidad_invitados + ' invitados',
      imagen: '',
      huesped: this.obtenerHuesped(reserva),
      estado: this.obtenerNombreEstado(reserva),
      fechaInicio: reservaServicio.fecha_inicio,
      fechaFin: reservaServicio.fecha_fin,
      pagoAcordado: reservaServicio.pago_acordado
    };
  }

  // ===== Búsquedas auxiliares =====
  private obtenerReserva(idReserva: number): Reserva | undefined {
    return this.reservas.find(reserva => reserva.id === idReserva);
  }

  private obtenerHabitacion(idHabitacion: number): Habitacion | undefined {
    return this.habitaciones.find(habitacion => habitacion.id === idHabitacion);
  }

  private obtenerTipoHabitacion(idTipoHabitacion: number): TipoHabitacion | undefined {
    return this.tiposHabitacion.find(tipoHabitacion => tipoHabitacion.id === idTipoHabitacion);
  }

  private obtenerServicio(idServicio: number): Servicio | undefined {
    return this.servicios.find(servicio => servicio.id === idServicio);
  }

  private obtenerTipoServicio(idTipoServicio: number): TipoServicio | undefined {
    return this.tiposServicio.find(tipoServicio => tipoServicio.id === idTipoServicio);
  }

  private obtenerHuesped(reserva: Reserva | undefined): string {
    const usuarioEncontrado = reserva
      ? this.usuarios.find(usuario => usuario.id === reserva.id_usuario)
      : undefined;
    return usuarioEncontrado ? usuarioEncontrado.nombre + ' ' + usuarioEncontrado.apellido : '';
  }

  private obtenerNombreEstado(reserva: Reserva | undefined): string {
    const estadoEncontrado = reserva
      ? this.estadosReserva.find(estadoReserva => estadoReserva.id === reserva.id_estado_reserva)
      : undefined;
    return estadoEncontrado ? estadoEncontrado.estado_reserva : '';
  }
}