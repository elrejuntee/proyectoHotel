import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LoginService } from '../../auth/servicios/login/login.service';

@Component({
  selector: 'app-sidebar-admin',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar-admin.component.html',
  styleUrl: './sidebar-admin.component.css'
})
export class SidebarAdminComponent {

  // Se inyectan el servicio de login y el router en el constructor
  constructor(private loginService: LoginService, private router: Router) {}

  // ===== Usuario logueado (se muestra abajo a la izquierda) =====
  get nombreCompleto(): string {
    const usuario = this.loginService.usuarioLogueado;
    return usuario ? usuario.nombre + ' ' + usuario.apellido : '';
  }

  get inicial(): string {
    const usuario = this.loginService.usuarioLogueado;
    return usuario ? usuario.nombre.charAt(0).toUpperCase() : '';
  }

  // ===== Cerrar sesión: quita al usuario logueado y vuelve al login =====
  cerrarSesion(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}