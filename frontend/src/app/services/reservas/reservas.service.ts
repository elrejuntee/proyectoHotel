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
    return throwError(() => new Error('No se pudo completar la reserva. Verificá que json-server esté corriendo e intentá de nuevo.'));
  }
}