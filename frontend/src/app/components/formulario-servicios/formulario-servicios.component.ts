import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../auth/servicios/login/login.service';

@Component({
  selector: 'app-formulario-servicios',
  imports: [ReactiveFormsModule],
  templateUrl: './formulario-servicios.component.html',
  styleUrl: './formulario-servicios.component.css'
})
export class FormularioServiciosComponent {
  public userLogged = inject(LoginService)
  public formBuilder = inject(FormBuilder)

  public formulario = this.formBuilder.group({
    fechaInicio: ['',[Validators.required]],
    fechaFin: ['',[Validators.required]],
    cantidadPersonas: ['',[Validators.required]],
  })
}
