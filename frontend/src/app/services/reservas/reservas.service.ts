import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface ReservaApi {
  id?: number | string;
  id_usuario: number | string;
  id_estado_reserva: number | string;
  numero_reserva: number;
  fecha_reserva: string;
}

export interface ReservaHabitacionApi {
  id?: number | string;
  id_reserva: number | string;
  id_habitacion: number | string;
  pago_acordado: number;
  fecha_checkin: string;
  fecha_checkout: string;
}

export interface ReservaServicioApi {
  id?: number | string;
  id_reserva: number | string;
  id_servicio: number | string;
  capacidad_invitados: number;
  pago_acordado: number;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface EstadoReservaApi {
  id?: number | string;
  estado_reserva: string;
}

// Servicio = Modelo (MVC): concentra las llamadas HTTP al backend Django.
@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  url: string = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // ----- POST -----
  crearReserva(reserva: ReservaApi): Observable<ReservaApi> {
    return this.http.post<ReservaApi>(this.url + '/reservas', reserva).pipe(
      catchError(this.handleError)
    );
  }

  crearReservaHabitacion(reservaHabitacion: ReservaHabitacionApi): Observable<ReservaHabitacionApi> {
    return this.http.post<ReservaHabitacionApi>(this.url + '/reservas-habitacion', reservaHabitacion).pipe(
      catchError(this.handleError)
    );
  }

  crearReservaServicio(reservaServicio: ReservaServicioApi): Observable<ReservaServicioApi> {
    return this.http.post<ReservaServicioApi>(this.url + '/reservas-servicio', reservaServicio).pipe(
      catchError(this.handleError)
    );
  }

  // ----- GET -----
  obtenerReservas(): Observable<ReservaApi[]> {
    return this.http.get<ReservaApi[]>(this.url + '/reservas').pipe(
      catchError(this.handleError)
    );
  }

  obtenerReservasHabitacion(): Observable<ReservaHabitacionApi[]> {
    return this.http.get<ReservaHabitacionApi[]>(this.url + '/reservas-habitacion').pipe(
      catchError(this.handleError)
    );
  }

  obtenerEstadosReserva(): Observable<EstadoReservaApi[]> {
    return this.http.get<EstadoReservaApi[]>(this.url + '/estados-reserva').pipe(
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