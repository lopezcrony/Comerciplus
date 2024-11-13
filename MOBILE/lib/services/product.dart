import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:comerciplus/models/products.dart';

class ProviderService {
  final String _salesUrl = '${dotenv.env['API_URL']!}/productos';

  Future<List<Products>> getProducts() async {
    final response = await http.get(Uri.parse(_salesUrl));
    if (response.statusCode == 200) {
      List jsonResponse = jsonDecode(response.body);
      return jsonResponse
          .map((products) => Products.fromJson(products))
          .toList();
    } else {
      throw Exception('Error al obtener los productos');
    }
  }

  Future<Products> fetchProducts(int id) async {
    final response = await http.get(Uri.parse('$_salesUrl/$id'));
    if (response.statusCode == 200) {
      return Products.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Falló en la carga de la API');
    }
  }
}