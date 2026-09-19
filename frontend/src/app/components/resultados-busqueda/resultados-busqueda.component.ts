import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitacionesService, HabitacionApi } from '../../services/habitaciones/habitaciones.service';

@Component({
  selector: 'app-resultados-busqueda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados-busqueda.component.html',
  styleUrl: './resultados-busqueda.component.css'
})
export class ResultadosBusquedaComponent {
  habitaciones: HabitacionApi[] = [];
  cargando: boolean = true;
  mensajeError: string = '';

  constructor(private habitacionesService: HabitacionesService) {}

  ngOnInit(): void {
    this.obtenerHabitaciones();
  }

  obtenerHabitaciones(): void{
    this.cargando = true;
    this.habitacionesService.obtenerHabitaciones().subscribe({
      next: (data) => {
        this.habitaciones = data;
        this.cargando = false;
        console.log('Habitaciones disponibles', this.habitaciones)
      },
      error: (error) => {
        console.error('Error al obtener las habitaciones', error);
        this.habitaciones = [];
        this.cargando = false;
        }
    })
  }
}