import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Reserva, ReservaHabitacion, ReservaServicio, EstadoReserva, Usuario } from '../../models';

// Nombre del estado de reserva que cuenta como "reserva firme". Tiene que existir en la tabla estado_reserva.
export const ESTADO_RESERVA_CONFIRMADA = 'Confirmada';

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

  // ----- Estados de reserva buscados por nombre (así el front no depende de los ids de la base) -----

  /** Busca en la base el id de un estado de reserva a partir de su nombre. */
  obtenerIdEstadoReserva(nombreEstado: string): Observable<number> {
    return new Observable<number>(observer => {
      this.obtenerEstadosReserva().subscribe({
        next: (estadosReserva) => {
          const estadoEncontrado = estadosReserva.find(estadoReserva => estadoReserva.estado_reserva === nombreEstado);

          if (estadoEncontrado) {
            observer.next(estadoEncontrado.id);
            observer.complete();
          } else {
            observer.error(new Error('No existe el estado de reserva "' + nombreEstado + '" en la base de datos.'));
          }
        },
        error: (error) => observer.error(error)
      });
    });
  }

  /** Solo las reservas que están en estado Confirmada. */
  obtenerReservasConfirmadas(): Observable<Reserva[]> {
    return new Observable<Reserva[]>(observer => {
      this.obtenerIdEstadoReserva(ESTADO_RESERVA_CONFIRMADA).subscribe({
        next: (idEstadoConfirmada) => {
          this.obtenerReservas().subscribe({
            next: (reservas) => {
              observer.next(reservas.filter(reserva => reserva.id_estado_reserva === idEstadoConfirmada));
              observer.complete();
            },
            error: (error) => observer.error(error)
          });
        },
        error: (error) => observer.error(error)
      });
    });
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