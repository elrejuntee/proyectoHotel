import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanelUsuarioService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  actualizarUsuario(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuario/${id}`, datos);
  }
}