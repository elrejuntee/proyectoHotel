import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HabitacionesService, HabitacionApi, TipoHabitacionApi } from '../../services/habitaciones/habitaciones.service';
import { ReservasService, ReservaApi, ReservaHabitacionApi, PagoApi } from '../../services/reservas/reservas.service';
import { LoginService } from '../../auth/servicios/login/login.service';

@Component({
  selector: 'app-detalle-pago',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './detalle-pago.component.html',
  styleUrl: './detalle-pago.component.css'
})
export class DetallePagoComponent implements OnInit {
  @Input() id!: string; // llega desde la ruta /detalle-pago/:id

  habitacion?: HabitacionApi;
  tipo?: TipoHabitacionApi;
  mensajeError: string = '';
  guardando: boolean = false;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private habitacionesService: HabitacionesService,
    private reservasService: ReservasService,
    private loginService: LoginService
  ) {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      documento: ['', [Validators.required]],
      comentarios: [''],
      fechaCheckin: ['', [Validators.required]],
      fechaCheckout: ['', [Validators.required]],
      metodoPago: ['1'], // 1 = Tarjeta, 2 = Transferencia (ids de metodos_pago)
      numeroTarjeta: [''],
      nombreTarjeta: [''],
      vencimiento: [''],
      cvv: [''],
      terminos: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {
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

  // Cantidad de noches entre check-in y check-out
  get noches(): number {
    const { fechaCheckin, fechaCheckout } = this.form.value;
    if (!fechaCheckin || !fechaCheckout) {
      return 0;
    }
    const diferencia = new Date(fechaCheckout).getTime() - new Date(fechaCheckin).getTime();
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
      this.mensajeError = 'Elegí un check-in y un check-out válidos (el check-out debe ser posterior al check-in).';
      return;
    }
    if (!this.loginService.usuarioLogueado) {
      this.mensajeError = 'Tenés que iniciar sesión para confirmar la reserva.';
      return;
    }

    this.guardando = true;
    this.guardarReserva();
  }

  // 1) Crea la reserva con estado "Confirmada" (id 1)
  private guardarReserva(): void {
    const reserva: ReservaApi = {
      id_usuario: this.loginService.usuarioLogueado!.id,
      id_estado_reserva: 1,
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
  private guardarReservaHabitacion(idReserva: number | string): void {
    const { fechaCheckin, fechaCheckout } = this.form.value;
    const reservaHabitacion: ReservaHabitacionApi = {
      id_reserva: idReserva,
      id_habitacion: this.habitacion!.id!,
      pago_acordado: this.total,
      fecha_hora_checkin: fechaCheckin + 'T14:00:00Z',
      fecha_hora_checkout: fechaCheckout + 'T10:00:00Z'
    };

    this.reservasService.crearReservaHabitacion(reservaHabitacion).subscribe({
      next: () => {
        this.guardarPago(idReserva);
      },
      error: (error: Error) => this.mostrarError(error)
    });
  }

  // 3) Registra el pago: Aprobado (1) con tarjeta, Pendiente (2) con transferencia
  private guardarPago(idReserva: number | string): void {
    const metodo = this.form.value.metodoPago;
    const pago: PagoApi = {
      id_reserva: idReserva,
      id_estado_pago: metodo === '1' ? 1 : 2,
      id_metodo_pago: Number(metodo),
      monto_total: this.total,
      fecha: new Date().toISOString().slice(0, 10)
    };

    this.reservasService.crearPago(pago).subscribe({
      next: () => {
        this.ocuparHabitacion();
      },
      error: (error: Error) => this.mostrarError(error)
    });
  }

  // 4) Cambia el estado de la habitación a "Ocupada" (id 2)
  private ocuparHabitacion(): void {
    const ocupada: HabitacionApi = { ...this.habitacion!, id_estado_habitacion: 2 };

    this.habitacionesService.actualizarHabitacion(this.habitacion!.id!, ocupada).subscribe({
      next: () => {
        this.guardando = false;
        alert('¡Reserva confirmada! Gracias por elegir El Rejunte Hotel.');
      },
      error: (error: Error) => this.mostrarError(error)
    });
  }

  private mostrarError(error: Error): void {
    this.mensajeError = error.message;
    this.guardando = false;
  }
}