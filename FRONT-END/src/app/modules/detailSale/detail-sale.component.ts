import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { AlertsService } from '../../shared/alerts/alerts.service';

import { DetailSale } from './detailSale.model'
import { DetailSalesService } from './detail.Sale.service';
import { Sale } from '../sales/sales.model'
import { SaleService } from '../sales/sales.service'
import { Product } from '../products/products.model';
import { ProductsService } from '../products/products.service';

@Component({
  selector: 'app-detail-sale',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective,
  ],
  templateUrl: './detail-sale.component.html',
  styleUrl: './detail-sale.component.css'
})
export class DetailSaleComponent implements OnInit {

  Sales: Sale[] = [];
  filteredSale: Sale[] = [];

  detailSale: DetailSale[] = []
  filteredDetailSale: any[] = []

  products: Product[] = []

  colums: { field: string, header: string, type: string }[] = [
    { field: 'idVenta', header: 'Nro. Venta', type: 'text' },
    { field: 'fechaVenta', header: 'Fecha', type: 'dateTime' },
    { field: 'totalVenta', header: 'Total', type: 'currency' },

  ];

  showModal = false;
  viewModal = false;
  selectedDetailSales: DetailSale | undefined
  detailModalVisible: boolean = false
  isFieldDisabled: boolean = false;

  constructor(
    private saleService: SaleService,
    private alertsService: AlertsService,
    private detailSaleService: DetailSalesService,
    private toastr: ToastrService,
    private productService: ProductsService
  ) { }

  ngOnInit(): void {
    this.loadSales();
    this.loadProducts();
  }

  loadSales() {
    this.saleService.getSales().subscribe(data => {
      this.Sales = data;
      this.filteredSale = data;
    },
    );
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe(data => {
      this.products = data
      this.loadSales()
    });
  };

  showCategoryModal() {
    this.detailModalVisible = true;
  };

  openShowModal(detailSale: DetailSale) {
    // Asigna el producto seleccionado a una variable para usar en la vista
    this.selectedDetailSales = detailSale;
    // Muestra la modal
    this.detailModalVisible = true;

    // Llama a la función que carga el detalle de la venta por id de venta y llena el array
    this.detailSaleService.getDetailSaleByidSale(detailSale.idVenta).subscribe({
      next: (detailSale) => {
        this.filteredDetailSale = detailSale.map(detailSale => {
          const product = this.products.find(product => product.idProducto === detailSale.idProducto)!;
          return { ...detailSale, nombreProducto: product.nombreProducto };
        });
      },
      error: () => {
        this.toastr.error('Error al cargar el detalle de venta.', 'Error');
      }
    });
  }

  changeSaleStatus(updatedSale: Sale) {

    this.saleService.cancelSale(updatedSale.idVenta).subscribe({
      next: () => {
        this.loadSales();
        this.toastr.success(`Venta anulada con éxito.`, 'Éxito');
      },
      error: () => {
        this.toastr.error(`Error al anular la venta.`, 'Error');
      }
    });
  }

  cancelSale(updatedSale: Sale) {
    // Mostrar mensaje de confirmación
    this.alertsService.confirm(
      `¿Estás seguro de que deseas cancelar la venta?`,

      () => {
        updatedSale.estadoVenta = false; 
        this.changeSaleStatus(updatedSale);

        this.saleService.cancelSale(updatedSale.idVenta).subscribe({
          next: () => {
            this.loadSales();
            this.toastr.success('Venta anulada con éxito.', 'Éxito');
          },
          error: () => {
            this.toastr.error('Error al anular la venta.', 'Error');
          }
        });
        
      },
      () => {
        this.toastr.info('Anulación cancelada', 'Información');
      }
    );
  }


  searchDetailSale(query: string) {
    const lowerCaseQuery = query.toLowerCase();

    // Define el estado que estás buscando. Aquí asumo que buscas "true" en la query.

    this.filteredSale = this.Sales.filter(detailSale =>
      detailSale.totalVenta.toString().includes(lowerCaseQuery) ||
      detailSale.fechaVenta && new Date(detailSale.fechaVenta).toLocaleDateString().includes(lowerCaseQuery) ||
      detailSale.estadoVenta
    );
  }

}
