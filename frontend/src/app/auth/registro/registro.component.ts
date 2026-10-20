import { Component, inject } from '@angular/core';
import { NavbarAuthComponent } from '../navbar-auth/navbar-auth.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegistroService, UsuarioRegistro } from '../servicios/registro/registro.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';

function passwordsIgualesValidator(form: AbstractControl): ValidationErrors | null {
  const password = form.get('password')?.value;
  const confirmacion = form.get('passwordConfirmacion')?.value;
  return password === confirmacion ? null : { passwordsNoCoinciden: true };
}


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
    passwordConfirmacion: ['', [Validators.required]]
  }, {
    validators: passwordsIgualesValidator
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

  get PasswordConfirmacion() {
    return this.registroForm.get('passwordConfirmacion');
  }

  enviar() {
    this.registroForm.markAllAsTouched();

    if (this.registroForm.valid) {
      const { passwordConfirmacion, ...datosUsuario } = this.registroForm.value;
      const nuevoUsuario: UsuarioRegistro = {
      ...datosUsuario,
      id_rol: "2" 
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
