import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CardModule } from 'primeng/card';

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

@Component({
  selector: 'app-sales',
  standalone: true,
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  imports: [
    ...SHARED_IMPORTS,
    InputSwitchModule,
    CardModule
  ]
})
export class SalesComponent implements OnInit {

  busquedaForm: FormGroup;
  creditForm: FormGroup;
  clientForm!: FormGroup;

  total: number = 0;
  selectedClient: any = null;
  imprimirRecibo: boolean = false;
  showCreditModal: boolean = false;
  showClientModal: boolean = false;
  idSale: number | null = null;

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
    this.loadCreditsClients();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe(data => {
      this.products = data.filter(p => p.estadoProducto === true);
      this.filteredProducts = [...this.products]; 
    });
  }  

  getImageUrl(productId: any): string {
    return this.productService.getImageUrl(productId);
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
    if (product.stock <= 0) {
      this.toastr.error('Stock insuficiente','Error')
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

  createSale() {
    if (this.detailSale.length === 0) {
      this.toastr.error('No hay productos en la venta', 'Error');
      return;
    }

    const saleData = { fechaVenta: new Date() };
    const saleDetail = this.detailSale;

    this.saleService.createSale(saleData, saleDetail).subscribe({
      next: (response) => {
        this.idSale = response.newSale.idVenta;
        
        this.loadProducts();        
      },
      error: (error) => {
        this.toastr.error('No se pudo registrar la venta', 'Error');
        console.error('Error al guardar la venta:', error);
      }
    });
  }

  finalizeSale(){
    this.createSale();
    this.toastr.success('Venta registrada', 'Éxito');
    this.resetForm();
  }

  cancelSale(){
    this.resetForm();
    this.toastr.success('Venta Cancelada', 'Info');
  };

  showCreditAssignmentModal() {
    this.createSale();
    this.showCreditModal = true;
  }

  addSaleToCredit() {
    const creditDetail = {
      idCredito: this.selectedClient,
      idVenta: this.idSale,
      montoAcreditado: this.creditForm.value.montoCredito,
      plazoMaximo: this.creditForm.value.plazoMaximo
    };

    console.log(this.idSale)

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

  onClientSelect(event: any) {
    this.selectedClient = event.value.idCredito;
    console.log(this.selectedClient)
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

  getProductName(idProducto: number): string {
    const product = this.products.find(p => p.idProducto === idProducto);
    return product ? product.nombreProducto : 'Desconocido';
  };

  getProductPrice(idProducto: number): number {
    const product = this.products.find(p => p.idProducto === idProducto);
    return product ? product.precioVenta : 0;
  };

  cancelClientCreation() {
    this.showClientModal = false;
  }

// ---------------------------------------- CREATE CLIENT----------------------------------------- //

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field?.invalid && (field.touched || field.dirty));
  }  

  getErrorMessage(fieldName: string): string {
    const control = this.clientForm.get(fieldName);
    if (control?.errors) {
      const errorKey = Object.keys(control.errors)[0];
      return this.validationService.getErrorMessage('clients', fieldName, errorKey);
    }
    return '';
  }

  private markFormFieldsAsTouched() {
    Object.values(this.clientForm.controls).forEach(control => control.markAsTouched());
  }

  saveClient(){
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
  }
}