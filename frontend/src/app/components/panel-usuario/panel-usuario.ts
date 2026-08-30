import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-panel-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './panel-usuario.html',
  styleUrl: './panel-usuario.css'
})
export class PanelUsuarioComponent implements OnInit {
  perfilForm!: FormGroup;

  // Datos dinámicos del usuario simulando una base de datos
  usuario = {
    nombre: 'Juan Perez',
    email: 'juan@rejunte.com',
    telefono: '+54 3532417835',
    fechaNacimiento: '1964-01-12',
    pais: 'Argentina',
    miembroDesde: 'enero 2026'
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Inicializamos el formulario reactivo con validaciones obligatorias
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, [Validators.required, Validators.minLength(3)]],
      email: [this.usuario.email, [Validators.required, Validators.email]],
      telefono: [this.usuario.telefono, Validators.required],
      fechaNacimiento: [this.usuario.fechaNacimiento, Validators.required],
      pais: [this.usuario.pais, Validators.required]
    });
  }

  guardarCambios(): void {
    if (this.perfilForm.valid) {
      this.usuario = { ...this.usuario, ...this.perfilForm.value };
      alert('¡Perfil actualizado con éxito!');
    } else {
      this.perfilForm.markAllAsTouched();
    }
  }
}
