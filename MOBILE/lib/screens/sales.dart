import 'package:flutter/material.dart';

class SalesHistoryScreen extends StatelessWidget {
  const SalesHistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Historial de Ventas'),
      ),
      body: ListView.builder(
        itemCount: 10, // Ejemplo con 10 ventas
        itemBuilder: (context, index) {
          return Card(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: Colors.blue.shade100,
                child: const Icon(Icons.receipt, color: Colors.blue),
              ),
              title: Text('Venta #${1000 + index}'),
              subtitle: Text('Total: \$${(index + 1) * 100}'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {
                // Mostrar detalles de la venta
              },
            ),
          );
        },
      ),
    );
  }
}