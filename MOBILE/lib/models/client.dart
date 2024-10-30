
 class Client {
  final int idCliente;
  final String cedulaCliente;
  final String nombreCliente;
  final String apellidoCliente;
  final String direccionCliente;
  final String telefonoCliente;
  final bool estadoCliente;

  Client({
    required this.idCliente,
    required this.cedulaCliente,
    required this.nombreCliente,
    required this.apellidoCliente,
    required this.direccionCliente,
    required this.telefonoCliente,
    required this.estadoCliente,
  });

  factory Client.fromJson(Map<String, dynamic> json) {
    return Client(
      idCliente: json['idCliente'],
      cedulaCliente: json['cedulaCliente'],
      nombreCliente: json['nombreCliente'],
      apellidoCliente: json['apellidoCliente'],
      direccionCliente: json['direccionCliente'],
      telefonoCliente: json['telefonoCliente'],
      estadoCliente: json['estadoCliente'],
    );
  }

 }