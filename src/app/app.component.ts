import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuNavegacionComponent } from './pages/menu-navegacion/menu-navegacion.component';
import { ReportsService } from '@services/reports.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuNavegacionComponent],
  providers: [ReportsService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'AmadeusAngular';
}
