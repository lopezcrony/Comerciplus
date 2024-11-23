  import 'package:comerciplus/models/sale.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';

import '../models/detailSale.dart';
import '../models/products.dart';
import '../services/detailSales.dart';
import '../services/product.dart';
import '../shared/AppColors.dart';
import '../widgets/datilSaleCard.dart';

void mostrarDetallesVenta(BuildContext context, Sales venta) {
    showDialog(
      context: context,
      builder: (context) => FutureBuilder<List<Detailsale>>(
        future: DetailSaleService()
            .getDetailSales(), // Obtén todos los detalles de venta
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(
                child: Text(
                    'Error al cargar los detalles de la venta: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(
                child: Text('No se encontraron detalles de ventas'));
          }

          // Filtra los detalles para mostrar solo aquellos que tienen el idVenta coincidente
          final detallesVenta = snapshot.data!
              .where((detalle) => detalle.idVenta == venta.idVenta)
              .toList();

          return Dialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            child: Container(
              padding: const EdgeInsets.all(24),
              constraints: const BoxConstraints(maxWidth: 400),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Estructura del encabezado y detalles de la venta
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: AppColors.secondary,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.receipt_outlined,
                                color: AppColors.primary),
                          ),
                          const SizedBox(width: 12),
                          Text(
                            'Venta #${venta.idVenta}',
                            style: GoogleFonts.poppins(
                              fontSize: 20,
                              fontWeight: FontWeight.w600,
                              color: AppColors.text,
                            ),
                          ),
                        ],
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: AppColors.text),
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.secondary,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        buildDetalleRow(
                          Icons.calendar_today,
                          'Fecha',
                          DateFormat('dd/MM/yyyy HH:mm')
                              .format(venta.fechaVenta),
                        ),
                        const SizedBox(height: 12),
                        buildDetalleRow(
                          Icons.shopping_bag_outlined,
                          'Total productos',
                          '${detallesVenta.length}', // Muestra la cantidad total de productos filtrados
                        ),
                        const SizedBox(height: 12),
                        buildDetalleRow(
                          Icons.attach_money,
                          'Total',
                          '\$${venta.totalVenta.toStringAsFixed(2)}',
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Productos',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: AppColors.text,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      border:
                          Border.all(color: AppColors.accent.withOpacity(0.2)),
                    ),
                    child: FutureBuilder<List<Products>>(
                      future: ProductService()
                          .getProducts(), // Obtén todos los productos
                      builder: (context, productSnapshot) {
                        if (productSnapshot.connectionState ==
                            ConnectionState.waiting) {
                          return const Center(
                              child: CircularProgressIndicator());
                        } else if (productSnapshot.hasError) {
                          return Center(
                              child: Text(
                                  'Error al cargar los productos: ${productSnapshot.error}'));
                        } else if (!productSnapshot.hasData ||
                            productSnapshot.data!.isEmpty) {
                          return const Center(
                              child: Text('No se encontraron productos'));
                        }

                        // Obtener la lista de productos
                        final productos = productSnapshot.data!;

                        return ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: detallesVenta.length,
                          itemBuilder: (context, index) {
                            final detalle = detallesVenta[index];
                            // Encuentra el producto correspondiente a este detalle
                            final producto = productos.firstWhere((prod) =>
                                prod.idProducto == detalle.idProducto);

                            return ListTile(
                              contentPadding: const EdgeInsets.symmetric(
                                  horizontal: 16, vertical: 8),
                              leading: const Icon(Icons.shopping_cart,
                                  color: AppColors.primary),
                              title: Text(
                                producto.nombreProducto, // Nombre del producto
                                style: GoogleFonts.poppins(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w500,
                                  color: AppColors.text,
                                ),
                              ),
                              subtitle: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Cantidad: ${detalle.cantidadProducto}',
                                    style: TextStyle(
                                        color: AppColors.text.withOpacity(0.6)),
                                  ),
                                  Text(
                                    'Precio: \$${producto.precioVenta.toStringAsFixed(2)}',
                                    style: TextStyle(
                                      color: AppColors.text.withOpacity(0.6),
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                              trailing: Text(
                                '\$${(detalle.cantidadProducto * producto.precioVenta).toStringAsFixed(2)}',
                                style: GoogleFonts.poppins(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.primary,
                                ),
                              ),
                            );
                          },
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 24),
                  Align(
                    alignment: Alignment.centerRight,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 24, vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      onPressed: () => Navigator.of(context).pop(),
                      child: Text(
                        'Cerrar',
                        style: GoogleFonts.poppins(
                          fontSize: 16,
                          color: Colors.white,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
