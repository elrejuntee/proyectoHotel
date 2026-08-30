import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listas-vacias',
  imports: [CommonModule],
  templateUrl: './listas-vacias.component.html',
  styleUrl: './listas-vacias.component.css'
})
export class ListasVaciasComponent {
resultadosBusqueda: any[] = [];
}
