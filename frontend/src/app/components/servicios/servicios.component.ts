import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../../auth/servicios/login/login.service';
import { ServiciosService, ServicioApi, TipoServicioApi } from '../../services/servicios/servicios.service';
import { ModalReservaComponent } from '../modal-reserva/modal-reserva.component';

@Component({
  selector: 'app-servicios',
  imports: [CommonModule, ModalReservaComponent],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent implements OnInit {
  private loginService = inject(LoginService);
  private router = inject(Router);
  private serviciosService = inject(ServiciosService);

  servicios: ServicioApi[] = [];
  tiposServicio: TipoServicioApi[] = [];
  cargando = true;
  mensajeError = '';
  mostrarModal = false;
  idServicioSeleccionado?: number;

  ngOnInit(): void {
    this.serviciosService.obtenerTiposServicio().subscribe({
      next: (tipos) => {
        this.tiposServicio = tipos;
        this.serviciosService.obtenerServicios().subscribe({
          next: (servicios) => {
            this.servicios = servicios;
            this.cargando = false;
          },
          error: (error: Error) => this.mostrarError(error)
        });
      },
      error: (error: Error) => this.mostrarError(error)
    });
  }

  nombreTipo(idTipo: number): string {
    return this.tiposServicio.find(tipo => tipo.id === idTipo)?.nombre_servicio ?? 'Servicio';
  }

  imagenTipo(idTipo: number): string {
    const nombre = this.nombreTipo(idTipo).toLowerCase();
    if (nombre.includes('conferencia')) return 'imagenes/sala-conferencia.webp';
    if (nombre.includes('comedor')) return 'imagenes/comedor.webp';
    if (nombre.includes('privada')) return 'imagenes/sala-privada.webp';
    if (nombre.includes('working')) return 'imagenes/co-working.webp';
    return 'imagenes/general.webp';
  }

  intentarReservar(idServicio: number): void {
    if (this.loginService.usuarioLogueado) {
      this.router.navigate(['/formulario-servicio', idServicio]);
    } else {
      this.idServicioSeleccionado = idServicio;
      this.mostrarModal = true;
    }
  }

  private mostrarError(error: Error): void {
    this.mensajeError = error.message;
    this.cargando = false;
  }
}