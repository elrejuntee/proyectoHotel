import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HabitacionesService, HabitacionApi, TipoHabitacionApi } from '../../services/habitaciones/habitaciones.service';
import { ReservasService, ReservaApi, ReservaHabitacionApi, PagoApi, MetodoPagoApi } from '../../services/reservas/reservas.service';
import { LoginService } from '../../auth/servicios/login/login.service';

@Component({
  selector: 'app-pago-confirmado',
  imports: [CommonModule, RouterLink],
  templateUrl: './pago-confirmado.component.html',
  styleUrl: './pago-confirmado.component.css'
})
export class PagoConfirmadoComponent implements OnInit {
  @Input() id!: string; // id de la reserva, llega desde /pago-confirmado/:id

  reserva?: ReservaApi;
  reservaHabitacion?: ReservaHabitacionApi;
  habitacion?: HabitacionApi;
  tipo?: TipoHabitacionApi;
  pago?: PagoApi;
  metodoPago?: MetodoPagoApi;
  mensajeError: string = '';

  constructor(
    private reservasService: ReservasService,
    private habitacionesService: HabitacionesService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.reservasService.obtenerReservaPorId(this.id).subscribe({
      next: (reserva) => {
        this.reserva = reserva;
        this.cargarReservaHabitacion();
        this.cargarPago();
      },
      error: (error: Error) => {
        this.mensajeError = error.message;
      }
    });
  }

  // Rama 1: reserva -> habitación reservada (fechas) -> habitación -> tipo
  private cargarReservaHabitacion(): void {
    this.reservasService.obtenerReservaHabitacionPorReserva(this.id).subscribe({
      next: (lista) => {
        this.reservaHabitacion = lista[0];
        if (this.reservaHabitacion) {
          this.cargarHabitacion(this.reservaHabitacion.id_habitacion);
        }
      },
      error: (error: Error) => {
        this.mensajeError = error.message;
      }
    });
  }

  private cargarHabitacion(idHabitacion: number | string): void {
    this.habitacionesService.obtenerHabitacionPorId(idHabitacion).subscribe({
      next: (habitacion) => {
        this.habitacion = habitacion;
        this.cargarTipo(habitacion.id_tipo_habitacion);
      },
      error: (error: Error) => {
        this.mensajeError = error.message;
      }
    });
  }

  private cargarTipo(idTipo: number | string): void {
    this.habitacionesService.obtenerTipoHabitacionPorId(idTipo).subscribe({
      next: (tipo) => {
        this.tipo = tipo;
      },
      error: (error: Error) => {
        this.mensajeError = error.message;
      }
    });
  }

  // Rama 2: reserva -> pago -> método de pago
  private cargarPago(): void {
    this.reservasService.obtenerPagoPorReserva(this.id).subscribe({
      next: (lista) => {
        this.pago = lista[0];
        if (this.pago) {
          this.cargarMetodoPago(this.pago.id_metodo_pago);
        }
      },
      error: (error: Error) => {
        this.mensajeError = error.message;
      }
    });
  }

  private cargarMetodoPago(idMetodo: number | string): void {
    this.reservasService.obtenerMetodoPagoPorId(idMetodo).subscribe({
      next: (metodo) => {
        this.metodoPago = metodo;
      },
      error: (error: Error) => {
        this.mensajeError = error.message;
      }
    });
  }

  // ----- Datos para la vista -----
  get huesped(): string {
    const usuario = this.loginService.usuarioLogueado;
    return usuario ? usuario.nombre + ' ' + usuario.apellido : '';
  }

  // Estado del pago: 1 = Aprobado, 2 = Pendiente (ids de estados_pago)
  get pagoAprobado(): boolean {
    return String(this.pago?.id_estado_pago) === '1';
  }

  get noches(): number {
    if (!this.reservaHabitacion) {
      return 0;
    }
    const ingreso = new Date(this.reservaHabitacion.fecha_hora_checkin).getTime();
    const salida = new Date(this.reservaHabitacion.fecha_hora_checkout).getTime();
    return Math.max(0, Math.round((salida - ingreso) / (1000 * 60 * 60 * 24)));
  }

  formatearFecha(fechaIso: string | undefined): string {
    if (!fechaIso) {
      return '';
    }
    return new Date(fechaIso).toLocaleDateString('es-AR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
    });
  }
}