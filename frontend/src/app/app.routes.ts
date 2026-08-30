import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { ReservasComponent } from './components/reservas/reservas.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'servicios', component: ServiciosComponent},
    { path: 'reservas', component: ReservasComponent}
];
