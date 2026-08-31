import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { ResultadosBusquedaComponent } from './components/resultados-busqueda/resultados-busqueda.component';
import { PanelUsuarioComponent } from './components/panel-usuario/panel-usuario.component';
import { HistorialReservasComponent } from './components/historial-reservas/historial-reservas.component';
import { PanelAdminComponent } from './components/panel-admin/panel-admin.component';
import { QuienesSomosComponent } from './components/quienes-somos/quienes-somos.component';
import { Pagina404Component } from './pages/pagina-404/pagina-404.component';
import { LoginComponent } from './auth/login/login.component';
import { LandingComponent } from './pages/landing/landing.component';


export const routes: Routes = [
    { path: '', component: LandingComponent, children: [
            { path: '', component: HomeComponent },
            { path: 'servicios', component: ServiciosComponent },
            { path: 'reservas', component: ResultadosBusquedaComponent },
            { path: 'panel-usuario', component: PanelUsuarioComponent },
            { path: 'historial-reservas', component: HistorialReservasComponent },
            { path: 'quienes-somos', component: QuienesSomosComponent },
        ]
    },
    { path: "login", component: LoginComponent },
    { path: "panel-admin", component: PanelAdminComponent },
    { path: "**", component: Pagina404Component },
];
