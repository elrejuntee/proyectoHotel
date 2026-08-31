import { Component } from '@angular/core';
import { FooterComponent } from '../../components/shared/footer/footer.component';
import { NavbarComponent } from '../../components/shared/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [FooterComponent, NavbarComponent, RouterOutlet],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
