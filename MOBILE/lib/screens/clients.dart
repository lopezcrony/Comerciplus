import 'package:intl/intl.dart';
import 'package:flutter/material.dart';

import '../widgets/appBar_Screens.dart';
import '../widgets/infoCard.dart';
import '../widgets/loading.dart';
import '../widgets/search.dart';

import '../models/client.dart';
import '../models/credits.dart';

import '../services/clients.dart';
import '../services/credits.dart';

class ClientScreen extends StatefulWidget {
  const ClientScreen({super.key});

  @override
  State<ClientScreen> createState() => _ClientScreenState();
}

class _ClientScreenState extends State<ClientScreen> {
  late Future<Map<Client, List<Credit>>> _futureClientCredits;

  String searchTerm = '';
  String sortBy = 'nombreCliente';
  bool isAscending = true;

  @override
  void initState() {
    super.initState();
    _futureClientCredits = _fetchClientCredits();
  }

  Future<Map<Client, List<Credit>>> _fetchClientCredits() async {
    try {
      final clients = await ClientService().getClients();
      final clientCredits = <Client, List<Credit>>{};

      for (var client in clients) {
        final credits =
            await CreditService().getCreditsByClient(client.idCliente);
        clientCredits[client] = credits;
      }

      return clientCredits;
    } catch (error) {
      rethrow;
    }
  }

  // Parámetros del buscador
  Map<Client, List<Credit>> _filteredClientCredits(
      Map<Client, List<Credit>> clientCredits) {
    final filtered = clientCredits.entries.where((entry) {
      final client = entry.key;
      return client.nombreCliente
              .toLowerCase()
              .contains(searchTerm.toLowerCase()) ||
          client.apellidoCliente
              .toLowerCase()
              .contains(searchTerm.toLowerCase()) ||
          client.cedulaCliente.toLowerCase().contains(searchTerm.toLowerCase());
    }).toList();

    filtered.sort((a, b) {
      final clientA = a.key.nombreCliente;
      final clientB = b.key.nombreCliente;
      return isAscending
          ? clientA.compareTo(clientB)
          : clientB.compareTo(clientA);
    });

    return Map.fromEntries(filtered);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppBarScreens(nameModule: 'Clientes'),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
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
            Expanded(
              child: FutureBuilder<Map<Client, List<Credit>>>(
                future: _futureClientCredits,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const LoadingIndicator(
                        message: 'Cargando clientes...');
                  } else if (snapshot.hasError) {
                    return Center(
                      child: Text('Error: ${snapshot.error}'),
                    );
                  } else if (snapshot.hasData) {
                    final filteredClientCredits =
                        _filteredClientCredits(snapshot.data!);

                    if (filteredClientCredits.isEmpty) {
                      return const Center(
                        child: Text('No hay clientes registrados.'),
                      );
                    }

                    return ListView.builder(
                      itemCount: filteredClientCredits.length,
                      itemBuilder: (context, index) {
                        final client =
                            filteredClientCredits.keys.elementAt(index);
                        final credits = filteredClientCredits[client] ?? [];

                        return Padding(
                          padding: const EdgeInsets.only(bottom: 16),
                          child: InfoCard(
                            typeId: 'CC',
                            id: client.cedulaCliente,
                            name:
                                '${client.nombreCliente} ${client.apellidoCliente}',
                            address: client.direccionCliente,
                            phone: client.telefonoCliente,
                            status: client.estadoCliente,
                            icon: Icons.credit_card_outlined,
                            title: 'Deuda Actual',
                            value: credits.isNotEmpty
                                ? NumberFormat.currency(
                                        locale: 'es', symbol: '\$')
                                    .format(credits[0].totalCredito)
                                : 'No hay créditos',
                          ),
                        );
                      },
                    );
                  } else {
                    return const Center(
                      child: Text('No hay clientes disponibles.'),
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
