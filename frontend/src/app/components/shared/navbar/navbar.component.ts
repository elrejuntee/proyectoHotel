import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router} from '@angular/router';
import { AuthService } from '../../../service/auth.service';
@Component({
  imports: [RouterLink, RouterLinkActive, CommonModule],
  selector: 'app-navbar',
  styleUrl: './navbar.component.css',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  menuAbierto = false;
  autenticado = true;

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    console.log(this.autenticado)
    this.authService.autenticado$.subscribe((estado: boolean) => {
      this.autenticado = estado;
    });
  }

  cerrarSesion(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
