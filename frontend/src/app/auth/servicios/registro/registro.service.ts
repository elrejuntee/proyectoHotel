import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Usuario } from '../../../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private url = 'http://localhost:8000/api/usuarios/';
  private httpClient = inject(HttpClient);

  registrarUsuario(usuario: Partial<Usuario>): Observable<Usuario> {
    return this.httpClient.post<Usuario>(this.url, usuario);
  }
}
