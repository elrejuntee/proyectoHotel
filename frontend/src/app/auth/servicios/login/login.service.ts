import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface Usuario {
  id: number;
  id_rol: number;
  nombre: string;
  apellido: string;
  email: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:3000/usuarios';
  private httpClient = inject(HttpClient);
  public usuarioLogueado: Usuario | null = null;

  login(email: string, password: string): Observable<Usuario | undefined> {

    return this.httpClient.get<Usuario[]>(this.apiUrl).pipe(
      map((usuarios: Usuario[]) => {
        const usuario = usuarios.find(
          (u: Usuario) =>
            u.email === email &&
            u.password === password
        );

        this.usuarioLogueado = usuario ?? null;
        return usuario;
      })
    );
  }

  logout(): void {
    this.usuarioLogueado = null;
  }
}
