import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ScannerService {
  final String _scannerUrl = '${dotenv.env['API_URL']!}/escaner';

  Future<void> sendBarcodeToBackend(String barcode) async {
    try {
      final response = await http.post(
        Uri.parse(_scannerUrl),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'barcode': barcode,
          'timestamp': DateTime.now().toIso8601String(),
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
