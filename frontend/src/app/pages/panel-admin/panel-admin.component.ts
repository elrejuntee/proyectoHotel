import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/shared/navbar/navbar.component';
import { SidebarAdminComponent } from '../../components/sidebar-admin/sidebar-admin.component';

@Component({
  selector: 'app-panel-admin',
  imports: [ SidebarAdminComponent ],
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.css'
})
export class PanelAdminComponent {

}
