import 'package:comerciplus/models/detailSale.dart';
import 'package:comerciplus/services/detailSales.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:google_fonts/google_fonts.dart';

import '../services/sales.dart';
import '../models/sale.dart';


// Definición de colores personalizados
class AppColors {
  static const Color primary = Color(0xFF5B8AF2);
  static const Color secondary = Color(0xFFEDF2FF);
  static const Color accent = Color(0xFF83A4FF);
  static const Color background = Color(0xFFF8FAFF);
  static const Color cardBackground = Colors.white;
  static const Color text = Color(0xFF2D3142);
  static const Color textLight = Color(0xFF9BA3B2);
}

class ResumenVentas extends StatefulWidget {
  const ResumenVentas({super.key});

  @override
  _ResumenVentasState createState() => _ResumenVentasState();
}

class _ResumenVentasState extends State<ResumenVentas>
    with SingleTickerProviderStateMixin {
  final TextEditingController _searchController = TextEditingController();
  Set<String> diasAbiertos = {};
  Map<String, List<Sales>> ventasPorDia = {};
  late AnimationController _animationController;

  @override
  void initState() {
    super.initState();
    _initializeData();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _initializeData() async {
    try {
      // Obtiene la lista de ventas desde la API
      List<Sales> ventas = await SaleService().getSales();

      // Organiza las ventas por fecha
      setState(() {
        ventasPorDia = {};
        for (var venta in ventas) {
          String fecha = DateFormat('yyyy-MM-dd').format(venta.fechaVenta);
          ventasPorDia.putIfAbsent(fecha, () => []);
          ventasPorDia[fecha]!.add(
            Sales(
                idVenta: venta.idVenta,
                fechaVenta: venta.fechaVenta,
                totalVenta: venta
                    .totalVenta, // Puedes agregar los productos si tu API los proporciona
                estadoVenta: venta.estadoVenta),
          );
        }
      });
    } catch (error) {
      // Manejo de errores (puedes mostrar un mensaje de error en pantalla)
      print("Error al cargar ventas: $error");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: ThemeData(
        textTheme: GoogleFonts.poppinsTextTheme(Theme.of(context).textTheme),
        scaffoldBackgroundColor: AppColors.background,
      ),
      child: Scaffold(
        body: CustomScrollView(
          slivers: [
            SliverAppBar(
              expandedHeight: 120.0,
              floating: true,
              pinned: true,
              elevation: 0,
              backgroundColor: AppColors.background,
              flexibleSpace: FlexibleSpaceBar(
                title: Text(
                  'Resumen de Ventas',
                  style: GoogleFonts.poppins(
                    color: AppColors.text,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                centerTitle: true,
              ),
            ),
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
                    prefixIcon:
                        const Icon(Icons.search, color: AppColors.accent),
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
                    contentPadding: const EdgeInsets.symmetric(
                        horizontal: 20, vertical: 15),
                  ),
                ),
              ),
            ),
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  String fecha = ventasPorDia.keys.elementAt(index);
                  List<Sales> ventas = ventasPorDia[fecha]!;
                  return _buildDayCard(fecha, ventas);
                },
                childCount: ventasPorDia.length,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDayCard(String fecha, List<Sales> ventas) {
    bool estaAbierto = diasAbiertos.contains(fecha);
    double totalDelDia = ventas.fold(0, (sum, venta) => sum + venta.totalVenta);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.cardBackground,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: Column(
            children: [
              InkWell(
                onTap: () {
                  setState(() {
                    if (estaAbierto) {
                      diasAbiertos.remove(fecha);
                      _animationController.reverse();
                    } else {
                      diasAbiertos.add(fecha);
                      _animationController.forward();
                    }
                  });
                },
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: estaAbierto
                        ? AppColors.secondary
                        : AppColors.cardBackground,
                    border: Border(
                      bottom: BorderSide(
                        color: estaAbierto
                            ? AppColors.accent.withOpacity(0.2)
                            : Colors.transparent,
                        width: 1,
                      ),
                    ),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: AppColors.secondary,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Icon(
                                  Icons.calendar_today,
                                  size: 20,
                                  color: AppColors.primary,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Text(
                                DateFormat('EEEE, d MMMM yyyy', 'es_ES')
                                    .format(DateTime.parse(fecha)),
                                style: GoogleFonts.poppins(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.text,
                                ),
                              ),
                            ],
                          ),
                          RotationTransition(
                            turns: Tween(begin: 0.0, end: 0.5)
                                .animate(_animationController),
                            child: const Icon(
                              Icons.keyboard_arrow_down,
                              color: AppColors.primary,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: AppColors.secondary,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _buildStatistic(
                              'Total del día',
                              '\$${totalDelDia.toStringAsFixed(2)}',
                              Icons.attach_money,
                            ),
                            Container(
                              height: 30,
                              width: 1,
                              color: AppColors.accent.withOpacity(0.2),
                            ),
                            _buildStatistic(
                              'Ventas realizadas',
                              '${ventas.length}',
                              Icons.shopping_cart,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              if (estaAbierto) ...[
                ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: ventas.length,
                  itemBuilder: (context, index) {
                    final venta = ventas[index];
                    return _buildVentaItem(venta);
                  },
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatistic(String label, String value, IconData icon) {
    return Row(
      children: [
        Icon(icon, size: 16, color: AppColors.primary),
        const SizedBox(width: 8),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                color: AppColors.textLight,
              ),
            ),
            Text(
              value,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.text,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildVentaItem(Sales venta) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.secondary.withOpacity(0.3),
        borderRadius: BorderRadius.circular(15),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: AppColors.primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: const Icon(
            Icons.receipt_outlined,
            color: AppColors.primary,
            size: 24,
          ),
        ),
        title: Text(
          '#${venta.idVenta}',
          style: const TextStyle(
            fontWeight: FontWeight.w600,
            color: AppColors.text,
          ),
        ),
        subtitle: Text(
          DateFormat('HH:mm').format(venta.fechaVenta),
          style: const TextStyle(color: AppColors.textLight),
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  '\$${venta.totalVenta.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 2),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Text(
                    'Ver detalle',
                    style: TextStyle(
                      fontSize: 10,
                      color: AppColors.primary,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
        // onTap: () => _mostrarDetallesVenta(venta),
      ),
    );
  }

// void _mostrarDetallesVenta(Sales venta) {
//   showDialog(
//     context: context,
//     builder: (context) => FutureBuilder<List<Detailsale>>(
//       future: DetailSaleService().getSaleDetails(venta.idVenta),
//       builder: (context, snapshot) {
//         if (snapshot.connectionState == ConnectionState.waiting) {
//           return Center(child: CircularProgressIndicator());
//         } else if (snapshot.hasError) {
//           return Center(child: Text('Error al cargar los detalles de la venta'));
//         } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
//           return Center(child: Text('No se encontraron detalles para esta venta'));
//         }

//         final detallesVenta = snapshot.data!;

//         return Dialog(
//           shape: RoundedRectangleBorder(
//             borderRadius: BorderRadius.circular(20),
//           ),
//           child: Container(
//             padding: const EdgeInsets.all(24),
//             constraints: const BoxConstraints(maxWidth: 400),
//             child: Column(
//               mainAxisSize: MainAxisSize.min,
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 Row(
//                   mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                   children: [
//                     Row(
//                       children: [
//                         Container(
//                           padding: const EdgeInsets.all(8),
//                           decoration: BoxDecoration(
//                             color: AppColors.secondary,
//                             borderRadius: BorderRadius.circular(12),
//                           ),
//                           child: const Icon(Icons.receipt_outlined,
//                               color: AppColors.primary),
//                         ),
//                         const SizedBox(width: 12),
//                         Text(
//                           'Venta #${venta.numero}',
//                           style: GoogleFonts.poppins(
//                             fontSize: 20,
//                             fontWeight: FontWeight.w600,
//                             color: AppColors.text,
//                           ),
//                         ),
//                       ],
//                     ),
//                     IconButton(
//                       icon: const Icon(Icons.close, color: AppColors.text),
//                       onPressed: () => Navigator.of(context).pop(),
//                     ),
//                   ],
//                 ),
//                 const SizedBox(height: 24),
//                 Container(
//                   padding: const EdgeInsets.all(16),
//                   decoration: BoxDecoration(
//                     color: AppColors.secondary,
//                     borderRadius: BorderRadius.circular(12),
//                   ),
//                   child: Column(
//                     crossAxisAlignment: CrossAxisAlignment.start,
//                     children: [
//                       _buildDetalleRow(
//                         Icons.calendar_today,
//                         'Fecha',
//                         DateFormat('dd/MM/yyyy HH:mm').format(venta.fecha),
//                       ),
//                       const SizedBox(height: 12),
//                       _buildDetalleRow(
//                         Icons.shopping_bag_outlined,
//                         'Total productos',
//                         '${detallesVenta.length}',
//                       ),
//                       const SizedBox(height: 12),
//                       _buildDetalleRow(
//                         Icons.attach_money,
//                         'Total',
//                         '\$${venta.total.toStringAsFixed(2)}',
//                       ),
//                     ],
//                   ),
//                 ),
//                 const SizedBox(height: 24),
//                 const Text(
//                   'Productos',
//                   style: TextStyle(
//                     fontSize: 18,
//                     fontWeight: FontWeight.w600,
//                     color: AppColors.text,
//                   ),
//                 ),
//                 const SizedBox(height: 12),
//                 Container(
//                   decoration: BoxDecoration(
//                     borderRadius: BorderRadius.circular(12),
//                     border: Border.all(color: AppColors.accent.withOpacity(0.2)),
//                   ),
//                   child: ListView.builder(
//                     shrinkWrap: true,
//                     physics: const NeverScrollableScrollPhysics(),
//                     itemCount: detallesVenta.length,
//                     itemBuilder: (context, index) {
//                       final producto = detallesVenta[index];
//                       return ListTile(
//                         contentPadding:
//                             const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
//                         leading: const Icon(Icons.shopping_cart,
//                             color: AppColors.primary),
//                         title: Text(
//                           producto.idProducto, // Nombre del producto
//                           style: GoogleFonts.poppins(
//                             fontSize: 16,
//                             fontWeight: FontWeight.w500,
//                             color: AppColors.text,
//                           ),
//                         ),
//                         subtitle: Text(
//                           'Cantidad: ${producto.cantidadProducto} - Precio: \$${producto.subtotal.toStringAsFixed(2)}',
//                           style: TextStyle(
//                               color: AppColors.text.withOpacity(0.6)),
//                         ),
//                         trailing: Text(
//                           '\$${(producto.cantidadProducto * producto.subtotal).toStringAsFixed(2)}',
//                           style: GoogleFonts.poppins(
//                             fontSize: 16,
//                             fontWeight: FontWeight.w600,
//                             color: AppColors.primary,
//                           ),
//                         ),
//                       );
//                     },
//                   ),
//                 ),
//                 const SizedBox(height: 24),
//                 Align(
//                   alignment: Alignment.centerRight,
//                   child: ElevatedButton(
//                     style: ElevatedButton.styleFrom(
//                       backgroundColor: AppColors.primary,
//                       padding:
//                           const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
//                       shape: RoundedRectangleBorder(
//                         borderRadius: BorderRadius.circular(12),
//                       ),
//                     ),
//                     onPressed: () => Navigator.of(context).pop(),
//                     child: Text(
//                       'Cerrar',
//                       style: GoogleFonts.poppins(
//                         fontSize: 16,
//                         color: Colors.white,
//                         fontWeight: FontWeight.w500,
//                       ),
//                     ),
//                   ),
//                 ),
//               ],
//             ),
//           ),
//         );
//       },
//     ),
//   );
// }

//   Widget _buildDetalleRow(IconData icon, String title, String value) {
//     return Row(
//       children: [
//         Icon(icon, color: AppColors.primary),
//        const SizedBox(width: 8),
//         Text(
//           '$title: ',
//           style:const TextStyle(
//             fontWeight: FontWeight.w600,
//             color: AppColors.text,
//           ),
//         ),
//         Text(
//           value,
//           style: TextStyle(
//             color: AppColors.text.withOpacity(0.7),
//           ),
//         ),
//       ],
//     );
//   }
// }
}
