import 'dart:convert';
import 'package:comerciplus/models/purchaseDetails.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart'; // Asegúrate de tener dotenv en pubspec.yaml

class PurchaseDetailsService {
  final String _purchaseDetailsUrl = '${dotenv.env['API_URL']!}/detalleCompra'; // Usamos el valor del .env

  // Obtener detalles de compra por ID de compra
  Future<List<PurchaseDetails>> getPurchaseDetailsByPurchaseId(int purchaseId) async {
    final response = await http.get(Uri.parse('$_purchaseDetailsUrl/$purchaseId')); // Llamada GET

    if (response.statusCode == 200) {
      List jsonResponse = jsonDecode(response.body);
      
      if (jsonResponse.isEmpty) {
        // Si no hay detalles, retornar una lista vacía
        return [];
      } else {
        // Convertir los datos en una lista de objetos PurchaseDetails
        return jsonResponse
            .map((detail) => PurchaseDetails.fromJson(detail)) // Mapea cada item
            .toList();
      }
    } else {
      throw Exception('Error al obtener los detalles de compra');
    }
  }
}
