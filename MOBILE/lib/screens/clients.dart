import 'package:intl/intl.dart';
import 'package:flutter/material.dart';

import '../widgets/appBar_Screens.dart';
import '../widgets/infoCard.dart';
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
  late Future<List<Client>> _futureClients;
  String searchTerm = '';
  String sortBy = 'nombreCliente';
  bool isAscending = true;

  @override
  void initState() {
    super.initState();
    _futureClients = ClientService().getClients();
  }

  // Parámetros del buscador
  List<Client> _filteredClients(List<Client> clients) {
    List<Client> filteredClients = clients
        .where((client) =>
            client.nombreCliente
                .toLowerCase()
                .contains(searchTerm.toLowerCase()) ||
            client.apellidoCliente
                .toLowerCase()
                .contains(searchTerm.toLowerCase()) ||
            client.cedulaCliente
                .toLowerCase()
                .contains(searchTerm.toLowerCase()))
        .toList();

    filteredClients.sort((a, b) => isAscending
        ? a.nombreCliente.compareTo(b.nombreCliente)
        : b.nombreCliente.compareTo(a.nombreCliente));

    return filteredClients;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppBarScreens(
        nameModule: 'Clientes',
      ),
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
              child: FutureBuilder<List<Client>>(
                future: _futureClients,
                builder: (context, clientSnapshot) {
                  if (clientSnapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  } else if (clientSnapshot.hasError) {
                    return const Center(child: Text('Error al cargar clientes.'));
                  } else if (clientSnapshot.hasData) {
                    final filteredClients = _filteredClients(clientSnapshot.data!);
                    if (filteredClients.isEmpty) {
                      return const Center(child: Text('No hay clientes registrados.'));
                    }
                    return ListView.builder(
                      itemCount: filteredClients.length,
                      itemBuilder: (context, index) {
                        final client = filteredClients[index];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 16),
                          child: FutureBuilder<List<Credit>>(
                            future: CreditService().getCreditsByClient(client.idCliente),
                            builder: (context, creditSnapshot) {
                              if (creditSnapshot.connectionState == ConnectionState.waiting) {
                                return const Center(child: CircularProgressIndicator());
                              } else if (creditSnapshot.hasError) {
                                return Center(child: Text('Error al cargar créditos: ${creditSnapshot.error}'));
                              } else if (creditSnapshot.hasData) {
                                final credits = creditSnapshot.data!;
                                if (credits.isEmpty) {
                                  return const Center(child: Text('No hay créditos disponibles.'));
                                }
                                return InfoCard(
                                  typeId: 'CC',
                                  id: client.cedulaCliente,
                                  name: '${client.nombreCliente} ${client.apellidoCliente}',
                                  address: client.direccionCliente,
                                  phone: client.telefonoCliente,
                                  status: client.estadoCliente,
                                  icon: Icons.credit_card_outlined,
                                  title: 'Deuda Actual',
                                  value: NumberFormat.currency(locale: 'es', symbol: '\$').format(credits[0].totalCredito),
                                );
                              } else {
                                return const Center(child: Text('No hay créditos disponibles.'));
                              }
                            },
                          ),
                        );
                      },
                    );
                  } else {
                    return const Center(child: Text('No hay clientes disponibles.'));
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
