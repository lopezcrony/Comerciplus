class Shopping {
  final int idCompra;
  final int idProveedor;
  final DateTime fechaCompra;
  final DateTime? fechaRegistro;
  final String numeroFactura;
  final double? valorCompra;
  final bool estadoCompra;

  Shopping({
    required this.idCompra,
    required this.idProveedor,
    required this.fechaCompra,
    this.fechaRegistro,
    required this.numeroFactura,
    this.valorCompra,
    required this.estadoCompra,
  });

  factory Shopping.fromJson(Map<String, dynamic> json) {
    return Shopping(
      idCompra: json['idCompra'],
      idProveedor: json['idProveedor'],
      fechaCompra: DateTime.parse(json['fechaCompra']),
      fechaRegistro: json['fechaRegistro'] != null ? DateTime.parse(json['fechaRegistro']) : null,
      numeroFactura: json['numeroFactura'],
      valorCompra: json['valorCompra']?.toDouble(),
      estadoCompra: json['estadoCompra'],
    );
  }
}
