import 'package:intl/intl.dart';
import 'package:flutter/material.dart';

import '../models/client.dart';
import '../models/credits.dart';
import '../services/clients.dart';
import '../services/credits.dart';
import '../widgets/infoCard.dart';
import '../widgets/appBar_Screens.dart';

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
              _buildFilters(),
              const SizedBox(height: 24),
              Expanded(
                child: FutureBuilder<List<Client>>(
                  future: _futureClients,
                  builder: (context, clientSnapshot) {
                    if (clientSnapshot.connectionState ==
                        ConnectionState.waiting) {
                      return const Center(child: CircularProgressIndicator());
                    } else if (clientSnapshot.hasError) {
                      return const Center(
                          child: Text('Error al cargar clientes.'));
                    } else if (clientSnapshot.hasData) {
                      final filteredClients =
                          _filteredClients(clientSnapshot.data!);
                      return ListView.builder(
                        itemCount: filteredClients.length,
                        itemBuilder: (context, index) {
                          final client = filteredClients[index];
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 16.0),
                            child: FutureBuilder<Credit>(
                              future: CreditService()
                                  .getCreditsByClient(client.idCliente),
                              builder: (context, creditSnapshot) {
                                if (creditSnapshot.connectionState ==
                                    ConnectionState.waiting) {
                                  return const Center(
                                      child: CircularProgressIndicator());
                                } else if (creditSnapshot.hasError) {
                                  return const Center(
                                      child: Text('Error al cargar créditos.'));
                                } else if (creditSnapshot.hasData) {
                                  final credit = creditSnapshot.data!;
                                  return infoCard(
                                    typeId: 'CC',
                                    id: client.cedulaCliente,
                                    name:
                                        '${client.nombreCliente} ${client.apellidoCliente}',
                                    address: client.direccionCliente,
                                    phone: client.telefonoCliente,
                                    status: client.estadoCliente,
                                    icon: Icons.credit_card_outlined,
                                    title: 'Deuda Actual',
                                    value: NumberFormat.currency(
                                            locale: 'es', symbol: '\$')
                                        .format(credit.totalCredito),
                                  );
                                } else {
                                  return const Center(
                                      child:
                                          Text('No hay créditos disponibles.'));
                                }
                              },
                            ),
                          );
                        },
                      );
                    } else {
                      return const Center(
                          child: Text('No hay clientes disponibles.'));
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

  Widget _buildFilters() {
    return Container(
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
          // Buscador de clientes
          Expanded(
            flex: 2,
            child: TextField(
              onChanged: (value) => setState(() => searchTerm = value),
              decoration: InputDecoration(
                hintText: 'Buscar cliente...',
                hintStyle: TextStyle(color: Colors.grey[400]),
                prefixIcon:
                    Icon(Icons.search, color: Colors.grey[400], size: 20),
                filled: true,
                fillColor: const Color(0xFFF8F9FF),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
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
                      value: 'nombreCliente',
                      child: Text('Por nombre',
                          style: TextStyle(color: Color(0xFF2D3142))),
                    ),
                    DropdownMenuItem(
                      value: 'estado',
                      child: Text('Por estado',
                          style: TextStyle(color: Color(0xFF2D3142))),
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
    );
  }
}
