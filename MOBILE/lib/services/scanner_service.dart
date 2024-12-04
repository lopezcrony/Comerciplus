import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ScannerService {
  final String _scannerUrl = '${dotenv.env['API_URL']!}/escaner';

  Future<void> sendBarcodeToBackend(String barcode) async {
    try {
      // Obtén el idUsuario y token almacenado de manera segura
      final prefs = await SharedPreferences.getInstance();
      final idUsuario = prefs.getInt('idUsuario');
      final token = prefs.getString('token');

      // Verificar si idUsuario o token es null
      if (idUsuario == null || token == null) {
        throw Exception('No se encontró sesión activa: idUsuario o token es null');
      }

      // // Log para verificar los datos enviados
      // print('Enviando datos: barcode=$barcode, timestamp=${DateTime.now().toIso8601String()}, idUsuario=$idUsuario, token=$token');

      final response = await http.post(
        Uri.parse(_scannerUrl),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token'
        },
        body: jsonEncode({
          'barcode': barcode,
          'timestamp': DateTime.now().toIso8601String(),
          'idUsuario': idUsuario, // Incluye el idUsuario
        }),
      );
      if (response.statusCode != 200) {
        throw Exception('Error al enviar el código');
      }

    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }
}
