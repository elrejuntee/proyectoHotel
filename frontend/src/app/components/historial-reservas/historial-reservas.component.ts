import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../auth/servicios/login/login.service';
import { HistorialReservasService } from '../../services/historial-reservas/historial-reservas.service';
import { DatePipe } from '@angular/common';

import {
  Reserva,
  ReservaHabitacion,
  Habitacion,
  TipoHabitacion,
  ReservaServicio,
  Servicio,
  TipoServicio
} from '../../services/historial-reservas/historial-reservas.service';

@Component({
  selector: 'app-historial-reservas',
  standalone: true,
  imports: [RouterLink, DatePipe], 
  templateUrl: './historial-reservas.component.html',
  styleUrl: './historial-reservas.component.css'
})
export class HistorialReservasComponent {
  private historialService = inject(HistorialReservasService);
  private loginService = inject(LoginService);

  reservas: Reserva[] = [];
  reservasHabitacion: ReservaHabitacion[] = [];
  habitaciones: Habitacion[] = [];
  tiposHabitacion: TipoHabitacion[] = [];
  reservasServicio: ReservaServicio[] = [];
  servicios: Servicio[] = [];
  tiposServicio: TipoServicio[] = [];
  historialHabitaciones: any[] = [];
  historialServicios: any[] = [];
  mensajeError: string = '';

  ngOnInit(): void {
    const usuarioLogueado = this.loginService.usuarioLogueado;
    if (usuarioLogueado === null) {
      return;
    }
    const idUsuario = usuarioLogueado.id;
    this.historialService.obtenerReservas().subscribe({
      next: (reservas) => {
        // Solo las reservas del usuario logueado
        this.reservas = reservas.filter(reserva => reserva.id_usuario === idUsuario);
        this.cargarHabitaciones();
        this.cargarServicios();
      },
      error: () => {
        this.mensajeError = 'No se pudo cargar el historial. Verificá que el servidor esté en funcionamiento.';
      }
    });
  }

  cargarHabitaciones(): void {
    this.historialService.obtenerReservasHabitacion().subscribe({
      next: (reservasHabitacion) => {
        this.reservasHabitacion = reservasHabitacion;
        this.historialService.obtenerHabitaciones().subscribe({
          next: (habitaciones) => {
            this.habitaciones = habitaciones;
            this.historialService.obtenerTiposHabitacion().subscribe({
              next: (tiposHabitacion) => {
                this.tiposHabitacion = tiposHabitacion;
                this.armarHistorialHabitaciones();
              },
              error: () => {
                this.mensajeError = 'No se pudo cargar el historial de habitaciones.';
              }
            });
          },
          error: () => {
            this.mensajeError = 'No se pudo cargar el historial de habitaciones.';
          }
        });
      },
      error: () => {
        this.mensajeError = 'No se pudo cargar el historial de habitaciones.';
      }
    });
  }

  cargarServicios(): void {
    this.historialService.obtenerReservasServicio().subscribe({
      next: (reservasServicio) => {
        this.reservasServicio = reservasServicio;
        this.historialService.obtenerServicios().subscribe({
          next: (servicios) => {
            this.servicios = servicios;
            this.historialService.obtenerTiposServicio().subscribe({
              next: (tiposServicio) => {
                this.tiposServicio = tiposServicio;
                this.armarHistorialServicios();
              },
              error: () => {
                this.mensajeError = 'No se pudo cargar el historial de servicios.';
              }
            });
          },
          error: () => {
            this.mensajeError = 'No se pudo cargar el historial de servicios.';
          }
        });
      },
      error: () => {
        this.mensajeError = 'No se pudo cargar el historial de servicios.';
      }
    });
  }

  armarHistorialHabitaciones(): void {
    this.historialHabitaciones = [];
    for (const reserva of this.reservas) {
      for (const reservaHabitacion of this.reservasHabitacion) {
        if (reservaHabitacion.id_reserva !== reserva.id) {
          continue;
        }
        for (const habitacion of this.habitaciones) {
          if (habitacion.id !== reservaHabitacion.id_habitacion) {
            continue;
          }
          for (const tipoHabitacion of this.tiposHabitacion) {
            if (tipoHabitacion.id !== habitacion.id_tipo_habitacion) {
              continue;
            }
            this.historialHabitaciones.push({
              idReserva: reserva.id,
              idHabitacion: habitacion.id,
              nombre: tipoHabitacion.nombre,
              descripcion: tipoHabitacion.descripcion,
              cantidadCamas: tipoHabitacion.cant_cama,
              capacidad: habitacion.capacidad,
              numeroHabitacion: habitacion.numero,
              precio: reservaHabitacion.pago_acordado,
              checkin: reservaHabitacion.fecha_checkin,
              checkout: reservaHabitacion.fecha_checkout
            });
          }
        }
      }
    }
  }

  armarHistorialServicios(): void {
    this.historialServicios = [];
    for (const reserva of this.reservas) {
      for (const reservaServicio of this.reservasServicio) {
        if (reservaServicio.id_reserva !== reserva.id) {
          continue;
        }
        for (const servicio of this.servicios) {
          if (servicio.id !== reservaServicio.id_servicio) {
            continue;
          }
          for (const tipoServicio of this.tiposServicio) {

            if (tipoServicio.id !== servicio.id_tipo_servicio) {
              continue;
            }
            this.historialServicios.push({
              idReserva: reserva.id,
              nombre: tipoServicio.nombre_servicio,
              capacidadMaxima: servicio.capacidad_maxima,
              capacidadInvitados: reservaServicio.capacidad_invitados,
              precio: reservaServicio.pago_acordado,
              fechaInicio: reservaServicio.fecha_inicio,
              fechaFin: reservaServicio.fecha_fin
            });
          }
        }
      }
    }
  }
}