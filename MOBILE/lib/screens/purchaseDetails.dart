  import 'package:flutter/material.dart';
  import 'package:google_fonts/google_fonts.dart';
  import 'package:intl/intl.dart';

import '../models/products.dart';
import '../models/purchase.dart';
import '../models/purchaseDetails.dart';
import '../services/product.dart';
import '../services/purchaseDetails.dart';
import '../shared/AppColors.dart';
import '../widgets/detailPurchaseCard.dart';

  void showPurchaseDetailsDialog(BuildContext context, Purchase purchase) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        child: FutureBuilder<List<PurchaseDetails>>(
          future: PurchaseDetailsService().getPurchaseDetailsByPurchaseId(purchase.idCompra),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            } else if (snapshot.hasError) {
              return Center(child: Text('Error: ${snapshot.error}'));
            } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
              return const Center(child: Text('No hay detalles disponibles.'));
            }

            List<PurchaseDetails> details = snapshot.data!;

            return SingleChildScrollView(
              child: Container(
                padding: const EdgeInsets.all(24),
                constraints: const BoxConstraints(maxWidth: 400),
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
                              child: const Icon(Icons.receipt_outlined, color: AppColors.primary),
                            ),
                            const SizedBox(width: 12),
                            Text(
                              'Compra #${purchase.idCompra}',
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
                          DetalleRow(
                            icon: Icons.calendar_today,
                            label: 'Fecha',
                            value: DateFormat('dd/MM/yyyy').format(purchase.fechaCompra),
                          ),
                          const SizedBox(height: 12),
                          DetalleRow(
                            icon: Icons.receipt,
                            label: 'N° Factura',
                            value: purchase.numeroFactura.toString(),
                          ),
                          const SizedBox(height: 12),
                          DetalleRow(
                            icon: Icons.attach_money,
                            label: 'Total',
                            value: '\$${purchase.valorCompra.toStringAsFixed(2)}',
                          ),
                          const SizedBox(height: 12),
                          DetalleRow(
                            icon: Icons.check_circle_outline,
                            label: 'Estado',
                            value: purchase.estadoCompra ? 'Activa' : 'Inactiva',
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Productos',
                      style: GoogleFonts.poppins(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: AppColors.text,
                      ),
                    ),
                    const SizedBox(height: 12),
                    ...details.map((item) {
                      return FutureBuilder<Products>(
                        future: ProductService().fetchProductById(item.idProducto),
                        builder: (context, productSnapshot) {
                          if (productSnapshot.connectionState == ConnectionState.waiting) {
                            return const Center(child: CircularProgressIndicator());
                          } else if (productSnapshot.hasError) {
                            return Center(child: Text('Error: ${productSnapshot.error}'));
                          } else if (!productSnapshot.hasData) {
                            return const Center(child: Text('Producto no encontrado'));
                          }

                          final product = productSnapshot.data!;
                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      const Icon(Icons.shopping_cart, color: AppColors.primary),
                                      const SizedBox(width: 8),
                                      Text(
                                        product.nombreProducto,
                                        style: GoogleFonts.poppins(
                                          fontWeight: FontWeight.w500,
                                          fontSize: 16,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    'Código: ${item.codigoBarra}',
                                    style: GoogleFonts.poppins(
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Cantidad: ${item.cantidadProducto}',
                                    style: GoogleFonts.poppins(),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Precio unitario: \$${item.precioCompraUnidad.toStringAsFixed(2)}',
                                    style: GoogleFonts.poppins(),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Subtotal: \$${item.subtotal.toStringAsFixed(2)}',
                                    style: GoogleFonts.poppins(fontWeight: FontWeight.w500),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      );
                    }),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
