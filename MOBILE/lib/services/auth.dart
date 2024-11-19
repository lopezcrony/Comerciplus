
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';

class AuthService {
  final String? _baseUrl = dotenv.env['API_URL'];

  Future<User> userAuthentication(String email, String password) async {
    final url = Uri.parse('$_baseUrl/login');
    
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'correoUsuario': email,
        'claveUsuario': password
      }),
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> data = jsonDecode(response.body);
      
      // Guardar token y datos de usuario
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', data['token']);
      await prefs.setInt('idUsuario', data['user']['idUsuario']);
      
      // Crear y retornar el usuario
      return User.fromJson(data['user']);
    } else {
      throw Exception('Error al iniciar sesión');
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}