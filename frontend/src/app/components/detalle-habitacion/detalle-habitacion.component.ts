import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HabitacionesService, HabitacionApi, TipoHabitacionApi } from '../../services/habitaciones/habitaciones.service';
import { ReservasService } from '../../services/reservas/reservas.service';
import { ModalReservaComponent } from '../modal-reserva/modal-reserva.component';
import { LoginService } from '../../auth/servicios/login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-habitacion',
  imports: [CommonModule, RouterLink, ModalReservaComponent ],
  templateUrl: './detalle-habitacion.component.html',
  styleUrl: './detalle-habitacion.component.css'
})
export class DetalleHabitacionComponent implements OnInit {
  @Input() id!: string; // llega desde la ruta /detalle-habitacion/:id
  @Input() checkin?: string;  // llega como parametro de ruta: /detalle-habitacion/:Id/:checkin/:checkout
  @Input() checkout?: string; // llega como parametro de ruta: /detalle-habitacion/:Id/:checkin/:checkout

  habitacion?: HabitacionApi;
  tipo?: TipoHabitacionApi;
  mensajeError: string = '';

  mensajeFechas: string = '';
  mensajeExitoFecha: string = '';
  mostrarFiltroFechas: boolean = false;

  mostrarModal: boolean = false;

  constructor(
    private habitacionesService: HabitacionesService,
    private reservasService: ReservasService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.mostrarFiltroFechas = !this.checkin || !this.checkout;

    this.habitacionesService.obtenerHabitacionPorId(this.id).subscribe({
      next: (habitacion) => {
        this.habitacion = habitacion;
        this.obtenerTipo(habitacion.id_tipo_habitacion);
      },
      error: (error) => {
        this.mensajeError = error.message;
      }
    });
  }

  obtenerTipo(idTipo: number | string): void {
    this.habitacionesService.obtenerTipoHabitacionPorId(idTipo).subscribe({
      next: (tipo) => {
        this.tipo = tipo;
      },
      error: (error) => {
        this.mensajeError = error.message;
      }
    });
  }
  imagenPrincipal(): string {
    return this.habitacion ? this.habitacionesService.obtenerImagenPrincipal(this.habitacion.id_tipo_habitacion) : '';
  }

  imagenesComplementarias(): string[] {
    return this.habitacion ? this.habitacionesService.obtenerImagenesComplementarias(this.habitacion.id_tipo_habitacion) : [];
  }

  buscarFechas(checkin: string, checkout: string): void {
    if (!checkin || !checkout || checkout <= checkin) {
      this.mensajeFechas = 'Elegí un check-in y un check-out válidos (el check-out debe ser posterior al check-in).';
      this.mensajeExitoFecha = '';
      return;
    }
    // Antes de aceptar las fechas, chequeamos que nadie haya reservado esta habitación para ese rango
    this.reservasService.obtenerReservas().subscribe({
      next: (reservas) => {
        this.reservasService.obtenerReservasHabitacion().subscribe({
          next: (reservasHabitacion) => {
            const idsConfirmadas = reservas
              .filter(r => String(r.id_estado_reserva) === '1')
              .map(r => String(r.id));

            const estaOcupada = reservasHabitacion
              .filter(rh => idsConfirmadas.includes(String(rh.id_reserva)))
              .filter(rh => String(rh.id_habitacion) === String(this.id))
              .some(rh => rh.fecha_hora_checkin.slice(0, 10) < checkout && rh.fecha_hora_checkout.slice(0, 10) > checkin);

            if (estaOcupada) {
              this.mensajeFechas = 'Esta habitación ya está reservada para esas fechas. Elegí otras fechas.';
              this.mensajeExitoFecha = '';
              return;
            }

            this.mensajeFechas = '';
            this.mensajeExitoFecha = 'Fechas confirmadas.';
            this.checkin = checkin;
            this.checkout = checkout;
          },
          error: (error: Error) => {
            this.mensajeFechas = error.message;
          }
        });
      },
      error: (error: Error) => {
        this.mensajeFechas = error.message;
      }
    });
  }

  intentarReservar() {
    if (!this.checkin || !this.checkout) {
      this.mensajeFechas = 'Elegí un check-in y un check-out válidos antes de reservar.';
      return;
    }
    if (this.loginService.usuarioLogueado) {
      console.log('Usuario autenticado, avanzando...');
    // Redirigimos por código usando el Router, pasando checkin y checkout como parametros de ruta
      this.router.navigate(['/detalle-pago', this.id, this.checkin, this.checkout]);
    } else {
      // Si NO está logueado, activamos la variable para que se muestre el modal
      this.mostrarModal = true;
    }
  }
  cerrarModal(): void {
    this.mostrarModal = false;
  }
}