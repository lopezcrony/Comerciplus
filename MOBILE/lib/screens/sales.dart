import 'package:comerciplus/screens/saleDetail.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:google_fonts/google_fonts.dart';

import '../services/sales.dart';
import '../models/sale.dart';
import '../shared/AppColors.dart';
import '../widgets/appBar_Screens.dart';

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
  Map<String, List<Sales>> ventasFiltradas =
      {}; // Agrega un mapa para las ventas filtradas
  late AnimationController _animationController;

  final formatoMoneda = NumberFormat.currency(
    locale: 'es_CO', // Cambia por el código de tu región, si es necesario
    symbol: '\$', // Símbolo de la moneda
    decimalDigits: 0, // Para evitar decimales
  );

  @override
  void initState() {
    super.initState();
    _initializeData();
    _searchController.addListener(
        _filterVentas); // Añadimos un listener para el controlador de búsqueda
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _searchController.removeListener(
        _filterVentas); // Removemos el listener al salir del estado
    _animationController.dispose();
    super.dispose();
  }

  // Función para inicializar las ventas
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
                totalVenta: venta.totalVenta,
                estadoVenta: venta.estadoVenta),
          );
        }
        // Inicializamos las ventas filtradas con todas las ventas por defecto
        ventasFiltradas = Map.from(ventasPorDia);
      });
    } catch (error) {
      // Manejo de errores
    }
  }

  // Función que se ejecuta cuando el texto del controlador de búsqueda cambia
  void _filterVentas() {
    String query = _searchController.text.toLowerCase();

    if (query.isEmpty) {
      // Si el campo de búsqueda está vacío, mostramos todas las ventas
      setState(() {
        ventasFiltradas = Map.from(ventasPorDia);
      });
    } else {
      Map<String, List<Sales>> filteredVentas = {};

      ventasPorDia.forEach((fecha, ventas) {
        // Filtra las ventas por número de venta o fecha
        List<Sales> filteredList = ventas.where((venta) {
          return venta.idVenta.toString().contains(query) ||
              DateFormat('yyyy-MM-dd').format(venta.fechaVenta).contains(query);
        }).toList();

        if (filteredList.isNotEmpty) {
          filteredVentas[fecha] = filteredList;
        }
      });

      setState(() {
        ventasFiltradas = filteredVentas;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppBarScreens(
        nameModule: 'Resumen de Ventas',
      ),
      body: CustomScrollView(
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
              ),
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                String fecha = ventasFiltradas.keys.elementAt(index);
                List<Sales> ventas = ventasFiltradas[fecha]!;
                return _buildDayCard(fecha, ventas);
              },
              childCount: ventasFiltradas.length,
            ),
          ),
        ],
      ),
    );
  }

  // Tu código para _buildDayCard y demás widgets
  Widget _buildDayCard(String fecha, List<Sales> ventas) {
    bool estaAbierto = diasAbiertos.contains(fecha);

    // Filtrar ventas activas
    List<Sales> ventasActivas =
        ventas.where((venta) => venta.estadoVenta).toList();
    double totalDelDia =
        ventasActivas.fold(0, (sum, venta) => sum + venta.totalVenta);

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
                              '\$${formatoMoneda.format(totalDelDia)}',
                              Icons.attach_money,
                            ),
                            Container(
                              height: 30,
                              width: 1,
                              color: AppColors.accent.withOpacity(0.2),
                            ),
                            _buildStatistic(
                              'Ventas realizadas',
                              '${ventasActivas.length}', // Solo las ventas activas
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
    bool isActive =
        venta.estadoVenta; // Si 'estadoVenta' es false, la venta no está activa

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: isActive
            ? AppColors.secondary.withOpacity(0.3)
            : Colors.grey.withOpacity(0.3), // Gris si no está activa
        borderRadius: BorderRadius.circular(15),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: isActive
                ? AppColors.primary.withOpacity(0.1)
                : Colors.grey.withOpacity(0.2), // Gris si no está activa
            borderRadius: BorderRadius.circular(12),
          ),
          child: const Icon(
            Icons.receipt_outlined,
            color: AppColors.primary,
            size: 24,
          ),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '#${venta.idVenta}',
              style: TextStyle(
                fontWeight: FontWeight.w600,
                color: isActive
                    ? AppColors.text
                    : Colors.grey, // Texto gris si no está activo
              ),
            ),
            if (!isActive) // Mostrar "Anulado" debajo del título si la venta no está activa
              const Padding(
                padding: EdgeInsets.only(top: 4),
                child: Text(
                  'Anulado',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.redAccent,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
          ],
        ),
        subtitle: Text(
          DateFormat('HH:mm').format(venta.fechaVenta),
          style: const TextStyle(color: AppColors.textLight),
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              '\$${formatoMoneda.format(venta.totalVenta)}',
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                color: AppColors.primary,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 2),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                color: isActive
                    ? AppColors.primary.withOpacity(0.1)
                    : Colors.grey.withOpacity(0.3), // Gris si no está activo
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
        onTap: () => mostrarDetallesVenta(context, venta),
      ),
    );
  }

}
