import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:comerciplus/models/detailSale.dart';

class DetailSaleService {
  final String _salesUrl = '${dotenv.env['API_URL']!}/detalleVenta';
  // Verifica si la URL está cargada correctamente

  Future<List<Detailsale>> getDetailSales() async {
    final response = await http.get(Uri.parse(_salesUrl));
    if (response.statusCode == 200) {
      List jsonResponse = jsonDecode(response.body);
      print(jsonResponse);
      return jsonResponse.map((sales) => Detailsale.fromJson(sales)).toList();
    } else {
      throw Exception('Error al obtener el detalle de venta');
    }
  }

  // Método para obtener todos los detalles de venta
  // Future<List<Detailsale>> getSaleDetails() async {
  //   final url = Uri.parse('$_salesUrl/detallesVenta'); // Ajusta la URL a la de tu endpoint

  //   try {
  //     final response = await http.get(url);

  //     // Verifica si la respuesta es exitosa
  //     if (response.statusCode == 200) {
  //       // Decodifica la respuesta en una lista de detalles de venta
  //       final List<dynamic> data = json.decode(response.body);
  //       // Convierte la respuesta en objetos de tipo Detailsale
  //       return data.map((item) => Detailsale.fromJson(item)).toList();
  //     } else {
  //       throw Exception('Error al cargar los detalles de venta service');
  //     }
  //   } catch (e) {
  //     throw Exception('Error al conectar con la API: $e');
  //   }
  // }
}
