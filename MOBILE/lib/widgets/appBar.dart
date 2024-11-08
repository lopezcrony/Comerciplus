import 'package:flutter/material.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  const CustomAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      elevation: 0,
      backgroundColor: Colors.white,
      title: const Text(
        'ComerciPlus',
        style: TextStyle(
          color: Color(0xFF2D3748),
          fontWeight: FontWeight.bold,
          fontSize: 24,
        ),
      ),
      actions: [
        IconButton(
          icon: const Badge(
            label: Text('3'),
            child: Icon(Icons.notifications_outlined, color: Color(0xFF2D3748)),
          ),
          onPressed: () {
            // Implementar notificaciones
          },
        ),
        IconButton(
          icon: const Icon(Icons.person_outline, color: Color(0xFF2D3748)),
          onPressed: () {
            // Perfil del administrador
          },
        ),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
