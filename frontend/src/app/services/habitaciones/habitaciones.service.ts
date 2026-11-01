import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { EstadoHabitacion, Habitacion, TipoHabitacion } from '../../models';

// Imágenes de las habitaciones: no vienen de la base de datos (el diagrama no las modela),
// así que quedan fijas en el código, indexadas por tipo de habitación.
const IMAGENES_POR_TIPO: Record<string, { principal: string; complementarias: string[] }> = {
  '1': { principal: 'imagenes/premium.webp', complementarias: ['imagenes/ejecutiva.webp', 'imagenes/baño.webp'] },
  '2': { principal: 'imagenes/familiar.webp', complementarias: ['imagenes/familiar-2.webp', 'imagenes/comedor-hab.webp'] },
  '3': { principal: 'imagenes/deluxe.webp', complementarias: ['imagenes/tv.webp', 'imagenes/baño-2.webp'] },
  '4': { principal: 'imagenes/estandar.webp', complementarias: ['imagenes/tv.webp', 'imagenes/baño.webp'] },
};
const IMAGEN_POR_DEFECTO = 'imagenes/premium.webp';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {
  private readonly url: string = 'http://localhost:8000';
  private http = inject(HttpClient)


  // ----- GET -----
  obtenerHabitaciones(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(this.url + '/habitaciones').pipe(
      catchError(this.handleError)
    );
  }

  obtenerTiposHabitacion(): Observable<TipoHabitacion[]> {
    return this.http.get<TipoHabitacion[]>(this.url + '/tipos_habitacion').pipe(
      catchError(this.handleError)
    );
  }

  obtenerEstadosHabitacion(): Observable<EstadoHabitacion[]> {
    return this.http.get<EstadoHabitacion[]>(this.url + '/estados_habitacion').pipe(
      catchError(this.handleError)
    );
  }

  obtenerHabitacionPorId(id: number): Observable<Habitacion> {
    return this.http.get<Habitacion>(this.url + '/habitaciones/' + id).pipe(
      catchError(this.handleError)
    );
  }

  obtenerTipoHabitacionPorId(id: number): Observable<TipoHabitacion> {
    return this.http.get<TipoHabitacion>(this.url + '/tipos_habitacion/' + id).pipe(
      catchError(this.handleError)
    );
  }

  // ----- POST -----
  // Al crear, la habitación todavía no tiene id: lo asigna el backend
  crearHabitacion(habitacion: Omit<Habitacion, 'id_habitacion'>): Observable<Habitacion> {
    return this.http.post<Habitacion>(this.url + '/habitaciones', habitacion).pipe(
      catchError(this.handleError)
    );
  }

  // ----- PUT -----
  actualizarHabitacion(id: number, habitacion: Habitacion): Observable<Habitacion> {
    return this.http.put<Habitacion>(this.url + '/habitaciones/' + id, habitacion).pipe(
      catchError(this.handleError)
    );
  }

  // ----- Imágenes (fijas en el código, no en la API) -----
  obtenerImagenPrincipal(idTipoHabitacion: number): string {
    return IMAGENES_POR_TIPO[String(idTipoHabitacion)]?.principal ?? IMAGEN_POR_DEFECTO;
  }

  obtenerImagenesComplementarias(idTipoHabitacion: number): string[] {
    return IMAGENES_POR_TIPO[String(idTipoHabitacion)]?.complementarias ?? [];
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
    return throwError(() => new Error('Algo salió mal con el servidor. Verificá que el backend esté corriendo e intentá de nuevo.'));
  }
}