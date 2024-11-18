import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { AlertsService } from '../../shared/alerts/alerts.service';
import { ValidationService } from '../../shared/validators/validations.service';

import { ReturnProviderService } from './return-provider.service';
import { ProvidersService } from '../providers/providers.service';
import { Proveedor } from '../providers/providers.model';
import { BarcodesService } from '../barcodes/barcodes.service';
import { Barcode } from '../barcodes/barcode.model'
import { returnProviderModel } from './return-provider.model';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/products.model';

@Component({
  selector: 'app-return-provider',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective,
  ],

  templateUrl: './return-provider.component.html',
})
export class ReturnProviderComponent implements OnInit {

  providers: Proveedor[] = [];
  products: any[] = [];
  code: any[] = [];

  filterCode: Barcode[] = [];
  filterProvider: Proveedor[] = [];

  returnProvider: returnProviderModel[] = [];
  filteredReturnProvider: returnProviderModel[] = [];

  returnProviderForm: FormGroup;

  showModal = false;
  isEditing = false;

  colums: { field: string, header: string, type: string }[] = [
    { field: 'nombreProveedor', header: 'Proveedor', type: 'text' },
    { field: 'codigoBarra', header: 'Código', type: 'text' },
    { field: 'nombreProducto', header: 'Producto', type: 'text' },
    { field: 'cantidad', header: 'Cantidad', type: 'text' },
    { field: 'motivoDevolucion', header: '  Motivo', type: 'text' },
    { field: 'fecha', header: '  Fecha', type: 'dateTime' },
  ];
  
  constructor(
    private returnProviderService: ReturnProviderService,
    private fb: FormBuilder,
    private alertsService: AlertsService,
    private toastr: ToastrService,
    private validationService: ValidationService,
    private providerService: ProvidersService,
    private barcodeService: BarcodesService,
    private productService: ProductsService
  ) {
    this.returnProviderForm = this.fb.group({
      idProveedor: ['', validationService.getValidatorsForField('returnProvider', 'idProveedor')],
      CodigoProducto: ['', validationService.getValidatorsForField('returnProvider', 'CodigoProducto')],
      cantidad: ['', validationService.getValidatorsForField('returnProvider', 'cantidad')],
      fecha: new Date(),
      motivoDevolucion: ['', validationService.getValidatorsForField('returnProvider', 'motivoDevolucion')],
      estado: ['Por notificar']
    });
  }

  ngOnInit() {
    this.loadData();
  };

  loadData() {
    forkJoin({
      providers: this.providerService.getAllProviders(),
      products: this.productService.getAllProducts(),
      barcodes: this.barcodeService.getAllBarcodes(),
      returnProviders: this.returnProviderService.getReturnProvider()
    }).subscribe({
      next: ({ providers, products, barcodes, returnProviders }) => {
        this.providers = providers;
        this.products = products;
        this.code = barcodes.map(c => {
          const product = this.products.find(p => p.idProducto === c.idProducto);
          return { ...c, nombreProducto: product?.nombreProducto || 'Desconocido' };
        });

        this.returnProvider = returnProviders.map(repp => {
          const provider = this.providers.find(p => p.idProveedor === repp.idProveedor);
          const code = this.code.find(codes => codes.idCodigoBarra === repp.idCodigoBarra);

          return {
            ...repp,
            nombreProveedor: provider ? provider.nombreProveedor : 'Desconocido',
            codigoBarra: code ? code.codigoBarra : 'Desconocido',
            nombreProducto: code ? code.nombreProducto : 'Desconocido'
          };
        });
        this.filteredReturnProvider = this.returnProvider;
      },
      error: (err) => {
        this.toastr.error('Error al cargar los datos.', 'Error');
      }
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
        this.loadData();
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

  estadoDict: { [key: string]: string } = {
    '1': 'por notificar',
    '2': 'notificado',
    '3': 'en proceso',
    '4': 'finalizado'
  };
  
  searchreturnProvider(query: string) {
    const lowerCaseQuery = query.toLowerCase();
    if (!query) {
      this.filteredReturnProvider = [...this.returnProvider]; 
      return;
    }
  
    this.filteredReturnProvider = this.returnProvider.filter(returnProviders => {
      const barCode = returnProviders as unknown as Barcode & {codigoBarra?: string};
      const code = (barCode.codigoBarra || '').toLowerCase().includes(lowerCaseQuery);
      const productName = returnProviders as unknown as Product & {nombreProducto?: string};
      const product = (productName.nombreProducto || '').toLowerCase().includes(lowerCaseQuery);
      const ProviderName = returnProviders as unknown as Proveedor & {nombreProveedor?: string};
      const provider = (ProviderName.nombreProveedor || '').toLowerCase().includes(lowerCaseQuery);
  
      const cantidad = returnProviders.cantidad.toString().includes(lowerCaseQuery);
      const motivo = returnProviders.motivoDevolucion.toLowerCase().includes(lowerCaseQuery);
      const fecha = returnProviders.fecha && new Date(returnProviders.fecha).toLocaleDateString().includes(lowerCaseQuery);
  
     // Obtener el nombre del estado desde el diccionario 
    
  
      return code || product || provider || cantidad || motivo || fecha 
    });
  }
  

  changeReturnProviderStatus(updatedReturnProvider: returnProviderModel) {
    const estado = updatedReturnProvider.estado;
    console.log('Valor que se envía al servicio:', estado);

    this.returnProviderService.updateStatusReturnProvider(updatedReturnProvider.idDevolucionLocal, estado).subscribe({
      next: (response) => {
        console.log('Respuesta del servicio:', response);  // Verificar si hay respuesta exitosa
        [this.returnProvider, this.filteredReturnProvider].forEach(list => {
          const index = list.findIndex(p => p.idDevolucionLocal === updatedReturnProvider.idDevolucionLocal);
          if (index !== -1) {
            list[index] = { ...list[index], ...updatedReturnProvider };
          }
        });
        this.toastr.success('Estado del proveedor actualizado con éxito', 'Éxito');
      },
      error: (err) => {
        console.error('Error al intentar actualizar el estado:', err);  // Verifica si hay error
        this.toastr.error('Error al actualizar el estado del proveedor', 'Error');
      }
    });
  }

}
