import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsService } from '@services/reports.service';
import { Chart, ChartModule } from 'angular-highcharts';
import { Location } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
  providers: [ReportsService],
})
export class ReportsComponent implements OnInit {
  reportData: any;
  environmentChart?: Chart;
  climateChart?: Chart;
  accommodationChart?: Chart;
  activityChart?: Chart;
  stayDurationChart?: Chart;
  ageRangeChart?: Chart;

  constructor(private reportsService: ReportsService, private location: Location) {}

  ngOnInit(): void {
    this.loadReportData();
  }

  async loadReportData(): Promise<void> {
    try {
      const params = {};
      this.reportData = await this.reportsService.getReportData(params);
      this.createChart();
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        console.warn('No se encontraron datos del reporte, cargando gráficos vacíos.');
        this.reportData = [];
        this.createChart();
      } else {
        console.error('Error al cargar los datos del reporte:', error);
      }
    }
  }

  processReportData(reportData: any[]): any {
    const totalReports = reportData.length;
    const environmentTypes: { [key: string]: number } = {};
    const climateTypes: { [key: string]: number } = {};
    const accommodationTypes: { [key: string]: number } = {};
    const activityTypes: { [key: string]: number } = {};
    const stayDurations: { [key: string]: number } = {};
    const ageRanges: { [key: string]: number } = {};

    reportData.forEach((report: any) => {
      report.userQueries.forEach((query: any) => {
        environmentTypes[query.environmentType] = (environmentTypes[query.environmentType] || 0) + 1;
        climateTypes[query.climateType] = (climateTypes[query.climateType] || 0) + 1;
        accommodationTypes[query.accommodationType] = (accommodationTypes[query.accommodationType] || 0) + 1;
        activityTypes[query.activityType] = (activityTypes[query.activityType] || 0) + 1;
        stayDurations[query.stayDuration] = (stayDurations[query.stayDuration] || 0) + 1;
        ageRanges[query.ageRange] = (ageRanges[query.ageRange] || 0) + 1;
      });
    });

    const calculatePercentages = (data: { [key: string]: number }) => {
      return Object.keys(data).map(key => ({
        name: key,
        y: (data[key] / totalReports) * 100
      }));
    };

    return {
      environmentTypes: calculatePercentages(environmentTypes),
      climateTypes: calculatePercentages(climateTypes),
      accommodationTypes: calculatePercentages(accommodationTypes),
      activityTypes: calculatePercentages(activityTypes),
      stayDurations: calculatePercentages(stayDurations),
      ageRanges: calculatePercentages(ageRanges)
    };
  }

  createChart(): void {
    if (!this.reportData || this.reportData.length === 0) {
      this.environmentChart = this.createEmptyChart('Distribución de Tipos de Entorno');
      this.climateChart = this.createEmptyChart('Distribución de Tipos de Clima');
      this.accommodationChart = this.createEmptyChart('Distribución de Tipos de Alojamiento');
      this.activityChart = this.createEmptyChart('Distribución de Tipos de Actividad');
      this.stayDurationChart = this.createEmptyChart('Distribución de Duraciones de Estancia');
      this.ageRangeChart = this.createEmptyChart('Distribución de Rangos de Edad');
      return;
    }

    const processedData = this.processReportData(this.reportData);

    this.environmentChart = new Chart({
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Distribución de Tipos de Entorno'
      },
      series: [{
        type: 'pie',
        name: 'Porcentaje',
        data: processedData.environmentTypes
      }]
    });

    this.climateChart = new Chart({
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Distribución de Tipos de Clima'
      },
      series: [{
        type: 'pie',
        name: 'Porcentaje',
        data: processedData.climateTypes
      }]
    });

    this.accommodationChart = new Chart({
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Distribución de Tipos de Alojamiento'
      },
      series: [{
        type: 'pie',
        name: 'Porcentaje',
        data: processedData.accommodationTypes
      }]
    });

    this.activityChart = new Chart({
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Distribución de Tipos de Actividad'
      },
      series: [{
        type: 'pie',
        name: 'Porcentaje',
        data: processedData.activityTypes
      }]
    });

    this.stayDurationChart = new Chart({
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Distribución de Duraciones de Estancia'
      },
      series: [{
        type: 'pie',
        name: 'Porcentaje',
        data: processedData.stayDurations
      }]
    });

    this.ageRangeChart = new Chart({
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Distribución de Rangos de Edad'
      },
      series: [{
        type: 'pie',
        name: 'Porcentaje',
        data: processedData.ageRanges
      }]
    });
  }

  createEmptyChart(title: string): Chart {
    return new Chart({
      chart: {
        type: 'pie'
      },
      title: {
        text: title
      },
      series: [{
        type: 'pie',
        name: 'Porcentaje',
        data: []
      }]
    });
  }

  goBack(): void {
    this.location.back();
  }
}
