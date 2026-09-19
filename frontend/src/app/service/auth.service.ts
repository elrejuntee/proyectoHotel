import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private autenticadoSubject = new BehaviorSubject<boolean>(false);
  autenticado$ = this.autenticadoSubject.asObservable();

  login() {
    this.autenticadoSubject.next(true);
  }

  logout() {
    this.autenticadoSubject.next(false);
  }
}