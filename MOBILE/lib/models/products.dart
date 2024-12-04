class Products {
  final int idProducto;
  final int idCategoria;
  final String nombreProducto;
  final int stock;
  final double precioVenta;
  final bool estadoProducto;

  Products({
    required this.idProducto,
    required this.idCategoria,
    required this.nombreProducto,
    required this.stock,
    required this.precioVenta,
    required this.estadoProducto,
  });

  factory Products.fromJson(Map<String, dynamic> json) {
    return Products(
      idProducto: json['idProducto'],
      idCategoria: json['idCategoria'],
      precioVenta: (json['precioVenta'] as num).toDouble(),
      nombreProducto: json['nombreProducto'],
      stock: json['stock'],
      estadoProducto: json['estadoProducto'],
    );
  }
}
