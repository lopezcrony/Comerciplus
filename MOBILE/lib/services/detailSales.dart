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
      return jsonResponse.map((sales) => Detailsale.fromJson(sales)).toList();
    } else {
      throw Exception('Error al obtener el detalle de venta');
    }
  }

}
