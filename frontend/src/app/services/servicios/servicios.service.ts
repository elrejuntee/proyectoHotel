import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { API_BASE_URL } from '../../api.config';

// Interfaces

/** Colección "servicios". */
export interface ServicioApi {
    id: number;
    id_tipo_servicio: number;
    precio: number;
    capacidad_maxima: number;
    }

/** Tipo de servicio expuesto por la API Django. */
export interface TipoServicioApi {
    id: number;
    nombre_servicio: string;
    }

@Injectable({
    providedIn: 'root'
    })
export class ServiciosService {
    private readonly url = API_BASE_URL;

    constructor(private http: HttpClient) { }

  // ----- GET -----
    obtenerServicios(): Observable<ServicioApi[]> {
        return this.http.get<ServicioApi[]>(`${this.url}/servicios/`).pipe(
            catchError(this.handleError)
        );
    }

    obtenerTiposServicio(): Observable<TipoServicioApi[]> {
        return this.http.get<TipoServicioApi[]>(`${this.url}/tipo-servicios/`).pipe(
            catchError(this.handleError)
        );
    }

    obtenerServicioPorId(id: number | string): Observable<ServicioApi> {
        return this.http.get<ServicioApi>(`${this.url}/servicios/${id}/`).pipe(
            catchError(this.handleError)
        );
    }

    obtenerTipoServicioPorId(id: number | string): Observable<TipoServicioApi> {
        return this.http.get<TipoServicioApi>(`${this.url}/tipo-servicios/${id}/`).pipe(
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
        return throwError(() => new Error('No se pudo completar la operación con el backend. Verificá que Django esté corriendo en http://localhost:8000 e intentá de nuevo.'));
    }
}