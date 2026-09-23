import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface UsuarioRegistro {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  id_rol: string;
  fecha_registro: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private url = 'http://localhost:3000/usuarios';
  private httpClient = inject(HttpClient);

  registrarUsuario(usuario: UsuarioRegistro) {
    return this.httpClient.post<UsuarioRegistro>(this.url, usuario);
  }
}
