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
      idUsuario: json['idUsuario'] as int,
      cedulaUsuario: json['cedulaUsuario']?.toString() ?? '',
      nombreUsuario: json['nombreUsuario']?.toString() ?? '',
      apellidoUsuario: json['apellidoUsuario']?.toString() ?? '',
      telefonoUsuario: json['telefonoUsuario']?.toString() ?? '',
      correoUsuario: json['correoUsuario']?.toString() ?? '',
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
      if (claveUsuario != null && claveUsuario!.isNotEmpty) 
        'claveUsuario': claveUsuario,
    };
  }

  User copyWith({
    String? nombreUsuario,
    String? apellidoUsuario,
    String? telefonoUsuario,
    String? correoUsuario,
    String? claveUsuario,
  }) {
    return User(
      idUsuario: idUsuario,
      cedulaUsuario: cedulaUsuario,
      nombreUsuario: nombreUsuario ?? this.nombreUsuario,
      apellidoUsuario: apellidoUsuario ?? this.apellidoUsuario,
      telefonoUsuario: telefonoUsuario ?? this.telefonoUsuario,
      correoUsuario: correoUsuario ?? this.correoUsuario,
      claveUsuario: claveUsuario ?? this.claveUsuario,
      estadoUsuario: estadoUsuario,
      idRol: idRol,
    );
  }
}