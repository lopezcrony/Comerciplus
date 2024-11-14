import 'dart:convert';
import 'package:comerciplus/models/purchaseDetails.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart'; // Asegúrate de tener dotenv en pubspec.yaml

class PurchaseDetailsService {
  final String _purchaseDetailsUrl =
      '${dotenv.env['API_URL']!}/detalleCompras'; // Usamos el valor del .env

  // Obtener detalles de compra por ID de compra
  Future<List<PurchaseDetails>> getPurchaseDetailsByPurchaseId(
      int purchaseId) async {
    print('Fetching purchase details for purchase ID: $purchaseId');
    try {
      final response =
          await http.get(Uri.parse('$_purchaseDetailsUrl/$purchaseId'));
      print('Response status code: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        List jsonResponse = jsonDecode(response.body);
        print('Decoded JSON: $jsonResponse');

        if (jsonResponse.isEmpty) {
          print('No purchase details found');
          return [];
        } else {
          return jsonResponse
              .map((detail) => PurchaseDetails.fromJson(detail))
              .toList();
        }
      } else {
        throw Exception(
            'Error al obtener los detalles de compra. Status code: ${response.statusCode}');
      }
    } catch (e) {
      print('Error in getPurchaseDetailsByPurchaseId: $e');
      rethrow;
    }
  }
}
