import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-historial-reservas',
  standalone: true,
  imports: [RouterLink], // Aquí sí usamos RouterLink para los botones "Ver habitación"
  templateUrl: './historial-reservas.component.html',
  styleUrl: './historial-reservas.component.css'
})
export class HistorialReservasComponent {
  // Acá más adelante podés cargar el array de reservas dinámicas
}
