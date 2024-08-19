import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  constructor(
    private primeNgConfirmationService: ConfirmationService,
    private toastr: ToastrService
  ) { }

// ALERTA DE CONFIRMACIÓN
  confirm(message: string, acceptCallback: () => void) {
    this.primeNgConfirmationService.confirm({
      message: message,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        acceptCallback();
      },
      reject: () => {
        this.toastr.info('Operación cancelada.');
      }
    });
  }

}