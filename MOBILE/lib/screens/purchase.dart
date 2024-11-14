import 'package:comerciplus/models/purchase.dart';
import 'package:comerciplus/screens/sales.dart';
import 'package:comerciplus/services/purchase.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:comerciplus/models/purchaseDetails.dart';
import 'package:comerciplus/services/purchaseDetails.dart';

class ShoppingListScreen extends StatefulWidget {
  @override
  _ShoppingListScreenState createState() => _ShoppingListScreenState();
}

class _ShoppingListScreenState extends State<ShoppingListScreen> {
  late Future<List<Purchase>> purchases;

  @override
  void initState() {
    super.initState();
    purchases = PurchaseService()
        .getPurchases(); // Llamamos al servicio para cargar las compras
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.secondary,
      appBar: AppBar(
        title: Center(
          child: Text('Mis Compras',
              style: GoogleFonts.poppins(
                  color: AppColors.text, fontWeight: FontWeight.w600)),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: FutureBuilder<List<Purchase>>(
        future: purchases,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text('No hay compras disponibles.'));
          } else {
            List<Purchase> purchasesData = snapshot.data!;

            return ListView.builder(
              padding: EdgeInsets.all(16.0),
              itemCount: purchasesData.length,
              itemBuilder: (context, index) {
                final purchase = purchasesData[index];
                return Card(
                  elevation: 4,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                  margin: EdgeInsets.only(bottom: 16.0),
                  color: Colors.white,
                  child: InkWell(
                    onTap: () => _showPurchaseDetails(context, purchase),
                    child: Padding(
                      padding: EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Compra ${purchase.idCompra}',
                                style: GoogleFonts.poppins(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.text),
                              ),
                              const Icon(Icons.shopping_bag,
                                  color: AppColors.primary),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              const Icon(Icons.calendar_today,
                                  size: 16, color: AppColors.primary),
                              const SizedBox(width: 4),
                              Text(
                                DateFormat('dd/MM/yyyy')
                                    .format(purchase.fechaRegistro),
                                style: GoogleFonts.poppins(
                                    color: AppColors.text.withOpacity(0.7)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              const Icon(Icons.attach_money,
                                  size: 16, color: AppColors.primary),
                              const SizedBox(width: 4),
                              Text(
                                '\$${purchase.valorCompra.toStringAsFixed(2)}',
                                style: GoogleFonts.poppins(
                                    color: AppColors.primary,
                                    fontWeight: FontWeight.w600),
                              ),
                            ],
                          ),
                          SizedBox(height: 8),
                          Align(
                            alignment: Alignment.centerRight,
                            child: ElevatedButton.icon(
                              icon: Icon(Icons.visibility, size: 18),
                              label: Text('Ver Detalle',
                                  style: GoogleFonts.poppins()),
                              onPressed: () =>
                                  _showPurchaseDetails(context, purchase),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.primary,
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(18)),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            );
          }
        },
      ),
    );
  }

  void _showPurchaseDetails(BuildContext context, Purchase purchase) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
        ),
        child: FutureBuilder<List<PurchaseDetails>>(
          future: PurchaseDetailsService()
              .getPurchaseDetailsByPurchaseId(purchase.idCompra),
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
                              child: const Icon(Icons.receipt_outlined,
                                  color: AppColors.primary),
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
                          _buildDetalleRow(
                            Icons.calendar_today,
                            'Fecha Compra',
                            DateFormat('dd/MM/yyyy HH:mm')
                                .format(purchase.fechaCompra),
                          ),
                          const SizedBox(height: 12),
                          _buildDetalleRow(
                            Icons.receipt,
                            'Número Factura',
                            purchase.numeroFactura.toString(),
                          ),
                          const SizedBox(height: 12),
                          _buildDetalleRow(
                            Icons.attach_money,
                            'Total',
                            '\$${purchase.valorCompra.toStringAsFixed(2)}',
                          ),
                          const SizedBox(height: 12),
                          _buildDetalleRow(
                            Icons.check_circle_outline,
                            'Estado',
                            purchase.estadoCompra ? 'Activa' : 'Inactiva',
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
                    Container(
                      decoration: BoxDecoration(
                        color: AppColors.secondary,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: details.length,
                        itemBuilder: (context, index) {
                          final item = details[index];
                          return ListTile(
                            leading: const Icon(Icons.shopping_cart),
                            title: Text(
                              'Producto ID: ${item.idProducto}',
                              style: GoogleFonts.poppins(
                                  fontWeight: FontWeight.w500),
                            ),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Código de Barra: ${item.codigoBarra}',
                                  style: GoogleFonts.poppins(),
                                ),
                                Text(
                                  'Cantidad: ${item.cantidadProducto}',
                                  style: GoogleFonts.poppins(),
                                ),
                                Text(
                                  'Precio unitario: \$${item.precioCompraUnidad.toStringAsFixed(2)}',
                                  style: GoogleFonts.poppins(),
                                ),
                                Text(
                                  'Subtotal: \$${item.subtotal.toStringAsFixed(2)}',
                                  style: GoogleFonts.poppins(
                                      fontWeight: FontWeight.w500),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildDetalleRow(IconData icon, String title, String value) {
    return Row(
      children: [
        Icon(icon, color: AppColors.primary),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            '$title: $value',
            style: GoogleFonts.poppins(fontWeight: FontWeight.w500),
          ),
        ),
      ],
    );
  }
}
