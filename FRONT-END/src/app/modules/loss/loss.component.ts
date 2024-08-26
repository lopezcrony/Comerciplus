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

@Component({
  selector: 'app-loss',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective],
  templateUrl: './loss.component.html',
})
export class LossComponent implements OnInit {
  loss: Loss[] = [];
  filteredLoss: Loss[] = [];

  colums: { field: string, header: string }[] = [
    { field: 'CodigoProducto', header: 'Código' },
    { field: 'NombreProducto', header: 'Producto' },
    { field: 'cantidad', header: 'Cantidad' },
    { field: 'fechaDeBaja', header: 'Fecha' },
    { field: 'motivo', header: 'Motivo' }
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
  ) {
    this.LossForm = this.fb.group({
      idDevolucionDeBaja: [null],
      idCodigoBarra: ['', validationService.getValidatorsForField('loss', 'idCodigoBarra')],
      cantidad: ['', validationService.getValidatorsForField('loss', 'cantidad')],
      fechaDeBaja: [new Date(), validationService.getValidatorsForField('loss', 'fechaDeBaja')],
      motivo: ['', validationService.getValidatorsForField('loss', 'motivo')],
    });
  }

  ngOnInit() {
    this.loadLoss();
  }

  loadLoss() {
    this.lossService.getLoss().subscribe(data => {
      this.loss = data;
      this.filteredLoss = data;
    },
    );
  }

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

    request.subscribe({
      next: () => {
        this.toastr.success('Pérdida guardada con éxito!', 'Éxito');
        this.loadLoss();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error al agregar un registro revise el stock:', error);
        if (error.status === 500) {
          this.toastr.error('No se puede agregar una pérdida revise el stock', 'Error');
        } else {
          this.toastr.error('Ocurrió un error al agregar la pérdida revise el stock.', 'Error');
        }
      }
    });

  }


  searchLoss(query: string) {
    const lowerCaseQuery = query.toLowerCase();

    // Define el estado que estás buscando. Aquí asumo que buscas "true" en la query.

    this.filteredLoss = this.loss.filter(loss =>
      loss.CodigoProducto.toLowerCase().includes(lowerCaseQuery) ||
      loss.NombreProducto.toLowerCase().includes(lowerCaseQuery) ||
      // loss.fechaDeBaja ||
      // loss.cantidad ||
      loss.motivo.toLowerCase().includes(lowerCaseQuery)
    );
  }

}
