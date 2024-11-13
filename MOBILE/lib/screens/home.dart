import 'package:comerciplus/screens/purchase.dart';
import 'package:comerciplus/screens/scanner.dart';
import 'package:flutter/material.dart';

import 'package:comerciplus/widgets/appBar.dart';
import 'package:comerciplus/screens/sales.dart';
import 'package:comerciplus/widgets/summary_card.dart';
import 'package:comerciplus/widgets/menu_card.dart';

import 'package:comerciplus/screens/providers.dart';
import 'package:comerciplus/screens/clients.dart';

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: const Color(0xFFF5F7FA),
        appBar: const CustomAppBar(),
        body: SafeArea(
          child: SingleChildScrollView(
            child:
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
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
                child: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Resumen del Día',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        SummaryCard(
                          title: 'Ventas',
                          value: '\$15,280',
                          icon: Icons.trending_up,
                          change: '+12.5%',
                        ),
                        SummaryCard(
                          title: 'Compras',
                          value: '\$30,950',
                          icon: Icons.trending_down,
                          change: '+1.5%',
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              // Menú principal
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 16),
                child: Text(
                  'Menú Principal',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF2D3748),
                  ),
                ),
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
                            builder: (context) => ResumenVentas()),
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
                            builder: (context) => PurchaseScreen()),
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
                  // Agregar más MenuCards aquí
                ],
              ),

              //Botón flotante
              Align(
                alignment: Alignment.bottomRight,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: FloatingActionButton(
                  onPressed: () {
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => ScannerScreen()),
                      );
                  },
                  backgroundColor: const Color.fromARGB(129, 221, 186, 221),
                  child: const Icon(Icons.qr_code_2_outlined, color: Color.fromARGB(255, 145, 72, 145)),
                  ),
                ),
              ),
            ]),
          ),
        ));
  }
}
