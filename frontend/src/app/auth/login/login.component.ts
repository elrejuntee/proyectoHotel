import { Component, inject, OnInit } from '@angular/core';
import { NavbarAuthComponent } from '../navbar-auth/navbar-auth.component';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../servicios/login/login.service';

@Component({
  selector: 'app-login',
  imports: [NavbarAuthComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mensajeError = '';

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  get Email() {
    return this.loginForm.get('email');
  }

  get Password() {
    return this.loginForm.get('password');
  }

  enviar(event: Event) {
    event.preventDefault();
    this.mensajeError = '';

    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';

    this.loginService.login(email, password).subscribe({
      next: (usuario) => {
        this.loginService.setUsuarioLogueado(usuario);

        if (usuario.rol.toLowerCase() === 'admin') {
          this.router.navigate(['/panel-admin']);
        } else if (['usuario', 'huesped'].includes(usuario.rol.toLowerCase())) {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          this.router.navigateByUrl(returnUrl || '/panel-usuario');
        } else {
          this.loginService.logout();
          this.mensajeError = 'La cuenta no tiene un rol habilitado para acceder.';
        }
      },
      error: (err) => {
        this.mensajeError = err.status === 401
          ? 'Correo o contraseña incorrectos.'
          : 'Error al conectar con el servidor.';
        console.error(err);
      }
    });
  }

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe(() => {
      if (this.mensajeError) {
        this.mensajeError = '';
      }
    });
  }
}
