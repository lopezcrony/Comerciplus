import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:comerciplus/models/client.dart';

class ClientService{
  final String _clientsUrl = '${dotenv.env['API_URL']!}/clientes';

  Future<List<Client>> getClients() async {
    final response = await http.get(Uri.parse(_clientsUrl));
    if (response.statusCode == 200) {
      List jsonResponse = jsonDecode(response.body);
      return jsonResponse
          .map((client) => Client.fromJson(client))
          .toList();
    } else {
      throw Exception('Error al obtener los clientes');
    }
  }

  Future<Client> fetchClient(int id) async {
    final response = await http.get(Uri.parse('$_clientsUrl/$id'));
    if (response.statusCode == 200) {
      return Client.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Falló en la carga de la API');
    }
  }
}