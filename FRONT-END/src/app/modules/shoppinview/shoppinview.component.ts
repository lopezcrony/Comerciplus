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
    shoppingdetails: any[] = [];
    viewModal = false;
    selectedShopping: Shopping | undefined;



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
      { field: 'nombreProveedor', header: 'Proveedor' },
      { field: 'fechaCompra', header: 'Fecha Compra' },  
      { field: 'fechaRegistro', header: 'Fecha Registro' },  
      { field: 'numeroFactura', header: 'Nro. Factura' },  
      { field: 'valorCompra', header: 'Valor Compra' },  
    ];


    openShopping() {
      this.router.navigate(['/shoppings']); // Navega a la ruta del componente ShoppinviewComponent
    }

    openShowModal(shopping: Shopping) {
      // Asigna el producto seleccionado a una variable para usar en la vista
      this.selectedShopping = shopping;
      // Muestra la modal
      this.viewModal = true;


      this.shoppingService.getShoppingdetailsByShopping(shopping.idCompra).subscribe({
        next: (data) => {
          this.shoppingdetails = data;
        },
        error: (err) => {
          this.toastr.error('Error al cargar los detalles de compra.');
        }
      });
    }

    loadShoppings() {
      this.shoppingService.getAllShoppings().subscribe(data => {
        this.shoppings = data.map(shopping => {
          const provider = this.providers.find(p => p.idProveedor === shopping.idProveedor);
          return { ...shopping, nombreProveedor: provider.nombreProveedor };
        });
        this.filteredShoppings = this.shoppings;
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
        this.filteredProducts = this.products; 
      });
    }

    getProductName(idProducto: number): string {
      const product = this.products.find(p => p.id === idProducto);
      return product ? product.nombreProducto : 'Desconocido'; // Cambia 'name' si el campo es diferente
    }
    

    ngOnInit() {
      this.loadProviders();
      this.loadProducts();
      this.loadShoppings();
    }

    changeShoppingStatus(shopping: Shopping) {
      if (shopping.estadoCompra === false) {
        this.toastr.warning('La compra ya está anulada y no puede cambiarse de estado.', 'Advertencia');
        return;
      }

      // Confirmar la acción con el usuario
      if (confirm('¿Está seguro de que desea anular esta compra? Esta acción no se puede deshacer.')) {
        this.shoppingService.updateStatusShopping(shopping.idCompra, false).subscribe({
          next: () => {
            this.loadShoppings(); // Recargar la lista de compras para reflejar el cambio
            this.toastr.success('Compra anulada con éxito.', 'Éxito');
          },
          error: () => {
            this.toastr.error('Error al anular la compra.', 'Error');
          }
        });
      }
    }

    // cancelShopping(shopping: Shopping) {

    //   this.shoppingService.cancelShopping(shopping.idCompra).subscribe({
    //     next: () => {
    //       this.loadShoppings(); // Recargar la lista de compras para reflejar el cambio
    //       this.toastr.success('Compra anulada con éxito.', 'Éxito');
    //     },
    //     error: () => {
    //       this.toastr.error('Error al anular la compra.', 'Error');
    //     }
    //   });
    // }

    // Verifica si el botón de cambio de estado debe estar deshabilitado
    isChangeStatusDisabled(shopping: Shopping): boolean {
      return shopping.estadoCompra === false; // Deshabilitar si está anulado
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
