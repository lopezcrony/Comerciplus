import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-venta-productos',
  standalone:true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent {
  productos = [
    { nombre: 'Producto 1', precio: 10.99, cantidad: 1 },
    { nombre: 'Producto 2', precio: 15.50, cantidad: 2 },
    { nombre: 'Producto 3', precio: 8.75, cantidad: 1 }
  ];

  creditoAsignado = 0;
  imprimirRecibo = false;

  incrementarCantidad(producto: any) {
    producto.cantidad++;
  }

  decrementarCantidad(producto: any) {
    if (producto.cantidad > 1) {
      producto.cantidad--;
    }
  }

  eliminarProducto(index: number) {
    this.productos.splice(index, 1);
  }

  finalizarVenta() {
    console.log('Venta finalizada');
    console.log('Crédito asignado:', this.creditoAsignado);
    console.log('Imprimir recibo:', this.imprimirRecibo);
  }
}
