import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Reserva, ReservaHabitacion, ReservaServicio, EstadoReserva, Usuario } from '../../models';


// Servicio = Modelo (MVC): concentra las llamadas HTTP al backend Django.
@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  url: string = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // ----- POST -----
  crearReserva(reserva: Reserva): Observable<Reserva> {
    return this.http.post<Reserva>(this.url + '/reservas/', reserva).pipe(
      catchError(this.handleError)
    );
  }

  crearReservaHabitacion(reservaHabitacion: ReservaHabitacion): Observable<ReservaHabitacion> {
    return this.http.post<ReservaHabitacion>(this.url + '/reservas-habitacion/', reservaHabitacion).pipe(
      catchError(this.handleError)
    );
  }

  crearReservaServicio(reservaServicio: ReservaServicio): Observable<ReservaServicio> {
    return this.http.post<ReservaServicio>(this.url + '/reservas-servicio/', reservaServicio).pipe(
      catchError(this.handleError)
    );
  }

  // ----- GET -----
  obtenerReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.url + '/reservas/').pipe(
      catchError(this.handleError)
    );
  }

  obtenerReservasServicio(): Observable<ReservaServicio[]> {
    return this.http.get<ReservaServicio[]>(this.url + '/reservas-servicio/').pipe(
      catchError(this.handleError)
    );
  }

  obtenerReservasHabitacion(): Observable<ReservaHabitacion[]> {
    return this.http.get<ReservaHabitacion[]>(this.url + '/reservas-habitacion/').pipe(
      catchError(this.handleError)
    );
  }

  obtenerEstadosReserva(): Observable<EstadoReserva[]> {
    return this.http.get<EstadoReserva[]>(this.url + '/estados-reserva/').pipe(
      catchError(this.handleError)
    );
  }

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url + '/usuarios/').pipe(
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