import 'package:comerciplus/shared/AppColors.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../screens/config.dart';
import '../services/user.service.dart';
import '../models/user.dart';

class CustomAppBar extends StatefulWidget implements PreferredSizeWidget {
  const CustomAppBar({super.key});

  @override
  _CustomAppBarState createState() => _CustomAppBarState();

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}

class _CustomAppBarState extends State<CustomAppBar> {
  User? _user;
  final UserService _userService = UserService();

  @override
  void initState() {
    super.initState();
    _fetchUserProfile();
  }

  Future<void> _fetchUserProfile() async {
    try {
      final user = await _userService.getUserProfile();
      if (mounted) {
        setState(() {
          _user = user;
        });
      }
    } catch (e) {
      // Handle error silently or log it
      print('Error fetching user profile: $e');
    }
  }

  String _getInitial() {
    return _user != null && _user!.nombreUsuario.isNotEmpty 
      ? _user!.nombreUsuario[0].toUpperCase() 
      : '?';
  }

  @override
  Widget build(BuildContext context) {
    return AppBar(
      elevation: 0,
      backgroundColor: AppColors.background,
      title: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFF2D3748).withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Icon(
              Icons.shopping_cart_outlined,
              color: Color(0xFF2D3748),
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Text(
            'ComerciPlus',
            style: GoogleFonts.poppins(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF2D3142),
            ),
          ),
        ],
      ),
      actions: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Container(
            margin: const EdgeInsets.only(right: 30, top: 7),
            decoration: BoxDecoration(
              border: Border.all(
                color: const Color(0xFF2D3748).withOpacity(0.2),
                width: 2,
              ),
              shape: BoxShape.circle,
            ),
            child: IconButton(
              icon: _user == null
                  ? const Icon(
                      Icons.person_outline,
                      color: Color(0xFF2D3748),
                      size: 28,
                    )
                  : CircleAvatar(
                      backgroundColor: Colors.blue.shade100,
                      child: Text(
                        _getInitial(),
                        style: TextStyle(
                          fontSize: 18,
                          color: Colors.blue.shade600,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
              onPressed: () {
                // Navigate to User Profile Screen
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const SettingsScreen(),
                    // builder: (context) => const UserProfileScreen(),
                  ),
                );
              },
            ),
          ),
        ),
      ],
    );
  }
}