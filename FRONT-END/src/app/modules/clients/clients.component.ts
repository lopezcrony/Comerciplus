import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { ValidationService } from '../../shared/validators/validations.service';
import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { AlertsService } from '../../shared/alerts/alerts.service';

import { Client } from './client.model';
import { ClientService } from './clients.service';
import { CreditsService } from '../credits/credits.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective,
  ],
  templateUrl: './clients.component.html',
  styleUrl: '../credits/credits.component.css'
})

export class ClientsComponent implements OnInit {

  clients: Client[] = [];
  filteredClients: Client[] = [];
  historyItems: any[] = [];

  columns: { field: string, header: string, type: string }[] = [
    { field: 'cedulaCliente', header: 'Cédula', type: 'text' },
    { field: 'nombreCliente', header: 'Nombre', type: 'text' },
    { field: 'apellidoCliente', header: 'Apellido', type: 'text' },
    { field: 'telefonoCliente', header: 'Teléfono', type: 'text' },
  ];

  clientForm: FormGroup;
  showModal: boolean = false;
  showHistoryModal: boolean = false;
  isEditing: boolean = false;
  selectedClient: Client | undefined;

  constructor(
    private clientService: ClientService,
    private creditService: CreditsService,
    private fb: FormBuilder,
    private alertsService: AlertsService,
    private toastr: ToastrService,
    private validationService: ValidationService
  ) {
    this.clientForm = this.fb.group({
      idCliente: [null],
      cedulaCliente: ['', this.validationService.getValidatorsForField('clients', 'cedulaCliente')],
      nombreCliente: ['', this.validationService.getValidatorsForField('clients', 'nombreCliente')],
      apellidoCliente: ['', this.validationService.getValidatorsForField('clients', 'apellidoCliente')],
      direccionCliente: ['', this.validationService.getValidatorsForField('clients', 'direccionCliente')],
      telefonoCliente: ['', this.validationService.getValidatorsForField('clients', 'telefonoCliente')],
      estadoCliente: [true]
    });
  }

  loadClients() {
    this.clientService.getAllClients().subscribe(data => {
      this.clients = data;
      this.filteredClients = data;
    },
    );
  }

  ngOnInit() {
    this.loadClients();
  }

  openCreateModal() {
    this.isEditing = false;
    this.clientForm.reset({ estadoCliente: true });
    this.showModal = true;
  }

  openEditModal(client: Client) {
    this.isEditing = true;
    this.clientForm.patchValue(client);
    this.showModal = true;
  }

  openHistoryModal(client: Client) {
    this.selectedClient = client;
    this.loadCreditHistory(client.idCliente);
    this.showHistoryModal = true;
  }
  
  cancelModalMessage(){
    this.alertsService.menssageCancel()
  }

  closeModal() {
    this.showModal = false;
    this.clientForm.reset();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field?.invalid && (field.touched || field.dirty));
  }  

  getErrorMessage(fieldName: string): string {
    const control = this.clientForm.get(fieldName);
    if (control?.errors) {
      const errorKey = Object.keys(control.errors)[0];
      return this.validationService.getErrorMessage('clients', fieldName, errorKey);
    }
    return '';
  }

  private markFormFieldsAsTouched() {
    Object.values(this.clientForm.controls).forEach(control => control.markAsTouched());
  }

  saveClient() {
    if (this.clientForm.invalid) return this.markFormFieldsAsTouched(); 

    const clientData = this.clientForm.value;
    const request = this.isEditing 
      ? this.clientService.updateClient(clientData) 
      : this.clientService.createClient(clientData);

    request.subscribe({
      next: () => {
        this.toastr.success('¡Cliente guardado con éxito!', 'Éxito');
        this.loadClients();
        this.closeModal();
      },
      error: () => this.toastr.error('Error al guardar cliente', 'Error')
    });
  };

  loadCreditHistory(idClient: number) {
    this.creditService.getCreditHistoryByClient(idClient).subscribe({
      next: (history) => {
        this.historyItems = history.filter(a => a.estadoAbono === true || a.tipo === 'Crédito');
      },
      error: () => {
        this.toastr.error('Error al cargar el historial de crédito', 'Error');
      }
    });
  }

  searchClients(query: string) {
    this.filteredClients = this.clients.filter(client =>
      client.nombreCliente.toLowerCase().includes(query.toLowerCase()) ||
      client.apellidoCliente.toLowerCase().includes(query.toLowerCase()) ||
      client.cedulaCliente.toLowerCase().includes(query.toLowerCase()) ||
      client.telefonoCliente.toLowerCase().includes(query.toLowerCase())
    );
  }

  exportClients() { }

  changeClientStatus(updatedClient: Client) {
    const estadoCliente = updatedClient.estadoCliente ?? false;
  
    this.clientService.updateStatusClient(updatedClient.idCliente, estadoCliente).subscribe({
      next: () => {
        [this.clients, this.filteredClients].forEach(list => {
          const index = list.findIndex(c => c.idCliente === updatedClient.idCliente);
          if (index !== -1) {
            list[index] = { ...list[index], ...updatedClient };
          }
        });
        this.toastr.success('Estado del cliente actualizado con éxito', 'Éxito');
      },
      error: () => {
        this.toastr.error('Error al actualizar el estado del cliente', 'Error');
      }
    });
  }  
  
}