import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';

import '../models/purchase.dart';

class PurchaseService {
  final String _purchasesUrl = '${dotenv.env['API_URL']!}/compras';

  Future<List<Purchase>> getPurchaseByProvider(int id) async {
    final response = await http.get(Uri.parse('$_purchasesUrl/proveedor/$id'));
    if (response.statusCode == 200) {
      List jsonResponse = jsonDecode(response.body);
      if (jsonResponse.isEmpty) {
        // Manejar el caso donde no hay datos
        return [];
      } else {
        return jsonResponse
            .map((purchase) => Purchase.fromJson(purchase))
            .toList();
      }
    } else {
      throw Exception('Error al obtener las compras');
    }
  }
}
