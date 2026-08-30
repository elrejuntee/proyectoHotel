import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  menuAbierto = false;
  autenticado = false;
  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }
}
