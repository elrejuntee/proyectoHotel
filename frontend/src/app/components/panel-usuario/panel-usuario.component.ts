import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { LoginService } from '../../auth/servicios/login/login.service';
import { PanelUsuarioService } from '../../services/panel-usuario/panel-usuario.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-panel-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './panel-usuario.component.html',
  styleUrl: './panel-usuario.component.css'
})
export class PanelUsuarioComponent implements OnInit {
  public loginService = inject(LoginService);
  private formBuilder = inject(FormBuilder);
  private usuarioservice = inject(PanelUsuarioService);
  private router = inject(Router); 

  mensajeError: string = '';


  // Validador asíncrono: consulta al backend si el email ya lo usa OTRO usuario.
  // Emite null si está libre (o vacío), o { emailEnUso: true } si ya existe.
  emailDisponibleValidator = (control: AbstractControl): Observable<ValidationErrors | null> => {
    const email = control.value;

    return new Observable<ValidationErrors | null>(observer => {
      // Vacío significa "mantener mi email actual": no hay nada que consultar
      if (!email) {
        observer.next(null);
        observer.complete();
        return;
      }

      const consulta = this.usuarioservice.obtenerUsuarios().subscribe({
        next: (usuarios) => {
          // Se ignora al propio usuario para que su email actual no figure como repetido
          const usuarioRepetido = usuarios.find(usuario =>
            usuario.email === email &&
            usuario.id !== this.loginService.usuarioLogueado?.id
          );
          observer.next(usuarioRepetido ? { emailEnUso: true } : null);
          observer.complete();
        },
        error: () => {
          // Si el backend no responde no se bloquea el formulario: el error se verá al guardar
          observer.next(null);
          observer.complete();
        }
      });

      // Si el valor cambia, se cancela la consulta anterior
      return () => consulta.unsubscribe();
    });
  };

  perfilForm = this.formBuilder.group({
    nombre: ['', [Validators.maxLength(50)]],
    apellido: ['', [Validators.maxLength(30)]],
    email: ['', [Validators.email], [this.emailDisponibleValidator]]
  });

  get Nombre() { return this.perfilForm.get('nombre'); }
  get Apellido() { return this.perfilForm.get('apellido'); }
  get Email() { return this.perfilForm.get('email'); }

  ngOnInit() {
    this.cargarDatosFormulario();
  }

  cargarDatosFormulario() {
    const usuario = this.loginService.usuarioLogueado;
    if (usuario) {
      this.perfilForm.patchValue({
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        email: usuario.email || ''
      });
    }
  }

    actualizarPerfil() {
      this.mensajeError = '';

      if (this.perfilForm.valid) {
        const usuarioActual = this.loginService.usuarioLogueado;
        if (!usuarioActual) return;

        const formValues = this.perfilForm.value;

        const datosAActualizar = {
          nombre: formValues.nombre ? formValues.nombre : usuarioActual.nombre,
          apellido: formValues.apellido ? formValues.apellido : usuarioActual.apellido,
          email: formValues.email ? formValues.email : usuarioActual.email,
        };

        this.usuarioservice.actualizarUsuario(usuarioActual.id, datosAActualizar).subscribe({
          next: () => {
            this.loginService.setUsuarioLogueado(null);
            this.router.navigate(['/login']);
          },
          error: (error) => {
            if (error.error?.email) {
              this.mensajeError = 'Ya existe un usuario con ese correo electrónico.';
            } else {
              this.mensajeError = 'No se pudieron guardar los cambios. Intentá de nuevo.';
            }
          }
      });
    }
  }
}
