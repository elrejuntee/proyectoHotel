import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Usuario } from '../../../models';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8000/api/usuarios/';
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

  setUsuarioLogueado(usuario: Usuario | null): void {
    this.usuarioLogueado = usuario;
  }

  logout(): void {
    this.usuarioLogueado = null;
  }
}
