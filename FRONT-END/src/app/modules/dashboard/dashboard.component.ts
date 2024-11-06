import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DashboardService } from './dashboard.service';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-informe-diario',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  informeUrl: SafeUrl | undefined;

  constructor(private dashboardService: DashboardService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Consumir el servicio y obtener el gráfico como Blob
    this.dashboardService.getDailyReport().subscribe((blob) => {
      // Convertir el Blob a una URL segura que pueda ser usada en el <img>
      const url = URL.createObjectURL(blob);
      this.informeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
    });
  }
}
