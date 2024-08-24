import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { AlertsService } from '../../shared/alerts/alerts.service';

import { ProvidersService } from './providers.service';
import { Proveedor } from './providers.model';
import { ValidationService } from '../../shared/validators/validations.service';
import { validationConfig, validationPatterns } from '../../shared/validators/validations.config';

@Component({
  selector: 'app-providers',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective
    ],
  templateUrl: './providers.component.html',
})

export class ProvidersComponent implements OnInit {

  providers: Proveedor[] = [];
  // Aquí se guardan los proveedores filtrados según la búsqueda
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
    private confirmationService: AlertsService,
    private toastr: ToastrService,
    private validationService: ValidationService
  ) {
    this.validationService.setConfig(validationConfig);
    this.validationService.setPatterns(validationPatterns);

    this.providerForm = this.fb.group({
      idProveedor: [null],
      nitProveedor: ['', this.validationService.getValidatorsForField('providers', 'nitProveedor')],
      nombreProveedor: ['', this.validationService.getValidatorsForField('providers', 'nombreProveedor')],
      direccionProveedor: ['', this.validationService.getValidatorsForField('providers', 'direccionProveedor')],
      telefonoProveedor: ['', this.validationService.getValidatorsForField('providers', 'telefonoProveedor')],
      estadoProveedor: [true]
    });
  }
  
  // Cargar la lista de proveedores
  loadProviders() {
    this.providersService.getAllProviders().subscribe(data => {
      this.providers = data;
      this.filteredProviders = data;
    });
  }

  ngOnInit() {
    this.loadProviders();
  }

  openCreateModal() {
    this.isEditing = false;
    this.providerForm.reset({ estadoProveedor: true });
    this.showModal = true;
  }

  openEditModal(provider: Proveedor) {
    this.isEditing = true;
    this.providerForm.patchValue(provider);
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.providerForm.reset();
  }

  // Crea o actualiza un proveedor
  saveProvider() {

    if (this.providerForm.invalid) {
      Object.keys(this.providerForm.controls).forEach(field => {
        const control = this.providerForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
      const providerData = { ...this.providerForm.value, estadoProveedor: this.providerForm.value.estadoProveedor ?? true };
      const request = this.isEditing ?
        this.providersService.updateProvider(providerData) :
        this.providersService.createProvider(providerData);
  
      request.subscribe({
        next: () => {
          this.toastr.success('¡Proveedor guardado con éxito!', 'Éxito');
          this.loadProviders();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al guardar proveedor:', error);
          this.toastr.error('Error al guardar proveedor. Inténtalo de nuevo.', 'Error');
        }
      });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.providerForm.get(fieldName);
    if (control?.errors) {
      const firstErrorKey = Object.keys(control.errors)[0];
      return this.validationService.getErrorMessage('providers', fieldName, firstErrorKey);
    }
    return '';
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

  confirmDelete(provider: Proveedor) {
    this.confirmationService.confirm(
      `¿Estás seguro de eliminar a ${provider.nombreProveedor}?`,
      () => this.deleteProvider(provider.idProveedor)
    );
  }

  searchProviders(query: string) {
    this.filteredProviders = this.providers.filter(provider =>
      provider.nitProveedor.toLowerCase().includes(query.toLowerCase()) ||
      provider.nombreProveedor.toLowerCase().includes(query.toLowerCase()) ||
      provider.direccionProveedor.toLowerCase().includes(query.toLowerCase()) ||
      provider.telefonoProveedor.toLowerCase().includes(query.toLowerCase())
    );
  }

  exportProviders() { }
}
