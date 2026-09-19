import { Component, inject } from '@angular/core';
import { NavbarAuthComponent } from '../navbar-auth/navbar-auth.component';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  get Password(){
    return this.loginForm.get("password")
  }

  enviar(event: Event){
    event.preventDefault()

    this.loginForm.markAllAsTouched()
  }
}