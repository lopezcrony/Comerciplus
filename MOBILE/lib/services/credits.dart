import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

import '../models/credits.dart';

class CreditService{
  final String _creditsUrl = '${dotenv.env['API_URL']!}/creditos';

  Future<List<Credit>> getCreditsByClient(int idClient) async {
  final response = await http.get(Uri.parse('$_creditsUrl/cliente/$idClient'));
  if (response.statusCode == 200) {
    var jsonResponse = jsonDecode(response.body);
    List<Credit> credits = (jsonResponse as List)
        .map((item) => Credit.fromJson(item))
        .toList();
    return credits;
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