import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiciosService, ServicioApi, TipoServicioApi } from '../../services/servicios/servicios.service';
import { LoginService } from '../../auth/servicios/login/login.service';
import { forkJoin } from 'rxjs';
import { ReservasService, ReservaApi, ReservaServicioApi } from '../../services/reservas/reservas.service';

@Component({
  selector: 'app-formulario-servicios',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario-servicios.component.html',
  styleUrl: './formulario-servicios.component.css'
})
export class FormularioServiciosComponent implements OnInit {
  @Input() id!: string; // llega desde la ruta /formulario-servicio/:id

  private serviciosService = inject(ServiciosService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private loginService = inject(LoginService);
  private reservasService = inject(ReservasService);

  servicio?: ServicioApi;
  tipo?: TipoServicioApi;
  mensajeError: string = '';
  guardando: boolean = false;

  formulario: FormGroup = this.fb.group({
    checkin: ['', Validators.required],
    checkout: ['', Validators.required],
    cantidadPersonas: ['', [Validators.required, Validators.min(1)]],
    nombreCompleto: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  get fechaMinima(): string {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${hoy.getFullYear()}-${mes}-${dia}`;
  }

  ngOnInit(): void {
    // Si hay un usuario logueado, se precargan sus datos en el formulario
    const usuario = this.loginService.usuarioLogueado;
    if (usuario) {
      this.formulario.patchValue({
        nombreCompleto: usuario.nombre + ' ' + usuario.apellido,
        email: usuario.email
      });
      this.formulario.get('nombreCompleto')?.markAllAsTouched();
      this.formulario.get('email')?.markAllAsTouched();
    }

    this.serviciosService.obtenerServicioPorId(this.id).subscribe({
      next: (servicio) => {
        this.servicio = servicio;
        this.obtenerTipo(servicio.id_tipo_servicio);

        const cantidadPersonas = this.formulario.get('cantidadPersonas');
        cantidadPersonas?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(servicio.capacidad_maxima)
        ]);
        cantidadPersonas?.updateValueAndValidity();
      },
      error: (error) => {
        this.mensajeError = error.message;
      }
    });
  }

  obtenerTipo(idTipo: number | string): void {
    this.serviciosService.obtenerTipoServicioPorId(idTipo).subscribe({
      next: (tipo) => {
        this.tipo = tipo;
      },
      error: (error) => {
        this.mensajeError = error.message;
      }
    });
  }

  get precioTotal(): number {
    const checkin = this.formulario.get('checkin')?.value;
    const checkout = this.formulario.get('checkout')?.value;
    if (!checkin || !checkout || !this.servicio) {
      return this.servicio?.precio ?? 0;
    }
    const dias = this.calcularDias(checkin, checkout);
    return dias > 0 ? this.servicio.precio * dias : this.servicio.precio;
  }

  private calcularDias(checkin: string, checkout: string): number {
    const msPorDia = 1000 * 60 * 60 * 24;
    const diferencia = new Date(checkout).getTime() - new Date(checkin).getTime();
    return Math.round(diferencia / msPorDia);
  }

  get Checkin() { return this.formulario.get('checkin'); }
  get Checkout() { return this.formulario.get('checkout'); }
  get CantidadPersonas() { return this.formulario.get('cantidadPersonas'); }
  get NombreCompleto() { return this.formulario.get('nombreCompleto'); }
  get Email() { return this.formulario.get('email'); }

  enviar(): void {
    this.mensajeError = '';
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid || !this.servicio) {
      return;
    }
    const { checkin, checkout, cantidadPersonas } = this.formulario.value;
    if (checkout <= checkin) {
      this.mensajeError = 'La fecha de fin debe ser posterior a la fecha de inicio.';
      return;
    }
    if (Number(cantidadPersonas) > this.servicio.capacidad_maxima) {
      this.mensajeError = `La capacidad máxima para este servicio es ${this.servicio.capacidad_maxima} personas.`;
      return;
    }

    this.verificarDisponibilidad();
  }

  private verificarDisponibilidad(): void {
    this.guardando = true;
    forkJoin({
      estados: this.reservasService.obtenerEstadosReserva(),
      reservas: this.reservasService.obtenerReservas(),
      reservasServicio: this.reservasService.obtenerReservasServicio()
    }).subscribe({
      next: ({ estados, reservas, reservasServicio }) => {
        const estadoConfirmado = estados.find(estado =>
          ['confirmada', 'confirmed'].includes(estado.nombre.toLowerCase())
        );
        if (!estadoConfirmado?.id) {
          this.mostrarError(new Error('No está configurado el estado de reserva confirmada en el backend.'));
          return;
        }

        const reservasConfirmadas = new Set(
          reservas
            .filter(reserva => reserva.id_estado_reserva === estadoConfirmado.id)
            .map(reserva => reserva.id)
        );
        const { checkin, checkout } = this.formulario.value;
        const inicioSolicitado = new Date(`${checkin}T09:00:00Z`).getTime();
        const finSolicitado = new Date(`${checkout}T18:00:00Z`).getTime();
        const ocupado = reservasServicio
          .filter(reserva => reserva.id_servicio === this.servicio!.id)
          .filter(reserva => reservasConfirmadas.has(reserva.id_reserva))
          .some(reserva =>
            new Date(reserva.fecha_hora_inicio).getTime() < finSolicitado &&
            new Date(reserva.fecha_hora_fin).getTime() > inicioSolicitado
          );

        if (ocupado) {
          this.mostrarError(new Error('Este servicio ya está reservado para esas fechas. Elegí otro período.'));
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
        this.guardarReservaServicio(reservaCreada.id!);
      },
      error: (error: Error) => this.mostrarError(error)
    });
  }

  // 2) Vincula el servicio, las fechas y el precio total a la reserva
  private guardarReservaServicio(idReserva: number): void {
    const { checkin, checkout, cantidadPersonas } = this.formulario.value;

    const reservaServicio: ReservaServicioApi = {
      id_reserva: idReserva,
      id_servicio: this.servicio!.id,
      capacidad_invitados: Number(cantidadPersonas),
      pago_acordado: this.precioTotal,
      fecha_hora_inicio: checkin + 'T09:00:00Z',
      fecha_hora_fin: checkout + 'T18:00:00Z'
    };

    this.reservasService.crearReservaServicio(reservaServicio).subscribe({
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
