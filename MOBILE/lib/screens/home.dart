import 'package:comerciplus/widgets/menu_card.dart';
import 'package:flutter/material.dart';
import 'package:comerciplus/screens/sales.dart';

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ComerciPlus'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {
              // Implementar notificaciones
            },
          ),
        ],
      ),
      body: GridView.count(
        padding: const EdgeInsets.all(16),
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        children: [
          MenuCard(
            title: 'Ventas del Día',
            icon: Icons.point_of_sale,
            color: Colors.blue,
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const SalesHistoryScreen(),
              ),
            ),
          ),
          MenuCard(
            title: 'Historial de Compras',
            icon: Icons.shopping_bag,
            color: Colors.green,
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const SalesHistoryScreen(),
              ),
            ),
          ),
          MenuCard(
            title: 'Proveedores',
            icon: Icons.business,
            color: Colors.orange,
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const SalesHistoryScreen(),
              ),
            ),
          ),
          MenuCard(
            title: 'Clientes',
            icon: Icons.people,
            color: Colors.purple,
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const SalesHistoryScreen(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
