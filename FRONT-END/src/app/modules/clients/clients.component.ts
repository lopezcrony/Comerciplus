import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastrService } from 'ngx-toastr';

import { ClientService } from './clients.service';
import { Client } from './client.model';
import { CRUDComponent } from '../crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { ConfirmationServiceMessage } from '../../shared/alerts/confirmation.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    ToolbarModule,
    DialogModule,
    InputTextModule,
    CRUDComponent,
    CrudModalDirective,
    ConfirmDialogModule
  ],
  templateUrl: './clients.component.html'
})

export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];

  columns: { field: string, header: string }[] = [
    { field: 'nombreCliente', header: 'Nombre' },
    { field: 'apellidoCliente', header: 'Apellido' },
    { field: 'cedulaCliente', header: 'Cédula' },
    { field: 'telefonoCliente', header: 'Teléfono' },
    { field: 'estadoCliente', header: 'Estado' }
  ];
  clientForm: FormGroup;
  showModal = false;
  isEditing = false;

  constructor(
    private clientService: ClientService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationServiceMessage,
    private toastr: ToastrService
  ) {
    this.clientForm = this.fb.group({
      idCliente: [null],
      cedulaCliente: ['', Validators.required],
      nombreCliente: ['', Validators.required],
      apellidoCliente: ['', Validators.required],
      direccionCliente: ['', Validators.required],
      telefonoCliente: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
      estadoCliente: [true]
    });
  }

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClients().subscribe(
      (data: Client[]) => {
        this.clients = data;
        this.filteredClients = data;
      },
      error => console.error('Error al cargar registros:', error)
    );
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

  saveClient() {
    if (this.clientForm.valid) {
      const clientData = this.clientForm.value;
      const request = this.isEditing ?
        this.clientService.updateClient(clientData) :
        this.clientService.createClient(clientData);

      request.subscribe({
        next: () => {
          this.loadClients();
          this.closeModal();
        },
        error: (error) => console.error('Error al guardar cliente:', error)
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.clientForm.reset();
  }

  confirmDelete(client: Client) {
    this.confirmationService.confirm(
      `¿Estás seguro de eliminar a ${client.nombreCliente} ${client.apellidoCliente}?`,
      () => this.deleteClient(client.idCliente)
    );
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

  deleteAllClients() { }

  exportClients() { }

  searchClients(query: string) {
    this.filteredClients = this.clients.filter(client =>
      client.nombreCliente.toLowerCase().includes(query.toLowerCase()) ||
      client.apellidoCliente.toLowerCase().includes(query.toLowerCase()) ||
      client.cedulaCliente.toLowerCase().includes(query.toLowerCase()) ||
      client.telefonoCliente.toLowerCase().includes(query.toLowerCase())
    );
  }
}