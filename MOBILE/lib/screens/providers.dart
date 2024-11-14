import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../widgets/appBar_Screens.dart';
import '../widgets/infoCard.dart';
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
  late Future<List<Provider>> _futureProviders;
  String searchTerm = '';
  String sortBy = 'nombreProveedor';

  @override
  void initState() {
    super.initState();
    _futureProviders = ProviderService().getProviders();
  }

  // Filtrar y ordenar proveedores
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
      if (sortBy == 'nombreProveedor') {
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
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Componente de búsqueda y filtro
              SearchFilter(
                onSearchChanged: (value) => setState(() => searchTerm = value),
                onSortChanged: (value) {
                  setState(() => sortBy = value!);
                },
                sortBy: sortBy,
                sortOptions: const [
                  DropdownMenuItem(
                    value: 'nombreProveedor',
                    child: Text('Ordenar',
                        style: TextStyle(color: Color(0xFF2D3142))),
                  ),
                ],
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
                              future: PurchaseService()
                                  .getPurchaseByProvider(proveedor.idProveedor),
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
                                      date: 'Sin compras registradas',
                                      value: '0,0 \$',
                                    );
                                  }
                                }
                                return const SizedBox.shrink();
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
    );
  }
}