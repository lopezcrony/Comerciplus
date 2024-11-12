import 'package:intl/intl.dart';
import 'package:flutter/material.dart';

import '../widgets/infoCard.dart';
import '../widgets/appBar_Screens.dart';
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

    filteredClients.sort((a, b) {
      if (sortBy == 'nombreCliente') {
        return a.nombreCliente.compareTo(b.nombreCliente);
      } else {
        return (a.estadoCliente == b.estadoCliente)
            ? 0
            : a.estadoCliente
                ? -1
                : 1;
      }
    });

    return filteredClients;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppBarScreens(
        nameModule: 'Clientes',
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
              SearchFilter(
                onSearchChanged: (value) => setState(() => searchTerm = value),
                onSortChanged: (value) {
                  setState(() => sortBy = value!);
                                },
                sortBy: sortBy,
                sortOptions: const [
                  DropdownMenuItem(
                    value: 'nombreCliente',
                    child: Text('Por nombre', style: TextStyle(color: Color(0xFF2D3142))),
                  ),
                  DropdownMenuItem(
                    value: 'estado',
                    child: Text('Por estado', style: TextStyle(color: Color(0xFF2D3142))),
                  ),
                ],
              ),
              const SizedBox(height: 24),
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
                      return ListView.builder(
                        itemCount: filteredClients.length,
                        itemBuilder: (context, index) {
                          final client = filteredClients[index];
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 16.0),
                            child: FutureBuilder<Credit>(
                              future: CreditService().getCreditsByClient(client.idCliente),
                              builder: (context, creditSnapshot) {
                                if (creditSnapshot.connectionState == ConnectionState.waiting) {
                                  return const Center(child: CircularProgressIndicator());
                                } else if (creditSnapshot.hasError) {
                                  return const Center(child: Text('Error al cargar créditos.'));
                                } else if (creditSnapshot.hasData) {
                                  final credit = creditSnapshot.data!;
                                  return infoCard(
                                    typeId: 'CC',
                                    id: client.cedulaCliente,
                                    name: '${client.nombreCliente} ${client.apellidoCliente}',
                                    address: client.direccionCliente,
                                    phone: client.telefonoCliente,
                                    status: client.estadoCliente,
                                    icon: Icons.credit_card_outlined,
                                    title: 'Deuda Actual',
                                    value: NumberFormat.currency(locale: 'es', symbol: '\$').format(credit.totalCredito),
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
      ),
    );
  }
}
