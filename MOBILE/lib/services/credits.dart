import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

import '../models/credits.dart';

class CreditService{
  final String _creditsUrl = '${dotenv.env['API_URL']!}/creditos';

  Future<Credit> getCreditsByClient(int idClient) async {
  final response = await http.get(Uri.parse('$_creditsUrl/cliente/$idClient'));
  if (response.statusCode == 200) {
    var jsonResponse = jsonDecode(response.body);
    if (jsonResponse == null) {
      // Manejar el caso donde no hay datos
      return Credit(idCredito: 0, idCliente: idClient, totalCredito: 0.0);
    } else {
      return Credit.fromJson(jsonResponse);
    }
  } else {
    throw Exception('Error al obtener el crédito');
  }
}


  Future<Credit> fetchCredit(int id) async {
    final response = await http.get(Uri.parse('$_creditsUrl/$id'));
    if (response.statusCode == 200) {
      return Credit.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Falló en la carga de la API');
    }
  }
}