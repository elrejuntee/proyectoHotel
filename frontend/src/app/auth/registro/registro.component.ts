import { Component, inject } from '@angular/core';
import { NavbarAuthComponent } from '../navbar-auth/navbar-auth.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegistroService, UsuarioRegistro } from '../servicios/registro/registro.service';

@Component({
  selector: 'app-registro',
  imports: [NavbarAuthComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  private formBuilder = inject(FormBuilder);
  private registroService = inject(RegistroService);
  private router = inject(Router);

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

    if (this.registroForm.valid) {
      const nuevoUsuario: UsuarioRegistro = {
        ...this.registroForm.value,
        id_rol: 2 
      };

      this.registroService.registrarUsuario(nuevoUsuario).subscribe({
        next: (usuario) => {
          console.log('Usuario registrado con éxito:', usuario);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error al registrar usuario:', error);
        }
      });
    } 
  }
}
