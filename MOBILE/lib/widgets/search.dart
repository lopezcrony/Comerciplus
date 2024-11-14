import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class SearchFilter extends StatelessWidget {
  final ValueChanged<String> onSearchChanged;
  final ValueChanged<String?> onSortChanged;
  final String sortBy;
  final List<DropdownMenuItem<String>> sortOptions;

  const SearchFilter({
    super.key,
    required this.onSearchChanged,
    required this.onSortChanged,
    required this.sortBy,
    required this.sortOptions,
  });

  @override
  Widget build(BuildContext context) {
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
          // Buscador
          Expanded(
            flex: 2,
            child: TextField(
              onChanged: onSearchChanged,
              decoration: InputDecoration(
                hintText: 'Buscar...',
                hintStyle: GoogleFonts.poppins(color: Colors.grey[400]),
                prefixIcon: const Icon(Icons.search, color: Colors.blueAccent, size: 20),
                filled: true,
                fillColor: const Color(0xFFF8F9FF),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              ),
            ),
          ),
          const SizedBox(width: 16),
          // Ordenar
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
                  icon: const Icon(Icons.sort_by_alpha_rounded, color: Color(0xFF4F5B93), size: 20),
                  items: sortOptions,
                  onChanged: onSortChanged,
                ),
              ),
            ),
          ),

          // Expanded(
          //   child: Container(
          //     padding: const EdgeInsets.symmetric(horizontal: 12),
          //     decoration: BoxDecoration(
          //       color: const Color(0xFFF8F9FF),
          //       borderRadius: BorderRadius.circular(12),
          //     ),
          //     child: GestureDetector(
          //       onTap: onSortPressed,  // Ejecuta la acción al presionar
          //       child: const Row(
          //         children: [
          //           Icon(Icons.sort_by_alpha_rounded, color: Color(0xFF4F5B93), size: 20),
          //           SizedBox(width: 8),
          //           Text(
          //             'Ordenar por Nombre',
          //             style: TextStyle(color: Color(0xFF2D3142)),
          //           ),
          //         ],
          //       ),
          //     ),
          //   ),
          // ),

        ],
      ),
    );
  }
}
