import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { SHARED_IMPORTS } from '../../shared/shared-imports'; // Archivo para las importaciones generales
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { AlertsService } from '../../shared/alerts/alerts.service';

import { ProvidersService } from '../providers/providers.service';


import { DropdownModule } from 'primeng/dropdown';
import { ReturnSaleService } from './return-sale.service';
import { ReturnSaleModel } from './return-sale.model';
import { ValidationService } from '../../shared/validators/validations.service';
import { ConfirmationService } from 'primeng/api';
import { Barcode } from '../barcodes/barcode.model';
import { BarcodesService } from '../barcodes/barcodes.service';


@Component({
  selector: 'app-return-sale',
  standalone: true,
  imports: [    
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective,
    DropdownModule
  ],
  templateUrl: './return-sale.component.html',
})
export class ReturnSaleComponent implements OnInit {

  providers:any []=[];
  barcode: Barcode[] = [];
  returnSale: ReturnSaleModel[] = [];
  filteredReturnSale: ReturnSaleModel[] = [];

  colums: { field: string, header: string }[] = [
    { field: 'codigoBarra', header: 'Código' },
    // { field: 'NombreProducto', header: 'Producto' },
    { field: 'cantidad', header: 'Cantidad' },
    { field: 'tipoReembolso', header: 'Tipo Reembolso' },
    { field: 'motivoDevolucion', header: 'Motivo' },   
    { field: 'valorDevolucion', header: 'Valor' },
    { field: 'fechaDevolucion', header: 'Fecha' },
  ];

  returnSaleForm: FormGroup;
  options = [
    { label: 'Dinero', value: 'Dinero' },
    { label: 'Producto', value: 'Producto' },
  ];

  motivos = [
    { label: 'Caducidad', value: 'Caducidad' },
    { label: 'Equivocación', value: 'Equivocación' },
  ];
  showModal = false;
  isEditing = false;

  constructor(
    private returnSaleService: ReturnSaleService,
    private fb: FormBuilder,
    private alertsService: AlertsService,
    private toastr: ToastrService,
    private validationService: ValidationService,
    private providerService: ProvidersService,
    private barcodeService: BarcodesService,
  private confirmationService: ConfirmationService,


  ) {
    this.returnSaleForm = this.fb.group({
      CodigoProducto: ['', validationService.getValidatorsForField('returnSale', 'CodigoProducto')],      
      cantidad: ['', validationService.getValidatorsForField('returnSale', 'cantidad')],
      fechaDeBaja: new Date(),
      motivoDevolucion: ['', validationService.getValidatorsForField('returnSale', 'motivoDevolucion')],
      tipoReembolso: ['', validationService.getValidatorsForField('returnSale', 'tipoReembolso')],
      idProveedor: ['', validationService.getValidatorsForField('returnProvider', 'idProveedor')],
    });
  }

  ngOnInit() {
    this.loadProviders()
    this.loadBardCode()
  }

  loadReturnSale() {
    this.returnSaleService.getReturnSale().subscribe(data => {
      this.returnSale = data.map(repp => {
        const code = this.barcode.find(codes => codes.idCodigoBarra === repp.idCodigoBarra);
  
        return { 
          ...repp, 
          codigoBarra: code ? code.codigoBarra : 'Codigo no encontrado'
        };
      });
      this.filteredReturnSale = this.returnSale;
    },
    );
  }

  loadProviders() {
    this.providerService.getAllProviders().subscribe(data => {
      this.providers = data.filter(p => p.estadoProveedor === true);
    });
  }

  loadBardCode() {
    this.barcodeService.getAllBarcodes().subscribe(data => {
      this.barcode = data; // Guardamos los códigos de barras
      this.loadReturnSale(); // Ahora que los códigos están cargados, podemos cargar las pérdidas
    });
  }

  openCreateModal() {
    this.isEditing = false;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.returnSaleForm.reset();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.returnSaleForm.get(fieldName);
    return !!(field?.invalid && (field.touched || field.dirty));
  }

