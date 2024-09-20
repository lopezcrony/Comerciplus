import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { SHARED_IMPORTS } from '../../shared/shared-imports'; // Archivo para las importaciones generales
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { AlertsService } from '../../shared/alerts/alerts.service';
// import {ProductsService} from '../products/products.service'

import { LossService } from './loss.service';
import { Loss } from './loss.model';

import { ValidationService } from '../../shared/validators/validations.service';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/products.model';
import { forkJoin } from 'rxjs';
import { BarcodesService } from '../barcodes/barcodes.service';
import { Barcode } from '../barcodes/barcode.model';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-loss',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective,
  ],
  templateUrl: './loss.component.html',
})
export class LossComponent implements OnInit {
  loss: Loss[] = [];
  filteredLoss: Loss[] = [];
  barcode: Barcode[] = [];

  colums: { field: string, header: string }[] = [
    { field: 'idCodigoBarra', header: 'Código' },
    // { field: 'idProducto', header: 'Producto' },
    { field: 'cantidad', header: 'Cantidad' },
    { field: 'motivo', header: 'Motivo' },
    { field: 'fechaDeBaja', header: 'Fecha' },

  ];

  LossForm: FormGroup;

  showModal = false;
  isEditing = false;

  constructor(
    private lossService: LossService,
    private fb: FormBuilder,
    private alertsService: AlertsService,
    private toastr: ToastrService,
    private validationService: ValidationService,
    private barcodeService: BarcodesService,
  private confirmationService: ConfirmationService,

    
  ) {
    this.LossForm = this.fb.group({
      CodigoProducto: ['', validationService.getValidatorsForField('loss', 'CodigoProducto')],      
      cantidad: ['', validationService.getValidatorsForField('loss', 'cantidad')],
      fechaDeBaja: new Date(),
      motivo: ['', validationService.getValidatorsForField('loss', 'motivo')],
    });
  }

  ngOnInit() {
    this.loadLoss()
    // this.loadCode()
  }

  loadLoss() {
    this.lossService.getLoss().subscribe(data => {
      this.loss = data
      this.filteredLoss = data;
    },
    );
  }

  // loadCode() {
  //   this.productService.getBarcodeByProduct().subscribe(data => {
  //     this.products=data ;
  //   });
  // }

  openCreateModal() {
    this.isEditing = false;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.LossForm.reset();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.LossForm.get(fieldName);
    return !!(field?.invalid && (field.touched || field.dirty));
  }

  getErrorMessage(fieldName: string): string {
    const control = this.LossForm.get(fieldName);
    if (control?.errors) {
      const errorKey = Object.keys(control.errors)[0];
      return this.validationService.getErrorMessage('loss', fieldName, errorKey);
    }
    return '';
  }

  private markFormFieldsAsTouched() {
    Object.values(this.LossForm.controls).forEach(control => control.markAsTouched());
  }

  saveLoss() {
    // Válida el formulario antes de enviarlo
    if (this.LossForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }

    const lossData = this.LossForm.value;
    const request = this.isEditing ?
      this.lossService.createLoss(lossData) :
      this.lossService.createLoss(lossData);
      console.log(lossData)

    request.subscribe({
      next: () => {
        this.toastr.success('Pérdida guardada con éxito!', 'Éxito');
        this.loadLoss();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al agregar un registro', error);
        if (error.status === 500) {
          this.toastr.error('No se puede agregar', 'Error');
        } else {
          this.toastr.error('Ocurrió un error al agregar la pérdida revise el stock.', 'Error');
        }
      }
    });
  }




  // changeSaleStatus(updatedSale: Loss) {
  //   // Asegúrate de que el estado es un booleano (true o false)
  //   const estadoVentas = updatedSale.estado !== undefined ? updatedSale.estado : false;
  
  //   // Llamar al servicio para actualizar el estadoVenta
  //   this.lossService.updateStatusSale(updatedSale.idDevolucionVenta, estadoVentas).subscribe({
  //     next: () => {
  //       // Actualiza las listas Sales y filteredSale
  //       [this.returnSale, this.filteredReturnSale].forEach(list => {
  //         const index = list.findIndex(sale => sale.idDevolucionVenta === updatedSale.idDevolucionVenta);
  //         if (index !== -1) {
  //           // Actualiza solo el campo 'estadoVenta' en lugar de reemplazar todo el objeto
  //           list[index] = { ...list[index], estado: estadoVentas };
  //         }
  //         console.log(estadoVentas)
  //       });
  //       this.toastr.success('Estado actualizado con éxito', 'Éxito');
  //     },
  //     error: () => {
  //       this.toastr.error('Error al actualizar el estado', 'Error');
  //     }
  //   });
  // }
  
  // cancelSale(updatedSale: Loss) {
  //   // Mostrar mensaje de confirmación
  //   this.confirmationService.confirm({
  //     message: '¿Estás seguro de que deseas cancelar esta venta?',
  //     header: 'Confirmación de Anulación',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       // Si se acepta, cambia el estado de la venta a "false" antes de llamar a changeSaleStatus
  //       updatedSale.estado = false; // Cambiamos el estado a "false"
        
  //       // Llama a la función que cambia el estado
  //       this.changeSaleStatus(updatedSale);
        
  //       // Deshabilitar el campo tras la cancelación (si tienes alguna lógica de deshabilitación)
  //       // this.disableField();
  //     },
  //     reject: () => {
  //       this.toastr.info('Anulación cancelada', 'Información');
  //     }
  //   });
  // }







  searchLoss(query: string) {
    if (!query) {
      this.filteredLoss = [...this.loss]; // Si no hay query, mostrar todos los resultados
      return;
    }
    
    this.filteredLoss = this.loss.filter(loss =>
      // loss.CodigoProducto.toString().includes(query.toLowerCase()) ||
      // loss.NombreProducto.toLowerCase().includes(query.toLowerCase()) ||
      loss.motivo.toLowerCase().includes(query.toLowerCase()) ||
      loss.cantidad.toString().includes(query) ||
      loss.fechaDeBaja && new Date(loss.fechaDeBaja).toLocaleDateString().includes(query) // Para la fecha
    );
  }
  

}
