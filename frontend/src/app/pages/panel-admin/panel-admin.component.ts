import { Component } from '@angular/core';
import { SidebarAdminComponent } from '../../components/sidebar-admin/sidebar-admin.component';
import { HabitacionesAdminComponent } from '../../components/habitaciones-admin/habitaciones-admin.component';

@Component({
  selector: 'app-panel-admin',
  imports: [SidebarAdminComponent, HabitacionesAdminComponent],
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.css'
})
export class PanelAdminComponent {

}
