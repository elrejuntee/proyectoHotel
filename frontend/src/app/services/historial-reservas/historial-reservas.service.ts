import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  EstadoReserva,
  Habitacion,
  Reserva,
  ReservaHabitacion,
  ReservaServicio,
  Servicio,
  TipoHabitacion,
  TipoServicio
} from '../../models';

@Injectable({
  providedIn: 'root'
})
export class HistorialReservasService {
  private apiUrl = 'http://localhost:8000/api';
  private httpClient = inject(HttpClient);

  obtenerReservas(): Observable<Reserva[]> {
    return this.httpClient.get<Reserva[]>(
      this.apiUrl + '/reservas/'
    );
  }

  obtenerEstadosReserva(): Observable<EstadoReserva[]> {
    return this.httpClient.get<EstadoReserva[]>(
      this.apiUrl + '/estados-reserva/'
    );
  }

  obtenerReservasHabitacion(): Observable<ReservaHabitacion[]> {
    return this.httpClient.get<ReservaHabitacion[]>(
      this.apiUrl + '/reservas-habitacion/'
    );
  }

  obtenerHabitaciones(): Observable<Habitacion[]> {
    return this.httpClient.get<Habitacion[]>(
      this.apiUrl + '/habitaciones/'
    );
  }

  obtenerTiposHabitacion(): Observable<TipoHabitacion[]> {
    return this.httpClient.get<TipoHabitacion[]>(
      this.apiUrl + '/tipos-habitaciones/'
    );
  }

  obtenerReservasServicio(): Observable<ReservaServicio[]> {
    return this.httpClient.get<ReservaServicio[]>(
      this.apiUrl + '/reservas-servicio/'
    );
  }

  obtenerServicios(): Observable<Servicio[]> {
    return this.httpClient.get<Servicio[]>(
      this.apiUrl + '/servicios/'
    );
  }

  obtenerTiposServicio(): Observable<TipoServicio[]> {
    return this.httpClient.get<TipoServicio[]>(
      this.apiUrl + '/tipo-servicios/'
    );
  }
}