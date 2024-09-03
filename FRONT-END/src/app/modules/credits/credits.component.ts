import { Component, OnInit } from '@angular/core';
import { Credit } from './credit.model';
import { Client } from '../clients/client.model';
import { CreditsService } from './credits.service';
import { ClientService } from '../clients/clients.service';

import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { AlertsService } from '../../shared/alerts/alerts.service';

import { FloatLabelModule } from 'primeng/floatlabel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Installment } from '../installments/installment.model';
import { ToastrService } from 'ngx-toastr';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective,
    FloatLabelModule,
    TableModule
  ],
  templateUrl: './credits.component.html',
})
export class CreditsComponent implements OnInit {
  credits: Credit[] = [];
  clients: Client[] = [];
  installments: Installment[] = [];
  historyItems: any[] = [];
  filteredCredits: any[] = [];
  selectedCredit: Credit | null = null;
  columns: { field: string, header: string }[] = [
    { field: 'nombreCliente', header: 'Cliente' },
    { field: 'totalCredito', header: 'Deuda Actual' },
  ];

  installmentForm: FormGroup;
  showModal = false;
  showHistoryModal = false;

  constructor(
    private creditService: CreditsService,
    private clientService: ClientService,
    private fb: FormBuilder,
    private alertsService: AlertsService,
    private toastr: ToastrService,
  ) {
    this.installmentForm = this.fb.group({
      idCredito: [null],
      totalCredito: [''],
      montoAbonado: [''],
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    forkJoin({
      clients: this.clientService.getAllClients(),
      credits: this.creditService.getAllCredits()
    }).subscribe(({ clients, credits }) => {
      this.clients = clients;
      this.credits = credits.map(credit => {
        const client = this.clients.find(c => c.idCliente === credit.idCliente)!;
        return { ...credit, nombreCliente: client.nombreCliente + ' ' + client.apellidoCliente };
      });
      this.filteredCredits = this.credits;
    });
  };

  openModal(credit: Credit) {
    this.selectedCredit = credit;
    this.installmentForm.patchValue({
      idCredito: credit.idCredito,
      totalCredito: credit.totalCredito,
    });
    this.showModal = true;
  };

  closeModal() {
    this.showModal = false;
    this.selectedCredit = null;
    this.installmentForm.reset();
  };

  saveInstallment() {
    if (this.installmentForm.valid && this.selectedCredit) {
      const installment = this.installmentForm.value;
      this.creditService.createInstallment(installment).subscribe({
        next: () => {
          this.toastr.success('¡Abono realizado con éxito!', 'Éxito');
          this.loadData();
          this.closeModal();
        },
        error: () => this.toastr.error('Error al guardar abono', 'Error')
      });
    }
  };

  searchCredits(query: string) {
    this.filteredCredits = this.credits.filter(credit =>
      // credit.nombreCliente.toLowerCase().includes(query.toLowerCase()) ||
      credit.totalCredito.toString().includes(query)
    );
  };

  loadCreditHistory(idCredit: number) {
    this.creditService.getCreditHistory(idCredit).subscribe({
      next: (history) => {
        console.log(history); 
        this.historyItems = history;
        this.showHistoryModal = true;
      },
      error: () => this.toastr.error('Error al cargar el historial', 'Error')
    });
  ;}

  openHistoryModal(credit: Credit) {
    this.selectedCredit = credit;
    this.loadCreditHistory(credit.idCredito);
  };
  

  closeHistoryModal() {
    this.showHistoryModal = false;
    this.selectedCredit = null;
    this.historyItems = [];
  };

  cancelInstallment(id: number) {
    this.creditService.cancelInstallment(id).subscribe({
      next: () => {
        
        if (this.selectedCredit?.idCredito !== undefined) {
          this.loadCreditHistory(this.selectedCredit.idCredito);
        }
        this.toastr.success('Abono anulado con éxito');
      },
      error: () => this.toastr.error('Error al anular el abono')
    });
  };

  confirmCancelInstallment(installment: any) {
    this.alertsService.confirm(
      `¿Estás seguro de anular el abono?`+ installment.idAbono,
      () => this.cancelInstallment(installment.idAbono)
    );
  }

  exportCredits() {

  };
  
}