import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { OrderListModule } from 'primeng/orderlist';
import { catchError, forkJoin, throwError } from 'rxjs';

import { SHARED_IMPORTS } from '../../shared/shared-imports';

import { DetailSale } from '../detailSale/detailSale.model';
import { Product } from '../products/products.model';
import { Credit } from '../credits/credit.model';
import { Client } from '../clients/client.model';

import { ProductsService } from '../products/products.service';
import { CreditsService } from '../credits/credits.service';
import { ClientService } from '../clients/clients.service';
import { SaleService } from './sales.service';
import { Sale } from './sales.model';
import { DetailSalesService } from '../detailSale/detail.Sale.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sales',
  standalone: true,
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  imports: [
    ...SHARED_IMPORTS,
    DropdownModule,
    AutoCompleteModule,
    CheckboxModule,
    OrderListModule,
  ]
})
export class SalesComponent implements OnInit {
  busquedaForm: FormGroup;
  total: number = 0;
  esVentaCredito: boolean = false;
  montoCredito: number = 0;
  clienteSeleccionado: any = null;
  imprimirRecibo: boolean = false;

  products: Product[] = [];
  clients: Client[] = [];
  credits: Credit[] = [];
  detailSale: any[] = [];

  filteredProducts: Product[] = [];
  filteredClients: Client[] = [];
  filteredCredits: Credit[] = [];
  filteredBarcodes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    private productService: ProductsService,
    private creditService: CreditsService,
    private clientService: ClientService,
    private detailSalesService: DetailSalesService,
    private toastr: ToastrService
  ) {
    this.busquedaForm = this.fb.group({
      busqueda: ['']
    });
  }

  ngOnInit() {
    this.loadProducts();
    this.loadCreditsClients();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe(data => {
      this.products = data.filter(p => p.estadoProducto === true);
    });
  }

  searchProduct(event: any): void {
    const query = event.query.toLowerCase();

    this.filteredProducts = this.products.filter(p =>
      p.nombreProducto.toLowerCase().includes(query)
    );
    // AQUÍ se implementará la función para buscar un producto por código de barras
    // this.barcodeService.searchProductByBarcode(event.query).subscribe(barcodes => {
    //   this.filteredBarcodes = barcodes;
    // });
  };

  addProductSale(event: any): void {
    const product = event.value ? event.value : event; // Extraer el producto de event.value si está presente
    const existingProduct = this.detailSale.find(item => item.idProducto === product.idProducto);
    
    console.log('Producto:', product);

    if (existingProduct) {
        existingProduct.cantidadProducto++;
        this.updateSubtotal(existingProduct);
    } else {
        const newDetail = {
            idProducto: product.idProducto,
            nombreProducto: product.nombreProducto,
            precioVenta: product.precioVenta,
            cantidadProducto: 1,
            subtotal: product.precioVenta
        };
        this.detailSale.push(newDetail);
        console.log(newDetail);
    }
  
    this.updateTotal();
}

  
  updateSubtotal(item: any): void {
    item.subtotal = item.cantidadProducto * item.precioVenta;
    this.updateTotal();
  }

  removeProductFromSale(item: DetailSale) {
    this.detailSale = this.detailSale.filter(i => i !== item);
    this.updateTotal();
  }

  updateTotal(): void {
    this.total = this.detailSale.reduce((sum, item) => sum + item.subtotal, 0);
  }


  loadCreditsClients() {
    forkJoin({
      clients: this.clientService.getAllClients(),
      credits: this.creditService.getAllCredits()
    }).subscribe(({ clients, credits }) => {
      this.clients = clients;
      this.credits = credits.map(credit => {
        const client = this.clients.find(c => c.idCliente === credit.idCliente);
        return {
          ...credit,
          nombreCliente: client ? `${client.nombreCliente} ${client.apellidoCliente}` : '',
          cedulaCliente: client ? client.cedulaCliente : ''
        };
      });
      this.filteredCredits = this.credits;
    });
  }

  searchCreditClient(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.filteredCredits = this.credits.filter(credit => {
      const creditWithClientName = credit as Credit & { nombreCliente?: string };
      return (creditWithClientName.nombreCliente || '').toLowerCase().includes(query);
    });
  }

  createSale() {

    if (this.detailSale.length === 0) this.toastr.error('No hay productos en la venta', 'Error');

    if (this.esVentaCredito && !this.clienteSeleccionado) this.toastr.error('Debe seleccionar un cliente para venta a crédito', 'Error');

    const saleData = {
        fechaVenta: new Date()
    };

    this.saleService.createSale(saleData).subscribe({
        next: (response) => {
            const idSale = response.idVenta;
            
            const detailRequests = this.detailSale.map(detail => {
                const detailData = {
                    idVenta: idSale,
                    idProducto: detail.idProducto,
                    cantidadProducto: detail.cantidadProducto,
                    subtotal: detail.subtotal
                };
                
                return this.detailSalesService.createDetailSale(detailData).pipe(
                    catchError(error => {
                        this.toastr.error(`No se pudo registrar el detalle de la venta: ${error.message}`, 'Error');
                        return throwError(() => new Error(error.message));
                    })
                );
            });

            forkJoin(detailRequests).subscribe({
                next: () => {
                    this.toastr.success('Venta registrada correctamente', 'Éxito');
                    this.resetForm();
                },
                error: (error) => {
                    this.toastr.error(`${error.message}`, 'Error');
                }
            });
        },
        error: () => {
            this.toastr.error('No se pudo registrar la venta', 'Error');
        }
    });
}


  resetForm(): void {
    this.busquedaForm.reset();
    this.detailSale = [];
    this.total = 0;
    this.esVentaCredito = false;
    this.clienteSeleccionado = null;
    this.montoCredito = 0;
    this.imprimirRecibo = false;
  }


  

  toggleVentaCredito() {
    this.esVentaCredito = !this.esVentaCredito;
    if (!this.esVentaCredito) {
      this.montoCredito = 0;
      this.clienteSeleccionado = null;
    }
  }

  mostrarModalAsignarCredito: boolean = false;

  mostrarModalCredito() {
    this.mostrarModalAsignarCredito = true;
  }

  cancelarAsignacionCredito() {
    this.mostrarModalAsignarCredito = false;
  }

  confirmarAsignacionCredito() {
    this.mostrarModalAsignarCredito = false;
  }

  cambiarCantidad(item: DetailSale, incremento: number) {
    const product = this.products.find(p => p.idProducto === item.idProducto);
    if (product) {
      item.cantidadProducto += incremento;
      if (item.cantidadProducto <= 0) {
        this.removeProductFromSale(item);
      } else {
        item.subtotal = item.cantidadProducto * product.precioVenta;
        this.updateTotal();
      }
    }
  }

  // imprimirRecibo() {
  //   // Implementar lógica para imprimir recibo
  // }

  getProductName(idProducto: number): string {
    const product = this.products.find(p => p.idProducto === idProducto);
    return product ? product.nombreProducto : 'Desconocido';
  }

  getProductPrice(idProducto: number): number {
    const product = this.products.find(p => p.idProducto === idProducto);
    return product ? product.precioVenta : 0;
  }


}
