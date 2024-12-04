import 'package:comerciplus/screens/purchase.dart';
import 'package:comerciplus/screens/scanner.dart';
import 'package:flutter/material.dart';
import 'package:comerciplus/widgets/appBar.dart';
import 'package:comerciplus/screens/sales.dart';
import 'package:comerciplus/widgets/summary_card.dart';
import 'package:comerciplus/widgets/menu_card.dart';
import 'package:comerciplus/screens/providers.dart';
import 'package:comerciplus/screens/clients.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';

import '../services/purchase.dart';
import '../services/sales.dart';
import '../shared/AppColors.dart';
import '../widgets/scanner_button.dart';

class Home extends StatelessWidget {
  Home({super.key});

  final formatoMoneda = NumberFormat.currency(
    locale: 'es_CO', // Cambia por el código de tu región, si es necesario
    symbol: '\$', // Símbolo de la moneda
    decimalDigits: 0, // Para evitar decimales
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const CustomAppBar(),

      // Botpón flotante para escanear
      floatingActionButton: AnimatedScannerButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const ScannerScreen()),
          );
        },
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,

      // Informe del día
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Resumen rápido del día
              Container(
                margin: const EdgeInsets.all(16),
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF4299E1), Color(0xFF3182CE)],
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Resumen del Día',
                      style: GoogleFonts.poppins(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 16),
                    FutureBuilder<List<double>>(
                      future: Future.wait([
                        SaleService().getDailySalesTotal(),
                        PurchaseService().getDailyPurchasesTotal(),
                      ]),
                      builder: (context, snapshot) {
                        if (snapshot.connectionState ==
                            ConnectionState.waiting) {
                          return const Center(
                              child: CircularProgressIndicator());
                        } else if (snapshot.hasError) {
                          return Text(
                            'Error: ${snapshot.error}',
                            style: const TextStyle(color: Colors.white),
                          );
                        }

                        final totals = snapshot.data ?? [0.0, 0.0];
                        final totalSales = totals[0];
                        final totalPurchases = totals[1];

                        return Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            SummaryCard(
                              title: 'Ventas',
                              value: '\$${formatoMoneda.format(totalSales)}',
                              icon: Icons.trending_up,
                              change:
                                  '+12.5%', // Puedes calcular cambios aquí si es necesario
                            ),
                            SummaryCard(
                              title: 'Compras',
                              value:
                                  '\$${formatoMoneda.format(totalPurchases)}',
                              icon: Icons.trending_down,
                              change: '+1.5%', // Placeholder
                            ),
                          ],
                        );
                      },
                    ),
                  ],
                ),
              ),

              // Menú principal
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 16),
              ),
              const SizedBox(height: 12),
              GridView.count(
                padding: const EdgeInsets.all(16),
                crossAxisCount: 2,
                shrinkWrap: true,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                physics: const NeverScrollableScrollPhysics(),
                children: [
                  MenuCard(
                    title: 'Ventas',
                    subtitle: 'Gestión de ventas',
                    icon: Icons.attach_money,
                    color: const Color(0xFF4299E1),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => const ResumenVentas()),
                      );
                    },
                  ),
                  MenuCard(
                    title: 'Compras',
                    subtitle: 'Gestión de compras',
                    icon: Icons.shopping_cart,
                    color: const Color.fromARGB(255, 123, 237, 100),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => const ShoppingListScreen()),
                      );
                    },
                  ),
                  MenuCard(
                    title: 'Clientes',
                    subtitle: 'Base de datos',
                    icon: Icons.people,
                    color: const Color.fromARGB(255, 237, 100, 100),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => const ClientScreen()),
                      );
                    },
                  ),
                  MenuCard(
                    title: 'Proveedores',
                    subtitle: 'Gestión de proveedores',
                    icon: Icons.local_shipping,
                    color: const Color.fromARGB(255, 237, 166, 100),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => const ProvidersScreen()),
                      );
                    },
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
