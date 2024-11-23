  import 'package:comerciplus/shared/AppColors.dart';
import 'package:flutter/material.dart';

Widget buildDetalleRow(IconData icon, String title, String value) {
    return Row(
      children: [
        Icon(icon, color: AppColors.primary),
        const SizedBox(width: 8),
        Text(
          '$title: ',
          style: const TextStyle(
            fontWeight: FontWeight.w600,
            color: AppColors.text,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            color: AppColors.text.withOpacity(0.7),
          ),
        ),
      ],
    );
  }
