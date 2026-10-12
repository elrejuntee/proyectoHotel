import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-modal-reserva',
  imports: [ RouterLink ],
  templateUrl: './modal-reserva.component.html',
  styleUrl: './modal-reserva.component.css'
})
export class ModalReservaComponent {
  private router = inject(Router);

  get urlActual(): string {
    return this.router.url;
  }
}