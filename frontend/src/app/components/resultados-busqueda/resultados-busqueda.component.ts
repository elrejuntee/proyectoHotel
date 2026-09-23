import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HabitacionesService, HabitacionApi, TipoHabitacionApi } from '../../services/habitaciones/habitaciones.service';
import { ListasVaciasComponent } from '../listas-vacias/listas-vacias.component';
import { ReservasService, ReservaApi, ReservaHabitacionApi } from '../../services/reservas/reservas.service';

@Component({
  selector: 'app-resultados-busqueda',
  standalone: true,
  imports: [CommonModule, ListasVaciasComponent, RouterLink],
  templateUrl: './resultados-busqueda.component.html',
  styleUrl: './resultados-busqueda.component.css'
})
export class ResultadosBusquedaComponent {
  habitaciones: HabitacionApi[] = [];
  habitacionesOriginales: HabitacionApi[] = [];
  tiposHabitacion: TipoHabitacionApi[] = [];
  cargando: boolean = true;
  mensajeError: string = '';
  checkin: string | null = null;
  checkout: string | null = null;
  mensajeFechas: string = '';
  idsOcupadas: string[] = [];
  huespedesMinimos: number = 1;
  precioMaximo: number = 0;
  busquedaHecha: boolean = false;

  constructor(private habitacionesService: HabitacionesService, private reservasService: ReservasService) {}

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
    this.precioMaximo = Number(valorInput) || 0;
    this.aplicarFiltros();
  }
  obtenerNombreTipo(idTipo: number | string): string {
    const tipoEncontrado = this.tiposHabitacion.find(t => t.id == idTipo);
    return tipoEncontrado ? tipoEncontrado.nombre : 'Habitación';
  }

    imagenPrincipal(hab: HabitacionApi): string {
    return this.habitacionesService.obtenerImagenPrincipal(hab.id_tipo_habitacion);
  }
  
  buscarFechas(checkin: string, checkout: string, huespedes: string): void {
    if (!checkin || !checkout || checkout <= checkin) {
      this.checkin = null;
      this.checkout = null;
      this.mensajeFechas = 'Elegí un check-in y un check-out válidos (el check-out debe ser posterior al check-in).';
      // Se saca el filtro de fechas y se vuelve a mostrar la lista
      this.busquedaHecha = false;
      this.idsOcupadas = [];
      this.huespedesMinimos = 1;
      this.aplicarFiltros();
      return;
    }
    this.mensajeFechas = '';
    this.checkin = checkin;
    this.checkout = checkout;

    this.reservasService.obtenerReservas().subscribe({
      next: (reservas) => {
        this.reservasService.obtenerReservasHabitacion().subscribe({
          next: (reservasHabitacion) => {
            this.filtrarDisponibles(reservas, reservasHabitacion, Number(huespedes));
          },
          error: (error: Error) => {
            this.mensajeFechas = error.message;
          }
        });
      },
      error: (error: Error) => {
        this.mensajeFechas = error.message;
      }
    });
  }

  private filtrarDisponibles(reservas: ReservaApi[], reservasHabitacion: ReservaHabitacionApi[], huespedes: number): void {
    // Solo cuentan las reservas Confirmadas (id 1)
    const idsConfirmadas = reservas
      .filter(r => String(r.id_estado_reserva) === '1')
      .map(r => String(r.id));

    // Habitaciones ocupadas: reserva confirmada cuyas fechas se superponen con la búsqueda
    this.idsOcupadas = reservasHabitacion
      .filter(rh => idsConfirmadas.includes(String(rh.id_reserva)))
      .filter(rh => rh.fecha_hora_checkin.slice(0, 10) < this.checkout! && rh.fecha_hora_checkout.slice(0, 10) > this.checkin!)
      .map(rh => String(rh.id_habitacion));

    this.huespedesMinimos = huespedes;
    this.busquedaHecha = true;
    this.aplicarFiltros();
  }

  // Aplica juntos el filtro de fechas/huéspedes y el de precio
  private aplicarFiltros(): void {
    this.habitaciones = this.habitacionesOriginales.filter(h =>
      (this.precioMaximo <= 0 || h.precio <= this.precioMaximo) &&
      (!this.busquedaHecha || (
        !this.idsOcupadas.includes(String(h.id)) &&
        String(h.id_estado_habitacion) !== '3' && // 3 = Mantenimiento
        h.capacidad >= this.huespedesMinimos
      ))
    );
  }
}