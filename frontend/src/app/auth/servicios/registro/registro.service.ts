import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../../../api.config';

export interface UsuarioRegistro {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private readonly url = `${API_BASE_URL}/usuario/`;
  private httpClient = inject(HttpClient);

  registrarUsuario(usuario: UsuarioRegistro) {
    return this.httpClient.post<UsuarioRegistro>(this.url, usuario);
  }
}
