import 'package:flutter/material.dart';
import '../screens/user.profile.dart'; 
import '../widgets/appBar_Screens.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

    @override
  State<SettingsScreen> createState() => _SettingsScreenState();

}

class _SettingsScreenState extends State<SettingsScreen> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppBarScreens(
        nameModule: 'Configuración',
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF2196F3),
              Colors.white,
            ],
            stops: [0.0, 0.3],
          ),
        ),
        child: Column(
          children: [
            const SizedBox(height: 20),
            // Avatar Section
            Center(
              child: Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.2),
                      blurRadius: 10,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),
                child: const CircleAvatar(
                  radius: 60,
                  backgroundColor: Color(0xFFE3F2FD),
                  child: Icon(
                    Icons.person,
                    size: 60,
                    color: Color(0xFF1976D2),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
            // User Name
            const Text(
              'Usuario',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 40),
            // Options List
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  children: [
                    _buildOptionTile(
                      context,
                      icon: Icons.edit,
                      title: 'Editar Perfil',
                      onTap: () {
                        // Implementar navegación a editar perfil
                         Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const UserProfileScreen(),
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: 15),
                    _buildOptionTile(
                      context,
                      icon: Icons.logout,
                      title: 'Cerrar Sesión',
                      isDestructive: true,
                      onTap: () {
                        _showLogoutDialog(context);
                      },
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOptionTile(
    BuildContext context, {
    required IconData icon,
    required String title,
    required VoidCallback onTap,
    bool isDestructive = false,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 5),
        leading: Icon(
          icon,
          color: isDestructive ? Colors.red : const Color(0xFF2196F3),
          size: 28,
        ),
        title: Text(
          title,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w500,
            color: isDestructive ? Colors.red : Colors.black87,
          ),
        ),
        trailing: Icon(
          Icons.chevron_right,
          color: isDestructive ? Colors.red : Colors.grey,
        ),
        onTap: onTap,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(15),
        ),
      ),
    );
  }

  Future<void> _showLogoutDialog(BuildContext context) async {
    return showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Cerrar Sesión'),
          content: const Text('¿Estás seguro que deseas cerrar sesión?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancelar'),
            ),
            TextButton(
              onPressed: () {
                // Implementar lógica de cierre de sesión
                Navigator.of(context).pop();
              },
              child: const Text(
                'Cerrar Sesión',
                style: TextStyle(color: Colors.red),
              ),
            ),
          ],
        );
      },
    );
  }
}