import 'package:comerciplus/models/purchase.dart';
import 'package:flutter/material.dart';

class PurchaseCard extends StatelessWidget {
  final Purchase purchase;

  const PurchaseCard({Key? key, required this.purchase}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        title: Text(
          'Factura: ${purchase.numeroFactura}',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Proveedor: ${purchase.idProveedor}'),
            Text('Fecha: ${purchase.fechaCompra.toLocal()}'.split(' ')[0]),
          ],
        ),
        trailing: Icon(Icons.arrow_forward_ios),
        onTap: () {
          // Navegación a la pantalla de detalles de compra
        },
      ),
    );
  }
}
