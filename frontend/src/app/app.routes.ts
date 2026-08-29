import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { QuienesSomosComponent } from './components/quienes-somos/quienes-somos.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'servicios', component: ServiciosComponent },
    { path: 'quienes-somos', component: QuienesSomosComponent},
];
