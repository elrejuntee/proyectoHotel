import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../auth/servicios/login/login.service';
import { ModalReservaComponent } from '../modal-reserva/modal-reserva.component';

@Component({
  selector: 'app-servicios',
  imports: [ModalReservaComponent],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent {
  private loginService = inject(LoginService);
  private router = inject(Router);

mostrarModal = false;

idServicioSeleccionado?: string | number;

intentarReservar(idServicio: string | number): void {
    if (this.loginService.usuarioLogueado) {
      this.router.navigate(['/formulario-servicio', idServicio]);
    } else {
      this.idServicioSeleccionado = idServicio;
      this.mostrarModal = true;
    }
  }
}