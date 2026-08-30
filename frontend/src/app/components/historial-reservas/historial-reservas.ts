import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-historial-reservas',
  standalone: true,
  imports: [CommonModule, RouterLink], // Aquí sí usamos RouterLink para los botones "Ver habitación"
  templateUrl: './historial-reservas.html',
  styleUrl: './historial-reservas.css'
})
export class HistorialReservasComponent {
  // Acá más adelante podés cargar el array de reservas dinámicas
}
