import { Component, inject } from '@angular/core';
import { NavbarAuthComponent } from '../navbar-auth/navbar-auth.component';
import { FormBuilder,Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
@Component({
  selector: 'app-login',
  imports: [NavbarAuthComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder)

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  })

  get Email(){
    return this.loginForm.get("email")
  }

  get password(){
    return this.loginForm.get("password")
  }
  constructor(private authService: AuthService, private router: Router) {}
  enviar() {
    
  }
  iniciarSesionRapido() {
    this.authService.login();
    this.router.navigate(['/panel-usuario']);
  } 
}

