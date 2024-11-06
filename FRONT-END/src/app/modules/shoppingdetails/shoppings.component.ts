import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { ValidationService } from '../../shared/validators/validations.service';

import { Shopping } from '../shoppings/shopping.model';
import { ShoppingsService } from '../shoppings/shoppings.service';
import { ProvidersService } from '../providers/providers.service';
import { ProductsService } from '../products/products.service';

import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective,
    RouterModule
  ],
  templateUrl: './shopping.create.component.html',
  styleUrls: ['./shoppings.component.css'],
})
export class ShoppingsComponent implements OnInit {
  shoppingForm: FormGroup;
  shoppings: Shopping[] = [];
  providers: any[] = [];
  products: any[] = [];
  filteredProducts: any[] = [];
  filteredShoppings: any[] = [];

  constructor(
    private fb: FormBuilder,
    private shoppingService: ShoppingsService,
    private providerService: ProvidersService,
    private productService: ProductsService,
    private toastr: ToastrService,
    private validationService: ValidationService
  ) {
    this.shoppingForm = this.fb.group({
      shopping: this.fb.group({
        idProveedor: ['', Validators.required],
        fechaCompra: [null, Validators.required],
        numeroFactura: ['', Validators.required],
        valorCompra: [{ value: 0, disabled: true }],
      }),
      shoppingDetail: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadData();
    this.addShoppingDetail();
  }

  get shoppingDetailArray() {
    return this.shoppingForm.get('shoppingDetail') as FormArray;
  }

  loadShoppings() {
    this.shoppingService.getAllShoppings().subscribe((data: any) => {
      this.shoppings = data; // Asegúrate de que el formato sea correcto
    });
  }

  loadData(){
    forkJoin({
      providers: this.providerService.getAllProviders(),
      products: this.productService.getAllProducts(),
      shoppings: this.shoppingService.getAllShoppings()
    }).subscribe(({ providers, products, shoppings }) => {
      this.providers = providers.filter(p => p.estadoProveedor === true);
      this.products = products.filter(pr => pr.estadoProducto === true);
      this.filteredShoppings = shoppings;
  })
  }

  searchProduct(event: any) {
    const query = event.query.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.nombreProducto.toLowerCase().includes(query)
    );
  }

  createShoppingDetail(): FormGroup {
    return this.fb.group({
      idProducto: ['', Validators.required],
      codigoBarra: ['', Validators.required],
      cantidadProducto: ['', [Validators.required, Validators.min(1)]],
      precioCompraUnidad: ['', [Validators.required, Validators.min(0.01)]],
      subtotal: [{ value: 0, disabled: true }]
    });
  }

  addShoppingDetail() {
    this.shoppingDetailArray.push(this.createShoppingDetail());
  }

  removeShoppingDetail(index: number) {
    this.shoppingDetailArray.removeAt(index);
    this.calculateTotalValue();
  }

  calculateSubtotal(index: number) {
    const detailGroup = this.shoppingDetailArray.at(index);
    const cantidad = detailGroup.get('cantidadProducto')?.value || 0;
    const precio = detailGroup.get('precioCompraUnidad')?.value || 0;
    const subtotal = cantidad * precio;
  
    detailGroup.patchValue({ subtotal });
  
    // Calcula el total después de actualizar el subtotal
    this.calculateTotalValue();
  }
  
  calculateTotalValue() {
    const shoppingDetailArray = this.shoppingForm.get('shoppingDetail') as FormArray;
    const valorCompra = shoppingDetailArray.controls.reduce((acc, control) => {
      const subtotal = control.get('subtotal')?.value || 0;
      return acc + subtotal;
    }, 0);
  
    // Actualiza el valor de compra en el control correspondiente
    this.shoppingForm.get('shopping.valorCompra')?.setValue(valorCompra);
  }
  
  saveShopping() {
    if (this.shoppingForm.invalid) {
      this.markFormFieldsAsTouched(this.shoppingForm);
      return;
    }

    const formValue = this.shoppingForm.getRawValue();
    
    const shoppingData = formValue.shopping;

    const shoppingDetails = formValue.shoppingDetail.map((detail: { idProducto: { idProducto: any; }; }) => ({
      ...detail,
      idProducto: detail.idProducto.idProducto
    }));

    if (shoppingDetails.length === 0) {
      this.toastr.error('Debe agregar al menos un detalle de compra.', 'Error');
      return;
    }

    this.shoppingService.createShopping(shoppingData, shoppingDetails).subscribe({
      next: (response) => {
        console.log('Respuesta exitosa:', response);
        this.toastr.success('Compra y detalles guardados exitosamente.', 'Éxito');
        this.resetForm();
      },
      error: (error) => {
        this.toastr.error(`El numero de factura ya existe`, 'Error');
      }
    });
  }

  resetForm() {
    this.shoppingForm.reset();
    this.shoppingDetailArray.clear();
    this.addShoppingDetail();
  }

  changeShoppingStatus(updatedShopping: Shopping) {
    const estadoShopping = updatedShopping.estadoCompra ?? false;

    this.shoppingService.updateStatusShopping(updatedShopping.idCompra, estadoShopping).subscribe({
      next: () => {
        [this.shoppings, this.filteredShoppings].forEach(list => {
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

  searchShopping(query: string) {
    const lowerCaseQuery = query.toLowerCase();
    const numericQuery = parseFloat(query);

    this.filteredShoppings = this.shoppings.filter(shopping => {
      const idProveedor = !isNaN(numericQuery) && shopping.idProveedor != null && Number(shopping.idProveedor) === numericQuery;
      const numeroFactura = !isNaN(numericQuery) && shopping.numeroFactura != null && Number(shopping.numeroFactura) === numericQuery;

      return idProveedor || numeroFactura;
    });
  }

  markFormFieldsAsTouched(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormFieldsAsTouched(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }

  isFieldInvalid(formGroup: string, fieldName: string): boolean {
    const field = this.shoppingForm.get(`${formGroup}.${fieldName}`);
    return !!(field?.invalid && (field.touched || field.dirty));
  }

  getErrorMessage(formGroup: string, fieldName: string): string {
    const control = this.shoppingForm.get(`${formGroup}.${fieldName}`);
    if (control?.errors) {
      const errorKey = Object.keys(control.errors)[0];
      return this.validationService.getErrorMessage('shopping', fieldName, errorKey);
    }
    return '';
  }
}