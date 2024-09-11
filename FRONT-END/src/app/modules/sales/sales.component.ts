import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteCompleteEvent, AutoCompleteSelectEvent  } from 'primeng/autocomplete';

import { OrderListModule } from 'primeng/orderlist';
import { ProductsService } from '../products/products.service';
import { Product } from '../products/products.model';

interface Producto {
  id: number;
  nombre: string;
  codigo: string;
  categoria: string;
  precio: number;
  imagen: string;
}

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
}

interface ItemVenta {
  producto: Producto;
  cantidad: number;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
  imports: [
    ...SHARED_IMPORTS,
    DropdownModule,
    AutoCompleteModule,
    CheckboxModule,
    OrderListModule,
  ]
})
export class SalesComponent implements OnInit {
  
  productos: Producto[] = [];
  clientes: Cliente[] = [];
  itemsVenta: ItemVenta[] = [];
  busquedaForm: FormGroup;
  clienteSeleccionado: Cliente | null = null;
  total: number = 0;
  esVentaCredito: boolean = false;
  montoCredito: number = 0;
  productosFiltrados: Producto[] = [];
  clientesFiltrados: Cliente[] = [];

  products: any[] = [];
  filteredProducts: Product[] = [];


  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private productService: ProductsService,

  ) {
    this.busquedaForm = this.fb.group({
      busqueda: ['']
    });
  }

  ngOnInit() {
    this.cargarProductos();
    this.loadProducts();
    this.cargarClientes();
  }

  cargarClientes() {
    this.clientes = [
      { id: 1, nombre: 'Juan', apellido: 'Pérez', telefono: '1234567890' },
      { id: 2, nombre: 'María', apellido: 'González', telefono: '0987654321' },
    ];
  }

  loadProducts(){
    this.productService.getAllProducts().subscribe(data => {
      this.products = data.filter(p => p.estadoProducto === true);
    });
  };

  searchProduct(event: AutoCompleteCompleteEvent){
    const query = event.query.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.nombreProducto.toLowerCase().includes(query)
    );
  };


  cargarProductos() {
    this.productos = [
      { id: 1, nombre: 'Producto 1', codigo: '001', categoria: 'Alimentos', precio: 10, imagen: 'url-imagen-1' },
      { id: 2, nombre: 'Producto 2', codigo: '002', categoria: 'Bebidas', precio: 15, imagen: 'url-imagen-2' },
    ];
  }

  buscarProducto(event: AutoCompleteCompleteEvent) {
    const busqueda = event.query.toLowerCase();
    this.productosFiltrados = this.productos.filter(producto => 
      producto.nombre.toLowerCase().includes(busqueda) || 
      producto.codigo.toLowerCase().includes(busqueda)
    );
  }

  agregarProducto(event: AutoCompleteSelectEvent) {
    const producto = event.value as Producto;
    const itemExistente = this.itemsVenta.find(item => item.producto.id === producto.id);
    if (itemExistente) {
      itemExistente.cantidad++;
    } else {
      this.itemsVenta.push({ producto, cantidad: 1 });
    }
    this.actualizarTotal();
    this.busquedaForm.reset();
  }

  cambiarCantidad(item: ItemVenta, incremento: number) {
    item.cantidad += incremento;
    if (item.cantidad <= 0) {
      this.itemsVenta = this.itemsVenta.filter(i => i !== item);
    }
    this.actualizarTotal();
  }

  actualizarTotal() {
    this.total = this.itemsVenta.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
  }

  buscarCliente(event: AutoCompleteCompleteEvent) {
    const busqueda = event.query.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(cliente => 
      `${cliente.nombre} ${cliente.apellido}`.toLowerCase().includes(busqueda) ||
      cliente.telefono.includes(busqueda)
    );
  }

  seleccionarCliente(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
  }

  toggleVentaCredito() {
    this.esVentaCredito = !this.esVentaCredito;
    if (!this.esVentaCredito) {
      this.montoCredito = 0;
      this.clienteSeleccionado = null;
    }
  }

  realizarVenta() {
    if (this.itemsVenta.length === 0) {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'No hay productos en la venta'});
      return;
    }

    if (this.esVentaCredito && !this.clienteSeleccionado) {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Debe seleccionar un cliente para venta a crédito'});
      return;
    }

    console.log('Venta realizada', {
      items: this.itemsVenta,
      total: this.total,
      esCredito: this.esVentaCredito,
      cliente: this.clienteSeleccionado,
      montoCredito: this.montoCredito
    });

    this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Venta realizada correctamente'});
    this.limpiarVenta();
  }

  limpiarVenta() {
    this.itemsVenta = [];
    this.total = 0;
    this.esVentaCredito = false;
    this.clienteSeleccionado = null;
    this.montoCredito = 0;
    this.busquedaForm.reset();
  }

  imprimirRecibo() {
    console.log('Imprimiendo recibo...');
    this.messageService.add({severity:'info', summary: 'Información', detail: 'Imprimiendo recibo'});
  }

  mostrarModalAsignarCredito: boolean = false;

mostrarModalCredito() {
  this.mostrarModalAsignarCredito = true;
}

cancelarAsignacionCredito() {
  this.mostrarModalAsignarCredito = false;
  // Limpiar los campos si es necesario
}

confirmarAsignacionCredito() {
  // Lógica para asignar el crédito
  this.mostrarModalAsignarCredito = false;
}
}