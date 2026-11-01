import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from '../../api.config';
import { Usuario } from '../../auth/servicios/login/login.service';
import { Reserva } from '../historial-reservas/historial-reservas.service';

type DatosPerfil = Pick<Usuario, 'nombre' | 'apellido' | 'email'>;

@Injectable({
  providedIn: 'root'
})
export class PanelUsuarioService {
  private readonly apiUrl = API_BASE_URL;

  constructor(private http: HttpClient) { }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/usuario/${id}/`);
  }

  getReservasUsuario(idUsuario: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/reservas`).pipe(
      map(reservas => reservas.filter(reserva => reserva.id_usuario === idUsuario))
    );
  }

  actualizarUsuario(id: number, datos: Partial<DatosPerfil>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuario/${id}/`, datos);
  }
}