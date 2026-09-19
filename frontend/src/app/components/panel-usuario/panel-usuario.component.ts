import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PanelUsuarioService } from '../../service/panel-usuario.service';

@Component({
  selector: 'app-panel-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './panel-usuario.component.html',
  styleUrl: './panel-usuario.component.css'
})
export class PanelUsuarioComponent implements OnInit {
  
  usuario: any = { nombre: '', apellido: '', email: '', rol: '' };
  reservas: any[] = [];
  perfilForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private panelService: PanelUsuarioService
  ) {}

  ngOnInit(): void {
    // Inicializamos el formulario con las validaciones
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    // Petición para traer a Juan Pérez (ID 1)
    this.panelService.getUsuario(1).subscribe({
      next: (data: any) => {
        this.usuario = data;
        if (this.perfilForm) {
          // Llenamos el formulario con los datos que llegaron del json-server
          this.perfilForm.patchValue({
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email
          });
        }
      },
      error: (err: any) => console.error('Error al cargar perfil:', err)
    });

    // Petición para traer las reservas de Juan Pérez
    this.panelService.getReservasUsuario(1).subscribe({
      next: (data: any[]) => {
        this.reservas = data;
      },
      error: (err: any) => console.error('Error al cargar reservas:', err)
    });
  }

  guardarCambios(): void {
    if (this.perfilForm && this.perfilForm.valid) {
      const datosActualizados = { ...this.usuario, ...this.perfilForm.value };

      if (this.usuario && this.usuario.id) {
        this.panelService.actualizarUsuario(this.usuario.id, datosActualizados).subscribe({
          next: (response: any) => {
            this.usuario = response;
            alert('¡Perfil actualizado con éxito!');
          },
          error: (err: any) => {
            console.error('Error al actualizar:', err);
            alert('Hubo un error al guardar los cambios.');
          }
        });
      }
    }
  }
}