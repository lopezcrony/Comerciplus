import 'package:comerciplus/models/purchase.dart';
import 'package:comerciplus/screens/sales.dart';
import 'package:comerciplus/services/purchase.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:comerciplus/models/purchaseDetails.dart';
import 'package:comerciplus/services/purchaseDetails.dart';

import '../widgets/appBar_Screens.dart';

class ShoppingListScreen extends StatefulWidget {
  const ShoppingListScreen({super.key});

  @override
  _ShoppingListScreenState createState() => _ShoppingListScreenState();
}

class _ShoppingListScreenState extends State<ShoppingListScreen> {
  late Future<List<Purchase>> purchases;
  final TextEditingController _searchController = TextEditingController();
  List<Purchase> _filteredPurchases = [];
  List<Purchase> _allPurchases = [];

  @override
  void initState() {
    super.initState();
    purchases = PurchaseService().getPurchases();
    purchases.then((value) {
      setState(() {
        _allPurchases  = value;
        _filteredPurchases  = _allPurchases;
      });
    });
  }

  void _filterPurchases(String query) {
    setState(() {
      if (query.isEmpty) {
        _filteredPurchases = _allPurchases;
      } else {
        _filteredPurchases = _allPurchases.where((purchase) {
          final idMatch =
              purchase.idCompra.toString().contains(query.toLowerCase());
          final dateMatch = DateFormat('dd/MM/yyyy')
              .format(purchase.fechaRegistro)
              .toLowerCase()
              .contains(query.toLowerCase());
          return idMatch || dateMatch;
        }).toList();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.secondary,
      appBar: const AppBarScreens(
        nameModule: 'Compras',
      ),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding:
                  const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              child: TextField(
                controller: _searchController,
                style: const TextStyle(color: AppColors.text),
                decoration: InputDecoration(
                  hintText: 'Buscar por número o fecha...',
                  hintStyle: const TextStyle(color: AppColors.textLight),
                  prefixIcon: const Icon(Icons.search, color: AppColors.accent),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                    borderSide: BorderSide.none,
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                    borderSide: BorderSide.none,
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                    borderSide:
                        const BorderSide(color: AppColors.accent, width: 2),
                  ),
                  filled: true,
                  fillColor: AppColors.cardBackground,
                  contentPadding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                ),
                onChanged: _filterPurchases,
              ),
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                final purchase = _filteredPurchases[index];
                return Card(
                  elevation: 4,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                  margin: const EdgeInsets.only(
                      bottom: 16.0, left: 16.0, right: 16.0),
                  color: Colors.white,
                  child: InkWell(
                    onTap: () => _showPurchaseDetails(context, purchase),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
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
                          const SizedBox(height: 8),
                          Align(
                            alignment: Alignment.centerRight,
                            child: TextButton(
                              onPressed: () =>
                                  _showPurchaseDetails(context, purchase),
                              style: TextButton.styleFrom(
                                backgroundColor: Colors.transparent,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(18),
                                ),
                                elevation: 2,
                                shadowColor:
                                    const Color.fromARGB(255, 221, 220, 220)
                                        .withOpacity(0.2),
                              ),
                              child: Text(
                                'Ver Detalle',
                                style: GoogleFonts.poppins(
                                  color: Colors.blue,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
              childCount: _filteredPurchases.length,
            ),
          ),
        ],
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
                    ...details
                        .map((item) => Card(
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
                                        const Icon(Icons.shopping_cart,
                                            color: AppColors.primary),
                                        const SizedBox(width: 8),
                                        Text(
                                          'Producto ID: ${item.idProducto}',
                                          style: GoogleFonts.poppins(
                                            fontWeight: FontWeight.w500,
                                            fontSize: 16,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      'Código de Barra: ${item.codigoBarra}',
                                      style: GoogleFonts.poppins(),
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
                                      style: GoogleFonts.poppins(
                                          fontWeight: FontWeight.w500),
                                    ),
                                  ],
                                ),
                              ),
                            ))
                        .toList(),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildDetalleRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 18, color: AppColors.primary),
        const SizedBox(width: 8),
        Text(
          '$label: ',
          style: GoogleFonts.poppins(fontWeight: FontWeight.w500),
        ),
        Text(
          value,
          style: GoogleFonts.poppins(),
        ),
      ],
    );
  }
}
