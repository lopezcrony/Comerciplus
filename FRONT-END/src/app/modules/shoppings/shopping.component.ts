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
  shoppings: Shopping[] = [];
  filteredProducts: any[] = [];
  filteredShoppings: Shopping[] = [];
  providers: any[] = [];
  products: any[] = [];
  shoppingdetails: any[] = [];
  viewModal = false;
  selectedShopping: Shopping | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
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
      const proveedor = shopping as Shopping & { nombreProveedor?: string };

      let idProveedor = !isNaN(numericQuery) && shopping.idProveedor != null && Number(shopping.idProveedor) === numericQuery;
      // Comparación numérica para el stock
      let numeroFactura = !isNaN(numericQuery) && shopping.numeroFactura != null && Number(shopping.numeroFactura) === numericQuery;

      // Retorna verdadero si hay coincidencia en nombreProducto o stock
      const matchproveedor = (proveedor.nombreProveedor || '').toLowerCase().includes(lowerQuery);
      return idProveedor || numeroFactura || matchproveedor;
    });
  }

  downloadPDF() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 12;
    const lineHeight = 6;
    const containerHeight = 27; 
    let yPosition = margin;

    // Colores corporativos
    const colors = {
      primary: [0, 83, 156],
      secondary: [100, 100, 100],
      accent: [41, 128, 185],
      success: [46, 204, 113],
      container: [240, 240, 240]
    };

    const styles = {
      title: { fontSize: 16, fontStyle: 'bold' },   
      subtitle: { fontSize: 12, fontStyle: 'bold' }, 
      normal: { fontSize: 9, fontStyle: 'normal' },  
      small: { fontSize: 8, fontStyle: 'normal' }
    };

    // Funciones helper
    const setStyle = (style: { fontSize: any; fontStyle: any; }) => {
      doc.setFontSize(style.fontSize);
      doc.setFont('helvetica', style.fontStyle);
    };

    const setColor = (color: number[]) => {
      doc.setTextColor(color[0], color[1], color[2]);
    };

    // Franja de color en la parte superior (más delgada)
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 15, 'F'); 

    // Título del reporte
    setStyle(styles.title);
    setColor([255, 255, 255]);
    doc.text('REPORTE DE COMPRAS', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += lineHeight + 6;

    // Información del negocio y fecha
    setStyle(styles.normal);
    setColor(colors.primary);
    doc.text('Tienda Santa Clara', margin, yPosition);

    const fecha = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    setColor(colors.secondary);
    doc.text(`Fecha de generación: ${fecha}`, pageWidth - margin - 50, yPosition);
    yPosition += lineHeight * 1.5; // Reducido el espaciado

    // Resumen general
    let totalCompras = 0;
    this.shoppings.forEach(compra => totalCompras += compra.valorCompra ?? 0);

    setColor(colors.accent);
    setStyle(styles.subtitle);
    doc.text('Resumen General', margin, yPosition);
    yPosition += lineHeight;

    setStyle(styles.normal);
    setColor(colors.secondary);
    doc.text(`Total de Compras: ${this.shoppings.length}`, margin, yPosition);
    doc.text(`Valor Total: $${totalCompras.toFixed(2)}`, pageWidth - margin - 50, yPosition);
    yPosition += lineHeight * 1.5; // Reducido el espaciado

    // Encabezado de la lista de compras
    doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.rect(margin, yPosition - 6, pageWidth - (margin * 2), lineHeight + 2, 'F');

    setStyle(styles.subtitle);
    setColor([255, 255, 255]);
    doc.text('DETALLE DE COMPRAS', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += lineHeight ; 

    // Lista de compras
    this.shoppings.forEach((compra, index) => {
      if (yPosition + containerHeight > pageHeight - margin * 3) {
        doc.addPage();
        yPosition = margin;
      }

      // Dibujar el contenedor con altura fija
      doc.setFillColor(colors.container[0], colors.container[1], colors.container[2]);
      doc.rect(margin, yPosition, pageWidth - (margin * 2), containerHeight, 'F');

      // Contenido de la compra
      setStyle(styles.subtitle);
      setColor(colors.primary);
      doc.text(`Compra #${compra.numeroFactura}`, margin + 5, yPosition + lineHeight);

      setStyle(styles.normal);
      setColor(colors.secondary);

      // Detalles de la compra en dos columnas
      const col2 = pageWidth / 2 + margin;

      // Columna 1
      doc.text(`Proveedor:`, margin + 5, yPosition + lineHeight * 2);
      doc.text(`Fecha:`, margin + 5, yPosition + lineHeight * 3);

      // Columna 2
      doc.text(`N° Factura:`, col2, yPosition + lineHeight * 2);
      doc.text(`Valor:`, col2, yPosition + lineHeight * 3);

      // Valores de la columna 1
      setColor(colors.secondary);
      doc.text(compra.idProveedor.toString(), margin + 30, yPosition + lineHeight * 2);
      doc.text(new Date(compra.fechaCompra).toLocaleDateString(), margin + 30, yPosition + lineHeight * 3);

      // Valores de la columna 2
      doc.text(compra.numeroFactura.toString(), col2 + 40, yPosition + lineHeight * 2);
      setColor(colors.success);
      doc.text(`$${(compra.valorCompra ?? 0).toFixed(1)}`, col2 + 40, yPosition + lineHeight * 3);

      yPosition += containerHeight + 4; // Espacio entre contenedores
    });

    // Pie de página
    yPosition = pageHeight - margin * 3;
    setStyle(styles.small);
    setColor(colors.secondary);
    doc.text('Reporte generado automáticamente - Tienda Santa Clara', pageWidth / 2, yPosition, { align: 'center' });
  
    // Guardar el PDF
    doc.save('reporte_compras.pdf');
  }
}
