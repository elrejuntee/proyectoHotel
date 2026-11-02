import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Usuario } from '../../../models';
import { Observable } from 'rxjs';

// Usuario nuevo: todavía no tiene id, y el backend completa id_rol y fecha_registro
interface NuevoUsuario {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private url = 'http://localhost:8000/api/usuarios/';
  private httpClient = inject(HttpClient);

  registrarUsuario(usuario: NuevoUsuario): Observable<Usuario> {
    return this.httpClient.post<Usuario>(this.url, usuario);
  }

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(this.url);
  }
}