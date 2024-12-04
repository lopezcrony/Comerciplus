import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../widgets/appBar_Screens.dart';
import '../widgets/infoCard.dart';
import '../widgets/loading.dart';
import '../widgets/search.dart';

import '../models/purchase.dart';
import '../models/provider.dart';

import '../services/providers.dart';
import '../services/purchase.dart';

class ProvidersScreen extends StatefulWidget {
  const ProvidersScreen({super.key});

  @override
  State<ProvidersScreen> createState() => _ProvidersScreenState();
}

class _ProvidersScreenState extends State<ProvidersScreen> {
  late Future<Map<Provider, Purchase?>> _futureProviderPurchases;
  String searchTerm = '';
  bool isAscending = true;

  @override
  void initState() {
    super.initState();
    _futureProviderPurchases = _fetchProviderPurchases();
  }

  // Obtener proveedores y su última compra
  Future<Map<Provider, Purchase?>> _fetchProviderPurchases() async {
    try {
      final providers = await ProviderService().getProviders();
      final providerPurchases = <Provider, Purchase?>{};

      for (var provider in providers) {
        final purchases = await PurchaseService().getPurchaseByProvider(provider.idProveedor);
        providerPurchases[provider] = purchases.isNotEmpty ? purchases.first : null;
      }

      return providerPurchases;
    } catch (error) {
      rethrow;
    }
  }

  // Filtrar y ordenar proveedores con sus compras
  Map<Provider, Purchase?> _filteredProviderPurchases(Map<Provider, Purchase?> data) {
    final filtered = data.entries.where((entry) {
      final provider = entry.key;
      return provider.nombreProveedor.toLowerCase().contains(searchTerm.toLowerCase()) ||
             provider.nitProveedor.toLowerCase().contains(searchTerm.toLowerCase());
    }).toList();

    filtered.sort((a, b) {
      final providerA = a.key.nombreProveedor;
      final providerB = b.key.nombreProveedor;
      return isAscending ? providerA.compareTo(providerB) : providerB.compareTo(providerA);
    });

    return Map.fromEntries(filtered);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppBarScreens(nameModule: 'Proveedores'),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Componente de búsqueda y orden
            SearchFilter(
              onSearchChanged: (value) => setState(() => searchTerm = value),
              onSortPressed: () {
                setState(() {
                  isAscending = !isAscending;
                });
              },
              isAscending: isAscending,
            ),
            const SizedBox(height: 10),
            // Lista de Proveedores
            Expanded(
              child: FutureBuilder<Map<Provider, Purchase?>>(
                future: _futureProviderPurchases,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const LoadingIndicator(message: 'Cargando proveedores...');
                  } else if (snapshot.hasError) {
                    return Center(
                      child: Text('Error: ${snapshot.error}'),
                    );
                  } else if (snapshot.hasData) {
                    final filteredProviderPurchases =
                        _filteredProviderPurchases(snapshot.data!);

                    if (filteredProviderPurchases.isEmpty) {
                      return const Center(
                        child: Text('No hay proveedores disponibles.'),
                      );
                    }

                    return ListView.builder(
                      itemCount: filteredProviderPurchases.length,
                      itemBuilder: (context, index) {
                        final provider = filteredProviderPurchases.keys.elementAt(index);
                        final purchase = filteredProviderPurchases[provider];

                        return Padding(
                          padding: const EdgeInsets.only(bottom: 16),
                          child: InfoCard(
                            typeId: 'NIT',
                            id: provider.nitProveedor,
                            name: provider.nombreProveedor,
                            address: provider.direccionProveedor,
                            phone: provider.telefonoProveedor,
                            status: provider.estadoProveedor,
                            icon: Icons.calendar_today_outlined,
                            title: 'Última compra',
                            date: purchase != null
                                ? DateFormat('dd MMMM yyyy', 'es').format(purchase.fechaCompra)
                                : 'Sin compras',
                            value: purchase != null
                                ? NumberFormat.currency(locale: 'es', symbol: '\$')
                                    .format(purchase.valorCompra)
                                : '0,0 \$',
                          ),
                        );
                      },
                    );
                  } else {
                    return const Center(
                      child: Text('No hay proveedores disponibles.'),
                    );
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
