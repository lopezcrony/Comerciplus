class PurchaseDetails {
  final int idDetalleCompra;
  final int idCompra;
  final int idProducto;
  final int codigoBarra;
  final int cantidadProducto;
  final double precioCompraUnidad;
  final double subtotal;

  PurchaseDetails({
    required this.idDetalleCompra,
    required this.idCompra,
    required this.idProducto,
    required this.codigoBarra,
    required this.cantidadProducto,
    required this.precioCompraUnidad,
    required this.subtotal,
  });

  factory PurchaseDetails.fromJson(Map<String, dynamic> json) {
    return PurchaseDetails(
      idDetalleCompra: json['idDetalleCompra'],
      idCompra: json['idCompra'],
      idProducto: json['idProducto'],
      codigoBarra: json['codigoBarra'], 
      cantidadProducto: json['cantidadProducto'],
      precioCompraUnidad: (json['precioCompraUnidad'] ?? 0.0).toDouble(),
      subtotal: (json['subtotal'] ?? 0.0).toDouble(),
    );
  }
}
