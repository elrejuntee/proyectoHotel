import { Component, inject } from '@angular/core';
import { NavbarAuthComponent } from '../navbar-auth/navbar-auth.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegistroService } from '../servicios/registro/registro.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';

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

  // Validador asíncrono: consulta al backend si el email ya está registrado.
  // Emite null si está libre, o { emailEnUso: true } si ya existe.
  emailDisponibleValidator = (control: AbstractControl): Observable<ValidationErrors | null> => {
    const email = control.value;

    return new Observable<ValidationErrors | null>(observer => {
      const consulta = this.registroService.obtenerUsuarios().subscribe({
        next: (usuarios) => {
          const usuarioRepetido = usuarios.find(usuario => usuario.email === email);
          observer.next(usuarioRepetido ? { emailEnUso: true } : null);
          observer.complete();
        },
        error: () => {
          // Si el backend no responde no se bloquea el formulario: el error se verá al enviar
          observer.next(null);
          observer.complete();
        }
      });

      // Si el valor cambia, se cancela la consulta anterior
      return () => consulta.unsubscribe();
    });
  };

  registroForm: FormGroup = this.formBuilder.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email], [this.emailDisponibleValidator]],
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
      const formulario = this.registroForm.value;

      const nuevoUsuario = {
        nombre: formulario.nombre!,
        apellido: formulario.apellido!,
        email: formulario.email!,
        password: formulario.password!
      };

      this.registroService.registrarUsuario(nuevoUsuario).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error al registrar usuario:', error);
        }
      });
    }
  }
}