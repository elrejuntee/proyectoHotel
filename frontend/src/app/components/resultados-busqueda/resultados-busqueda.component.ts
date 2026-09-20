import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitacionesService, HabitacionApi, TipoHabitacionApi } from '../../services/habitaciones/habitaciones.service';

@Component({
  selector: 'app-resultados-busqueda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados-busqueda.component.html',
  styleUrl: './resultados-busqueda.component.css'
})
export class ResultadosBusquedaComponent {
  habitaciones: HabitacionApi[] = [];
  habitacionesOriginales: HabitacionApi[] = [];
  tiposHabitacion: TipoHabitacionApi[] = [];
  cargando: boolean = true;
  mensajeError: string = '';

  constructor(private habitacionesService: HabitacionesService) {}

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    this.cargando = true;
        this.habitacionesService.obtenerTiposHabitacion().subscribe({
      next: (tipos) => {
        this.tiposHabitacion = tipos;
        this.obtenerHabitaciones(); // Una vez obtenidos los tipos, traemos las habitaciones
      },
      error: (error) => {
        console.error('Error al obtener los tipos', error);
        this.obtenerHabitaciones(); // Intentamos traer las habitaciones igual
      }
    });
  }
  obtenerHabitaciones(): void{
    this.cargando = true;
    this.habitacionesService.obtenerHabitaciones().subscribe({
      next: (data) => {
        this.habitacionesOriginales = data;
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
  filtrarPorPrecio(valorInput: string) {
    const precioMaximo = Number(valorInput);

    if (!precioMaximo || precioMaximo <= 0) {
      this.habitaciones = [...this.habitacionesOriginales];
    } else {
      this.habitaciones = this.habitacionesOriginales.filter(
        h => h.precio <= precioMaximo
      );
    }
  }
  obtenerNombreTipo(idTipo: number | string): string {
    const tipoEncontrado = this.tiposHabitacion.find(t => t.id == idTipo);
    return tipoEncontrado ? tipoEncontrado.nombre : 'Habitación';
  }
}