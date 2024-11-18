import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/purchase.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class PurchaseService {

  final String _purchasesUrl = '${dotenv.env['API_URL']!}/compras';

  // Método para obtener las compras por proveedor
  Future<List<Purchase>> getPurchaseByProvider(int id) async {
    try {
      final response = await http.get(Uri.parse('$_purchasesUrl/proveedor/$id'));

      if (response.statusCode == 200) {
        List jsonResponse = jsonDecode(response.body);

        return jsonResponse
            .map((purchase) => Purchase.fromJson(purchase))
            .toList();
      } else {
        throw Exception('Error al obtener las compras');
      }
    } catch (error) {
      rethrow;
    }
  }

  Future<List<Purchase>> getPurchases() async {
    try {
      final response = await http.get(Uri.parse(_purchasesUrl));


      if (response.statusCode == 200) {
        List jsonResponse = jsonDecode(response.body);
        return jsonResponse
            .map((purchase) => Purchase.fromJson(purchase))
            .toList();
      } else {
        throw Exception('Error al obtener las compras');
      }
    } catch (error) {
      rethrow; 
    }
  }
}
