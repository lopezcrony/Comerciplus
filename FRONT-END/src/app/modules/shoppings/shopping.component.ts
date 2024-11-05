  import { Component, OnInit } from '@angular/core';
  import { Router } from '@angular/router'; 
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { forkJoin } from 'rxjs';
  import { ToastrService } from 'ngx-toastr';

  import { CRUDComponent } from '../../shared/crud/crud.component';
  import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
  import { SHARED_IMPORTS } from '../../shared/shared-imports';
  import { ValidationService } from '../../shared/validators/validations.service';
  import { AlertsService } from '../../shared/alerts/alerts.service';

  import { ProductsService } from '../products/products.service';
  import { ShoppingsService } from './shoppings.service';
  import { ProvidersService } from '../providers/providers.service';
  import { Shopping } from './shopping.model';
  import { jsPDF } from 'jspdf';

  @Component({
    selector: 'app-shoppinview',
    standalone: true,
    imports: [
      ...SHARED_IMPORTS,
      CRUDComponent,
      CrudModalDirective,
    ],
    templateUrl: './shopping.component.html'
  })
  export class ShoppinviewComponent implements OnInit {

    shoppingForm: FormGroup;
    shoppings:Shopping[]=[];
    filteredProducts: any[] = [];
    filteredShoppings: Shopping[] = [];
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
      private ValidationService: ValidationService,
      private alertsService: AlertsService
    ) {
      this.shoppingForm = this.fb.group({
        idProveedor: ['', Validators.required],
        fechaCompra: ['', Validators.required],
        numeroFactura: ['', Validators.required],
        valorCompra: [{ value: 0, disabled: false }],
        detalles: this.fb.array([]) // FormArray para los detalles
      });
    }

    columns: { field: string, header: string, type: string }[] = [
      { field: 'nombreProveedor', header: 'Proveedor', type: 'text' },
      { field: 'fechaCompra', header: 'Fecha Compra', type: 'date' },  
      { field: 'fechaRegistro', header: 'Fecha Registro', type: 'date' },  
      { field: 'numeroFactura', header: 'Nro. Factura', type: 'text' },  
      { field: 'valorCompra', header: 'Valor Compra', type: 'currency' },  
    ];

    // Asegura que se cargue toda la información antes de ser mostrada
    loadAllData() {
      forkJoin({
        providers: this.providerService.getAllProviders(),
        products: this.productService.getAllProducts(),
        shoppings: this.shoppingService.getAllShoppings()
      }).subscribe(({ providers, products, shoppings }) => {
        this.providers = providers.filter(p => p.estadoProveedor === true);
        this.products = products.filter(pr => pr.estadoProducto === true);
        this.filteredProducts = this.products;
    
        this.shoppings = shoppings.map(shopping => {
          const provider = this.providers.find(p => p.idProveedor === shopping.idProveedor);
          return { ...shopping, nombreProveedor: provider ? provider.nombreProveedor : 'Desconocido' };
        });
        this.filteredShoppings = this.shoppings;
      });
    }

    ngOnInit() {
      this.loadAllData();
    }

    openShopping() {
      this.router.navigate(['/shoppings']); // Navega a la ruta del componente ShoppinviewComponent
    }


    // metodo para el pdf
  downloadPDF() {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Reporte de Compras', 10, 10);

    let yPosition = 20; // Inicializa la posición Y para el texto

    this.shoppings.forEach(compra => {
      doc.setFontSize(12);
      doc.text(`Proveedor: ${compra.idProveedor}`, 10, yPosition);
      doc.text(`Fecha de Compra: ${compra.fechaCompra}`, 10, yPosition + 10);
      doc.text(`Número de Factura: ${compra.numeroFactura}`, 10, yPosition + 20);
      doc.text(`Valor de Compra: ${compra.valorCompra}`, 10, yPosition + 30);
      yPosition += 40; // Espacio para la siguiente compra

      yPosition += 10; // Espacio extra entre compras
    });

    doc.save('reporte_compras.pdf');
  }

    openShowModal(shopping: Shopping) {
      // Asigna el producto seleccionado a una variable para usar en la vista
      this.selectedShopping = shopping;
      // Muestra la modal
      this.viewModal = true;

      this.shoppingService.getShoppingdetailsByShopping(shopping.idCompra).subscribe({
        next: (data) => {
          this.shoppingdetails = data.map(detail => {
            const product = this.products.find(p => p.idProducto === detail.idProducto);
            return { ...detail, nombreProducto: product ? product.nombreProducto : 'Desconocido' };
          });
        },
        error: (err) => {
          this.toastr.error('Error al cargar los detalles de compra.');
        }
      });
    }

    cancelShopping(shopping: Shopping) {

      this.alertsService.confirm(
        `¿Estás seguro de anular esta compra?`,
        () => {
          this.shoppingService.cancelShopping(shopping.idCompra).subscribe({
            next: () => {
              this.loadAllData();
              this.toastr.success('Compra anulada con éxito.', 'Éxito');
            },
            error: () => {
              this.toastr.error('Error al anular la compra.', 'Error');
            }
          });
        }
      );
    }

    searchShopping(query: string) {
      let lowerQuery = query.toLowerCase();

      // Intenta convertir la consulta a un número
      let numericQuery = parseFloat(query);

      this.filteredShoppings = this.shoppings.filter(shopping => {
        const proveedor= shopping as Shopping & { nombreProveedor?: string };

        let idProveedor = !isNaN(numericQuery) && shopping.idProveedor != null && Number(shopping.idProveedor) === numericQuery;
        // Comparación numérica para el stock
        let numeroFactura = !isNaN(numericQuery) && shopping.numeroFactura != null && Number(shopping.numeroFactura) === numericQuery;

        // Retorna verdadero si hay coincidencia en nombreProducto o stock
        const matchproveedor =(proveedor.nombreProveedor ||'').toLowerCase().includes(lowerQuery);
        return idProveedor || numeroFactura ||matchproveedor;
      });
    }

  }
