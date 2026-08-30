import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { ResultadosBusquedaComponent } from './components/resultados-busqueda/resultados-busqueda';
import { PanelUsuarioComponent } from './components/panel-usuario/panel-usuario';
import { HistorialReservasComponent } from './components/historial-reservas/historial-reservas';
import { PanelAdminComponent } from './components/panel-admin/panel-admin.component';



export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'servicios', component: ServiciosComponent},
    { path: 'reservas', component: ResultadosBusquedaComponent },
    { path: 'panel-usuario', component: PanelUsuarioComponent },
    { path: 'historial-reservas', component: HistorialReservasComponent },
    { path: 'panel-admin', component: PanelAdminComponent },
];
