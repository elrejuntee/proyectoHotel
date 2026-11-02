import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Servicio, TipoServicio } from '../../models';

@Injectable({
    providedIn: 'root'
    })
export class ServiciosService {
    url: string = 'http://localhost:8000/api';

    constructor(private http: HttpClient) { }

  // ----- GET -----
    obtenerServicios(): Observable<Servicio[]> {
        return this.http.get<Servicio[]>(this.url + '/servicios/').pipe(
            catchError(this.handleError)
        );
    }

    obtenerTiposServicio(): Observable<TipoServicio[]> {
        return this.http.get<TipoServicio[]>(this.url + '/tipo-servicios/').pipe(
            catchError(this.handleError)
        );
    }

    obtenerServicioPorId(id: number): Observable<Servicio> {
        return this.http.get<Servicio>(this.url + '/servicios/' + id + '/').pipe(
            catchError(this.handleError)
        );
    }

    obtenerTipoServicioPorId(id: number): Observable<TipoServicio> {
        return this.http.get<TipoServicio>(this.url + '/tipo-servicios/' + id + '/').pipe(
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
        return throwError(() => new Error('Algo salió mal con el servidor. Verificá que el backend esté corriendo e intentá de nuevo.'));
    }
}