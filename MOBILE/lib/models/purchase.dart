class Purchase {
  final int idCompra;
  final int idProveedor;
  final DateTime fechaCompra;
  final DateTime fechaRegistro;
  final String numeroFactura;
  final double valorCompra;
  final bool estadoCompra;

  Purchase({
    required this.idCompra,
    required this.idProveedor,
    required this.fechaCompra,
    required this.fechaRegistro,
    required this.numeroFactura,
    required this.valorCompra,
    required this.estadoCompra,
  });

  factory Purchase.fromJson(Map<String, dynamic> json) {
    return Purchase(
      idCompra: json['idCompra'],
      idProveedor: json['idProveedor'],
      fechaCompra: json['fechaCompra'] != null ? DateTime.parse(json['fechaCompra']) : DateTime.now(),
      fechaRegistro: DateTime.parse(json['fechaRegistro']),
      numeroFactura: json['numeroFactura'],
      valorCompra: (json['valorCompra'] ?? 0.0).toDouble(),
      estadoCompra: json['estadoCompra'],
    );
  }
}
