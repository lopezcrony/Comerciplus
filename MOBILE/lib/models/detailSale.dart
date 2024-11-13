class Detailsale {
  final int idDetalleVenta;
  final int idVenta;
  final int idProducto;
  final DateTime fechaVenta;
  final double subtotal;
  final int cantidadProducto;

  Detailsale({   
    required this.idDetalleVenta,
    required this.idVenta,
    required this.idProducto,
    required this.fechaVenta,
    required this.subtotal,
    required this.cantidadProducto,
  });

  factory Detailsale.fromJson(Map<String, dynamic> json) {
    return Detailsale(
      
      idDetalleVenta: json['idDetalleVenta'],
      idVenta: json['idVenta'],
      idProducto: json['idProducto'],
      fechaVenta: DateTime.parse(json['fechaVenta']),
      subtotal: json['subtotal'],
      cantidadProducto: json['cantidadProducto'],
    );
  }
}
