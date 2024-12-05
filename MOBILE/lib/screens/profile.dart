import 'package:flutter/material.dart';
import '../widgets/appBar_Screens.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppBarScreens(nameModule: 'Mi Perfil'),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const CircleAvatar(
            radius: 50,
            backgroundImage: AssetImage('assets/profile_placeholder.png'),
          ),
          const SizedBox(height: 16),
          const Text(
            'Nombre del Usuario',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          _buildProfileItem(Icons.email, 'Correo', 'usuario@ejemplo.com'),
          _buildProfileItem(Icons.phone, 'Teléfono', '+1234567890'),
          _buildProfileItem(Icons.business, 'Rol', 'Administrador'),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildProfileItem(IconData icon, String title, String value) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: ListTile(
        leading: Icon(icon),
        title: Text(title),
        subtitle: Text(value),
      ),
    );
  }
}