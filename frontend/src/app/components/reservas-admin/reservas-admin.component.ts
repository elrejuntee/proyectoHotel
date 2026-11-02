import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  EstadoReserva,
  Habitacion,
  Reserva,
  ReservaHabitacion,
  TipoHabitacion,
  Usuario
} from '../../models';
import { HabitacionesService } from '../../services/habitaciones/habitaciones.service';
import { ReservasService } from '../../services/reservas/reservas.service';

@Component({
  selector: 'app-reservas-admin',
  imports: [DatePipe, FormsModule],
  templateUrl: './reservas-admin.component.html',
  styleUrl: './reservas-admin.component.css'
})
export class ReservasAdminComponent {

  // ===== Datos: cada fila de la tabla es una reserva_habitacion =====
  reservas: Reserva[] = [];
  reservasHabitacion: ReservaHabitacion[] = [];
  habitaciones: Habitacion[] = [];
  tiposHabitacion: TipoHabitacion[] = [];
  usuarios: Usuario[] = [];
  estadosReserva: EstadoReserva[] = [];
  errorReservas: string | null = null;

  // ===== Menú de acciones abierto (número de fila de la tabla) =====
  dropdownAbiertoIndice: number | null = null;

  // ===== Modal abierto + reserva sobre la que se está trabajando =====
  modalActivo: 'ver' | 'estado' | null = null;
  reservaSeleccionada: ReservaHabitacion | null = null;

  // ===== Modal "Cambiar estado" =====
  idNuevoEstado: string = '';

  // Se inyectan los servicios en el constructor
  constructor(
    private reservasService: ReservasService,
    private habitacionesService: HabitacionesService
  ) {
    this.cargarReservas();
    this.cargarReservasHabitacion();
    this.cargarUsuarios();
    this.cargarEstadosReserva();
    this.cargarHabitaciones();
    this.cargarTiposHabitacion();
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

  // ===== Datos derivados de cada fila (se consultan desde la vista) =====
  obtenerNombreHabitacion(reservaHabitacion: ReservaHabitacion): string {
    const habitacion = this.obtenerHabitacion(reservaHabitacion);
    const tipoEncontrado = habitacion
      ? this.tiposHabitacion.find(tipoHabitacion => tipoHabitacion.id_tipo_habitacion === habitacion.id_tipo_habitacion)
      : undefined;
    return tipoEncontrado ? tipoEncontrado.nombre : '';
  }

  obtenerNumeroHabitacion(reservaHabitacion: ReservaHabitacion): string {
    const habitacion = this.obtenerHabitacion(reservaHabitacion);
    return habitacion ? 'Habitación ' + habitacion.numero : '';
  }

  obtenerImagen(reservaHabitacion: ReservaHabitacion): string {
    const habitacion = this.obtenerHabitacion(reservaHabitacion);
    // Si todavía no se encontró la habitación, el servicio devuelve la imagen por defecto
    return this.habitacionesService.obtenerImagenPrincipal(habitacion ? habitacion.id_tipo_habitacion : 0);
  }

  obtenerHuesped(reservaHabitacion: ReservaHabitacion): string {
    const reserva = this.obtenerReserva(reservaHabitacion);
    const usuarioEncontrado = reserva
      ? this.usuarios.find(usuario => usuario.id_usuario === reserva.id_usuario)
      : undefined;
    return usuarioEncontrado ? usuarioEncontrado.nombre + ' ' + usuarioEncontrado.apellido : '';
  }

  obtenerNombreEstado(reservaHabitacion: ReservaHabitacion): string {
    const reserva = this.obtenerReserva(reservaHabitacion);
    const estadoEncontrado = reserva
      ? this.estadosReserva.find(estadoReserva => estadoReserva.id_estado_reserva === reserva.id_estado_reserva)
      : undefined;
    return estadoEncontrado ? estadoEncontrado.estado_reserva : '';
  }

  // ===== Menú de acciones por fila =====
  toggleDropdown(indice: number): void {
    this.dropdownAbiertoIndice = this.dropdownAbiertoIndice === indice ? null : indice;
  }

  cerrarDropdown(): void {
    this.dropdownAbiertoIndice = null;
  }

  // ===== Modal: Ver =====
  verReserva(reservaHabitacion: ReservaHabitacion): void {
    this.cerrarDropdown();
    this.reservaSeleccionada = reservaHabitacion;
    this.modalActivo = 'ver';
  }

  // ===== Modal: Cambiar estado =====
  cambiarEstadoReserva(reservaHabitacion: ReservaHabitacion): void {
    this.cerrarDropdown();
    const reserva = this.obtenerReserva(reservaHabitacion);
    this.idNuevoEstado = reserva ? String(reserva.id_estado_reserva) : '';
    this.reservaSeleccionada = reservaHabitacion;
    this.modalActivo = 'estado';
  }

  guardarNuevoEstado(): void {
    // TODO: falta un método actualizarReserva (PUT /reservas/:id) en ReservasService
    this.cerrarModal();
  }

  cerrarModal(): void {
    this.modalActivo = null;
    this.reservaSeleccionada = null;
  }

  // ===== Helpers privados =====
  private obtenerReserva(reservaHabitacion: ReservaHabitacion): Reserva | undefined {
    return this.reservas.find(reserva => reserva.id_reserva === reservaHabitacion.id_reserva);
  }

  private obtenerHabitacion(reservaHabitacion: ReservaHabitacion): Habitacion | undefined {
    return this.habitaciones.find(habitacion => habitacion.id_habitacion === reservaHabitacion.id_habitacion);
  }
}
