import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { PlanService } from '@services/plan.service';

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

  constructor(private planService: PlanService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.destinationName = params.get('destination') ?? '';
      this.loadPlans();
    });
  }

  async loadPlans(): Promise<void> {
    try {
      this.plans = await this.planService.getPlansByDestination(this.destinationName);
    } catch (error) {
      console.error('Error al cargar los planes:', error);
    }
  }
}
