
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ScannerSocketService } from './scanner.service';

@Component({
  selector: 'app-barcode',
  standalone: true,
  template: `
    <div class="container">
      <h2>Código escaneado en tiempo real</h2>
      @if (latestBarcode) {
        <div class="barcode-info">
          <p>Código: {{latestBarcode.barcode}}</p>
          <p>Escaneado: {{latestBarcode.timestamp}}</p>
        </div>
      }
    </div>
  `
})

export class ScannerComponent implements OnInit, OnDestroy {
  latestBarcode: any;
  

  private subscription!: Subscription;
  constructor(private scannerSocketService: ScannerSocketService) { } ngOnInit() {
    this.subscription = this.scannerSocketService.getLatestBarcode().subscribe(barcode => {
      if (barcode) { 
  console.log(this.latestBarcode);
        
        this.latestBarcode = barcode; }
    });
  } ngOnDestroy() { if (this.subscription) { this.subscription.unsubscribe(); } }
}