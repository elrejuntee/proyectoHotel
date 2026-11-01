import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../api.config';

export interface Usuario {
  id: number;
  id_rol: number;
  rol: string;
  nombre: string;
  apellido: string;
  email: string;
  fecha_registro: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly apiUrl = `${API_BASE_URL}/login/`;
  private httpClient = inject(HttpClient);
  public usuarioLogueado: Usuario | null = null;

  login(email: string, password: string): Observable<Usuario> {
    return this.httpClient.post<Usuario>(this.apiUrl, { email, password });
  }

  setUsuarioLogueado(usuario: Usuario) {
    this.usuarioLogueado = usuario;
  }

  logout(): void {
    this.usuarioLogueado = null;
  }
}
