import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart'; // Para obtener el userId almacenado de manera segura

class ScannerService {
  final String _scannerUrl = '${dotenv.env['API_URL']!}/escaner';
  final storage = const FlutterSecureStorage();

  Future<void> sendBarcodeToBackend(String barcode) async {
    try {
      // Obtén el userId almacenado de manera segura
      final userId = await storage.read(key: 'userId');
      
      final response = await http.post(
        Uri.parse(_scannerUrl),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'barcode': barcode,
          'timestamp': DateTime.now().toIso8601String(),
          'userId': userId, // Incluye el userId
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
