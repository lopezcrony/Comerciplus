import 'package:comerciplus/models/purchaseDetails.dart';

class Purchase {
  final int idCompra;
  final int idProveedor;
  final DateTime fechaCompra;
  final DateTime fechaRegistro;
  final String numeroFactura;
  final double valorCompra;
  final bool estadoCompra;
  final List<PurchaseDetails> detalleCompra; // Lista de detalles de compra

  Purchase({
    required this.idCompra,
    required this.idProveedor,
    required this.fechaCompra,
    required this.fechaRegistro,
    required this.numeroFactura,
    required this.valorCompra,
    required this.estadoCompra,
    required this.detalleCompra, // Añadimos este campo
  });

  factory Purchase.fromJson(Map<String, dynamic> json) {
    var detallesJson = json['detalleCompra'] as List? ?? [];
    List<PurchaseDetails> detalles = detallesJson
        .map((detalleJson) => PurchaseDetails.fromJson(detalleJson))
        .toList();

    return Purchase(
      idCompra: json['idCompra'],
      idProveedor: json['idProveedor'],
      fechaCompra: DateTime.parse(json['fechaCompra']),
      fechaRegistro: DateTime.parse(json['fechaRegistro']),
      numeroFactura: json['numeroFactura'],
      valorCompra: (json['valorCompra'] ?? 0.0).toDouble(),
      estadoCompra: json['estadoCompra'] ?? true,
      detalleCompra: detalles, // Asignamos los detalles aquí
    );
  }
}
