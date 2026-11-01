import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { HabitacionesService, HabitacionApi, TipoHabitacionApi } from '../../services/habitaciones/habitaciones.service';
import { ReservasService, ReservaApi, ReservaHabitacionApi} from '../../services/reservas/reservas.service';
import { LoginService } from '../../auth/servicios/login/login.service';

@Component({
  selector: 'app-detalle-pago',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './detalle-pago.component.html',
  styleUrl: './detalle-pago.component.css'
})
export class DetallePagoComponent implements OnInit {
  @Input() id!: string; // llega desde la ruta /detalle-pago/:id
  @Input() checkin?: string;  // llega desde la URL: ?checkin=YYYY-MM-DD
  @Input() checkout?: string; // llega desde la URL: ?checkout=YYYY-MM-DD

  habitacion?: HabitacionApi;
  tipo?: TipoHabitacionApi;
  mensajeError: string = '';
  guardando: boolean = false;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private habitacionesService: HabitacionesService,
    private reservasService: ReservasService,
    private loginService: LoginService,
    private router: Router
  ) {
      this.form = this.formBuilder.group({
        nombre: ['', [Validators.required]],
        apellido: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        metodoPago: ['1'], // 1 = Tarjeta, 2 = Transferencia (ids de metodos_pago)
        numeroTarjeta: ['', [Validators.required,]],
        nombreTarjeta: ['', [Validators.required]],
        vencimiento: ['', [Validators.required]],
        cvv: ['', [Validators.required]]
      });
  }

  ngOnInit(): void {
    // Si hay un usuario logueado, se precargan sus datos en el formulario
    const usuario = this.loginService.usuarioLogueado;
    if (usuario) {
      this.form.patchValue({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email
      });
      this.form.get('nombre')?.markAllAsTouched();
      this.form.get('apellido')?.markAllAsTouched();
      this.form.get('email')?.markAllAsTouched();
    }
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

  // Cantidad de noches entre check-in y check-out
    get noches(): number {
      if (!this.checkin || !this.checkout) {
        return 0;
      }
      const diferencia = new Date(this.checkout).getTime() - new Date(this.checkin).getTime();
      return Math.max(0, Math.round(diferencia / (1000 * 60 * 60 * 24)));
    }

  get total(): number {
    return (this.habitacion?.precio ?? 0) * this.noches;
  }

  onEnviar(event: Event): void {
    event.preventDefault();
    this.mensajeError = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.habitacion || this.noches <= 0) {
      this.mensajeError = 'Elegí las fechas de tu estadía desde la búsqueda de reservas (el check-out debe ser posterior al check-in).';
      return;
    }
    if (!this.loginService.usuarioLogueado) {
      this.mensajeError = 'Tenés que iniciar sesión para confirmar la reserva.';
      return;
    }

    this.guardando = true;
    this.verificarDisponibilidad();
  }

// 0) Antes de guardar, chequea que nadie haya reservado esta habitación para estas fechas
//    (por si la habitación se ocupó después de que se armó el listado de resultados)
  private verificarDisponibilidad(): void {
    forkJoin({
      estadosHabitacion: this.habitacionesService.obtenerEstadosHabitacion(),
      estadosReserva: this.reservasService.obtenerEstadosReserva(),
      reservas: this.reservasService.obtenerReservas(),
      reservasHabitacion: this.reservasService.obtenerReservasHabitacion()
    }).subscribe({
      next: ({ estadosHabitacion, estadosReserva, reservas, reservasHabitacion }) => {
        const estadoDisponible = estadosHabitacion.find(estado =>
          estado.nombre.toLowerCase() === 'disponible'
        );
        const estadoConfirmado = estadosReserva.find(estado =>
          estado.nombre.toLowerCase() === 'confirmada'
        );
        if (!estadoDisponible || !estadoConfirmado?.id) {
          this.mostrarError(new Error('Falta configurar el estado de habitación disponible o reserva confirmada.'));
          return;
        }
        if (this.habitacion!.id_estado_habitacion !== estadoDisponible.id) {
          this.mostrarError(new Error('Esta habitación ya no está disponible para reservar.'));
          return;
        }

        const idsConfirmadas = new Set(
          reservas
            .filter(reserva => reserva.id_estado_reserva === estadoConfirmado.id)
            .map(reserva => reserva.id)
        );
        const inicio = new Date(`${this.checkin}T14:00:00Z`).getTime();
        const fin = new Date(`${this.checkout}T10:00:00Z`).getTime();
        const yaReservada = reservasHabitacion
          .filter(reserva => reserva.id_habitacion === this.habitacion!.id)
          .filter(reserva => idsConfirmadas.has(reserva.id_reserva))
          .some(reserva =>
            new Date(reserva.fecha_hora_checkin).getTime() < fin &&
            new Date(reserva.fecha_hora_checkout).getTime() > inicio
          );

        if (yaReservada) {
          this.mostrarError(new Error('Esta habitación ya fue reservada para esas fechas. Volvé a los resultados y elegí otra.'));
          return;
        }

        this.guardarReserva(estadoConfirmado.id);
      },
      error: (error: Error) => this.mostrarError(error)
    });
  }

  private guardarReserva(idEstadoConfirmado: number): void {
    const reserva: ReservaApi = {
      id_usuario: this.loginService.usuarioLogueado!.id,
      id_estado_reserva: idEstadoConfirmado,
      numero_reserva: Math.floor(10000 + Math.random() * 90000),
      fecha_hora_reserva: new Date().toISOString()
    };

    this.reservasService.crearReserva(reserva).subscribe({
      next: (reservaCreada) => {
        this.guardarReservaHabitacion(reservaCreada.id!);
      },
      error: (error: Error) => this.mostrarError(error)
    });
  }

  // 2) Vincula la habitación y las fechas a la reserva
  private guardarReservaHabitacion(idReserva: number): void {
    const reservaHabitacion: ReservaHabitacionApi = {
      id_reserva: idReserva,
      id_habitacion: this.habitacion!.id!,
      pago_acordado: this.total,
      fecha_hora_checkin: this.checkin + 'T14:00:00Z',
      fecha_hora_checkout: this.checkout + 'T10:00:00Z'
    };

      this.reservasService.crearReservaHabitacion(reservaHabitacion).subscribe({
        next: () => {
          this.guardando = false;
          this.router.navigate(['/pago-confirmado', idReserva]);
        },
        error: (error: Error) => {
          this.reservasService.eliminarReserva(idReserva).subscribe({
            next: () => this.mostrarError(error),
            error: (rollbackError: Error) => {
              this.mensajeError = `${error.message} No se pudo revertir la reserva incompleta: ${rollbackError.message}`;
              this.guardando = false;
            }
          });
        }
      });
    }

  private mostrarError(error: Error): void {
    this.mensajeError = error.message;
    this.guardando = false;
  }
}