import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarAdminComponent } from '../../components/sidebar-admin/sidebar-admin.component';

@Component({
  selector: 'app-panel-admin',
  imports: [RouterOutlet, SidebarAdminComponent],
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.css'
})
export class PanelAdminComponent {

}