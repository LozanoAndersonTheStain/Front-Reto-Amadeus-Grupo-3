import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PlanService } from '@services/plan.service';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class PlanesComponent implements OnInit {
  plans: any[] = [];
  destinationName: string = '';
  userEmail: string = '';
  isLoading: boolean = false;
  message: string = '';

  constructor(private planService: PlanService, private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.destinationName = params.get('destination') ?? '';
      this.loadPlans();
    });
    this.authService.getUserEmail().then(email => {
      this.userEmail = email;
    });
  }

  async loadPlans(): Promise<void> {
    try {
      this.plans = await this.planService.getPlansByDestination(this.destinationName);
      console.log('Plans loaded:', this.plans);
    } catch (error) {
      console.error('Error al cargar los planes:', error);
    }
  }

  async sendDestinationInfo(plan: any): Promise<void> {
    this.isLoading = true;
    this.message = '';
    try {
      await this.planService.sendDestinationInfoByEmail(this.destinationName, this.userEmail, plan);
      this.message = 'Información enviada al correo electrónico.';
    } catch (error) {
      console.error('Error al enviar la información:', error);
      this.message = 'Error al enviar la información.';
    } finally {
      this.isLoading = false;
    }
  }
}
