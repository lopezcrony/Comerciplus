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
  final formatoMoneda = NumberFormat.currency(
    locale: 'es_CO', // Cambia por el código de tu región, si es necesario
    symbol: '\$', // Símbolo de la moneda
    decimalDigits: 0, // Para evitar decimales
  );

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
    constraints: const BoxConstraints(maxWidth: 400), // Ancho máximo
    child: Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
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
                DateFormat('dd/MM/yyyy HH:mm').format(venta.fechaVenta),
              ),
              const SizedBox(height: 12),
              buildDetalleRow(
                Icons.shopping_bag_outlined,
                'Total productos',
                '${detallesVenta.length}',
              ),
              const SizedBox(height: 12),
              buildDetalleRow(
                Icons.attach_money,
                'Total',
                formatoMoneda.format(venta.totalVenta),
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
        // Contenedor con scroll para los productos
        Container(
          height: 300, // Limita la altura de los productos
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.accent.withOpacity(0.2)),
          ),
          child: FutureBuilder<List<Products>>(
            future: ProductService().getProducts(),
            builder: (context, productSnapshot) {
              if (productSnapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              } else if (productSnapshot.hasError) {
                return Center(
                    child: Text(
                        'Error al cargar los productos: ${productSnapshot.error}'));
              } else if (!productSnapshot.hasData ||
                  productSnapshot.data!.isEmpty) {
                return const Center(child: Text('No se encontraron productos'));
              }

              final productos = productSnapshot.data!;

              return ListView.builder(
                padding: const EdgeInsets.symmetric(vertical: 8),
                itemCount: detallesVenta.length,
                itemBuilder: (context, index) {
                  final detalle = detallesVenta[index];
                  final producto = productos.firstWhere(
                      (prod) => prod.idProducto == detalle.idProducto);

                  return ListTile(
                    contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 8),
                    leading: const Icon(Icons.shopping_cart,
                        color: AppColors.primary),
                    title: Text(
                      producto.nombreProducto,
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
                          'Precio: \$${formatoMoneda.format(producto.precioVenta)}',
                          style: TextStyle(
                            color: AppColors.text.withOpacity(0.6),
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    trailing: Text(
                      '\$${formatoMoneda.format(detalle.cantidadProducto * producto.precioVenta)}',
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
      ],
    ),
  ),
);

      },
    ),
  );
}
