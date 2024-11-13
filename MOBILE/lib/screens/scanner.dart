import 'package:flutter/material.dart';
import '../services/scanner_service.dart';

class ScannerScreen extends StatefulWidget {
  const ScannerScreen({super.key});

  @override
  _ScannerScreenState createState() => _ScannerScreenState();
}

class _ScannerScreenState extends State<ScannerScreen> {
  final TextEditingController _controller = TextEditingController();
  final ScannerService _scannerService = ScannerService(); // Instancia del servicio

  Future<void> _sendBarcode() async {
    final barcode = _controller.text;

    if (barcode.isEmpty) {
      // Muestra un mensaje de error si no se ha ingresado un código
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor ingrese un código de barras')),
      );
      return;
    }

    try {
      // Llamada al servicio para enviar el código
      await _scannerService.sendBarcodeToBackend(barcode);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Código enviado exitosamente')),
      );
    } catch (e) {
      // Manejo de errores
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al enviar el código: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Barcode Input')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: _controller,
              decoration: const InputDecoration(labelText: 'Scan or Enter Barcode'),
              onSubmitted: (value) {
                _sendBarcode(); // Llamar al método cuando se ingrese el código
              },
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _sendBarcode, // Llamar al método al hacer clic en el botón
              child: const Text('Submit'),
            ),
          ],
        ),
      ),
    );
  }
}
