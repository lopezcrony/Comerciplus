import 'package:comerciplus/models/purchaseDetails.dart';
import 'package:flutter/material.dart';

class DetailCard extends StatelessWidget {
  final PurchaseDetails detail;

  const DetailCard({Key? key, required this.detail}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: 3,
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Producto ID: ${detail.idProducto}', style: TextStyle(fontWeight: FontWeight.bold)),
            SizedBox(height: 4),
            Text('Cantidad: ${detail.cantidadProducto}'),
            Text('Precio por Unidad: \$${detail.precioCompraUnidad.toStringAsFixed(2)}'),
            Text('Subtotal: \$${detail.subtotal.toStringAsFixed(2)}'),
          ],
        ),
      ),
    );
  }
}
