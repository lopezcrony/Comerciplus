import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class ConfirmationServiceMessage {
  constructor(
    private primeNgConfirmationService: ConfirmationService,
    private toastr: ToastrService

  ) { }

  confirm(message: string, acceptCallback: () => void) {
    this.primeNgConfirmationService.confirm({
      message: message,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        acceptCallback();
        // Se eliminó el toastr de éxito
      },
      reject: () => {
        this.toastr.info('Operación cancelada.');
      }
    });
  }

}