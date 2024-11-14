import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class SearchFilter extends StatelessWidget {
  final ValueChanged<String> onSearchChanged;
  final VoidCallback? onSortPressed;
  final bool isAscending;

  const SearchFilter({
    super.key,
    required this.onSearchChanged,
    this.onSortPressed,
    this.isAscending = true,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      child: Row(
        children: [
          // Buscador
          Expanded(
            flex: 2,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(15),
              ),
              child: TextField(
                onChanged: onSearchChanged,
                decoration: InputDecoration(
                  hintText: 'Buscador...',
                  hintStyle: GoogleFonts.poppins(color: const Color(0xFF9BA3B2)),
                  prefixIcon: const Icon(Icons.search, color: Color(0xFF83A4FF)),
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
                    borderSide: const BorderSide(color: Color(0xFF83A4FF), width: 2),
                  ),
                  filled: true,
                  fillColor: Colors.white,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                ),
              ),
            ),
          ),
          
          // Botón de ordenar (opcional)
          if (onSortPressed != null) ...[
            const SizedBox(width: 18),
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white, 
                  borderRadius: BorderRadius.circular(12),
                ),
                child: InkWell(
                  onTap: onSortPressed,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Ordenar',
                        style:  GoogleFonts.poppins (color: const Color(0xFF2D3142)),
                      ),
                      Icon(
                        isAscending ? Icons.arrow_upward : Icons.arrow_downward,
                        color: const Color(0xFF4F5B93),
                        size: 20,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}