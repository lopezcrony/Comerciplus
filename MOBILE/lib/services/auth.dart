import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class AuthService {
  final String? _baseUrl = dotenv.env['API_URL'];

  Future<Map<String, dynamic>> userAuthentication(String email, String password) async {

    final url = Uri.parse('$_baseUrl/login'); 

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'correoUsuario': email, 'claveUsuario': password}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Error al iniciar sesión');
    }
  }

  Future<void> recoverPassword(String email) async {
    final url = Uri.parse('$_baseUrl/recover-password');

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'correoUsuario': email}),
    );

    if (response.statusCode != 200) {
      throw Exception('Error al recuperar la contraseña');
    }
  }
}
