import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LoginService } from '../../../auth/servicios/login/login.service';

@Component({
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  selector: 'app-navbar',
  styleUrl: './navbar.component.css',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  menuAbierto = false;

  public loginService = inject(LoginService);

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }
}
