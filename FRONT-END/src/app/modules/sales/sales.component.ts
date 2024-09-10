import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputGroupModule } from 'primeng/inputgroup';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

interface Cliente {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-venta-productos',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    InputGroupModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    CheckboxModule
  ],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  productos: Producto[] = [];
  clientes: Cliente[] = [];
  clienteSeleccionado: Cliente | null = null;
  busquedaProducto: string = '';
  creditoAsignado: number = 0;
  imprimirRecibo: boolean = false;

  ngOnInit() {
    // Inicializar productos y clientes (esto podría venir de un servicio en una aplicación real)
    this.productos = [
      { id: 1, nombre: 'Producto 1', precio: 10.99, cantidad: 1, imagen: 'assets/producto1.jpg' },
      { id: 2, nombre: 'Producto 2', precio: 15.50, cantidad: 2, imagen: 'assets/producto2.jpg' },
      { id: 3, nombre: 'Producto 3', precio: 8.75, cantidad: 1, imagen: 'assets/producto3.jpg' }
    ];

    this.clientes = [
      { id: 1, nombre: 'Cliente 1' },
      { id: 2, nombre: 'Cliente 2' },
      { id: 3, nombre: 'Cliente 3' }
    ];
  }

  searchProduct() {
    // Implementar lógica de búsqueda
    console.log('Buscando producto:', this.busquedaProducto);
    // Aquí podrías filtrar this.productos basado en this.busquedaProducto
  }

  eliminarProducto(producto: Producto) {
    this.productos = this.productos.filter(p => p.id !== producto.id);
  }

  finalizarVenta() {
    console.log('Venta finalizada');
    console.log('Cliente:', this.clienteSeleccionado);
    console.log('Productos:', this.productos);
    console.log('Crédito asignado:', this.creditoAsignado);
    console.log('Imprimir recibo:', this.imprimirRecibo);
    console.log('Total:', this.calcularTotal());
    // Aquí irías la lógica para procesar la venta, actualizar inventario, etc.
  }

  calcularTotal(): number {
    return this.productos.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  }
}