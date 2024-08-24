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
    private alertsService: AlertsService,
    private toastr: ToastrService,
    private validationService: ValidationService
  ) {

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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.providerForm.get(fieldName);
    return !!(field?.invalid && (field.touched || field.dirty));
  } 

  getErrorMessage(fieldName: string): string {
    const control = this.providerForm.get(fieldName);
    if (control?.errors) {
      const errorKey = Object.keys(control.errors)[0];
      return this.validationService.getErrorMessage('providers', fieldName, errorKey);
    }
    return '';
  }

  private markFormFieldsAsTouched() {
    Object.values(this.providerForm.controls).forEach(control => control.markAsTouched());
  }

  // Crea o actualiza un proveedor
  saveProvider() {

    if (this.providerForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }
      const providerData = { ...this.providerForm.value, estadoProveedor: this.providerForm.value.estadoProveedor ?? true };
      const request = this.isEditing 
      ? this.providersService.updateProvider(providerData) 
      : this.providersService.createProvider(providerData);
  
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
