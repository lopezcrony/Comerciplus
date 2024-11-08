import 'package:comerciplus/models/provider.dart';
import 'package:comerciplus/widgets/provider_card.dart';
import 'package:flutter/material.dart';
import '../services/providers.dart';

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

  List<Provider> _filterAndSortProviders(List<Provider> providers) {
    List<Provider> filteredProviders = providers
        .where((provider) => provider.nombreProveedor.toLowerCase().contains(searchTerm.toLowerCase()))
        .toList();

    filteredProviders.sort((a, b) {
      if (sortBy == 'nombre') {
        return a.nombreProveedor.compareTo(b.nombreProveedor);
      } else {
        return (a.estadoProveedor == b.estadoProveedor) ? 0 : a.estadoProveedor ? -1 : 1;
      }
    });

    return filteredProviders;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
                const Text(
                  'Directorio de Proveedores',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF2D3142),
                  ),
                ),
                const SizedBox(height: 24),
                // Filtros en una fila
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
                          onChanged: (value) => setState(() => searchTerm = value),
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
                        return const Center(child: Text('Error al cargar proveedores.'));
                      } else if (snapshot.hasData) {
                        final filteredProviders = _filterAndSortProviders(snapshot.data!);
                        return ListView.builder(
                          itemCount: filteredProviders.length,
                          itemBuilder: (context, index) {
                            final proveedor = filteredProviders[index];
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 16.0),
                              child: ProviderCard(proveedor: proveedor),
                            );
                          },
                        );
                      } else {
                        return const Center(child: Text('No hay proveedores disponibles.'));
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
