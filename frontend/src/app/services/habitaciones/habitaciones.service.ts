import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

// Interfaces 

/** Colección "habitaciones". */
export interface HabitacionApi {
  id?: string; 
  id_tipo_habitacion: string;
  id_estado_habitacion: string;
  numero: number;
  piso: number;
  precio: number;
  capacidad: number;
  imagen_principal?: string;
  imagenes_complementarias?: string[];
}

/** Colección "tipos_habitacion". */
export interface TipoHabitacionApi {
  id: string;
  nombre: string;
  cant_cama: number;
}

/** Colección "estados_habitacion". */
export interface EstadoHabitacionApi {
  id: string;
  nombre: string;
}

// Servicio = Modelo (MVC): concentra las llamadas HTTP a json-server.
@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {
  url: string = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // ----- GET -----
  obtenerHabitaciones(): Observable<HabitacionApi[]> {
    return this.http.get<HabitacionApi[]>(this.url + '/habitaciones').pipe(
      catchError(this.handleError)
    );
  }

  obtenerTiposHabitacion(): Observable<TipoHabitacionApi[]> {
    return this.http.get<TipoHabitacionApi[]>(this.url + '/tipos_habitacion').pipe(
      catchError(this.handleError)
    );
  }

  obtenerEstadosHabitacion(): Observable<EstadoHabitacionApi[]> {
    return this.http.get<EstadoHabitacionApi[]>(this.url + '/estados_habitacion').pipe(
      catchError(this.handleError)
    );
  }

    obtenerHabitacionPorId(id: number | string): Observable<HabitacionApi> {
    return this.http.get<HabitacionApi>(this.url + '/habitaciones/' + id).pipe(
      catchError(this.handleError)
    );
  }

  obtenerTipoHabitacionPorId(id: number | string): Observable<TipoHabitacionApi> {
    return this.http.get<TipoHabitacionApi>(this.url + '/tipos_habitacion/' + id).pipe(
      catchError(this.handleError)
    );
  }

  // ----- POST -----
  crearHabitacion(habitacion: HabitacionApi): Observable<HabitacionApi> {
    return this.http.post<HabitacionApi>(this.url + '/habitaciones', habitacion).pipe(
      catchError(this.handleError)
    );
  }

  // ----- PUT -----
  actualizarHabitacion(id: number | string, habitacion: HabitacionApi): Observable<HabitacionApi> {
    return this.http.put<HabitacionApi>(this.url + '/habitaciones/' + id, habitacion).pipe(
      catchError(this.handleError)
    );
  }

  // ----- Manejo de errores  -----
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // Error del lado del cliente, como un error de red, etc.
      console.error('Ocurrió un error:', error.error);
    } else {
      // El backend rechazó la petición y devolvió un código de estado.
      console.error(`El backend devolvió el código ${error.status}, el cuerpo fue: `, error.error);
    }
    // El observable falla y retorna un mensaje genérico para el usuario.
    return throwError(() => new Error('Algo salió mal con json-server. Verificá que esté corriendo en http://localhost:3000 e intentá de nuevo.'));
  }
}