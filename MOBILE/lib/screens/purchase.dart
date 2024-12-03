import 'package:comerciplus/screens/purchaseDetails.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import 'package:comerciplus/models/purchase.dart';
import 'package:comerciplus/services/purchase.dart';

import '../shared/AppColors.dart';
import '../widgets/appBar_Screens.dart';

class ShoppingListScreen extends StatefulWidget {
  const ShoppingListScreen({super.key});

  @override
  _ShoppingListScreenState createState() => _ShoppingListScreenState();
}

class _ShoppingListScreenState extends State<ShoppingListScreen> {
  late Future<List<Purchase>> purchases;
  final TextEditingController _searchController = TextEditingController();
  List<Purchase> _filteredPurchases = [];
  List<Purchase> _allPurchases = [];
  Map<String, List<Purchase>> purchasesByDay = {};


  @override
  void initState() {
    super.initState();
    purchases = PurchaseService().getPurchases();
    purchases.then((value) {
      setState(() {
        _allPurchases = value;
        _filteredPurchases = _allPurchases;
      });
    });
  }

  // ignore: unused_element
  void _initializeData() async {
    try {
      // Obtiene la lista de compras desde la API
      purchases = PurchaseService().getPurchases();

      // Organiza las compras por fecha
      setState(() {
      purchasesByDay = {};
      for (var p in _allPurchases) {
        String fecha = DateFormat('yyyy-MM-dd').format(p.fechaRegistro);
        purchasesByDay.putIfAbsent(fecha, () => []);
        purchasesByDay[fecha]!.add(p);
      }
      // Inicializamos las compras filtradas con todas las compras por defecto
      _filteredPurchases = _allPurchases;
      });
    } catch (error) {
      // Manejo de errores
    }
  }

  void _filterPurchases(String query) {
    setState(() {
      if (query.isEmpty) {
        _filteredPurchases = _allPurchases;
      } else {
        _filteredPurchases = _allPurchases.where((purchase) {
          final idMatch =
              purchase.idCompra.toString().contains(query.toLowerCase());
          final dateMatch = DateFormat('dd/MM/yyyy')
              .format(purchase.fechaRegistro)
              .toLowerCase()
              .contains(query.toLowerCase());
          return idMatch || dateMatch;
        }).toList();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppBarScreens(
        nameModule: 'Compras',
      ),
      body: 
      CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding:
                  const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              child: TextField(
                controller: _searchController,
                style: const TextStyle(color: AppColors.text),
                decoration: InputDecoration(
                  hintText: 'Buscar por número o fecha...',
                  hintStyle: const TextStyle(color: AppColors.textLight),
                  prefixIcon: const Icon(Icons.search, color: AppColors.accent),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                    borderSide: BorderSide.none,
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                    borderSide: BorderSide.none,
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                    borderSide:
                        const BorderSide(color: AppColors.accent, width: 2),
                  ),
                  filled: true,
                  fillColor: AppColors.cardBackground,
                  contentPadding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                ),
                onChanged: _filterPurchases,
              ),
            ),
          ),
          
    
            SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) {
              String fecha = purchasesByDay.keys.elementAt(index);
              List<Purchase> compras = purchasesByDay[fecha]!;

              return Card(
                elevation: 4,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
                margin: const EdgeInsets.only(
                  bottom: 16.0, left: 16.0, right: 16.0),
                color: Colors.white,
                child: ExpansionTile(
                title: Text(
                  DateFormat('dd MMMM yyyy', 'es').format(DateTime.parse(fecha)),
                  style: GoogleFonts.poppins(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: AppColors.text),
                ),
                children: compras.map((purchase) {
                  return ListTile(
                  title: Text(
                    'Compra ${purchase.idCompra}',
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      color: AppColors.text),
                  ),
                  subtitle: Text(
                    '\$${purchase.valorCompra.toStringAsFixed(2)}',
                    style: GoogleFonts.poppins(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w600),
                  ),
                  onTap: () => showPurchaseDetailsDialog(context, purchase),
                  );
                }).toList(),
                ),
              );
              },
              childCount: purchasesByDay.length,
            ),
            ),

          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                final purchase = _filteredPurchases[index];
                return Card(
                  elevation: 4,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                  margin: const EdgeInsets.only(
                      bottom: 16.0, left: 16.0, right: 16.0),
                  color: Colors.white,
                  child: InkWell(
                    onTap: () => showPurchaseDetailsDialog(context, purchase),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Compra ${purchase.idCompra}',
                                style: GoogleFonts.poppins(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.text),
                              ),
                              const Icon(Icons.shopping_bag,
                                  color: AppColors.primary),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              const Icon(Icons.calendar_today,
                                  size: 16, color: AppColors.primary),
                              const SizedBox(width: 4),
                              Text(
                                DateFormat('dd MMMM yyyy', 'es')
                                          .format(purchase.fechaRegistro),
                                style: GoogleFonts.poppins(
                                    color: AppColors.text.withOpacity(0.7)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              const Icon(Icons.attach_money,
                                  size: 16, color: AppColors.primary),
                              const SizedBox(width: 4),
                              Text(
                                '\$${purchase.valorCompra.toStringAsFixed(2)}',
                                style: GoogleFonts.poppins(
                                    color: AppColors.primary,
                                    fontWeight: FontWeight.w600),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Align(
                            alignment: Alignment.centerRight,
                            child: TextButton(
                              onPressed: () =>
                                  showPurchaseDetailsDialog(context, purchase),
                              style: TextButton.styleFrom(
                                backgroundColor: Colors.transparent,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(18),
                                ),
                                elevation: 2,
                                shadowColor:
                                    const Color.fromARGB(255, 221, 220, 220)
                                        .withOpacity(0.2),
                              ),
                              child: Text(
                                'Ver Detalle',
                                style: GoogleFonts.poppins(
                                  color: Colors.blue,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
              childCount: _filteredPurchases.length,
            ),
          ),
        ],
      ),
    );
  }
}