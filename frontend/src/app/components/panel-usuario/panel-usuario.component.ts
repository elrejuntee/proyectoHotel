import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LoginService, Usuario } from '../../auth/servicios/login/login.service';
import { PanelUsuarioService } from '../../services/panel-usuario/panel-usuario.service';

@Component({
  selector: 'app-panel-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './panel-usuario.component.html',
  styleUrl: './panel-usuario.component.css'
})
export class PanelUsuarioComponent {
  public loginService = inject(LoginService);
  private formBuilder = inject(FormBuilder);
  private usuarioservice = inject(PanelUsuarioService);

  perfilForm = this.formBuilder.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
  }
