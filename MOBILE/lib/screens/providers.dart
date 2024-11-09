import 'package:comerciplus/models/provider.dart';
import 'package:comerciplus/services/purchase.dart';
import 'package:comerciplus/widgets/infoCard.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/purchase.dart';
import '../services/providers.dart';
import '../widgets/appBar_Screens.dart';

class ProvidersScreen extends StatefulWidget {
  const ProvidersScreen({super.key});

  @override
  State<ProvidersScreen> createState() => _ProvidersScreenState();
}

class _ProvidersScreenState extends State<ProvidersScreen> {
  late Future<List<Provider>> _futureProviders;
  String searchTerm = '';
  String sortBy = 'nombre';

  @override
  void initState() {
    super.initState();
    _futureProviders = ProviderService().getProviders();
  }

  List<Provider> _filteredProviders(List<Provider> providers) {
    List<Provider> filteredProviders = providers
        .where((provider) =>
            provider.nombreProveedor
                .toLowerCase()
                .contains(searchTerm.toLowerCase()) ||
            provider.nitProveedor
                .toLowerCase()
                .contains(searchTerm.toLowerCase()))
        .toList();

    filteredProviders.sort((a, b) {
      if (sortBy == 'nombre') {
        return a.nombreProveedor.compareTo(b.nombreProveedor);
      } else {
        return (a.estadoProveedor == b.estadoProveedor)
            ? 0
            : a.estadoProveedor
                ? -1
                : 1;
      }
    });

    return filteredProviders;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppBarScreens(
        nameModule: 'Proveedores',
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFFF8F9FF),
              Color(0xFFF0F3FF),
              Colors.white,
            ],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        flex: 2,
                        child: TextField(
                          onChanged: (value) =>
                              setState(() => searchTerm = value),
                          decoration: InputDecoration(
                            hintText: 'Buscar proveedor...',
                            hintStyle: TextStyle(color: Colors.grey[400]),
                            prefixIcon: Icon(Icons.search,
                                color: Colors.grey[400], size: 20),
                            filled: true,
                            fillColor: const Color(0xFFF8F9FF),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                            contentPadding: const EdgeInsets.symmetric(
                                horizontal: 16, vertical: 12),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF8F9FF),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: sortBy,
                              isExpanded: true,
                              icon: const Icon(Icons.sort,
                                  color: Color(0xFF4F5B93), size: 20),
                              items: const [
                                DropdownMenuItem(
                                  value: 'nombre',
                                  child: Text('Por nombre',
                                      style:
                                          TextStyle(color: Color(0xFF2D3142))),
                                ),
                                DropdownMenuItem(
                                  value: 'estado',
                                  child: Text('Por estado',
                                      style:
                                          TextStyle(color: Color(0xFF2D3142))),
                                ),
                              ],
                              onChanged: (value) {
                                if (value != null) {
                                  setState(() => sortBy = value);
                                }
                              },
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                // Lista de Proveedores
                Expanded(
                  child: FutureBuilder<List<Provider>>(
                    future: _futureProviders,
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const Center(child: CircularProgressIndicator());
                      } else if (snapshot.hasError) {
                        return const Center(
                            child: Text('Error al cargar proveedores.'));
                      } else if (snapshot.hasData) {
                        final filteredProviders =
                            _filteredProviders(snapshot.data!);
                        return ListView.builder(
                          itemCount: filteredProviders.length,
                          itemBuilder: (context, index) {
                            final proveedor = filteredProviders[index];
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 16.0),
                              child: FutureBuilder<List<Purchase>>(
                                future: PurchaseService().getPurchaseByProvider(
                                    proveedor.idProveedor),
                                builder: (context, snapshot) {
                                  if (snapshot.connectionState ==
                                      ConnectionState.waiting) {
                                    return const Center(
                                        child: CircularProgressIndicator());
                                  } else if (snapshot.hasError) {
                                    return const Center(
                                        child: Text(
                                            'Error al cargar última compra.'));
                                  } else if (snapshot.hasData) {
                                    final purchases = snapshot.data!;
                                    if (purchases.isNotEmpty) {
                                      final purchase = purchases[0];
                                      return infoCard(
                                        typeId: 'NIT',
                                        id: proveedor.nitProveedor,
                                        name: proveedor.nombreProveedor,
                                        address: proveedor.direccionProveedor,
                                        phone: proveedor.telefonoProveedor,
                                        status: proveedor.estadoProveedor,
                                        icon: Icons.calendar_today_outlined,
                                        title: 'Última compra',
                                        date: DateFormat('dd MMMM yyyy', 'es')
                                            .format(purchase.fechaCompra),
                                        value: NumberFormat.currency(
                                                locale: 'es', symbol: '\$')
                                            .format(purchase.valorCompra),
                                      );
                                    } else {
                                      // Mostrar la tarjeta del proveedor con datos predeterminados si no hay compras
                                      return infoCard(
                                        typeId: 'NIT',
                                        id: proveedor.nitProveedor,
                                        name: proveedor.nombreProveedor,
                                        address: proveedor.direccionProveedor,
                                        phone: proveedor.telefonoProveedor,
                                        status: proveedor.estadoProveedor,
                                        icon: Icons.calendar_today_outlined,
                                        title: 'Última compra',
                                        date: 'N/A', // Fecha predeterminada
                                        value: 'N/A', // Valor predeterminado
                                      );
                                    }
                                  } else {
                                    // Mostrar la tarjeta del proveedor con datos predeterminados si no hay datos
                                    return infoCard(
                                      typeId: 'NIT',
                                      id: proveedor.nitProveedor,
                                      name: proveedor.nombreProveedor,
                                      address: proveedor.direccionProveedor,
                                      phone: proveedor.telefonoProveedor,
                                      status: proveedor.estadoProveedor,
                                      icon: Icons.calendar_today_outlined,
                                      title: 'Última compra',
                                      date: 'N/A', // Fecha predeterminada
                                      value: 'N/A', // Valor predeterminado
                                    );
                                  }
                                },
                              ),
                            );
                          },
                        );
                      } else {
                        return const Center(
                            child: Text('No hay proveedores disponibles.'));
                      }
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
