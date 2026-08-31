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

}
