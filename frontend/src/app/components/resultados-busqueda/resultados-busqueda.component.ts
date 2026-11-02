import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HabitacionesService } from '../../services/habitaciones/habitaciones.service';
import { ListasVaciasComponent } from '../listas-vacias/listas-vacias.component';
import { ReservasService } from '../../services/reservas/reservas.service';
import { Habitacion, TipoHabitacion, Reserva, ReservaHabitacion } from '../../models';

@Component({
  selector: 'app-resultados-busqueda',
  standalone: true,
  imports: [CommonModule, ListasVaciasComponent, RouterLink],
  templateUrl: './resultados-busqueda.component.html',
  styleUrl: './resultados-busqueda.component.css'
})
export class ResultadosBusquedaComponent {
  habitaciones: Habitacion[] = [];
  habitacionesOriginales: Habitacion[] = [];
  tiposHabitacion: TipoHabitacion[] = [];
  cargando: boolean = true;
  mensajeError: string = '';
  checkin: string | null = null;
  checkout: string | null = null;
  mensajeFechas: string = '';
  idsOcupadas: number[] = [];
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

  obtenerHabitaciones(): void {
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

  obtenerNombreTipo(idTipo: number): string {
    const tipoEncontrado = this.tiposHabitacion.find(tiposHabitacion => tiposHabitacion.id === idTipo);
    return tipoEncontrado ? tipoEncontrado.nombre : 'Habitación';
  }

  imagenPrincipal(habitacion: Habitacion): string {
    return this.habitacionesService.obtenerImagenPrincipal(habitacion.id_tipo_habitacion);
  }

  buscarFechas(checkin: string, checkout: string, huespedes: string): void {
    this.huespedesMinimos = Number(huespedes) || 1;

    const hayCheckin = !!checkin;
    const hayCheckout = !!checkout;

    // Si cargó alguna fecha, las dos tienen que ser válidas
    if ((hayCheckin || hayCheckout) && (!hayCheckin || !hayCheckout || checkout <= checkin)) {
      this.mensajeFechas = 'Elegí un check-in y un check-out válidos (el check-out debe ser posterior al check-in).';
      this.checkin = null;
      this.checkout = null;
      this.busquedaHecha = false;
      this.idsOcupadas = [];
      this.aplicarFiltros();
      return;
    }

    this.mensajeFechas = '';

    if (!hayCheckin && !hayCheckout) {
      // Sin fechas: filtramos solo por huéspedes/precio/disponibilidad general
      this.checkin = null;
      this.checkout = null;
      this.busquedaHecha = false;
      this.idsOcupadas = [];
      this.aplicarFiltros();
      return;
    }

    this.checkin = checkin;
    this.checkout = checkout;

    this.reservasService.obtenerReservasConfirmadas().subscribe({
      next: (reservasConfirmadas) => {
        this.reservasService.obtenerReservasHabitacion().subscribe({
          next: (reservasHabitacion) => {
            this.filtrarDisponibles(reservasConfirmadas, reservasHabitacion);
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

  private filtrarDisponibles(reservasConfirmadas: Reserva[], reservasHabitacion: ReservaHabitacion[]): void {
    // Las reservas ya vienen filtradas: solo las Confirmadas
    const idsConfirmadas = reservasConfirmadas.map(reserva => reserva.id);

    // Habitaciones ocupadas: reserva confirmada cuyas fechas se superponen con la búsqueda
    this.idsOcupadas = reservasHabitacion
      .filter(reservaHabitacion => idsConfirmadas.includes(reservaHabitacion.id_reserva))
      .filter(reservaHabitacion => reservaHabitacion.fecha_checkin.slice(0, 10) < this.checkout! && reservaHabitacion.fecha_checkout.slice(0, 10) > this.checkin!)
      .map(reservaHabitacion => reservaHabitacion.id_habitacion);

    this.busquedaHecha = true;
    this.aplicarFiltros();
  }

  private aplicarFiltros(): void {
    this.habitaciones = this.habitacionesOriginales.filter(habitacion =>
      (this.precioMaximo <= 0 || habitacion.precio <= this.precioMaximo) &&
      habitacion.capacidad >= this.huespedesMinimos &&
      (this.busquedaHecha
        ? (
            !this.idsOcupadas.includes(habitacion.id) &&
            habitacion.id_estado_habitacion !== 3 // 3 = Mantenimiento
          )
        : habitacion.id_estado_habitacion === 1 // Sin fechas elegidas: solo mostramos las Disponibles
      )
    );
  }
}