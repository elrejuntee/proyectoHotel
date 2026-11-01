import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { API_BASE_URL } from '../../api.config';

export interface ReservaApi {
  id?: number;
  id_usuario: number;
  id_estado_reserva: number;
  numero_reserva: number;
  fecha_hora_reserva: string;
}

export interface ReservaHabitacionApi {
  id?: number;
  id_reserva: number;
  id_habitacion: number;
  pago_acordado: number;
  fecha_hora_checkin: string;
  fecha_hora_checkout: string;
}

export interface ReservaServicioApi {
  id?: number;
  id_reserva: number;
  id_servicio: number;
  capacidad_invitados: number;
  pago_acordado: number;
  fecha_hora_inicio: string;
  fecha_hora_fin: string;
}

export interface EstadoReservaApi {
  id?: number;
  nombre: string;
}

// Servicio = Modelo (MVC): concentra las llamadas HTTP al backend Django.
@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private readonly url = API_BASE_URL;

  constructor(private http: HttpClient) { }

  // ----- POST -----
  crearReserva(reserva: ReservaApi): Observable<ReservaApi> {
    return this.http.post<ReservaApi>(`${this.url}/reservas`, reserva).pipe(
      catchError(this.handleError)
    );
  }

  eliminarReserva(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/reservas/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  crearReservaHabitacion(reservaHabitacion: ReservaHabitacionApi): Observable<ReservaHabitacionApi> {
    return this.http.post<ReservaHabitacionApi>(`${this.url}/reservas-habitacion`, reservaHabitacion).pipe(
      catchError(this.handleError)
    );
  }

  crearReservaServicio(reservaServicio: ReservaServicioApi): Observable<ReservaServicioApi> {
    return this.http.post<ReservaServicioApi>(`${this.url}/reservas-servicio`, reservaServicio).pipe(
      catchError(this.handleError)
    );
  }

  // ----- GET -----
  obtenerReservas(): Observable<ReservaApi[]> {
    return this.http.get<ReservaApi[]>(`${this.url}/reservas`).pipe(
      catchError(this.handleError)
    );
  }

  obtenerReservasHabitacion(): Observable<ReservaHabitacionApi[]> {
    return this.http.get<ReservaHabitacionApi[]>(`${this.url}/reservas-habitacion`).pipe(
      catchError(this.handleError)
    );
  }

  obtenerReservasServicio(): Observable<ReservaServicioApi[]> {
    return this.http.get<ReservaServicioApi[]>(`${this.url}/reservas-servicio`).pipe(
      catchError(this.handleError)
    );
  }

  obtenerEstadosReserva(): Observable<EstadoReservaApi[]> {
    return this.http.get<EstadoReservaApi[]>(`${this.url}/estados-reserva`).pipe(
      catchError(this.handleError)
    );
  }

  // ----- Manejo de errores -----
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Ocurrió un error:', error.error);
    } else {
      console.error(`El backend devolvió el código ${error.status}, el cuerpo fue: `, error.error);
    }
    return throwError(() => new Error('No se pudo completar la operación. Verificá que el servidor esté corriendo e intentá de nuevo.'));
  }
}