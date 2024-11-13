import 'package:comerciplus/models/purchaseDetails.dart';
import 'package:comerciplus/services/purchase.dart';
import 'package:comerciplus/services/purchaseDetails.dart';
import 'package:flutter/material.dart';
import '../models/purchase.dart';

class PurchaseScreen extends StatefulWidget {
  @override
  _PurchaseScreenState createState() => _PurchaseScreenState();
}

class _PurchaseScreenState extends State<PurchaseScreen> {
  final PurchaseService _purchaseService = PurchaseService();
  final PurchaseDetailsService _purchaseDetailsService =
      PurchaseDetailsService();

  List<Purchase> _purchases = [];
  List<PurchaseDetails> _purchaseDetails = [];
  bool _isLoading = true;
  int? _selectedPurchaseId;

  @override
  void initState() {
    super.initState();
    _fetchPurchases(); // Cargar las compras al inicio
  }

  // Obtener las compras
  Future<void> _fetchPurchases() async {
    try {
      final purchases = await _purchaseService
          .getPurchaseByProvider(1); // Usamos un proveedor como ejemplo
      setState(() {
        _purchases = purchases;
        _isLoading = false;
      });
    } catch (e) {
      // Manejo de errores
      setState(() {
        _isLoading = false;
      });
      print("Error al obtener las compras:");
    }
  }

  // Obtener detalles de la compra seleccionada
  Future<void> _fetchPurchaseDetails(int purchaseId) async {
    setState(() {
      _isLoading = true;
    });
    try {
      final details = await _purchaseDetailsService
          .getPurchaseDetailsByPurchaseId(purchaseId);
      setState(() {
        _purchaseDetails = details;
        _selectedPurchaseId = purchaseId;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      print("Error al obtener los detalles de compra: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Compras'),
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator()) // Cargando
          : Column(
              children: [
                // Listado de compras
                Expanded(
                  child: ListView.builder(
                    itemCount: _purchases.length,
                    itemBuilder: (context, index) {
                      final purchase = _purchases[index];
                      return ListTile(
                        title: Text('Compra #${purchase.idCompra}'),
                        subtitle: Text('Factura: ${purchase.numeroFactura}'),
                        onTap: () {
                          _fetchPurchaseDetails(purchase.idCompra);
                        },
                      );
                    },
                  ),
                ),
                if (_selectedPurchaseId != null)
                  Expanded(
                    child: ListView.builder(
                      itemCount: _purchaseDetails.length,
                      itemBuilder: (context, index) {
                        final detail = _purchaseDetails[index];
                        return ListTile(
                          title: Text('Producto: ${detail.codigoBarra}'),
                          subtitle: Text(
                              'Cantidad: ${detail.cantidadProducto} | Subtotal: \$${detail.subtotal}'),
                        );
                      },
                    ),
                  ),
              ],
            ),
    );
  }
}
