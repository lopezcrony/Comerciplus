class Credit {
  final int idCredito;
  final int idCliente;
  final double totalCredito;

  Credit({
    required this.idCredito,
    required this.idCliente,
    required this.totalCredito,
  });

  factory Credit.fromJson(Map<String, dynamic> json) {
    return Credit(
      idCredito: json['idCredito'],
      idCliente: json['idCliente'],
      totalCredito: (json['totalCredito'] ?? 0).toDouble(),
    );
  }
}
