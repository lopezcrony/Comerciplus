import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { SHARED_IMPORTS } from '../../shared/shared-imports'; // Archivo para las importaciones generales
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { AlertsService } from '../../shared/alerts/alerts.service';

import { ReturnProviderService } from './return-provider.service';
import { ProvidersService } from '../providers/providers.service';



// import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { returnProviderModel } from './return-provider.model';
import { ValidationService } from '../../shared/validators/validations.service';

@Component({
  selector: 'app-return-provider',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective,
    DropdownModule,
],

  templateUrl: './return-provider.component.html',
})
export class ReturnProviderComponent implements OnInit{
  
  providers:any []=[];
  returnProvider: returnProviderModel[] = [];
  filteredReturnProvider: returnProviderModel[] = [];

  colums: { field: string, header: string }[] = [
    { field: 'NombreProveedor', header: 'Proveedor' },
    { field: 'CodigoProducto', header: 'Código Barras' },
    { field: 'cantidad', header: 'Cantidad' },
    { field: 'motivoDevolucion', header: 'Motivo' },
    { field: 'fecha', header: 'fecha' },
    { field: 'estado', header: 'Estado' },
    

  ];

  returnProviderForm: FormGroup;

  showModal = false;
  isEditing = false;

  constructor(
    private returnProviderService: ReturnProviderService,
    private fb: FormBuilder,
    private alertsService: AlertsService,
    private toastr: ToastrService,
    private validationService: ValidationService,
    private providerService: ProvidersService
  ) {
    this.returnProviderForm = this.fb.group({
      idProveedor: ['', validationService.getValidatorsForField('returnProvider', 'idProveedor')],
      CodigoProducto: ['', validationService.getValidatorsForField('returnProvider', 'CodigoProducto')],      
      cantidad: ['', validationService.getValidatorsForField('returnProvider', 'cantidad')],
      fecha: new Date(),
      motivoDevolucion: ['', validationService.getValidatorsForField('returnProvider', 'motivoDevolucion')],
      estado:['Por notificar']
    });
  }

  ngOnInit() {
    this.loadReturnProvider();
    this.loadProviders()
  }

  loadReturnProvider() {
    this.returnProviderService.getReturnProvider().subscribe(data => {
      this.returnProvider = data;
      this.filteredReturnProvider = data;
    },
    );
  }

  //funcion para traer las categorias y luego llenar el select de productos
  loadProviders() {
    this.providerService.getAllProviders().subscribe(data => {
      this.providers = data.filter(p => p.estadoProveedor === true);
    });
  }


  openCreateModal() {
    this.isEditing = false;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.returnProviderForm.reset();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.returnProviderForm.get(fieldName);
    return !!(field?.invalid && (field.touched || field.dirty));
  }

  getErrorMessage(fieldName: string): string {
    const control = this.returnProviderForm.get(fieldName);
    if (control?.errors) {
      const errorKey = Object.keys(control.errors)[0];
      return this.validationService.getErrorMessage('returnProvider', fieldName, errorKey);
    }
    return '';
  }

  private markFormFieldsAsTouched() {
    Object.values(this.returnProviderForm.controls).forEach(control => control.markAsTouched());
  }

  savereturnProvider() {
    // Válida el formulario antes de enviarlo
    if (this.returnProviderForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }

    const returnProviderData = this.returnProviderForm.value;
    const request = this.isEditing ?
      this.returnProviderService.createReturnProvider(returnProviderData) :
      this.returnProviderService.createReturnProvider(returnProviderData);
      //Para validar
      console.log(returnProviderData)

    request.subscribe({
      next: () => {
        this.toastr.success('Devolucion a proveedor guardada con éxito!', 'Éxito');
        this.loadReturnProvider();
        this.closeModal();
      },
      error: (error) => {
        this.toastr.error(error.message, 'Error');
        
        // if (error.status === 500) {
        //   this.toastr.error('No se puede agregar la devolucion', 'Error');
        // } else {
        //   this.toastr.error('Ocurrió un error al agregar la devolución de proveedor.', 'Error');
        // }
      }
    });

  }


  searchreturnProvider(query: string) {
    const lowerCaseQuery = query.toLowerCase();

    // Define el estado que estás buscando. Aquí asumo que buscas "true" en la query.

    this.filteredReturnProvider = this.returnProvider.filter(returnProviders =>
      returnProviders.CodigoProducto.toFixed() ||
      returnProviders.NombreProveedor.toLowerCase().includes(lowerCaseQuery) ||
      returnProviders.cantidad ||
      returnProviders.motivoDevolucion.toLowerCase().includes(lowerCaseQuery)
    );
  }

  changeReturnProviderStatus(updatedReturnProvider: returnProviderModel) {
    const estado = updatedReturnProvider.estado ?? false;
  
    this.returnProviderService.updateStatusProduct(updatedReturnProvider.idDevolucionLocal, estado).subscribe({
      next: () => {
        [this.returnProvider, this.filteredReturnProvider].forEach(list => {
          const index = list.findIndex(p => p.idDevolucionLocal === updatedReturnProvider.idDevolucionLocal);
          if (index !== -1) {
            list[index] = { ...list[index], ...updatedReturnProvider };
          }
        });
        this.toastr.success('Estado del proveedor actualizado con éxito', 'Éxito');
      },
      error: () => {
        this.toastr.error('Error al actualizar el estado del proveedor', 'Error');
      }
    });
  } 
}
