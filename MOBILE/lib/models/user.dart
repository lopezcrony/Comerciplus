class User {
  final int idUsuario;
  final String cedulaUsuario;
  final String nombreUsuario;
  final String apellidoUsuario;
  final String telefonoUsuario;
  final String correoUsuario;
  final String? claveUsuario;
  final bool? estadoUsuario;
  final int? idRol;

  User({
    required this.idUsuario,
    this.cedulaUsuario = '',
    required this.nombreUsuario,
    required this.apellidoUsuario,
    this.telefonoUsuario = '',
    required this.correoUsuario,
    this.claveUsuario,
    this.estadoUsuario,
    this.idRol,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      idUsuario: json['idUsuario'] as int,
      cedulaUsuario: json['cedulaUsuario']?.toString() ?? '',
      nombreUsuario: json['nombreUsuario']?.toString() ?? '',
      apellidoUsuario: json['apellidoUsuario']?.toString() ?? '',
      telefonoUsuario: json['telefonoUsuario']?.toString() ?? '',
      correoUsuario: json['correoUsuario'] as String,
      claveUsuario: json['claveUsuario']?.toString(),
      estadoUsuario: json['estadoUsuario'] as bool?,
      idRol: json['idRol'] as int?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'idUsuario': idUsuario,
      'cedulaUsuario': cedulaUsuario,
      'nombreUsuario': nombreUsuario,
      'apellidoUsuario': apellidoUsuario,
      'telefonoUsuario': telefonoUsuario,
      'correoUsuario': correoUsuario,
      if (claveUsuario != null) 'claveUsuario': claveUsuario,
      if (estadoUsuario != null) 'estadoUsuario': estadoUsuario,
      if (idRol != null) 'idRol': idRol,
    };
  }
}