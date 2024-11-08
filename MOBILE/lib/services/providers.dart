import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:comerciplus/models/provider.dart';

class ProviderService {
  final String _providersUrl = '${dotenv.env['API_URL']!}/proveedores';

  Future<List<Provider>> getProviders() async {
    final response = await http.get(Uri.parse(_providersUrl));
    if (response.statusCode == 200) {
      List jsonResponse = jsonDecode(response.body);
      return jsonResponse
          .map((provider) => Provider.fromJson(provider))
          .toList();
    } else {
      throw Exception('Error al obtener los proveedores');
    }
  }

  Future<Provider> fetchProveedor(int id) async {
    final response = await http.get(Uri.parse('$_providersUrl/$id'));
    if (response.statusCode == 200) {
      return Provider.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Falló en la carga de la API');
    }
  }
}
