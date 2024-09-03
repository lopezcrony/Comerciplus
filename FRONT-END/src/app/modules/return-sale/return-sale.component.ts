import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { SHARED_IMPORTS } from '../../shared/shared-imports'; // Archivo para las importaciones generales
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { AlertsService } from '../../shared/alerts/alerts.service';

import { ReturnSaleService } from './return-sale.service';
import { ReturnSaleModel } from './return-sale.model';
import { ValidationService } from '../../shared/validators/validations.service';


@Component({
  selector: 'app-return-sale',
  standalone: true,
  imports: [    
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective
  ],
  templateUrl: './return-sale.component.html',
})
export class ReturnSaleComponent implements OnInit {

  returnSale: ReturnSaleModel[] = [];
  filteredReturnSale: ReturnSaleModel[] = [];

  colums: { field: string, header: string }[] = [
    { field: 'CodigoBarra', header: 'Código' },
    { field: 'cantidad', header: 'Cantidad' },
    { field: 'fechaDevolucion', header: 'Fecha' },
    { field: 'motivoDevolucion', header: 'Motivo' },
    { field: 'tipoReembolso', header: 'Tipo Reembolso' },
    { field: 'valorDevolucion', header: 'Producto' },
  ];

  returnSaleForm: FormGroup;

  showModal = false;
  isEditing = false;

  constructor(
    private returnSaleService: ReturnSaleService,
    private fb: FormBuilder,
    private alertsService: AlertsService,
    private toastr: ToastrService,
    private validationService: ValidationService,
  ) {
    this.returnSaleForm = this.fb.group({
      CodigoProducto: ['', validationService.getValidatorsForField('returnSale', 'CodigoProducto')],      
      cantidad: ['', validationService.getValidatorsForField('returnSale', 'cantidad')],
      fechaDeBaja: new Date(),
      motivo: ['', validationService.getValidatorsForField('returnSale', 'motivo')],
    });
  }

  ngOnInit() {
    this.loadReturnSale();
  }

  loadReturnSale() {
    this.returnSaleService.getReturnSale().subscribe(data => {
      this.returnSale = data;
      this.filteredReturnSale = data;
    },
    );
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


  searchReturnSale(query: string) {
    const lowerCaseQuery = query.toLowerCase();

    // Define el estado que estás buscando. Aquí asumo que buscas "true" en la query.

    this.filteredReturnSale = this.returnSale.filter(returSale =>
      returSale.CodigoBarra.toFixed() ||
      returSale.tipoReembolso.toLowerCase().includes(lowerCaseQuery) ||
      // returSale.fechaDeBaja ||
      // returSale.cantidad ||
      returSale.motivoDevolucion.toLowerCase().includes(lowerCaseQuery)
    );
  }


}
