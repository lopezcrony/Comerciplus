import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


import { SHARED_IMPORTS } from '../../shared/shared-imports'; // Archivo para las importaciones generales
import { AlertsService } from '../../shared/alerts/alerts.service';


import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { Shopping} from "../shoppings/shopping.model";
import { ShoppingsService} from "../shoppings/shoppings.service";
import { Proveedor} from "../providers/providers.model";
import { Product} from "../products/products.model";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ValidationService } from '../../shared/validators/validations.service';
import { DropdownModule } from 'primeng/dropdown';
import {StyleClassModule} from 'primeng/styleclass';



@Component({
  selector: 'app-shoppings',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    AutoCompleteModule,
    DropdownModule,
    StyleClassModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    IconFieldModule,
    ToggleButtonModule
  ],
  templateUrl: './shoppings.component.html',
  styleUrl: './shoppings.component.css'
})
export class ShoppingsComponent {

  shopping:Shopping[]=[];
  filteredShoppings:Shopping[]=[];
  providers:Proveedor[]=[];
  Products:Product[]=[];

  columns:{ field: string, header: string }[] = [
    { field: 'idProveedor', header: 'Proveedor' },
    { field: 'fechaCompra', header: 'fecha compra' },
    { field: 'fechaRegistro', header: 'fecha registro' },
    { field: 'numeroFactura', header: 'numero factura' },
    { field: 'valorCompra', header: 'valor compra' },
  ];

  shoppingForm:FormGroup;
  viewModal = false;


  constructor(
    private shoppingService:ShoppingsService,
    private fb: FormBuilder,
    private alertsService: AlertsService,
    private toastr: ToastrService,
    private validationService: ValidationService,

  ){
    this.shoppingForm = this.fb.group({
      idCompra: [null],
      idProveedor: ['', this.validationService.getValidatorsForField('shoppings', 'idProveedor')],
      fechaCompra: new Date(),
      numeroFactura: ['', this.validationService.getValidatorsForField('shoppings', 'numeroFactura')],
      estadoCompra: [true],
    });
    
  }




  loadShoppings() {
    this.shoppingService.getAllShoppings().subscribe(data => {
      this.shopping = data;
      this.filteredShoppings = data;
    });
  }

  ngOnInit() {
    this.loadShoppings();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.shoppingForm.get(fieldName);
    return !!(field?.invalid && (field.touched || field.dirty));
  }


  getErrorMessage(fieldName: string): string {
    const control = this.shoppingForm.get(fieldName);
    if (control?.errors) {
      const errorKey = Object.keys(control.errors)[0];
      return this.validationService.getErrorMessage('shopping', fieldName, errorKey);
    }
    return '';
  }


  searchShopping(query: string) {
    let lowerCaseQuery = query.toLowerCase();

    // Intenta convertir la consulta a un número
    // let numericQuery = parseFloat(query);

    this.filteredShoppings = this.shopping.filter(shopping => {
      let numeroFacturaMatch = shopping.numeroFactura?.toLowerCase().includes(lowerCaseQuery);

      // let stockMatch = !isNaN(numericQuery) && shopping.stock != null && Number(shopping.stock) === numericQuery;

      // Retorna verdadero si hay coincidencias
      return numeroFacturaMatch;
    });
  }


  changeShoppingStatus(updatedShopping: Shopping) {
    const estadoShopping = updatedShopping.estadoCompra ?? false;

    this.shoppingService.updateStatusShopping(updatedShopping.idCompra, estadoShopping).subscribe({
      next: () => {
        [this.shopping, this.filteredShoppings].forEach(list => {
          const index = list.findIndex(c => c.idCompra === updatedShopping.idCompra);
          if (index !== -1) {
            list[index] = { ...list[index], ...updatedShopping };
          }
        });
        this.toastr.success('Estado actualizado con éxito', 'Éxito');
      },
      error: () => {
        this.toastr.error('Error al actualizar el estado', 'Error');
      }
    });
  }
}
