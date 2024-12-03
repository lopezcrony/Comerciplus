class Detailsale {
  final int idDetalleVenta;
  final int idVenta;
  final int idProducto;
  final double subtotal;
  final int cantidadProducto;

  Detailsale({   
    required this.idDetalleVenta,
    required this.idVenta,
    required this.idProducto,
    required this.subtotal,
    required this.cantidadProducto,
  });

  factory Detailsale.fromJson(Map<String, dynamic> json) {
    return Detailsale(
      
      idDetalleVenta: json['idDetalleVenta'],
      idVenta: json['idVenta'],
      idProducto: json['idProducto'],
      subtotal: (json['subtotal'] as num).toDouble(),
      cantidadProducto: json['cantidadProducto'],
    );
  }
}
