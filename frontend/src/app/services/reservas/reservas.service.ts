import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface ReservaApi {
  id?: number | string;
  id_usuario: number | string;
  id_estado_reserva: number | string;
  numero_reserva: number;
  fecha_hora_reserva: string;
}

export interface ReservaHabitacionApi {
  id?: number | string;
  id_reserva: number | string;
  id_habitacion: number | string;
  pago_acordado: number;
  fecha_hora_checkin: string;
  fecha_hora_checkout: string;
}

export interface PagoApi {
  id?: number | string;
  id_reserva: number | string;
  id_estado_pago: number | string;
  id_metodo_pago: number | string;
  monto_total: number;
  fecha: string;
}

export interface MetodoPagoApi {
  id: number | string;
  nombre: string;
}

// Servicio = Modelo (MVC): concentra las llamadas HTTP a json-server.
@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  url: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // ----- POST -----
  crearReserva(reserva: ReservaApi): Observable<ReservaApi> {
    return this.http.post<ReservaApi>(this.url + '/reservas', reserva).pipe(
      catchError(this.handleError)
    );
  }

  crearReservaHabitacion(reservaHabitacion: ReservaHabitacionApi): Observable<ReservaHabitacionApi> {
    return this.http.post<ReservaHabitacionApi>(this.url + '/reservas_habitacion', reservaHabitacion).pipe(
      catchError(this.handleError)
    );
  }

  crearPago(pago: PagoApi): Observable<PagoApi> {
    return this.http.post<PagoApi>(this.url + '/pagos', pago).pipe(
      catchError(this.handleError)
    );
  }

  obtenerReservas(): Observable<ReservaApi[]> {
    return this.http.get<ReservaApi[]>(this.url + '/reservas').pipe(
      catchError(this.handleError)
    );
  }

  obtenerReservasHabitacion(): Observable<ReservaHabitacionApi[]> {
    return this.http.get<ReservaHabitacionApi[]>(this.url + '/reservas_habitacion').pipe(
      catchError(this.handleError)
    );
  }

  obtenerPagos(): Observable<PagoApi[]> {
    return this.http.get<PagoApi[]>(this.url + '/pagos').pipe(
      catchError(this.handleError)
    );
  }

    obtenerReservaPorId(id: number | string): Observable<ReservaApi> {
    return this.http.get<ReservaApi>(this.url + '/reservas/' + id).pipe(
      catchError(this.handleError)
    );
  }

  // json-server filtra por campo con ?campo=valor y devuelve una lista
  obtenerReservaHabitacionPorReserva(idReserva: number | string): Observable<ReservaHabitacionApi[]> {
    return this.http.get<ReservaHabitacionApi[]>(this.url + '/reservas_habitacion?id_reserva=' + idReserva).pipe(
      catchError(this.handleError)
    );
  }

  obtenerPagoPorReserva(idReserva: number | string): Observable<PagoApi[]> {
    return this.http.get<PagoApi[]>(this.url + '/pagos?id_reserva=' + idReserva).pipe(
      catchError(this.handleError)
    );
  }

  obtenerMetodoPagoPorId(id: number | string): Observable<MetodoPagoApi> {
    return this.http.get<MetodoPagoApi>(this.url + '/metodos_pago/' + id).pipe(
      catchError(this.handleError)
    );
  }

  // ----- Manejo de errores -----
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // Error del lado del cliente, como un error de red, etc.
      console.error('Ocurrió un error:', error.error);
    } else {
      // El backend rechazó la petición y devolvió un código de estado.
      console.error(`El backend devolvió el código ${error.status}, el cuerpo fue: `, error.error);
    }
    // El observable falla y retorna un mensaje genérico para el usuario.
    return throwError(() => new Error('No se pudo completar la operación. Verificá que json-server esté corriendo e intentá de nuevo.'));
  }
}