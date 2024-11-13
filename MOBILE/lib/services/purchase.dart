import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/purchase.dart';

class PurchaseService {
  // URL de la API
  final String _purchasesUrl = 'http://localhost:3006/compras';

  // Método para obtener las compras por proveedor
  Future<List<Purchase>> getPurchaseByProvider(int id) async {
    try {
      // Realizamos la solicitud GET
      final response = await http.get(Uri.parse('$_purchasesUrl/$id'));

      print('Response body: ${response.body}'); // Verifica lo que recibes

      if (response.statusCode == 200) {
        List jsonResponse = jsonDecode(response.body);
        print('Decoded JSON: $jsonResponse'); // Asegúrate de que se está decodificando correctamente
        return jsonResponse
            .map((purchase) => Purchase.fromJson(purchase))
            .toList();
      } else {
        throw Exception('Error al obtener las compras');
      }
    } catch (error, stacktrace) {
      // Imprimimos el error y el stacktrace para obtener más detalles
      print("Error al obtener las compras: $error");
      print("Stacktrace: $stacktrace");

      // Aquí puedes manejar el error como prefieras
      rethrow; // Para que el error pueda ser capturado en el lugar que se esté llamando
    }
  }
}
