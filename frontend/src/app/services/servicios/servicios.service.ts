import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

// Interfaces

/** Colección "servicios". */
export interface ServicioApi {
    id?: string;
    id_tipo_servicio: string;
    precio: number;
    capacidad_maxima: number;
    }

/** Colección "tipos_servicio". */
export interface TipoServicioApi {
    id: string;
    nombre_servicio: string;
    }

@Injectable({
    providedIn: 'root'
    })
export class ServiciosService {
    url: string = 'http://localhost:3000';

    constructor(private http: HttpClient) { }

  // ----- GET -----
    obtenerServicios(): Observable<ServicioApi[]> {
        return this.http.get<ServicioApi[]>(this.url + '/servicios').pipe(
            catchError(this.handleError)
        );
    }

    obtenerTiposServicio(): Observable<TipoServicioApi[]> {
        return this.http.get<TipoServicioApi[]>(this.url + '/tipos_servicio').pipe(
            catchError(this.handleError)
        );
    }

    obtenerServicioPorId(id: number | string): Observable<ServicioApi> {
        return this.http.get<ServicioApi>(this.url + '/servicios/' + id).pipe(
            catchError(this.handleError)
        );
    }

    obtenerTipoServicioPorId(id: number | string): Observable<TipoServicioApi> {
        return this.http.get<TipoServicioApi>(this.url + '/tipos_servicio/' + id).pipe(
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
        return throwError(() => new Error('Algo salió mal con json-server. Verificá que esté corriendo en http://localhost:3000 e intentá de nuevo.'));
    }
}