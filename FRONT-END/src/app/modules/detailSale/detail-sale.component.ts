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
import jsPDF from 'jspdf';

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

  startDates: Date = new Date();
  endDates: Date = new Date();

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
    this.loadDetailSales()
  }

  loadSales() {
    this.saleService.getSales().subscribe(data => {
      this.Sales = data;
      this.filteredSale = data;
    },
    );
  }

  loadDetailSales() {
    this.detailSaleService.getDetailSale().subscribe(data => {
      this.detailSale = data;
      this.filteredDetailSale = data;
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


// ----------------------------------------- Descarga de PDF ---------------------------------------------------

downloadPDF() {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 15;
  const cardPadding = 10;
  const lineHeight = 7;

  // Colores y estilos
  const colors = {
    primary: [63, 131, 248],
    secondary: [31, 41, 55],
    accent: [239, 68, 68],
    background: [249, 250, 251],
    text: [75, 85, 99],
    textLight: [156, 163, 175],
    cardBg: [255, 255, 255]
  };

  const setStyle = (fontSize: number, fontStyle: string) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
  };

  const setColor = (color: number[]) => {
    doc.setTextColor(color[0], color[1], color[2]);
  };

  const drawCard = (x: number, y: number, width: number, height: number) => {
    doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    doc.setDrawColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
    doc.roundedRect(x, y, width, height, 3, 3, 'FD');
  };

  const drawDivider = (x: number, y: number, width: number) => {
    doc.setDrawColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
    doc.setLineWidth(0.1);
    doc.line(x, y, x + width, y);
  };

  type ProductSalesData = {
    cantidad: number;
    subtotal: number;
  };

  type SalesByDate = {
    [date: string]: {
      [productName: string]: ProductSalesData;
    };
  };

  const salesByDate: SalesByDate = this.Sales.reduce((acc: SalesByDate, sale) => {
    const saleDate = new Date(sale.fechaVenta).toLocaleDateString();
    const details = this.detailSale.filter(d => d.idVenta === sale.idVenta);
    
    details.forEach(detail => {
      const product = this.products.find(p => p.idProducto === detail.idProducto);
      if (!product) return;

      if (!acc[saleDate]) acc[saleDate] = {};

      if (!acc[saleDate][product.nombreProducto]) {
        acc[saleDate][product.nombreProducto] = { 
          cantidad: 0, 
          subtotal: 0 
        };
      }

      acc[saleDate][product.nombreProducto].cantidad += detail.cantidadProducto;
      acc[saleDate][product.nombreProducto].subtotal += detail.subtotal;
    });

    return acc;
  }, {} as SalesByDate);

  let yPosition = margin;

  // Encabezado más angosto
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(0, 0, pageWidth, 30, 'F');  // Reducido de 40 a 30
  
  setStyle(26, 'bold');
  setColor([255, 255, 255]);
  doc.text('Tienda Santa Clara', pageWidth / 2, yPosition + 12, { align: 'center' });
  
  setStyle(14, 'normal');
  doc.text('Informe de Ventas', pageWidth / 2, yPosition + 20, { align: 'center' });

  yPosition = 45;

  Object.entries(salesByDate).forEach(([date, products]) => {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    const dateCardHeight = 25;
    drawCard(margin, yPosition, pageWidth - 2 * margin, dateCardHeight);
    
    setStyle(16, 'bold');
    setColor(colors.primary);
    doc.text(`Ventas del ${date}`, margin + cardPadding, yPosition + 16);

    yPosition += dateCardHeight + 10;

    const productCount = Object.keys(products).length;
    const productsCardHeight = productCount * lineHeight + 40;
    
    drawCard(margin, yPosition, pageWidth - 2 * margin, productsCardHeight);

    setColor(colors.textLight);
    setStyle(11, 'bold');
    const headers = ['Producto', 'Cantidad', 'Subtotal'];
    const colWidths = [90, 40, 40];
    let xPos = margin + cardPadding;
    
    headers.forEach((header, index) => {
      doc.text(header, xPos, yPosition + 15);
      xPos += colWidths[index];
    });

    drawDivider(margin + cardPadding, yPosition + 18, pageWidth - 2 * (margin + cardPadding));

    yPosition += 25;
    setStyle(10, 'normal');
    setColor(colors.text);
    
    Object.entries(products).forEach(([productName, info]) => {
      doc.text(productName, margin + cardPadding, yPosition);
      doc.text(info.cantidad.toString(), margin + cardPadding + colWidths[0], yPosition, { align: 'right' });
      doc.text(`$${info.subtotal.toFixed(2)}`, margin + cardPadding + colWidths[0] + colWidths[1], yPosition, { align: 'right' });
      yPosition += lineHeight;
    });

    // Línea divisoria y ajuste del "Total del día" unos píxeles más arriba
    drawDivider(margin + cardPadding, yPosition - 2, pageWidth - 2 * (margin + cardPadding));
    yPosition += 10;  // Reducido de 15 a 10
    
    const totalDia = Object.values(products).reduce((sum, p) => sum + p.subtotal, 0);
    setStyle(12, 'bold');
    setColor(colors.primary);
    doc.text(`Total del día: $${totalDia.toFixed(2)}`, pageWidth - margin - cardPadding, yPosition, { align: 'right' });

    yPosition += 30;
  });

  doc.save('informe_ventas.pdf');
}


}
