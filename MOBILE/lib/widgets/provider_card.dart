import 'package:comerciplus/models/provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

class ProviderCard extends StatelessWidget {
  final Provider proveedor;

  const ProviderCard({
    super.key,
    required this.proveedor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
        border: BorderDirectional(
          end: BorderSide(
            width: 6,
            color: proveedor.estadoProveedor
                ? const Color(0xFF4CAF50)
                : const Color(0xFFFF5252),
          ),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Información principal
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Row(
                    children: [
                      Text(
                        proveedor.nombreProveedor,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF2D3142),
                        ),
                      ),
                      const SizedBox(width: 12),
                      _buildIdentifier('NIT', proveedor.nitProveedor),
                    ],
                  ),
                ),
                // Estado del proveedor
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: proveedor.estadoProveedor
                        ? const Color(0xFFE8F5E9)
                        : const Color(0xFFFFEBEE),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    proveedor.estadoProveedor ? 'Activo' : 'Inactivo',
                    style: TextStyle(
                      color: proveedor.estadoProveedor
                          ? const Color(0xFF2E7D32)
                          : const Color(0xFFC62828),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    children: [
                      _buildContactRow(
                        Icons.location_on_outlined,
                        proveedor.direccionProveedor,
                        onTap: () {
                          // Implementar acción para abrir en maps
                        },
                      ),
                      const SizedBox(height: 12),
                      _buildContactRow(
                        Icons.phone_outlined,
                        proveedor.telefonoProveedor,
                        onTap: () {
                          // Implementar acción para llamar
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildStatsRow(icon: Icons.calendar_today_outlined),
                ),
              ],
            ),
          ],
        ),
      ),
    ).animate().fadeIn().slideX(
          begin: 0.2,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOutQuad,
        );
  }

  Widget _buildIdentifier(String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFFF8F9FF),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: const Color(0xFFE0E0E0)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            '$label: ',
            style: const TextStyle(
              color: Color(0xFF4F5B93),
              fontWeight: FontWeight.w500,
              fontSize: 13,
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              color: Color(0xFF2D3142),
              fontWeight: FontWeight.w600,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContactRow(IconData icon, String text,
      {VoidCallback? onTap}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFFF8F9FF),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, color: const Color(0xFF4F5B93), size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                text,
                style: const TextStyle(
                  fontSize: 15,
                  color: Color(0xFF4A4A4A),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsRow({required IconData icon}) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF8F9FF),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE0E0E0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: const Color(0xFF4F5B93)),
              const SizedBox(width: 6),
              const Text(
                'Última compra: ',
                style: TextStyle(
                  color: Color(0xFF4F5B93),
                  fontSize: 12,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8), // Aumentado de 4 a 8
          const Text(
            '15 Mar 2024',
            style: TextStyle(
              color: Color(0xFF2D3142),
              fontWeight: FontWeight.w600,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            '80.000,00 COP',
            style: TextStyle(
              color: Color.fromARGB(255, 86, 187, 77),
              fontWeight: FontWeight.w600,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }
}