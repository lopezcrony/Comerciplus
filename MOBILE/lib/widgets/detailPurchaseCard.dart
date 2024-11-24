import 'package:comerciplus/shared/AppColors.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class DetalleRow extends StatelessWidget {
    final IconData icon;
    final String label;
    final String value;

    const DetalleRow({
      super.key,
      required this.icon,
      required this.label,
      required this.value,
    });

    @override
    Widget build(BuildContext context) {
      return Row(
        children: [
          Icon(icon, size: 18, color: AppColors.primary),
          const SizedBox(width: 8),
          Text(
            '$label: ',
            style: GoogleFonts.poppins(fontWeight: FontWeight.w500),
          ),
          Text(
            value,
            style: GoogleFonts.poppins(),
          ),
        ],
      );
    }
  }