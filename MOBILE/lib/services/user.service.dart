import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/user.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserService {
  final String baseUrl = '${dotenv.env['API_URL']!}/usuarios';

  Future<User> getUserProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final idUsuario = prefs.getInt('idUsuario');

    if (token == null || idUsuario == null) {
      throw Exception('No se encontró sesión activa');
    }

    final response = await http.get(
      Uri.parse('$baseUrl/$idUsuario'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> data = json.decode(response.body);
      return User.fromJson(data);
    } else {
      throw Exception('Error al obtener el perfil de usuario');
    }
  }

  Future<User> updateUserProfile(User user) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');
    final idUsuario = prefs.getInt('idUsuario');

    if (token == null || idUsuario == null) {
      throw Exception('No se encontró sesión activa');
    }

    try {
      final response = await http.put(
        Uri.parse('$baseUrl/$idUsuario'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'nombreUsuario': user.nombreUsuario,
          'apellidoUsuario': user.apellidoUsuario,
          'telefonoUsuario': user.telefonoUsuario,
          'correoUsuario': user.correoUsuario,
          'idUsuario': user.idUsuario,
          'cedulaUsuario': user.cedulaUsuario,
          'estadoUsuario': user.estadoUsuario,
          'idRol': user.idRol,
        }),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        return User.fromJson(data);
      } else {
        final errorData = json.decode(response.body);
        throw Exception(errorData['message'] ?? 'Error al actualizar el perfil de usuario');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }
}