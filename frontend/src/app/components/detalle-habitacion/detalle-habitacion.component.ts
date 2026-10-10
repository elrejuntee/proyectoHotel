import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HabitacionesService, HabitacionApi, TipoHabitacionApi } from '../../services/habitaciones/habitaciones.service';
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
  @Input() checkin?: string;  // llega desde la URL: ?checkin=YYYY-MM-DD
  @Input() checkout?: string; // llega desde la URL: ?checkout=YYYY-MM-DD

  habitacion?: HabitacionApi;
  tipo?: TipoHabitacionApi;
  mensajeError: string = '';

  mensajeFechas: string = '';
  mostrarFiltroFechas: boolean = false;

  constructor(
    private habitacionesService: HabitacionesService,
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
      return;
    }
    this.mensajeFechas = '';
    this.checkin = checkin;
    this.checkout = checkout;
  }

  intentarReservar() {
    if (this.loginService.usuarioLogueado) {
      console.log('Usuario autenticado, avanzando...');
    // Redirigimos por código usando el Router, pasando los parámetros de la URL
      this.router.navigate(['/detalle-pago', this.id], { 
        queryParams: { 
          checkin: this.checkin, 
          checkout: this.checkout 
        } 
      });
    } else {
      // Si NO está logueado, abrimos el modal de Bootstrap
      const modalElement = document.getElementById('authModal');
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    }
  }
}