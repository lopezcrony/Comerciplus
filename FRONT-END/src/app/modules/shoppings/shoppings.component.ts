import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { ShoppingsService } from './shoppings.service';
// import {ShoppingdetailsService } from '../shoppingdetails/shoppingdetails.service';
import { ProvidersService } from '../providers/providers.service';
import { ProductsService } from '../products/products.service';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { ValidationService } from '../../shared/validators/validations.service';
import { Shopping } from './shopping.model';
import { Shoppingdetails } from '../shoppingdetails/model';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    DropdownModule,
    AutoCompleteModule,
    CRUDComponent,
    CrudModalDirective
  ],
  templateUrl: './shoppingscreate.component.html',
  styleUrls: ['./shoppings.component.scss'],
  providers: [MessageService]
})
export class ShoppingsComponent implements OnInit {

  shoppingForm: FormGroup;
  shoppingDetailsForm: FormGroup;
  shoppings:Shopping[]=[];
  shoppingsDetails:Shoppingdetails[]=[];
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
    private messageService: MessageService,
    private ValidationService: ValidationService
  ) {
    this.shoppingForm = this.fb.group({
      idProveedor: ['', Validators.required],
      fechaCompra: ['', Validators.required],
      numeroFactura: ['', Validators.required],
      valorCompra: [{ value: 0, disabled: false }],
      detalles: this.fb.array([]) // FormArray para los detalles
    });
    this.shoppingDetailsForm = this.fb.group({
      idDetalleCompra: ['', Validators.required],
      idCompra: ['', Validators.required],
      idProducto: ['', Validators.required],
      codigoBarra: ['', Validators.required],
      cantidadProducto: ['', Validators.required],
      precioCompraUnidad: ['', Validators.required],
    });
  }


  loadShoppings() {
    this.shoppingService.getAllShoppings().subscribe(data => {
      this.shoppings = data;
      this.filteredShoppings = data;
    });
  }

  // Métodos para cargar proveedores y productos
  loadProviders() {
    this.providerService.getAllProviders().subscribe(data => {
      this.providers = data.filter(p=>p.estadoProveedor === true);
    });
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe(data => {
      this.products = data.filter(pr => pr.estadoProducto === true);
      this.filteredProducts = this.products; // Inicializa con todos los productos
    });
  }

  ngOnInit() {
    this.loadShoppings();
    this.loadProviders();
    this.loadProducts();
    this.addShoppingDetail(); // Añadimos un detalle inicial
  }

  searchProduct(event: any) {
    const query = event.query.toLowerCase(); // Obtener la búsqueda en minúsculas
    this.filteredProducts = this.products.filter(product => 
      product.nombreProducto.toLowerCase().includes(query)
    );
  }

  // Getter para acceder al FormArray de detalles
  get detalles(): FormArray {
    return this.shoppingForm.get('detalles') as FormArray;
  }

  // Método para crear un FormGroup de detalle
  createShoppingDetail(): FormGroup {
    return this.fb.group({
      idProducto: ['', Validators.required],
      codigoBarra: ['', Validators.required],
      cantidadProducto: ['', [Validators.required, Validators.min(1)]],
      precioCompraUnidad: ['', [Validators.required, Validators.min(0.01)]],
      subtotal: [{ value: 0, disabled: true }]
    });
  }

  // Añadir un nuevo detalle
  addShoppingDetail() {
    this.detalles.push(this.createShoppingDetail());
  }

  // Eliminar un detalle específico
  removeShoppingDetail(index: number) {
    this.detalles.removeAt(index);
  }

  // Método para calcular el subtotal de un detalle
  calculateSubtotal(index: number) {
    const detailGroup = this.detalles.at(index);
    const cantidad = detailGroup.get('cantidadProducto')?.value || 0;
    const precio = detailGroup.get('precioCompraUnidad')?.value || 0;
    const subtotal = cantidad * precio;

    detailGroup.patchValue({ subtotal });
  }

  // Método para guardar la compra y detalles
  saveShopping() {
    if (this.shoppingForm.invalid) {
      this.markFormFieldsAsTouched(this.shoppingForm);
      return;
    }

    const shoppingData = this.shoppingForm.getRawValue();

    this.shoppingService.createShopping(shoppingData).subscribe({
      next: () => {
        this.toastr.success('Compra y detalles guardados exitosamente.', 'Éxito');
        this.shoppingForm.reset();
        this.detalles.clear();
        this.addShoppingDetail(); // Añadimos un detalle vacío después de guardar
      },
      error: (error) => {
        this.toastr.error(error.message, 'Error');
      }
    });
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
    let lowerCaseQuery = query.toLowerCase();

    // Intenta convertir la consulta a un número
    let numericQuery = parseFloat(query);

    this.filteredShoppings = this.shoppings.filter(shopping => {

      let idProveedor = !isNaN(numericQuery) && shopping.idProveedor != null && Number(shopping.idProveedor) === numericQuery;
      // Comparación numérica para el stock
      let numeroFactura = !isNaN(numericQuery) && shopping.numeroFactura != null && Number(shopping.numeroFactura) === numericQuery;

      // Retorna verdadero si hay coincidencia en nombreProducto o stock
      return idProveedor || numeroFactura;
    });
  }

  // Método para marcar los campos como tocados y mostrar los errores
  markFormFieldsAsTouched(form: FormGroup | FormArray) {
    Object.values(form.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormFieldsAsTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }

  // Método para verificar si un campo es inválido
 isFieldInvalid(fieldName: string): boolean {
    const field = this.shoppingForm.get(fieldName);
    return !!(field?.invalid && (field.touched || field.dirty));
  }

  // Obtener mensaje de error
  getErrorMessage(fieldName: string): string {
    const control = this.shoppingForm.get(fieldName);
    if (control?.errors) {
      const errorKey = Object.keys(control.errors)[0];
      return this.ValidationService.getErrorMessage('shopping', fieldName, errorKey);
    }
    return '';
  }
}
