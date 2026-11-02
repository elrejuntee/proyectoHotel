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

// Habitación nueva: todavía no tiene id, lo asigna el backend
interface NuevaHabitacion {
  id_tipo_habitacion: number;
  id_estado_habitacion: number;
  numero: number;
  piso: number;
  precio: number;
  capacidad: number;
}

// Error que devuelve este servicio: un mensaje claro para el usuario y,
// cuando el backend rechaza los datos (400), los errores de cada campo.
// Ejemplo: { message: 'Revisá los datos ingresados.', errores: { capacidad: ['...'] } }
export interface ErrorApi {
  message: string;
  errores: { [campo: string]: string[] };
}

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {
  private readonly url: string = 'http://localhost:8000/api';
  private http = inject(HttpClient);

  // ----- GET -----
  obtenerHabitaciones(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(this.url + '/habitaciones/').pipe(
      catchError(this.handleError)
    );
  }

  obtenerTiposHabitacion(): Observable<TipoHabitacion[]> {
    return this.http.get<TipoHabitacion[]>(this.url + '/tipos-habitaciones/').pipe(
      catchError(this.handleError)
    );
  }

  obtenerEstadosHabitacion(): Observable<EstadoHabitacion[]> {
    return this.http.get<EstadoHabitacion[]>(this.url + '/estados-habitaciones/').pipe(
      catchError(this.handleError)
    );
  }

  obtenerHabitacionPorId(id: number): Observable<Habitacion> {
    return this.http.get<Habitacion>(this.url + '/habitaciones/' + id + '/').pipe(
      catchError(this.handleError)
    );
  }

  obtenerTipoHabitacionPorId(id: number): Observable<TipoHabitacion> {
    return this.http.get<TipoHabitacion>(this.url + '/tipos-habitaciones/' + id + '/').pipe(
      catchError(this.handleError)
    );
  }

  // ----- POST -----
  crearHabitacion(habitacion: NuevaHabitacion): Observable<Habitacion> {
    return this.http.post<Habitacion>(this.url + '/habitaciones/', habitacion).pipe(
      catchError(this.handleError)
    );
  }

  // ----- PUT -----
  actualizarHabitacion(id: number, habitacion: Habitacion): Observable<Habitacion> {
    return this.http.put<Habitacion>(this.url + '/habitaciones/' + id + '/', habitacion).pipe(
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
    let mensaje = 'Algo salió mal; por favor, inténtalo de nuevo más tarde.';
    let errores: { [campo: string]: string[] } = {};

    if (error.status === 0) {
      // Error del lado del cliente, como un error de red, etc.
      console.error('Ocurrió un error:', error.error);
      mensaje = 'No se pudo conectar con el servidor. Verificá que el backend esté corriendo.';
    } else {
      // El backend rechazó la petición y devolvió un código de estado.
      console.error(`El backend devolvió el código ${error.status}, el cuerpo fue: `, error.error);

      if (error.status === 400) {
        mensaje = 'Revisá los datos ingresados.';
        // Django devuelve un objeto con una lista de errores por cada campo: { capacidad: ['...'] }
        if (error.error && typeof error.error === 'object') {
          errores = error.error;
        }
      }
    }

    // El observable falla con un mensaje claro y, si los hay, los errores por campo.
    const errorApi: ErrorApi = { message: mensaje, errores: errores };
    return throwError(() => errorApi);
  }
}