class User {
  final int idUsuario;
  final String cedulaUsuario;
  final String nombreUsuario;
  final String apellidoUsuario;
  final String telefonoUsuario;
  final String correoUsuario;
  final String claveUsuario;
  final bool estadoUsuario;

  User({
    required this.idUsuario,
    required this.cedulaUsuario,
    required this.nombreUsuario,
    required this.apellidoUsuario,
    required this.telefonoUsuario,
    required this.correoUsuario,
    required this.claveUsuario,
    required this.estadoUsuario,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      idUsuario: json['idUsuario'],
      cedulaUsuario: json['cedulaUsuario'],
      nombreUsuario: json['nombreUsuario'],
      apellidoUsuario: json['apellidoUsuario'],
      telefonoUsuario: json['telefonoUsuario'],
      correoUsuario: json['correoUsuario'],
      claveUsuario: json['claveUsuario'],
      estadoUsuario: json['estadoUsuario'],
    );
  }
}