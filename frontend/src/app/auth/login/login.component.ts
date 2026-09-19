// import { Component, inject, OnInit } from '@angular/core';
// import { NavbarAuthComponent } from '../navbar-auth/navbar-auth.component';
// import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
// import { RouterLink, Router } from '@angular/router';
// import { LoginService } from '../servicios/login/login.service';

// @Component({
//   selector: 'app-login',
//   imports: [NavbarAuthComponent, ReactiveFormsModule, RouterLink],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css'
// })
// export class LoginComponent implements OnInit {
//   private formBuilder = inject(FormBuilder)
//   private loginService = inject(LoginService)
//   private router = inject(Router)

//   loginForm = this.formBuilder.group({
//     email: ['', [Validators.required, Validators.email]],
//     password: ['', Validators.required]
//   })

//   get Email(){
//     return this.loginForm.get("email")
//   }

//   get Password(){
//     return this.loginForm.get("password")
//   }

//   login() {

//   }

//   enviar(event: Event){
//     event.preventDefault()

//     this.loginService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
//       next: (usuario) => {
//         if(usuario && usuario.id_rol === 2) {
//           console.log('Login exitoso:', usuario);
//           this.router.navigate(['/reservas']);
//         } else {
//           this.router.navigate(['/panel-admin']);
//         }
//       },
//       error: (err) => {
//       }
//     });

//     this.loginForm.markAllAsTouched()
//   }

//   ngOnInit(): void {}
// }

import { Component, inject, OnInit } from '@angular/core';
import { NavbarAuthComponent } from '../navbar-auth/navbar-auth.component';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
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
        if (!usuario) {
          this.mensajeError = 'Correo o contraseña incorrectos.';
          return;
        }

        if (usuario.id_rol === 2) {
          console.log('Login exitoso (Cliente):', usuario);
          this.router.navigate(['/reservas']);
        } else {
          console.log('Login exitoso (Admin):', usuario);
          this.router.navigate(['/panel-admin']);
        }
      },
      error: (err) => {
        this.mensajeError = 'Error al conectar con el servidor.';
        console.error(err);
      }
    });
  }

  ngOnInit(): void {}
}