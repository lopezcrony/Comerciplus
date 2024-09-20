import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { SHARED_IMPORTS } from '../../shared/shared-imports'; // Archivo para las importaciones generales
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { AlertsService } from '../../shared/alerts/alerts.service';
import {DetailSale} from './detailSale.model'
import { DetailSalesService } from './detail.Sale.service';
import {Sale} from '../sales/sales.model'
import {SaleService} from '../sales/sales.service'
import { ConfirmationService } from 'primeng/api';
import { Product } from '../products/products.model';
import { ProductsService } from '../products/products.service';
import { forkJoin } from 'rxjs';


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
export class DetailSaleComponent implements OnInit{

Sales: Sale[]=[];
filteredSale: Sale[]=[];

detailSale: DetailSale[]=[]
filteredDetailSale: DetailSale[] =[]

products: Product[]=[]



colums: { field: string, header: string }[] = [
  { field: 'idVenta', header: '#Venta' },
  { field: 'fechaVenta', header: 'Fecha' },
  { field: 'totalVenta', header: 'Total' },
    
];

showModal = false;
viewModal = false;
selectedDetailSales: DetailSale | undefined
detailModalVisible: boolean =false
isFieldDisabled: boolean = false;


constructor(
  private saleService:SaleService,
  private confirmationService: ConfirmationService,
  private detailSaleService:DetailSalesService,
  private toastr: ToastrService,
  private productService: ProductsService
){}


ngOnInit(): void {
  this.loadSales()
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
    this.products = data.filter(d => d.estadoProducto === true);
  });
}

showCategoryModal() {
  this.detailModalVisible = true;
}

openShowModal(detailSale: DetailSale ) {
  // Asigna el producto seleccionado a una variable para usar en la vista
  this.selectedDetailSales = detailSale;
  // Muestra la modal
  this.detailModalVisible = true;

  // Suponiendo que `detailSale.idVenta` es el ID que estás buscando
  // Cargar detalles de venta relacionados con el idVenta
  this.detailSaleService.getDetailSale().subscribe({
    next: (data) => {
      // Filtra los detalles que coinciden con el idVenta seleccionado
      this.filteredDetailSale = data.filter(d => d.idVenta === detailSale.idVenta);
      if (this.filteredDetailSale.length > 0) {
        this.selectedDetailSales = detailSale; // Asigna la venta seleccionada
      } else {
        this.toastr.warning('No se encontraron detalles para esta venta.');
      }
    },
    error: (err) => {
      this.toastr.error('Error al cargar el detalle de venta.', 'Error');
    }
  });

}

changeSaleStatus(updatedSale: Sale) {
  // Asegúrate de que el estado es un booleano (true o false)
  const estadoVentas = updatedSale.estadoVenta !== undefined ? updatedSale.estadoVenta : false;

  // Llamar al servicio para actualizar el estadoVenta
  this.saleService.updateStatusSale(updatedSale.idVenta, estadoVentas).subscribe({
    next: () => {
      // Actualiza las listas Sales y filteredSale
      [this.Sales, this.filteredSale].forEach(list => {
        const index = list.findIndex(sale => sale.idVenta === updatedSale.idVenta);
        if (index !== -1) {
          // Actualiza solo el campo 'estadoVenta' en lugar de reemplazar todo el objeto
          list[index] = { ...list[index], estadoVenta: estadoVentas };
        }
        console.log(estadoVentas)
      });
      this.toastr.success('Estado actualizado con éxito', 'Éxito');
    },
    error: () => {
      this.toastr.error('Error al actualizar el estado', 'Error');
    }
  });
}

cancelSale(updatedSale: Sale) {
  // Mostrar mensaje de confirmación
  this.confirmationService.confirm({
    message: '¿Estás seguro de que deseas cancelar esta venta?',
    header: 'Confirmación de Anulación',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      // Si se acepta, cambia el estado de la venta a "false" antes de llamar a changeSaleStatus
      updatedSale.estadoVenta = false; // Cambiamos el estado a "false"
      
      // Llama a la función que cambia el estado
      this.changeSaleStatus(updatedSale);
      
      // Deshabilitar el campo tras la cancelación (si tienes alguna lógica de deshabilitación)
      this.disableField();
    },
    reject: () => {
      this.toastr.info('Anulación cancelada', 'Información');
    }
  });
}


disableField() {
  this.isFieldDisabled = true; // Cambia el estado del flag
}

searchDetailSale(query: string){
  const lowerCaseQuery = query.toLowerCase();

    // Define el estado que estás buscando. Aquí asumo que buscas "true" en la query.

    this.filteredSale = this.Sales.filter(detailSale => 
      detailSale.totalVenta.toString().includes(lowerCaseQuery) ||
      detailSale.fechaVenta && new Date(detailSale.fechaVenta).toLocaleDateString().includes(lowerCaseQuery) ||
      detailSale.estadoVenta
    );
}


}
