import 'package:comerciplus/shared/AppColors.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppBarScreens extends StatelessWidget implements PreferredSizeWidget {
  final String nameModule;

  const AppBarScreens({super.key, required this.nameModule});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: AppColors.background,
      title: Row(
        children: [
          const SizedBox(width: 10),
          Text(
            nameModule,
            style: GoogleFonts.poppins(
              color: const Color(0xFF2D3142),
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
