 class Sales {
  final int idVenta;
  final DateTime fechaVenta;
  final double totalVenta;
  final bool estadoVenta;

  Sales({
    required this.idVenta,
    required this.fechaVenta,
    required this.totalVenta,
    required this.estadoVenta,
  });

  factory Sales.fromJson(Map<String, dynamic> json) {
    return Sales(
      idVenta: json['idVenta'],
      fechaVenta: DateTime.parse(json['fechaVenta']),
      totalVenta: (json['totalVenta'] as num).toDouble(), // Convierte a double
      estadoVenta: json['estadoVenta'],
    );
  }
 }