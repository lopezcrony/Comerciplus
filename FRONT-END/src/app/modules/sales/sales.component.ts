import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { ValidationService } from '../../shared/validators/validations.service';

import { DetailSale } from '../detailSale/detailSale.model';
import { Product } from '../products/products.model';
import { Credit } from '../credits/credit.model';
import { Client } from '../clients/client.model';

import { ProductsService } from '../products/products.service';
import { CreditsService } from '../credits/credits.service';
import { ClientService } from '../clients/clients.service';
import { SaleService } from './sales.service';
import { CreditDetailService } from '../detailCredit/creditDetail.service';
import { BarcodesService } from '../barcodes/barcodes.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  imports: [
    ...SHARED_IMPORTS,
  ]
})
export class SalesComponent implements OnInit {

  @ViewChild('searchInput') searchInput!: ElementRef;

  busquedaForm: FormGroup;
  creditForm: FormGroup;
  clientForm!: FormGroup;

  total: number = 0;
  selectedClient: any = null;
  imprimirRecibo: boolean = false;
  showCreditModal: boolean = false;
  showClientModal: boolean = false;
  idSale: number | null = null;
  selectedProduct: any = null;
  searchText: string = '';

  products: Product[] = [];
  clients: Client[] = [];
  credits: Credit[] = [];
  detailSale: any[] = [];

