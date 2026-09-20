import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-detalle-habitacion',
  imports: [RouterLink],
  templateUrl: './detalle-habitacion.component.html',
  styleUrl: './detalle-habitacion.component.css'
})
export class DetalleHabitacionComponent {
  @Input() id!: string; // llega desde la ruta /detalle-habitacion/:id

}
