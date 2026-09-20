import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanelUsuarioService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${id}`);
  }

  getReservasUsuario(idUsuario: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservas?id_usuario=${idUsuario}`);
  }

  actualizarUsuario(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/${id}`, datos);
  }
}