  filteredProducts: Product[] = [];
  filteredCredits: Credit[] = [];
  filteredBarcodes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private saleService: SaleService,
    private productService: ProductsService,
    private barcodeService: BarcodesService,
    private creditService: CreditsService,
    private creditDetailService: CreditDetailService,
    private clientService: ClientService,
    private toastr: ToastrService,
    private validationService: ValidationService
  ) {
    this.busquedaForm = this.fb.group({
      busqueda: ['']
    });
    this.creditForm = this.fb.group({
      cliente: [null, Validators.required],
      montoCredito: [0, [Validators.required, Validators.min(1)]],
      plazoMaximo: ['', Validators.required],
      totalVenta: [{ value: this.total, disabled: true }]
    });
    this.clientForm = this.fb.group({
      idCliente: [null],
      cedulaCliente: ['', this.validationService.getValidatorsForField('clients', 'cedulaCliente')],
      nombreCliente: ['', this.validationService.getValidatorsForField('clients', 'nombreCliente')],
      apellidoCliente: ['', this.validationService.getValidatorsForField('clients', 'apellidoCliente')],
      direccionCliente: ['', this.validationService.getValidatorsForField('clients', 'direccionCliente')],
      telefonoCliente: ['', this.validationService.getValidatorsForField('clients', 'telefonoCliente')],
      estadoCliente: [true]
    });
  }

  ngOnInit() {
    this.loadProducts();
  };

  loadProducts() {
    this.productService.getAllProducts().subscribe(data => {
      this.products = data.filter(p => p.estadoProducto === true);
      this.filteredProducts = [...this.products];
    });
  }

  // --------------------------------------BUSCADOR DE PRODUCTOS-------------------------------------------
  focusSearchInput() {
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  handleSearch(event: any, searchInput: any): void {
    const query = event.query.toLowerCase();
    this.searchText = query; // Guardamos el texto de búsqueda
    const isBarcode = /^[0-9]+$/.test(query);
  
    if (isBarcode) {
      setTimeout(() => {
        this.searchByBarcode(query);
      }, 700);
    } else {
      let exactMatches = this.products.filter(p =>
        p.nombreProducto.toLowerCase() === query
      );
  
      let partialMatches = this.products.filter(p =>
        p.nombreProducto.toLowerCase().includes(query) && p.nombreProducto.toLowerCase() !== query
      );
  
      this.filteredProducts = [...exactMatches, ...partialMatches];
  
      if (this.filteredProducts.length > 0) {
        this.selectedProduct = this.filteredProducts[0];
        
        setTimeout(() => {
          if (searchInput && searchInput.panelVisible) {
            searchInput.selectItem(this.filteredProducts[0]);
          }
        }, 2000);
      }
    }
  }

  searchByBarcode(barcode: string) {
    if (!barcode) return;

    this.barcodeService.getProductByBarcode(barcode).subscribe({
      next: (barcodeData: { idProducto: number; }) => {
        if (barcodeData) {
          this.productService.getOneProduct(barcodeData.idProducto).subscribe({
            next: (product: any) => {
              if (product) {
                this.addProductSale(product);
              }
            },
            error: () => {
              this.toastr.error('Error al obtener el producto');
            }
          });
        } else {
          this.toastr.warning('Producto no encontrado');
        }
      },
      error: () => {
        this.toastr.warning('Código de barras no registrado');
      }
    });
  }

  // Función para agregar producto cuando se presiona Enter
  onEnterPressed(): void {
    if (this.selectedProduct) {  // Asegúrate de que haya un producto seleccionado
      this.addProductSale(this.selectedProduct);  // Añadir el objeto del producto completo, no solo el nombre
      this.selectedProduct = null;  // Resetea el producto seleccionado después de agregarlo
      this.busquedaForm.get('busqueda')?.setValue('');  // Limpia el campo de búsqueda
    }
  }

  onSelect(event: any): void {
    this.selectedProduct = event;
    this.busquedaForm.get('busqueda')?.setValue(this.searchText);
    setTimeout(() => {
      this.clear(); 
    }, 100);
  }

  clear() {
    this.searchText = '';
    this.selectedProduct = null;
    this.busquedaForm.get('busqueda')?.setValue('');
  }
  
  getImageUrl(productId: any): string {
    return this.productService.getImageUrl(productId);
  }

  // --------------------------------------AGREGAR PRODUCTO A VENTA-------------------------------------------
  getProductName(idProducto: number): string {
    const product = this.products.find(p => p.idProducto === idProducto);
    return product!.nombreProducto;
  };

  getProductPrice(idProducto: number): number {
    const product = this.products.find(p => p.idProducto === idProducto);
    return product ? product.precioVenta : 0;
  };

  getProductStock(idProducto: number): number {
    const product = this.products.find(p => p.idProducto === idProducto);
    return product ? product.stock : 0;
  };

  addProductSale(event: any): void {
    const product = event && event.value ? event.value : event;
    if (product.stock <= 0) {
      this.toastr.error('Stock insuficiente', 'Error')
    }
    else {
      const existingProduct = this.detailSale.find(item => item.idProducto === product.idProducto);

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
      }
      this.updateTotal();
    }
    this.busquedaForm.get('busqueda')?.setValue('');
    this.focusSearchInput();
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

  updateSubtotal(item: any): void {
    item.subtotal = item.cantidadProducto * item.precioVenta;
    this.updateTotal();
  };

  removeProductFromSale(item: DetailSale) {
    this.detailSale = this.detailSale.filter(i => i !== item);
    this.updateTotal();
  }

  updateTotal(): void {
    this.total = this.detailSale.reduce((sum, item) => sum + item.subtotal, 0);
    this.creditForm.get('totalVenta')?.setValue(this.total);
  }

  // --------------------------------------FINALIZAR VENTA-------------------------------------------
  createSale(callback: (success: boolean) => void) {
    if (this.detailSale.length === 0) {
      this.toastr.error('No hay productos en la venta', 'Error');
      callback(false);
      return;
    }

    const saleData = { fechaVenta: new Date() };
    const saleDetail = this.detailSale;

    this.saleService.createSale(saleData, saleDetail).subscribe({
      next: (response) => {
        this.idSale = response.newSale.idVenta;
        this.loadProducts();
        callback(true);
      },
      error: (error) => {
        this.toastr.error('No se pudo registrar la venta', 'Error');
        callback(false);
      }
    });
  }

  finalizeSale() {
    this.createSale((completed) => {
      if (!completed) return;
      this.toastr.success('Venta registrada', 'Éxito');
      this.resetForm();
    });
  }

  cancelSale() {
    this.resetForm();
    this.toastr.success('Venta Cancelada', 'Info');
  };

  // ---------------------------------------- ASIGNAR CREDITO ----------------------------------------- //
  loadCreditsClients() {
    forkJoin({
      clients: this.clientService.getAllClients(),
      credits: this.creditService.getAllCredits()
    }).subscribe(({ clients, credits }) => {
      this.clients = clients.filter(c => c.estadoCliente === true);
      this.credits = credits
        // Doble filtro para asegurarnos de que no aparezcan clientes inactivos
        .filter(credit => this.clients.some(c => c.idCliente === credit.idCliente))
        .map(credit => {
          const client = this.clients.find(c => c.idCliente === credit.idCliente);
          return {
            ...credit,
            nombreCliente: client ? `${client.nombreCliente} ${client.apellidoCliente}` : '',
            cedulaCliente: client ? client.cedulaCliente : ''
          };
        });
      this.filteredCredits = this.credits
    });
  }

  searchCreditClient(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCredits = this.credits.filter(credit => {
      const creditWithClientName = credit as Credit & { nombreCliente?: string };
      return (creditWithClientName.nombreCliente || '').toLowerCase().includes(query);
    });
  }

  showCreditAssignmentModal() {
    this.createSale((completed) => {
      if (!completed) return;
    });
    this.loadCreditsClients();
    this.showCreditModal = true;
  }

  addSaleToCredit() {
    const creditDetail = {
      idCredito: this.selectedClient,
      idVenta: this.idSale,
      montoAcreditado: this.creditForm.value.montoCredito,
      plazoMaximo: this.creditForm.value.plazoMaximo
    };

    this.creditDetailService.addSaleToCredit(creditDetail).subscribe({
      next: () => {
        this.toastr.success('Venta asignada', 'Éxito');
        this.closeModal();
        this.resetForm();
      },
      error: (error) => {
        this.toastr.error(`No se pudo asignar el crédito: ${error.message}`, 'Error');
        // Aquí se debería eliminar la venta creada
      }
    });
  }

  cancelarAsignacionCredito() {
    this.closeModal();
    // Aquí se debería eliminar la venta creada
  };

  closeModal() {
    this.showCreditModal = false;
  }

  resetForm(): void {
    this.busquedaForm.reset();
    this.creditForm.reset();
    this.detailSale = [];
    this.total = 0;
    this.selectedClient = null;
    this.imprimirRecibo = false;
    this.idSale = null;
    this.loadProducts();
  }

  // ---------------------------------------- CREATE CLIENT----------------------------------------- //

  onClientSelect(event: any) {
    this.selectedClient = event.value.idCredito;
    console.log(this.selectedClient)
  };

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field?.invalid && (field.touched || field.dirty));
  };

  getErrorMessage(fieldName: string): string {
    const control = this.clientForm.get(fieldName);
    if (control?.errors) {
      const errorKey = Object.keys(control.errors)[0];
      return this.validationService.getErrorMessage('clients', fieldName, errorKey);
    }
    return '';
  };

  private markFormFieldsAsTouched() {
    Object.values(this.clientForm.controls).forEach(control => control.markAsTouched());
  };

  saveClient() {
    if (this.clientForm.invalid) return this.markFormFieldsAsTouched();

    this.clientService.createClient(this.clientForm.value).subscribe({
      next: () => {
        this.toastr.success('Cliente creado correctamente', 'Éxito');
        this.showClientModal = false;
        this.loadCreditsClients();
      },
      error: (error) => {
        this.toastr.error(`No se pudo crear el cliente: ${error.message}`, 'Error');
      }
    });
  };

  cancelClientCreation() {
    this.showClientModal = false;
  }

}