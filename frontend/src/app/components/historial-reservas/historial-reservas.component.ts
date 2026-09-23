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

  ngOnInit(): void {

    const usuarioLogueado = this.loginService.usuarioLogueado;

    if (usuarioLogueado === null) {
      return;
    }

    const idUsuario = usuarioLogueado.id;

    this.historialService.obtenerReservas().subscribe(
      (reservas) => {

        this.reservas = reservas;

        for (const reserva of reservas) {

          if (reserva.id_usuario === idUsuario) {

            this.historialService.obtenerReservasHabitacion().subscribe(
              (reservasHabitacion) => {

                this.reservasHabitacion = reservasHabitacion;

                this.historialService.obtenerHabitaciones().subscribe(
                  (habitaciones) => {

                    this.habitaciones = habitaciones;

                    this.historialService.obtenerTiposHabitacion().subscribe(
                      (tiposHabitacion) => {

                        this.tiposHabitacion = tiposHabitacion;

                        this.armarHistorialHabitaciones(reserva.id);
                      }
                    );
                  }
                );
              }
            );

            this.historialService.obtenerReservasServicio().subscribe(
              (reservasServicio) => {

                this.reservasServicio = reservasServicio;

                this.historialService.obtenerServicios().subscribe(
                  (servicios) => {

                    this.servicios = servicios;

                    this.historialService.obtenerTiposServicio().subscribe(
                      (tiposServicio) => {

                        this.tiposServicio = tiposServicio;

                        this.armarHistorialServicios(reserva.id);
                      }
                    );
                  }
                );
              }
            );
          }
        }
      }
    );
  }

  armarHistorialHabitaciones(idReserva: string): void {

    for (const reservaHabitacion of this.reservasHabitacion) {

      if (reservaHabitacion.id_reserva !== idReserva) {
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
            idReserva: idReserva,
            idHabitacion: habitacion.id,
            nombre: tipoHabitacion.nombre,
            descripcion: tipoHabitacion.descripcion,
            cantidadCamas: tipoHabitacion.cant_cama,
            capacidad: habitacion.capacidad,
            numeroHabitacion: habitacion.numero,
            precio: reservaHabitacion.pago_acordado,
            checkin: reservaHabitacion.fecha_hora_checkin,
            checkout: reservaHabitacion.fecha_hora_checkout
          });
        }
      }
    }
  }

  armarHistorialServicios(idReserva: string): void {

    for (const reservaServicio of this.reservasServicio) {

      if (reservaServicio.id_reserva !== idReserva) {
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
            idReserva: idReserva,
            nombre: tipoServicio.nombre_servicio,
            capacidadMaxima: servicio.capacidad_maxima,
            capacidadInvitados: reservaServicio.capacidad_invitados,
            precio: reservaServicio.pago_acordado,
            fechaInicio: reservaServicio.fecha_hora_inicio,
            fechaFin: reservaServicio.fecha_hora_fin
          });
        }
      }
    }
  }
}
