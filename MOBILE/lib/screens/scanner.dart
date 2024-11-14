import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import '../services/scanner_service.dart';


class ScannerScreen extends StatefulWidget {
  const ScannerScreen({super.key});

  @override
  _ScannerScreenState createState() => _ScannerScreenState();
}

class _ScannerScreenState extends State<ScannerScreen> {
  final ScannerService _scannerService = ScannerService();
  MobileScannerController cameraController = MobileScannerController();
  bool isScannerActive = false;
  String scannedBarcode = '';
  bool showSuccessAlert = false;
  bool showErrorAlert = false;
  String errorMessage = '';

  @override
  void dispose() {
    cameraController.dispose();
    super.dispose();
  }

  void _handleBarcodeScan(Barcode barcode) async {
    setState(() {
      scannedBarcode = barcode.rawValue ?? '';
    });

    try {
      await _scannerService.sendBarcodeToBackend(scannedBarcode);
      setState(() {
        showSuccessAlert = true;
      });
    } catch (e) {
      setState(() {
        showErrorAlert = true;
        errorMessage = 'Error al enviar el código de barras: $e';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Barcode Scanner'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (isScannerActive)
              MobileScanner(
                  onDetect: (barcodeCapture) {
                    final barcode = barcodeCapture.barcodes.first;
                    _handleBarcodeScan(barcode);
                  }),
            if (!isScannerActive)
              const Text('Presiona el botón para iniciar el escáner'),
            const SizedBox(height: 16.0),
            if (scannedBarcode.isNotEmpty)
              Text('Código de barras escaneado: $scannedBarcode'),
            const SizedBox(height: 16.0),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  isScannerActive = !isScannerActive;
                  if (isScannerActive) {
                    cameraController.start();
                  } else {
                    cameraController.stop();
                  }
                });
              },
              child: Text(isScannerActive ? 'Detener Escáner' : 'Iniciar Escáner'),
            ),
            if (showSuccessAlert)
              AlertDialog(
                title: const Text('Código de Barras Enviado'),
                content: const Text('El código de barras se envió correctamente.'),
                actions: [
                  TextButton(
                    onPressed: () {
                      setState(() {
                        showSuccessAlert = false;
                      });
                    },
                    child: const Text('OK'),
                  ),
                ],
              ),
            if (showErrorAlert)
              AlertDialog(
                title: const Text('Error'),
                content: Text(errorMessage),
                actions: [
                  TextButton(
                    onPressed: () {
                      setState(() {
                        showErrorAlert = false;
                      });
                    },
                    child: const Text('OK'),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }
}