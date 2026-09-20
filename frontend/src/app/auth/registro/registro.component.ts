import { Component, inject } from '@angular/core';
import { NavbarAuthComponent } from '../navbar-auth/navbar-auth.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  imports: [NavbarAuthComponent, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  private formBuilder = inject(FormBuilder);

  registroForm: FormGroup = this.formBuilder.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  })

  get Nombre() {
    return this.registroForm.get('nombre');
  }

  get Apellido() {
    return this.registroForm.get('apellido');
  }       

  get Email() { 
    return this.registroForm.get('email');
  }

  get Password() {
    return this.registroForm.get('password');
  }

  enviar() {
    this.registroForm.markAllAsTouched();


  }
}
