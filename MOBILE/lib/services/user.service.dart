import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:logging/logging.dart';
import '../models/user.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserService {
  final String baseUrl = '${dotenv.env['API_URL']!}/usuarios';
  final _logger = Logger('UserService');

    Future<User> getUserProfile() async {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      final idUsuario = prefs.getInt('idUsuario');

      if (token == null || idUsuario == null) {
        throw Exception('No se encontró sesión activa');
      }

      try {
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
          final errorData = json.decode(response.body);
          throw Exception(errorData['message'] ?? 'Error al obtener el perfil de usuario');
        }
      } catch (e) {
        _logger.severe('Error getting user profile: $e');
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
    final Map<String, dynamic> updateData = {
      'idUsuario': user.idUsuario,
      'cedulaUsuario': user.cedulaUsuario,
      'nombreUsuario': user.nombreUsuario,
      'apellidoUsuario': user.apellidoUsuario,
      'telefonoUsuario': user.telefonoUsuario,
      'correoUsuario': user.correoUsuario,
      'estadoUsuario': user.estadoUsuario ?? false,
      'idRol': user.idRol ?? 0,
    };

    // Manejar contraseña de manera opcional
    if (user.claveUsuario != null && user.claveUsuario!.isNotEmpty) {
      updateData['claveUsuario'] = user.claveUsuario;
    }

    _logger.info('Sending update request for user $idUsuario');
    _logger.info('Update data: $updateData');

    final response = await http.put(
      Uri.parse('$baseUrl/$idUsuario'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
      body: json.encode(updateData),
    );

    _logger.info('Update response status: ${response.statusCode}');
    _logger.info('Update response body: ${response.body}');

    if (response.statusCode == 200) {
      final Map<String, dynamic> data = json.decode(response.body);
      
      // Depuración adicional
      _logger.info('Parsed response data: $data');

      // Manejar diferentes estructuras de respuesta
      final userJson = data['user'] ?? data['updatedUser'] ?? data;
      return User.fromJson(userJson);
    } else {
      final errorData = json.decode(response.body);
      throw Exception(errorData['message'] ?? 'Error al actualizar el perfil de usuario');
    }
  } catch (e, stackTrace) {
    _logger.severe('Error updating user profile', e, stackTrace);
    throw Exception('Error al actualizar el perfil de usuario: $e');
  }
}
}