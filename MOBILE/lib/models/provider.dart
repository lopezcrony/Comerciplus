 class Provider {
  final int idProveedor;
  final String nitProveedor;
  final String nombreProveedor;
  final String telefonoProveedor;
  final String direccionProveedor;
  final bool estadoProveedor;

  Provider({
    required this.idProveedor,
    required this.nitProveedor,
    required this.nombreProveedor,
    required this.telefonoProveedor,
    required this.direccionProveedor,
    required this.estadoProveedor,
  });

  factory Provider.fromJson(Map<String, dynamic> json) {
    return Provider(
      idProveedor: json['idProveedor'],
      nitProveedor: json['nitProveedor'],
      nombreProveedor: json['nombreProveedor'],
      telefonoProveedor: json['telefonoProveedor'],
      direccionProveedor: json['direccionProveedor'],
      estadoProveedor: json['estadoProveedor'],
    );
  }
 }