import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { AlertsService } from '../../shared/alerts/alerts.service';
import { ValidationService } from '../../shared/validators/validations.service';

import { LossService } from './loss.service';
import { Loss } from './loss.model';
import { BarcodesService } from '../barcodes/barcodes.service';
import { Barcode } from '../barcodes/barcode.model';
import { forkJoin } from 'rxjs';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/products.model';

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
  barcode: any[] = [];
  products: any[] = [];

  filteredLoss: Loss[] = [];
  filterCode: Barcode[] = [];

  showModal = false;
  isEditing = false;

  LossForm: FormGroup;

    colums: { field: string, header: string, type: string }[] = [
    { field: 'codigoBarra', header: 'Código', type: 'text' },
    { field: 'nombreProducto', header: 'Producto', type: 'text' },
    { field: 'cantidad', header: 'Cantidad', type: 'text' },
    { field: 'motivo', header: 'Motivo', type: 'text' },
    { field: 'fechaDeBaja', header: 'Fecha', type: 'dateTime' },

  ];

  constructor(
    private lossService: LossService,
    private fb: FormBuilder,
    private alertsService: AlertsService,
    private toastr: ToastrService,
    private validationService: ValidationService,
    private barcodeService: BarcodesService,
    private productService: ProductsService
  ) {
    this.LossForm = this.fb.group({
      CodigoProducto: ['', validationService.getValidatorsForField('loss', 'CodigoProducto')],      
      cantidad: ['', validationService.getValidatorsForField('loss', 'cantidad')],
      fechaDeBaja: new Date(),
      motivo: ['', validationService.getValidatorsForField('loss', 'motivo')],
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    forkJoin({
      loss: this.lossService.getLoss(),
      code: this.barcodeService.getAllBarcodes(),
      products: this.productService.getAllProducts()
    }).subscribe({
      next: ({ loss, code, products }) => {

        this.products = products;
        this.barcode = code.map(c => {
          const product = this.products.find(p => p.idProducto === c.idProducto);
          return { ...c, nombreProducto: product.nombreProducto };
        });

        this.loss = loss.map(repp => {
          const code = this.barcode.find(codes => codes.idCodigoBarra === repp.idCodigoBarra);
          return { 
            ...repp, 
            codigoBarra: code ? code.codigoBarra : 'Desconocido',
            nombreProducto: code ? code.nombreProducto : 'Desconocido'
          };
        });
        this.filteredLoss = this.loss; 
      },
      error: (error) => {
        console.error('Error al cargar los datos', error);
        this.toastr.error('Ocurrió un error al cargar los datos', 'Error');
      }
    })
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
      console.log(lossData)

    request.subscribe({
      next: () => {
        this.toastr.success('Pérdida guardada con éxito!', 'Éxito');
        this.loadData();
        this.closeModal();
      },
      error: (error) => { this.toastr.error(error, 'Error'); }
    });
  }


  searchLoss(query: string) {
    if (!query) {
      this.filteredLoss = [...this.loss]; // Si no hay query, mostrar todos los resultados
      return;
    }
    
    this.filteredLoss = this.loss.filter(loss =>{

      const barCode = loss as unknown as Barcode & {codigoBarra?: string};
      const code =(barCode.codigoBarra || '').toLowerCase().includes(query);
      const productName = loss as unknown as Product & {nombreProducto?: string};
      const product =(productName.nombreProducto || '').toLowerCase().includes(query);
      // loss.NombreProducto.toLowerCase().includes(query.toLowerCase()) ||
      const motivo=loss.motivo.toLowerCase().includes(query.toLowerCase());
      const cantidad =loss.cantidad.toString().includes(query);
      const fecha= loss.fechaDeBaja && new Date(loss.fechaDeBaja).toLocaleDateString().includes(query); // Para la fecha
  
      return code || motivo || product || cantidad || fecha
    });
  
  }
  

}
