import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { OrderListModule } from 'primeng/orderlist';
import { forkJoin } from 'rxjs';

import { SHARED_IMPORTS } from '../../shared/shared-imports';

import { DetailSale } from '../detailSale/detailSale.model';
import { Product } from '../products/products.model';
import { Credit } from '../credits/credit.model';
import { Client } from '../clients/client.model';

import { ProductsService } from '../products/products.service';
import { CreditsService } from '../credits/credits.service';
import { ClientService } from '../clients/clients.service';
import { SalesService } from './sales.service';
import { Sale } from './sales.model';
import { DetailSalesService } from '../detailSale/detail.Sale.service';



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

  products: any[] = [];
  clients: Client[] = [];
  credits: Credit[] = [];
  detailSale: DetailSale[] = [];

  filteredProducts: Product[] = [];
  filteredClients: Client[] = [];
  filteredCredits: Credit[] = [];


  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private salesService: SalesService,
    private productService: ProductsService,
    private creditService: CreditsService,
    private clientService: ClientService,
    private detailSalesService: DetailSalesService,


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

  searchProduct(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.nombreProducto.toLowerCase().includes(query)
    );
  }

  addProductSale(event: AutoCompleteSelectEvent) {
    const product = event.value as Product;
    const existingItem = this.detailSale.find(item => item.idCodigoBarra === product.idProducto);
  
    if (existingItem) {
      existingItem.cantidadProducto++;
      existingItem.subtotal = existingItem.cantidadProducto * product.precioVenta;
    } else {
      const nuevoItem: DetailSale = {
        idVenta: this.getCurrentSaleId(), // Implementar este método
        idCodigoBarra: product.idProducto,
        cantidadProducto: 1,
        subtotal: product.precioVenta
      };
      this.detailSale.push(nuevoItem);
    }
  
    this.actualizarTotal();
    this.busquedaForm.reset();
  }
  
  actualizarSubtotal(item: DetailSale) {
    const product = this.products.find(p => p.idProducto === item.idCodigoBarra);
    if (product) {
      item.subtotal = item.cantidadProducto * product.precioVenta;
      this.actualizarTotal();
    }
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
  };

  searchCreditClient(event: AutoCompleteCompleteEvent) {
    const query = event.query.toLowerCase();
    this.filteredCredits = this.credits.filter(credit => {
      const creditWithClientName = credit as Credit & { nombreCliente?: string };
      return (creditWithClientName.nombreCliente || '').toLowerCase().includes(query);
    });
  };

  createSale() {
    if (this.detailSale.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No hay productos en la venta' });
      return;
    }

    if (this.esVentaCredito && !this.clienteSeleccionado) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un cliente para venta a crédito' });
      return;
    }

    // Aquí iría la lógica para crear la venta

    const totalVenta = this.total; 

  // Crear el objeto de la venta
  const nuevaVenta: Sale = {
    idVenta: 0, // Lo generará la base de datos
    fechaVenta: new Date(),
    totalVenta: totalVenta,
  };

  // Llamar al servicio para guardar la venta en la base de datos
  this.salesService.createSale(nuevaVenta).subscribe(
    async response => {
      const generatedSaleId =await response.idVenta; // Obtener el idVenta generado por la base de datos

      // Ahora que tenemos el idVenta, guardar los detalles de los productos
      this.saveSaleDetails(generatedSaleId);
      console.log(nuevaVenta)
      this.messageService.add({ severity: 'success', summary: 'Venta Registrada', detail: 'La venta se registró correctamente' });
      // Limpiar los datos después de la venta
      
    },
    error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar la venta' });
    }
  );
  }

  saveSaleDetails(idVenta: number) {
    const saleDetails: DetailSale[] = this.detailSale.map(item => ({
      idVenta: idVenta,
      idCodigoBarra: item.idCodigoBarra,
      cantidadProducto: item.cantidadProducto,
      subtotal: item.subtotal
    }));
    console.log(saleDetails)

  
    // Llamar al servicio para guardar todos los detalles de la venta
    this.detailSalesService.createDetailSale(saleDetails).subscribe(
      response => {
        console.log(saleDetails)
        this.clearSale()

        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Venta registrada correctamente' });
      },
      error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar el detalle de la venta' });
      }
    );
  }
  
  

  clearSale() {
    this.detailSale = []; // Limpia la lista de productos en la venta
    this.total = 0; // Reinicia el total de la venta
    this.clienteSeleccionado = null; // Limpia la selección del cliente si hay
    this.esVentaCredito = false; // Reinicia la selección de venta a crédito si corresponde
  }
  

  actualizarTotal() {
    this.total = this.detailSale.reduce((sum, item) => sum + item.subtotal, 0);
  }

  toggleVentaCredito() {
    this.esVentaCredito = !this.esVentaCredito;
    if (!this.esVentaCredito) {
      this.montoCredito = 0;
      this.clienteSeleccionado = null;
    }
  }

  getCurrentSaleId(): number {
    // Implementar para obtener el ID de la venta actual
    return 1; // Valor de ejemplo
  }

  limpiarVenta() {
    this.detailSale = [];
    this.total = 0;
    this.esVentaCredito = false;
    this.clienteSeleccionado = null;
    this.montoCredito = 0;
    this.busquedaForm.reset();
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

  }

  imprimirRecibo(){}

  // Agregar métodos para obtener nombre y precio del producto
getProductName(idCodigoBarra: number): string {
  const product = this.products.find(p => p.idProducto === idCodigoBarra);
  return product ? product.nombreProducto : 'Desconocido';
}

getProductPrice(idCodigoBarra: number): number {
  const product = this.products.find(p => p.idProducto === idCodigoBarra);
  return product ? product.precioVenta : 0;
}

// Agregar el método para eliminar un producto de la venta
removeProductFromSale(item: DetailSale) {
  this.detailSale = this.detailSale.filter(i => i !== item);
  this.actualizarTotal();
}

}
