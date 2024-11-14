import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class infoCard extends StatelessWidget {
  final String typeId, id, name, address, phone, title, value;
  final String? date;
  final bool status;
  final IconData icon;

  const infoCard({
    super.key,
    required this.typeId,
    required this.id,
    required this.name,
    required this.address,
    required this.phone,
    required this.status,
    required this.icon,
    required this.title,
    required this.value,
    this.date,
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
            color: status ? const Color(0xFF4CAF50) : const Color(0xFFFF5252),
          ),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Row(
                    children: [
                      Text(
                        name,
                        style: GoogleFonts.poppins(
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                            color: const Color(0xFF2D3142)),
                      ),
                      const SizedBox(width: 12),
                      _buildIdentifier(typeId, id),
                    ],
                  ),
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: status
                        ? const Color(0xFFE8F5E9)
                        : const Color(0xFFFFEBEE),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    status ? 'Activo' : 'Inactivo',
                    style: GoogleFonts.poppins(
                      color: status
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
                        address,
                        onTap: () {
                          // Implementar acción para abrir en maps
                        },
                      ),
                      const SizedBox(height: 12),
                      _buildContactRow(
                        Icons.phone_outlined,
                        phone,
                        onTap: () {
                          // Implementar acción para llamar
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _buildCreditRow(
                    icon: icon,
                    value: value,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
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
            style: GoogleFonts.poppins(
              color: const Color(0xFF4F5B93),
              fontWeight: FontWeight.w500,
              fontSize: 13,
            ),
          ),
          Text(
            value,
            style: GoogleFonts.poppins(
              color: const Color(0xFF2D3142),
              fontWeight: FontWeight.w600,
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContactRow(IconData icon, String text, {VoidCallback? onTap}) {
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
                style: GoogleFonts.poppins(
                  fontSize: 15,
                  color: const Color(0xFF4A4A4A),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCreditRow({required IconData icon, required String value}) {
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
              Text(
                '$title: ',
                style: GoogleFonts.poppins(
                  color: const Color(0xFF4F5B93),
                  fontSize: 12,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          if (date != null)
            Text(
              date!,
              style: GoogleFonts.poppins(
                color: const Color(0xFF2D3142),
                fontWeight: FontWeight.w600,
                fontSize: 14,
              ),
            ),
          const SizedBox(height: 8),
          Text(
            value,
            style: GoogleFonts.poppins(
              color: const Color.fromARGB(255, 86, 187, 77),
              fontWeight: FontWeight.w600,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }
}
