import { Component, OnInit } from '@angular/core';

import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { ConfirmationServiceMessage } from '../../shared/alerts/confirmation.service';
import { SHARED_IMPORTS } from '../../shared/shared-imports';

import { ProvidersService } from './providers.service';
import { Proveedor } from './providers.model';

@Component({
  selector: 'app-providers',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    FormsModule,
    ReactiveFormsModule,
    CRUDComponent,
    CrudModalDirective,
  ],
  templateUrl: './providers.component.html',
})

export class ProvidersComponent implements OnInit {
  providers: Proveedor[] = [];
  filteredProviders: Proveedor[] = [];

  columns: { field: string, header: string }[] = [
    { field: 'nitProveedor', header: 'NIT' },
    { field: 'nombreProveedor', header: 'Nombre' },
    { field: 'direccionProveedor', header: 'Dirección' },
    { field: 'telefonoProveedor', header: 'Teléfono' },
    { field: 'estadoProveedor', header: 'Estado' }
  ];
  providerForm: FormGroup;
  showModal = false;
  isEditing = false;

  constructor(
    private providersService: ProvidersService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationServiceMessage,
    private toastr: ToastrService) {
    this.providerForm = this.fb.group({
      idProveedor: [null],
      nitProveedor: ['', Validators.required],
      nombreProveedor: ['', Validators.required],
      direccionProveedor: ['', Validators.required],
      telefonoProveedor: ['', Validators.required],
      estadoProveedor: [true] // Valor predeterminado
    });

  }

  ngOnInit() {
    this.loadProviders();
  }

  // Cargar la lista de proveedores
  loadProviders() {
    this.providersService.getAllProviders().subscribe(data => {
      console.log('Datos recibidos:', data); // Verifica aquí
      this.providers = data;
      this.filteredProviders = data;
    });
  }


  openCreateModal() {
    this.isEditing = false;
    this.providerForm.reset({ estadoCliente: true });
    this.showModal = true;
  }

  openEditModal(client: Proveedor) {
    this.isEditing = true;
    this.providerForm.patchValue(client);
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.providerForm.reset();
  }

  // Crear o actualizar un proveedor
  saveProvider() {
    if (this.providerForm.valid) {
      const providerData = { ...this.providerForm.value, estadoProveedor: this.providerForm.value.estadoProveedor ?? true };
      const request = this.isEditing ?
        this.providersService.updateProvider(providerData) :
        this.providersService.createProvider(providerData);
  
      request.subscribe({
        next: () => {
          this.toastr.success('Proveedor guardado con éxito!', 'Éxito');
          this.loadProviders();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al guardar proveedor:', error);
          this.toastr.error('Error al guardar proveedor. Inténtalo de nuevo.', 'Error');
        }
      });
    } else {
      this.toastr.warning('Por favor, completa todos los campos requeridos.', 'Advertencia');
    }
  }

  confirmDelete(provider: Proveedor) {
    this.confirmationService.confirm(
      `¿Estás seguro de eliminar a ${provider.nombreProveedor}?`,
      () => this.deleteProvider(provider.idProveedor)
    );
  }

  deleteProvider(id: number) {
    this.providersService.deleteProvider(id).subscribe({
      next: () => {
        this.loadProviders();
        this.toastr.success('Proveedor eliminado exitosamente.', 'Éxito');
      },
      error: (error) => {
        console.error('Error al eliminar registro:', error);
        if (error.status === 500 && error.error.mensagge.includes('Cannot delete or update a parent row')) {
          this.toastr.error('No se puede eliminar el proveedor porque tiene créditos asociados.', 'Error');
        } else {
          this.toastr.error('Ocurrió un error al eliminar el proveedor.', 'Error');
        }
      }
    });
  }

  searchProviders(query: string) {
    this.filteredProviders = this.providers.filter(provider =>
      provider.nitProveedor.toLowerCase().includes(query.toLowerCase()) ||
      provider.nombreProveedor.toLowerCase().includes(query.toLowerCase()) ||
      provider.direccionProveedor.toLowerCase().includes(query.toLowerCase()) ||
      provider.telefonoProveedor.toLowerCase().includes(query.toLowerCase())
    );
  }


  deleteAllProviders() { }

  exportProviders() { }


}
