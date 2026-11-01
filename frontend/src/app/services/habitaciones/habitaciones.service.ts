import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { API_BASE_URL } from '../../api.config';

// Interfaces 

/** Colección "habitaciones". */
export interface HabitacionApi {
  id?: number;
  id_tipo_habitacion: number;
  id_estado_habitacion: number;
  numero: number;
  piso: number;
  precio: number;
  capacidad: number;
}

/** Tipo de habitación expuesto por la API Django. */
export interface TipoHabitacionApi {
  id: number;
  nombre: string;
  cant_cama: number;
}

/** Estado de habitación expuesto por la API Django. */
export interface EstadoHabitacionApi {
  id: number;
  nombre: string;
}

// Imágenes de las habitaciones: no vienen de la base de datos (el diagrama no las modela),
// así que quedan fijas en el código, indexadas por tipo de habitación.
const IMAGENES_POR_TIPO: Record<string, { principal: string; complementarias: string[] }> = {
  '1': { principal: 'imagenes/premium.webp', complementarias: ['imagenes/ejecutiva.webp', 'imagenes/baño.webp'] },
  '2': { principal: 'imagenes/familiar.webp', complementarias: ['imagenes/familiar-2.webp', 'imagenes/comedor-hab.webp'] },
  '3': { principal: 'imagenes/deluxe.webp', complementarias: ['imagenes/tv.webp', 'imagenes/baño-2.webp'] },
  '4': { principal: 'imagenes/estandar.webp', complementarias: ['imagenes/tv.webp', 'imagenes/baño.webp'] },
};
const IMAGEN_POR_DEFECTO = 'imagenes/premium.webp';

// Centraliza las llamadas HTTP al backend Django.
@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {
  private readonly url = API_BASE_URL;

  constructor(private http: HttpClient) { }

  // ----- GET -----
  obtenerHabitaciones(): Observable<HabitacionApi[]> {
    return this.http.get<HabitacionApi[]>(`${this.url}/habitaciones/`).pipe(
      catchError(this.handleError)
    );
  }

  obtenerTiposHabitacion(): Observable<TipoHabitacionApi[]> {
    return this.http.get<TipoHabitacionApi[]>(`${this.url}/tipos-habitaciones/`).pipe(
      catchError(this.handleError)
    );
  }

  obtenerEstadosHabitacion(): Observable<EstadoHabitacionApi[]> {
    return this.http.get<EstadoHabitacionApi[]>(`${this.url}/Estados-Habitaciones/`).pipe(
      catchError(this.handleError)
    );
  }

    obtenerHabitacionPorId(id: number | string): Observable<HabitacionApi> {
    return this.http.get<HabitacionApi>(`${this.url}/habitaciones/${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  obtenerTipoHabitacionPorId(id: number | string): Observable<TipoHabitacionApi> {
    return this.http.get<TipoHabitacionApi>(`${this.url}/tipos-habitaciones/${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  // ----- POST -----
  crearHabitacion(habitacion: HabitacionApi): Observable<HabitacionApi> {
    return this.http.post<HabitacionApi>(`${this.url}/habitaciones/`, habitacion).pipe(
      catchError(this.handleError)
    );
  }

  // ----- PUT -----
  actualizarHabitacion(id: number | string, habitacion: HabitacionApi): Observable<HabitacionApi> {
    return this.http.put<HabitacionApi>(`${this.url}/habitaciones/${id}/`, habitacion).pipe(
      catchError(this.handleError)
    );
  }

    // ----- Imágenes (fijas en el código, no en la API) -----
  obtenerImagenPrincipal(idTipoHabitacion: number | string): string {
    return IMAGENES_POR_TIPO[String(idTipoHabitacion)]?.principal ?? IMAGEN_POR_DEFECTO;
  }

  obtenerImagenesComplementarias(idTipoHabitacion: number | string): string[] {
    return IMAGENES_POR_TIPO[String(idTipoHabitacion)]?.complementarias ?? [];
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
    return throwError(() => new Error('No se pudo completar la operación con el backend. Verificá que Django esté corriendo en http://localhost:8000 e intentá de nuevo.'));
  }
}