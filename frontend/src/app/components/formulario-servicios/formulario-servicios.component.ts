import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiciosService, ServicioApi, TipoServicioApi } from '../../services/servicios/servicios.service';
import { LoginService } from '../../auth/servicios/login/login.service';

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

  servicio?: ServicioApi;
  tipo?: TipoServicioApi;
  mensajeError: string = '';

  formulario: FormGroup = this.fb.group({
    checkin: ['', Validators.required],
    checkout: ['', Validators.required],
    cantidadPersonas: ['', [Validators.required, Validators.min(1)]],
    nombreCompleto: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

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
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid) {
      return;
    }
    // No se guarda nada en la base de datos: solo mostramos la confirmación
    this.router.navigate(['/pago-confirmado', this.id]);
  }
}