import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class RestoreService {
  final String? _baseUrl = dotenv.env['API_URL'];

  Future<Map<String, dynamic>> resetPasswordWithToken(String token, String newPassword) async {
    final url = Uri.parse('$_baseUrl/restore');
    
    try {
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'x-reset-token': token,
        },
        body: jsonEncode({
          'claveUsuario': newPassword,
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        final errorBody = jsonDecode(response.body);
        throw Exception(errorBody['message'] ?? 'Error al restablecer la contraseña');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }
}