 class Sales {
  final int idVenta;
  final String nitProveedor;
  final String nombreProveedor;
  final String telefonoProveedor;
  final String direccionProveedor;
  final bool estadoVenta;

  Sales({
    required this.idVenta,
    required this.nitProveedor,
    required this.nombreProveedor,
    required this.telefonoProveedor,
    required this.direccionProveedor,
    required this.estadoVenta,
  });

  factory Sales.fromJson(Map<String, dynamic> json) {
    return Sales(
      idVenta: json['idVenta'],
      nitProveedor: json['nitProveedor'],
      nombreProveedor: json['nombreProveedor'],
      telefonoProveedor: json['telefonoProveedor'],
      direccionProveedor: json['direccionProveedor'],
      estadoVenta: json['estadoVenta'],
    );
  }
 }