  getErrorMessage(fieldName: string): string {
    const control = this.returnSaleForm.get(fieldName);
    if (control?.errors) {
      const errorKey = Object.keys(control.errors)[0];
      return this.validationService.getErrorMessage('returnSale', fieldName, errorKey);
    }
    return '';
  }

  private markFormFieldsAsTouched() {
    Object.values(this.returnSaleForm.controls).forEach(control => control.markAsTouched());
  }

  saveReturnSale() {
    // Válida el formulario antes de enviarlo
    if (this.returnSaleForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }

    const lossData = this.returnSaleForm.value;
    const request = this.isEditing ?
      this.returnSaleService.createReturnSale(lossData) :
      this.returnSaleService.createReturnSale(lossData);
      console.log(lossData)

    request.subscribe({
      next: () => {
        this.toastr.success('Devolución guardada con éxito!', 'Éxito');
        this.loadReturnSale();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al agregar un registro', error);
        if (error.status === 500) {
          this.toastr.error('No se puede agregar', 'Error');
        } else {
          this.toastr.error('Ocurrió un error al agregar la devolucion.', 'Error');
        }
      }
    });

  }


  changeSaleStatus(updatedSale: ReturnSaleModel) {
    // Asegúrate de que el estado es un booleano (true o false)
    const estadoVentas = updatedSale.estado !== undefined ? updatedSale.estado : false;
  
    // Llamar al servicio para actualizar el estadoVenta
    this.returnSaleService.updateStatusSale(updatedSale.idDevolucionVenta, estadoVentas).subscribe({
      next: () => {
        // Actualiza las listas Sales y filteredSale
        [this.returnSale, this.filteredReturnSale].forEach(list => {
          const index = list.findIndex(sale => sale.idDevolucionVenta === updatedSale.idDevolucionVenta);
          if (index !== -1) {
            // Actualiza solo el campo 'estadoVenta' en lugar de reemplazar todo el objeto
            list[index] = { ...list[index], estado: estadoVentas };
          }
          console.log(estadoVentas)
        });
        this.toastr.success('Estado actualizado con éxito', 'Éxito');
      },
      error: () => {
        this.toastr.error('Error al actualizar el estado', 'Error');
      }
    });
  }
  
  cancelSale(updatedSale: ReturnSaleModel) {
    // Mostrar mensaje de confirmación
    this.alertsService.confirm(
    `¿Estás seguro de que deseas cancelar esta venta?`,
      
      () => {
        // Si se acepta, cambia el estado de la venta a "false" antes de llamar a changeSaleStatus
        updatedSale.estado = false; // Cambiamos el estado a "false"
        
        // Llama a la función que cambia el estado
        this.changeSaleStatus(updatedSale);
        
        // Deshabilitar el campo tras la cancelación (si tienes alguna lógica de deshabilitación)
        // this.disableField();
      },
      () => {
        this.toastr.info('Anulación cancelada', 'Información');
      }
    );
  }
  
  

  searchReturnSale(query: string) {
    const lowerCaseQuery = query.toLowerCase();

    // Define el estado que estás buscando. Aquí asumo que buscas "true" en la query.

    this.filteredReturnSale = this.returnSale.filter(returSale =>
      // returSale.CodigoProducto.toString().includes(lowerCaseQuery) ||
      returSale.tipoReembolso.toLowerCase().includes(lowerCaseQuery) ||
      returSale.cantidad.toString().includes(lowerCaseQuery) ||
      returSale.motivoDevolucion.toLowerCase().includes(lowerCaseQuery) ||
      // returSale.NombreProducto.toLowerCase().includes(lowerCaseQuery) ||
      returSale.fechaDevolucion && new Date(returSale.fechaDevolucion).toLocaleDateString().includes(lowerCaseQuery) ||
      returSale.valorDevolucion.toString().includes(lowerCaseQuery)
    );
  }


}
