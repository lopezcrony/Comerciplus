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
    required this.cedulaUsuario,
    required this.nombreUsuario,
    required this.apellidoUsuario,
    required this.telefonoUsuario,
    required this.correoUsuario,
    this.claveUsuario,
    this.estadoUsuario,
    this.idRol,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      idUsuario: json['idUsuario'] is int 
        ? json['idUsuario'] 
        : int.tryParse(json['idUsuario']?.toString() ?? '0') ?? 0,
      cedulaUsuario: json['cedulaUsuario']?.toString() ?? '',
      nombreUsuario: json['nombreUsuario']?.toString() ?? '',
      apellidoUsuario: json['apellidoUsuario']?.toString() ?? '',
      telefonoUsuario: json['telefonoUsuario']?.toString() ?? '',
      correoUsuario: json['correoUsuario']?.toString() ?? '',
      claveUsuario: json['claveUsuario']?.toString(),
      estadoUsuario: json['estadoUsuario'] is bool 
        ? json['estadoUsuario'] 
        : (json['estadoUsuario']?.toString().toLowerCase() == 'true'),
      idRol: json['idRol'] is int 
        ? json['idRol'] 
        : int.tryParse(json['idRol']?.toString() ?? '0'),
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
      if (claveUsuario != null && claveUsuario!.isNotEmpty)
        'claveUsuario': claveUsuario,
      'estadoUsuario': estadoUsuario,
      'idRol': idRol,
    };
  }
}