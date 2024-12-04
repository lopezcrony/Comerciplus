import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:comerciplus/models/sale.dart';

class SaleService {
  final String _salesUrl = '${dotenv.env['API_URL']!}/ventas';

  Future<List<Sales>> getSales() async {
    final response = await http.get(Uri.parse(_salesUrl));
    if (response.statusCode == 200) {
      List jsonResponse = jsonDecode(response.body);
      return jsonResponse
          .map((sales) => Sales.fromJson(sales))
          .toList();
    } else {
      throw Exception('Error al obtener las ventas');
    }
  }

  Future<Sales> fetchSalesr(int id) async {
    final response = await http.get(Uri.parse('$_salesUrl/$id'));
    if (response.statusCode == 200) {
      return Sales.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Falló en la carga de la API');
    }
  }

  Future<double> getDailySalesTotal() async {
  final response = await http.get(Uri.parse(_salesUrl));
  if (response.statusCode == 200) {
    List jsonResponse = jsonDecode(response.body);
    List<Sales> allSales = jsonResponse.map((sales) => Sales.fromJson(sales)).toList();

    // Obtener ventas del día
    DateTime today = DateTime.now();
    double totalSales = allSales
        .where((sale) =>
            sale.fechaVenta.year == today.year &&
            sale.fechaVenta.month == today.month &&
            sale.fechaVenta.day == today.day)
        .fold(0.0, (sum, sale) => sum + sale.totalVenta);

    return totalSales;
  } else {
    throw Exception('Error al obtener las ventas del día');
  }
}

}