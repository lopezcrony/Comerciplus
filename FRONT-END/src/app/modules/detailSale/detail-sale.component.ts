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



colums: { field: string, header: string }[] = [
  { field: 'idVenta', header: '#Venta' },
  { field: 'fechaVenta', header: 'Fecha' },
  { field: 'totalVenta', header: 'Total' },
    
];

showModal = false;
viewModal = false;
selectedDetailSales: DetailSale | undefined
detailModalVisible: boolean =false


constructor(
  private saleService:SaleService,
  private detailSaleService:DetailSalesService,
  private toastr: ToastrService
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

changeSaletStatus(updatedSale: Sale) {
  const estadoProducto = updatedSale.estado ?? false;

  this.saleService.updateStatusSale(updatedSale.idVenta, estadoProducto).subscribe({
    next: () => {
      [this.Sales, this.filteredSale].forEach(list => {
        const index = list.findIndex(c => c.idVenta === updatedSale.idVenta);
        if (index !== -1) {
          list[index] = { ...list[index], ...updatedSale };
        }
      });
      this.toastr.success('Estado actualizado con éxito', 'Éxito');
    },
    error: () => {
      this.toastr.error('Error al actualizar el estado', 'Error');
    }
  });
}



searchDetailSale(query: string){
  const lowerCaseQuery = query.toLowerCase();

    // Define el estado que estás buscando. Aquí asumo que buscas "true" en la query.

    this.filteredSale = this.Sales.filter(detailSale => 
      detailSale.totalVenta.toString().includes(lowerCaseQuery) ||
      detailSale.fechaVenta && new Date(detailSale.fechaVenta).toLocaleDateString().includes(lowerCaseQuery) ||
      detailSale.estado
    );
}


}
