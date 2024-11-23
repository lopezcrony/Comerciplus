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
    return LayoutBuilder(
      builder: (context, constraints) {
        final isSmallScreen = constraints.maxWidth < 370;
        final isVerySmallScreen = constraints.maxWidth < 370;

        return Container(
          padding: EdgeInsets.all(isSmallScreen ? 8 : 10),
          child: Row(
            children: [
              Expanded(
                flex: isVerySmallScreen ? 4 : (isSmallScreen ? 3 : 2),
                child: _buildSearchField(isVerySmallScreen),
              ),
              if (onSortPressed != null) ...[
                SizedBox(width: isSmallScreen ? 8 : 18),
                _buildSortButton(isVerySmallScreen),
              ],
            ],
          ),
        );
      },
    );
  }

  Widget _buildSearchField(bool isVerySmallScreen) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 5,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: TextField(
        onChanged: onSearchChanged,
        style: GoogleFonts.poppins(
          fontSize: isVerySmallScreen ? 13 : 14,
          color: const Color(0xFF2D3142),
        ),
        decoration: InputDecoration(
          hintText: 'Buscador...',
          hintStyle: GoogleFonts.poppins(
            color: const Color(0xFF9BA3B2),
            fontSize: isVerySmallScreen ? 13 : 14,
          ),
          prefixIcon: Icon(
            Icons.search,
            color: const Color(0xFF83A4FF),
            size: isVerySmallScreen ? 18 : 20,
          ),
          border: _buildInputBorder(),
          enabledBorder: _buildInputBorder(),
          focusedBorder: _buildInputBorder(true),
          filled: true,
          fillColor: Colors.white,
          contentPadding: EdgeInsets.symmetric(
            horizontal: isVerySmallScreen ? 12 : 16,
            vertical: isVerySmallScreen ? 10 : 12,
          ),
          isDense: true,
        ),
      ),
    );
  }

  Widget _buildSortButton(bool isVerySmallScreen) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 5,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: isVerySmallScreen
          ? IconButton(
              onPressed: onSortPressed,
              icon: Icon(
                isAscending ? Icons.arrow_upward : Icons.arrow_downward,
                color: const Color(0xFF4F5B93),
                size: 18,
              ),
              tooltip: 'Ordenar',
              padding: const EdgeInsets.all(10),
              constraints: const BoxConstraints(
                minHeight: 36,
                minWidth: 36,
              ),
            )
          : InkWell(
              onTap: onSortPressed,
              borderRadius: BorderRadius.circular(12),
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 12,
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'Ordenar',
                      style: GoogleFonts.poppins(
                        color: const Color(0xFF2D3142),
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Icon(
                      isAscending ? Icons.arrow_upward : Icons.arrow_downward,
                      color: const Color(0xFF4F5B93),
                      size: 18,
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  InputBorder _buildInputBorder([bool isFocused = false]) {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(15),
      borderSide: isFocused
          ? const BorderSide(color: Color(0xFF83A4FF), width: 2)
          : BorderSide.none,
    );
  }
}