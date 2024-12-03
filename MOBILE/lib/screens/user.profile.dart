import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/user.dart';
import '../services/user.service.dart';

class UserProfileScreen extends StatefulWidget {
  const UserProfileScreen({super.key});

  @override
  _UserProfileScreenState createState() => _UserProfileScreenState();
}

class _UserProfileScreenState extends State<UserProfileScreen> {
  User? _user;
  final UserService _userService = UserService();
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;
  bool _isEditing = false;
  
  late TextEditingController _nombreController;
  late TextEditingController _apellidoController;
  late TextEditingController _telefonoController;
  late TextEditingController _correoController;
  late TextEditingController _claveController;

  @override
  void initState() {
    super.initState();
    _initializeControllers();
    _fetchUserProfile();
  }

  void _initializeControllers() {
    _nombreController = TextEditingController();
    _apellidoController = TextEditingController();
    _telefonoController = TextEditingController();
    _correoController = TextEditingController();
    _claveController = TextEditingController();
  }

  @override
  void dispose() {
    _nombreController.dispose();
    _apellidoController.dispose();
    _telefonoController.dispose();
    _correoController.dispose();
    _claveController.dispose();
    super.dispose();
  }

  Future<void> _fetchUserProfile() async {
    setState(() => _isLoading = true);
    try {
      final user = await _userService.getUserProfile();
      if (mounted) {
        setState(() {
          _user = user;
          _nombreController.text = user.nombreUsuario;
          _apellidoController.text = user.apellidoUsuario;
          _telefonoController.text = user.telefonoUsuario;
          _correoController.text = user.correoUsuario;
          _claveController.text = user.claveUsuario ?? '';
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error al cargar perfil: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _toggleEdit() {
    setState(() {
      _isEditing = !_isEditing;
      if (!_isEditing && _user != null) {
        // Restore original values when canceling edit
        _nombreController.text = _user!.nombreUsuario;
        _apellidoController.text = _user!.apellidoUsuario;
        _telefonoController.text = _user!.telefonoUsuario;
        _correoController.text = _user!.correoUsuario;
        _claveController.text = _user!.claveUsuario ?? '';
      }
    });
  }

  Future<void> _saveProfile() async {
  if (!_formKey.currentState!.validate()) return;

  setState(() => _isLoading = true);

  try {
    if (_user != null) {
      final updatedUser = User(
        idUsuario: _user!.idUsuario,
        cedulaUsuario: _user!.cedulaUsuario,
        nombreUsuario: _nombreController.text.trim(),
        apellidoUsuario: _apellidoController.text.trim(),
        telefonoUsuario: _telefonoController.text.trim(),
        correoUsuario: _correoController.text.trim(),
        claveUsuario: _claveController.text.isNotEmpty 
          ? _claveController.text.trim() 
          : null,
        estadoUsuario: _user!.estadoUsuario ?? false,
        idRol: _user!.idRol ?? 0,
      );

      final result = await _userService.updateUserProfile(updatedUser);

      if (mounted) {
        setState(() {
          _user = result;
          _isEditing = false;
        });

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Perfil actualizado exitosamente'),
            backgroundColor: Colors.green,
          ),
        );
      }
    }
  } catch (e) {
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error al actualizar perfil: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  } finally {
    if (mounted) {
      setState(() => _isLoading = false);
    }
  }
}

  String _getInitial() {
    return _user != null && _user!.nombreUsuario.isNotEmpty 
      ? _user!.nombreUsuario[0].toUpperCase() 
      : '?';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Perfil de Usuario',
          style: GoogleFonts.poppins(
            color: const Color(0xFF2D3142),
            fontWeight: FontWeight.w600,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
        actions: [
          IconButton(
            icon: Icon(_isEditing ? Icons.save : Icons.edit),
            onPressed: _isEditing ? _saveProfile : _toggleEdit,
          ),
          if (_isEditing)
            IconButton(
              icon: const Icon(Icons.close),
              onPressed: _toggleEdit,
            ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _user == null
              ? const Center(child: Text('No se pudo cargar el perfil'))
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16.0),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        Center(
                          child: CircleAvatar(
                            radius: 60,
                            backgroundColor: Colors.blue.shade100,
                            child: Text(
                              _getInitial(),
                              style: TextStyle(
                                fontSize: 60,
                                color: Colors.blue.shade500,
                                fontWeight: FontWeight.bold
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),
                        _buildReadOnlyField('Cédula', _user!.cedulaUsuario),
                        const SizedBox(height: 10),
                        _buildEditableField(
                          'Nombre',
                          _nombreController,
                          _isEditing,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Por favor ingrese su nombre';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 10),
                        _buildEditableField(
                          'Apellido',
                          _apellidoController,
                          _isEditing,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Por favor ingrese su apellido';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 10),
                        _buildEditableField(
                          'Teléfono',
                          _telefonoController,
                          _isEditing,
                          keyboardType: TextInputType.phone,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Por favor ingrese su teléfono';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 10),
                        _buildEditableField(
                          'Correo',
                          _correoController,
                          _isEditing,
                          keyboardType: TextInputType.emailAddress,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Por favor ingrese su correo';
                            }
                            if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
                              return 'Correo electrónico inválido';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 10),
                        if (_isEditing)
                          _buildEditableField(
                            'Nueva Contraseña',
                            _claveController,
                            true,
                            obscureText: true,
                            validator: (value) {
                              if (value != null && value.isNotEmpty && value.length < 6) {
                                return 'La contraseña debe tener al menos 6 caracteres';
                              }
                              return null;
                            },
                          ),
                        const SizedBox(height: 24),
                        if (_isEditing)
                          ElevatedButton(
                            onPressed: _isLoading ? null : _saveProfile,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.blue,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                            child: _isLoading
                                ? const SizedBox(
                                    height: 20,
                                    width: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                    ),
                                  )
                                : Text(
                                    'Guardar Cambios',
                                    style: GoogleFonts.poppins(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                          ),
                      ],
                    ),
                  ),
                ),
    );
  }

  Widget _buildReadOnlyField(String label, String value) {
    return TextFormField(
      initialValue: value,
      readOnly: true,
      decoration: InputDecoration(
        labelText: label,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
        ),
        filled: true,
        fillColor: Colors.grey.shade200,
      ),
    );
  }

  Widget _buildEditableField(
    String label, 
    TextEditingController controller, 
    bool isEditable, {
    TextInputType? keyboardType,
    String? Function(String?)? validator,
    bool obscureText = false,
  }) {
    return TextFormField(
      controller: controller,
      enabled: isEditable,
      readOnly: !isEditable,
      obscureText: obscureText,
      keyboardType: keyboardType,
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
        ),
        filled: !isEditable,
        fillColor: !isEditable ? Colors.grey.shade200 : null,
        suffixIcon: obscureText
            ? Icon(Icons.visibility_off, color: isEditable ? Colors.blue : Colors.grey)
            : (!isEditable ? const Icon(Icons.lock_outline, color: Colors.grey) : null),
      ),
    );
  }
}