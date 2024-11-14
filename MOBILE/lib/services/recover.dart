import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class RecoverService {
  final String? _baseUrl = dotenv.env['API_URL'];

  Future<Map<String, dynamic>> recoverPassword(String email) async {
    final url = Uri.parse('$_baseUrl/recover');
    
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'correoUsuario': email}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else if (response.statusCode == 404) {
      throw Exception('Usuario no encontrado');
    } else {
      throw Exception('Error al procesar la solicitud');
    }
  }
}