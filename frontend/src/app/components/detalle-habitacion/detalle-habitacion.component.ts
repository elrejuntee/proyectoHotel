import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HabitacionesService, HabitacionApi, TipoHabitacionApi } from '../../services/habitaciones/habitaciones.service';

@Component({
  selector: 'app-detalle-habitacion',
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-habitacion.component.html',
  styleUrl: './detalle-habitacion.component.css'
})
export class DetalleHabitacionComponent implements OnInit {
  @Input() id!: string; // llega desde la ruta /detalle-habitacion/:id

  habitacion?: HabitacionApi;
  tipo?: TipoHabitacionApi;
  mensajeError: string = '';

  constructor(private habitacionesService: HabitacionesService) {}

  ngOnInit(): void {
    this.habitacionesService.obtenerHabitacionPorId(this.id).subscribe({
      next: (habitacion) => {
        this.habitacion = habitacion;
        this.obtenerTipo(habitacion.id_tipo_habitacion);
      },
      error: (error) => {
        this.mensajeError = error.message;
      }
    });
  }

  obtenerTipo(idTipo: number | string): void {
    this.habitacionesService.obtenerTipoHabitacionPorId(idTipo).subscribe({
      next: (tipo) => {
        this.tipo = tipo;
      },
      error: (error) => {
        this.mensajeError = error.message;
      }
    });
  }
}