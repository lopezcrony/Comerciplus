import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:comerciplus/models/products.dart';

class ProductService {
  final String _salesUrl = '${dotenv.env['API_URL']!}/productos';

  Future<List<Products>> getProducts() async {
    final response = await http.get(Uri.parse(_salesUrl));
    if (response.statusCode == 200) {
      List jsonResponse = jsonDecode(response.body);
      return jsonResponse.map((product) => Products.fromJson(product)).toList();
    } else {
      throw Exception('Error al obtener los productos');
    }
  }

  // Método para obtener un producto específico por su id
  Future<Products> fetchProductById(int id) async {
    final response = await http.get(Uri.parse('$_salesUrl/$id'));
    if (response.statusCode == 200) {
      return Products.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Error al obtener el producto');
    }
  }
}
