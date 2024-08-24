import { ClientService } from './clients.service';
import { Client } from './client.model';
import { ValidationService } from '../../shared/validators/validations.service';
import { validationConfig, validationPatterns } from '../../shared/validators/validations.config';

import { SHARED_IMPORTS } from '../../shared/shared-imports'; // Archivo para las importaciones generales
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { AlertsService } from '../../shared/alerts/alerts.service';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective,
    FloatLabelModule
  ],
  templateUrl: './clients.component.html'
})

export class ClientsComponent implements OnInit {

  clients: Client[] = [];
  filteredClients: Client[] = [];

  columns: { field: string, header: string }[] = [
    { field: 'cedulaCliente', header: 'Cédula' },
    { field: 'nombreCliente', header: 'Nombre' },
    { field: 'apellidoCliente', header: 'Apellido' },
    { field: 'telefonoCliente', header: 'Teléfono' },
    { field: 'estadoCliente', header: 'Estado' }
  ];

  clientForm: FormGroup;
  showModal = false;
  isEditing = false;

  constructor(
    private clientService: ClientService,
    private fb: FormBuilder,
    private confirmationService: AlertsService,
    private toastr: ToastrService,
    private validationService: ValidationService
  ) {
    this.validationService.setConfig(validationConfig);
    this.validationService.setPatterns(validationPatterns);

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
    this.clientService.getClients().subscribe(data => {
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

  closeModal() {
    this.showModal = false;
    this.clientForm.reset();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.clientForm.get(fieldName);
    if (control?.errors) {
      const firstErrorKey = Object.keys(control.errors)[0];
      return this.validationService.getErrorMessage('clients', fieldName, firstErrorKey);
    }
    return '';
  }

  saveClient() {
    if (this.clientForm.invalid) {
      Object.keys(this.clientForm.controls).forEach(field => {
        const control = this.clientForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    const clientData = this.clientForm.value;
    const request = this.isEditing ?
      this.clientService.updateClient(clientData) :
      this.clientService.createClient(clientData);
  
    request.subscribe({
      next: () => {
        this.toastr.success('¡Cliente guardado con éxito!', 'Éxito');
        this.loadClients();
        this.closeModal();
      },
      error: (error) => console.error('Error al guardar cliente:', error)
    });
  }
  

  deleteClient(id: number) {
    this.clientService.deleteClient(id).subscribe({
      next: () => {
        this.loadClients();
        this.toastr.success('Cliente eliminado exitosamente.', 'Éxito');
      },
      error: (error) => {
        console.error('Error al eliminar registro:', error);
        if (error.status === 500 && error.error.mensagge.includes('Cannot delete or update a parent row')) {
          this.toastr.error('No se puede eliminar el cliente porque tiene créditos asociados.', 'Error');
        } else {
          this.toastr.error('Ocurrió un error al eliminar el cliente.', 'Error');
        }
      }
    });
  }

  confirmDelete(client: Client) {
    this.confirmationService.confirm(
      `¿Estás seguro de eliminar a ${client.nombreCliente} ${client.apellidoCliente}?`,
      () => this.deleteClient(client.idCliente)
    );
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
}