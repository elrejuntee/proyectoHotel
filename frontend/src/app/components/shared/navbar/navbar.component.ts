import { Component, inject, OnChanges } from '@angular/core';
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
export class NavbarComponent implements OnChanges {
  menuAbierto = false;

  public loginService = inject(LoginService);

  ngOnChanges(): void {
    this.salir();
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  salir(): void {
    this.loginService.logout();
  }
}
