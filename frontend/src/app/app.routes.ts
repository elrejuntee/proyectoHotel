import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { ResultadosBusquedaComponent } from './components/resultados-busqueda/resultados-busqueda.component';
import { PanelUsuarioComponent } from './components/panel-usuario/panel-usuario.component';
import { HistorialReservasComponent } from './components/historial-reservas/historial-reservas.component';
import { PanelAdminComponent } from './components/panel-admin/panel-admin.component';
import { QuienesSomosComponent } from './components/quienes-somos/quienes-somos.component';
import { Pagina404Component } from './pages/pagina-404/pagina-404.component';
import { ListasVaciasComponent } from './components/listas-vacias/listas-vacias.component';
import { LoginComponent } from './auth/login/login.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'servicios', component: ServiciosComponent},
    { path: 'reservas', component: ResultadosBusquedaComponent },
    { path: 'panel-usuario', component: PanelUsuarioComponent },
    { path: 'historial-reservas', component: HistorialReservasComponent },
    { path: 'panel-admin', component: PanelAdminComponent },
    { path: 'quienes-somos', component: QuienesSomosComponent },
    { path: 'prueba-vacia', component: ListasVaciasComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', component: Pagina404Component}
];
