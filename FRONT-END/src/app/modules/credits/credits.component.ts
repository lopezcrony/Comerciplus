import { Component, OnInit } from '@angular/core';
import { Credit } from './credit.model';
import { Client } from '../clients/client.model';
import { CreditsService } from './credits.service';
import { ClientService } from '../clients/clients.service';

import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { AlertsService } from '../../shared/alerts/alerts.service';
import { ValidationService } from '../../shared/validators/validations.service';

import { FloatLabelModule } from 'primeng/floatlabel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Installment } from '../installments/installment.model';
import { ToastrService } from 'ngx-toastr';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective,
    FloatLabelModule,
    TableModule,
    TooltipModule,
    InputNumberModule,
  ],
  templateUrl: './credits.component.html',
  styleUrl: './credits.component.css',
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

  remainingBalance: number = 0;

  constructor(
    private creditService: CreditsService,
    private clientService: ClientService,
    private fb: FormBuilder,
    private alertsService: AlertsService,
    private toastr: ToastrService,
    private validationService: ValidationService
  ) {
    this.installmentForm = this.fb.group({
      idCredito: [null],
      totalCredito: [{value: '', disabled: true}],
      montoAbonado: ['', this.validationService.getValidatorsForField('credits', 'montoAbonado')],
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
  }

  openModal(credit: Credit) {
    this.selectedCredit = credit;
    this.installmentForm.patchValue({
      idCredito: credit.idCredito,
      totalCredito: credit.totalCredito,
      montoAbonado: 0
    });
    this.showModal = true;
  }

  cancelModalMessage(){
    this.closeModal();
    this.alertsService.menssageCancel();
  }; 

  closeModal() {
    this.showModal = false;
    this.selectedCredit = null;
    this.installmentForm.reset();
  };

  isFieldInvalid(fieldName: string): boolean {
    const field = this.installmentForm.get(fieldName);
    return !!(field?.invalid && (field.touched || field.dirty));
  }  

  getErrorMessage(fieldName: string): string {
    const control = this.installmentForm.get(fieldName);
    if (control?.errors) {
      const errorKey = Object.keys(control.errors)[0];
      return this.validationService.getErrorMessage('credits', fieldName, errorKey);
    }
    return '';
  }

  private markFormFieldsAsTouched() {
    Object.values(this.installmentForm.controls).forEach(control => control.markAsTouched());
  }
  calculateRemainingBalance(): number {
    const totalCredito = this.installmentForm.get('totalCredito')?.value || 0;
    const montoAbonado = this.installmentForm.get('montoAbonado')?.value || 0;
    return this.remainingBalance = totalCredito - montoAbonado;
  }

  saveInstallment() {
    
    if (this.installmentForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }

    if (this.selectedCredit) {
      const installment = this.installmentForm.getRawValue();
      this.creditService.createInstallment(installment).subscribe({
        next: () => {
          this.toastr.success('¡Abono realizado con éxito!', 'Éxito');
          this.loadData();
          this.closeModal();
        },
        error: () => this.toastr.error('Error al guardar abono', 'Error')
      });
    }
  }

  searchCredits(query: string) {
    this.filteredCredits = this.credits.filter(credit =>
      credit.totalCredito.toString().includes(query)
    );
    this.clients = this.clients.filter(client => 
      client.nombreCliente.toLowerCase().includes(query.toLowerCase()) ||
      client.apellidoCliente.toLowerCase().includes(query.toLowerCase())
    );
  }

  loadCreditHistory(idCredit: number) {
    this.creditService.getCreditHistory(idCredit).subscribe({
      next: (history) => {
        this.historyItems = history;
        this.showHistoryModal = true;
      },
      error: () => this.toastr.error('Error al cargar el historial', 'Error')
    });
  }

  openHistoryModal(credit: Credit) {
    this.selectedCredit = credit;
    this.loadCreditHistory(credit.idCredito);
  }

  closeHistoryModal() {
    this.showHistoryModal = false;
    this.selectedCredit = null;
    this.historyItems = [];
  }

  cancelInstallment(id: number) {
    this.creditService.cancelInstallment(id).subscribe({
      next: () => {
        if (this.selectedCredit?.idCredito !== undefined) {
          this.loadCreditHistory(this.selectedCredit.idCredito);
        }
        this.toastr.success('Abono anulado con éxito');
        this.loadData();
      },
      error: () => this.toastr.error('Error al anular el abono')
    });
  }

  confirmCancelInstallment(installment: any) {
    this.alertsService.confirm(
      `¿Estás seguro de anular el abono?`,
      () => this.cancelInstallment(installment.idAbono)
    );
  }

  exportCredits() {
    // Implementar lógica de exportación
  }
}