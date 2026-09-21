import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../auth/servicios/login/login.service';
import { PanelUsuarioService } from '../../services/panel-usuario/panel-usuario.service';

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

  perfilForm = this.formBuilder.group({
    nombre: [''],
    apellido: [''],
    email: ['', [Validators.email]]
  });

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
    if (this.perfilForm.valid) {
      const usuarioActual = this.loginService.usuarioLogueado;
      if (!usuarioActual) return;

      const formValues = this.perfilForm.value;

      const datosAActualizar = {
        nombre: formValues.nombre ? formValues.nombre : usuarioActual.nombre,
        apellido: formValues.apellido ? formValues.apellido : usuarioActual.apellido,
        email: formValues.email ? formValues.email : usuarioActual.email,
      };

      const usuarioActualizado = {
        ...usuarioActual,
        ...datosAActualizar
      };

      this.usuarioservice.actualizarUsuario(usuarioActual.id, usuarioActualizado).subscribe({
        next: (usuarioNuevo) => {
          console.log('Usuario actualizado en BD:', usuarioNuevo);
          this.loginService.setUsuarioLogueado(usuarioActualizado);
          this.perfilForm.patchValue(usuarioActualizado);
        },
        error: (error) => {
          console.error('Error al actualizar el usuario:', error);
        }
      });
    }
  }
}