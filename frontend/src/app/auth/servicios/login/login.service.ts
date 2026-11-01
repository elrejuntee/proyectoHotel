import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { RolUsuario, Usuario } from '../../../models';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8000/api/usuarios/';
  private rolesUrl = 'http://localhost:8000/api/roles/';
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

  obtenerIdRolPorNombre(nombreRol: string): Observable<number | undefined> {
    return this.httpClient.get<RolUsuario[]>(this.rolesUrl).pipe(
      map((roles: RolUsuario[]) => {
        const rolEncontrado = roles.find(
          (rol: RolUsuario) => rol.rol.toLowerCase() === nombreRol.toLowerCase()
        );
        return rolEncontrado?.id;
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
