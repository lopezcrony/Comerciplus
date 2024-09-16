import { Component, OnInit } from '@angular/core';
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ProductsService } from '../products/products.service';
import { ShoppingsService } from '../shoppings/shoppings.service';
import { ProvidersService } from '../providers/providers.service';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { ValidationService } from '../../shared/validators/validations.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Shopping } from '../shoppings/shopping.model';
import { Router } from '@angular/router'; 



@Component({
  selector: 'app-shoppinview',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,
    DropdownModule,
    CrudModalDirective,
    AutoCompleteModule
  ],
  templateUrl: './shoppinview.component.html',
  styleUrl: './shoppinview.component.css'
})
export class ShoppinviewComponent implements OnInit {

  shoppingForm: FormGroup;
  shoppings:Shopping[]=[];
  filteredProducts: any[] = [];
  filteredShoppings: any[] = [];
  providers: any[] = [];
  products: any[] = [];


  constructor(
    private fb: FormBuilder,
    private router : Router,
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
  }

  columns: { field: string, header: string }[] = [
    { field: 'idProveedor', header: 'Proveedor' },
    { field: 'fechaCompra', header: 'fecha compra' },  
    { field: 'fechaRegistro', header: 'fecha registro' },  
    { field: 'numeroFactura', header: 'Nro.factura' },  
    { field: 'valorCompra', header: 'valor' },  
  ];


  openShopping() {
    this.router.navigate(['/shoppings']); // Navega a la ruta del componente ShoppinviewComponent
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


}
